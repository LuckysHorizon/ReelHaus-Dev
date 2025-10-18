import crypto from "crypto";
import { supabaseAdmin } from "../../../lib/supabase";
import { sendEmailsToAllAttendees } from "../../../lib/resend";

export const config = {
  api: {
    bodyParser: false, // 🚨 Critical for signature verification
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }

  try {
    console.log('[Cashfree Webhook] Received webhook request');
    
    // Collect raw body (important for signature verification)
    const chunks = [];
    for await (const chunk of req) {
      chunks.push(chunk);
    }
    const rawBody = Buffer.concat(chunks).toString("utf8");

    const signature = req.headers["x-webhook-signature"];
    const timestamp = req.headers["x-webhook-timestamp"];

    console.log('[Cashfree Webhook] Signature present:', !!signature);
    console.log('[Cashfree Webhook] Timestamp:', timestamp);
    console.log('[Cashfree Webhook] Body length:', rawBody.length);

    if (!signature || !timestamp) {
      console.error('Missing Cashfree webhook signature or timestamp');
      return res.status(400).send("Missing signature or timestamp");
    }

    // Verify webhook signature using CASHFREE_SECRET_KEY with timestamp + rawBody
    const secretKey = process.env.CASHFREE_SECRET_KEY;
    if (!secretKey) {
      console.error('Missing CASHFREE_SECRET_KEY environment variable');
      return res.status(500).send("Secret key not configured");
    }

    const computed = crypto
      .createHmac("sha256", secretKey)
      .update(timestamp + rawBody)
      .digest("base64");

    if (computed !== signature) {
      console.error("❌ Invalid Cashfree signature");
      console.error("Expected:", computed);
      console.error("Received:", signature);
      return res.status(401).send("Invalid signature");
    }

    console.log("✅ Cashfree webhook signature verified successfully");

    const data = JSON.parse(rawBody);
    const eventType = data.type;
    const orderId = data.data?.order?.order_id;
    const paymentId = data.data?.payment?.cf_payment_id;
    const paymentStatus = data.data?.payment?.payment_status;

    console.log('[Cashfree Webhook] Event type:', eventType);
    console.log('[Cashfree Webhook] Order ID:', orderId);
    console.log('[Cashfree Webhook] Payment ID:', paymentId);
    console.log('[Cashfree Webhook] Payment Status:', paymentStatus);

    // Handle different event types
    if (eventType === 'PAYMENT_SUCCESS_WEBHOOK' || eventType === 'ORDER_PAID') {
      return await handlePaymentSuccess(data, res);
    } else if (eventType === 'PAYMENT_FAILED_WEBHOOK') {
      return await handlePaymentFailed(data, res);
    } else if (eventType === 'PAYMENT_USER_DROPPED') {
      return await handleUserDropped(data, res);
    } else {
      console.log(`Unhandled Cashfree event type: ${eventType}`);
      return res.status(200).send("Event type not handled");
    }

  } catch (err) {
    console.error("⚠️ Webhook error:", err);
    return res.status(500).send("Internal Server Error");
  }
}

/**
 * Handle successful payment
 */
async function handlePaymentSuccess(event, res) {
  try {
    const payment = event.data.payment;
    const order = event.data.order;
    const customer = event.data.customer_details;
    const orderId = order.order_id;
    const paymentId = payment.cf_payment_id;

    console.log('💰 Processing payment success for order:', orderId);
    console.log('👤 Customer:', customer.customer_name, customer.customer_email);
    console.log('💳 Payment ID:', paymentId);

    // Check if payment already processed (idempotency)
    const { data: existingPayment, error: checkError } = await supabaseAdmin
      .from('payments')
      .select('*')
      .eq('provider_payment_id', paymentId)
      .single();

    if (existingPayment && existingPayment.status === 'succeeded') {
      console.log('Payment already processed, skipping');
      return res.status(200).send("Payment already processed");
    }

    // Get registration details with event information
    const { data: paymentRecord, error: paymentError } = await supabaseAdmin
      .from('payments')
      .select(`
        *,
        registrations!inner(
          *,
          events!inner(
            id,
            title,
            start_datetime,
            end_datetime,
            description
          )
        )
      `)
      .eq('provider_order_id', orderId)
      .single();

    if (paymentError || !paymentRecord) {
      console.error('Payment record not found:', paymentError);
      return res.status(404).send("Payment record not found");
    }

    const registration = paymentRecord.registrations;

    // Update payment status
    const { error: updatePaymentError } = await supabaseAdmin
      .from('payments')
      .update({
        provider_payment_id: paymentId,
        status: 'succeeded',
        raw_event: event
      })
      .eq('id', paymentRecord.id);

    if (updatePaymentError) {
      console.error('Failed to update payment:', updatePaymentError);
      return res.status(500).send("Failed to update payment");
    }

    console.log('✅ Payment status updated to succeeded');

    // Update registration status
    const { error: updateRegError } = await supabaseAdmin
      .from('registrations')
      .update({ status: 'paid' })
      .eq('id', registration.id);

    if (updateRegError) {
      console.error('Failed to update registration:', updateRegError);
      return res.status(500).send("Failed to update registration");
    }

    console.log('✅ Registration status updated to paid');

    // Atomically decrement event seats
    const { error: decrementError } = await supabaseAdmin
      .rpc('decrement_event_seats', {
        event_uuid: registration.event_id,
        seats_to_decrement: registration.tickets
      });

    if (decrementError) {
      console.error('Failed to decrement seats:', decrementError);
    } else {
      console.log('✅ Event seats decremented');
    }

    // Send confirmation emails to all attendees
    if (process.env.RESEND_API_KEY) {
      const eventData = registration.events;
      const eventDate = new Date(eventData.start_datetime).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      const eventTime = `${new Date(eventData.start_datetime).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      })} - ${new Date(eventData.end_datetime).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      })}`;

      try {
        await sendEmailsToAllAttendees({
          mainRegistrant: {
            email: registration.email,
            name: registration.name || 'Attendee',
            roll_no: registration.roll_no || 'N/A',
          },
          ticketDetails: registration.ticket_details || [],
          eventName: eventData.title,
          eventDate,
          eventTime,
          eventLocation: 'TBD',
          paymentId: paymentId,
        });
        console.log('✅ Confirmation email sent');
      } catch (emailError) {
        console.error('Email sending failed:', emailError);
      }
    }

    return res.status(200).send("Payment processed successfully");
  } catch (error) {
    console.error('Error in handlePaymentSuccess:', error);
    return res.status(500).send("Failed to process payment success");
  }
}

/**
 * Handle failed payment
 */
async function handlePaymentFailed(event, res) {
  try {
    const order = event.data.order;
    const orderId = order.order_id;

    console.log('❌ Processing payment failure for order:', orderId);

    // Update payment status to failed
    const { error: updateError } = await supabaseAdmin
      .from('payments')
      .update({
        status: 'failed',
        raw_event: event
      })
      .eq('provider_order_id', orderId);

    if (updateError) {
      console.error('Failed to update payment status:', updateError);
    }

    return res.status(200).send("Payment failure processed");
  } catch (error) {
    console.error('Error in handlePaymentFailed:', error);
    return res.status(500).send("Failed to process payment failure");
  }
}

/**
 * Handle user dropped (closed payment page)
 */
async function handleUserDropped(event, res) {
  try {
    const order = event.data.order;
    const orderId = order.order_id;

    console.log(`User dropped payment for order ${orderId}`);

    return res.status(200).send("User dropped payment processed");
  } catch (error) {
    console.error('Error handling user dropped:', error);
    return res.status(500).send("Failed to process user dropped");
  }
}
