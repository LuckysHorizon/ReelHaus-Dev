import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import crypto from 'crypto'
import { sendEmailsToAllAttendees } from '@/lib/resend'

/**
 * Cashfree Webhook Handler
 * 
 * Handles the following events:
 * - PAYMENT_SUCCESS_WEBHOOK: Payment successfully captured
 * - PAYMENT_FAILED_WEBHOOK: Payment failed
 * - PAYMENT_USER_DROPPED: User closed payment page
 * - ORDER_PAID: Order paid successfully
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get('x-webhook-signature')
    
    if (!signature) {
      console.error('Missing Cashfree webhook signature')
      return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
    }
    
    // Verify webhook signature
    const expectedSignature = crypto
      .createHmac('sha256', process.env.CASHFREE_SECRET_KEY!)
      .update(body)
      .digest('base64')
    
    if (signature !== expectedSignature) {
      console.error('Invalid Cashfree webhook signature')
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }
    
    const event = JSON.parse(body)
    const rawType: string | undefined = event.type || event.event || event?.data?.event
    const eventType = (rawType || '').toString().trim().toLowerCase()
    const orderId = event.data?.order?.order_id || event.data?.order_id
    
    // Handle different event types
    switch (eventType) {
      case 'payment_success_webhook':
      case 'order_paid':
      case 'success payment':
      case 'success_payment':
      case 'success payment tdr':
        return await handlePaymentSuccess(event)
      case 'payment_failed_webhook':
      case 'failed payment':
      case 'failed_payment':
      case 'abandoned checkout':
        return await handlePaymentFailed(event)
      case 'payment_user_dropped':
      case 'user dropped payment':
      case 'abandoned_checkout':
        return await handleUserDropped(event)
      case 'dispute created':
      case 'dispute updated':
      case 'dispute closed':
        return NextResponse.json({ status: 'success' })
      case 'refund':
      case 'auto refund':
        return NextResponse.json({ status: 'success' })
      default:
        console.log(`Unhandled Cashfree event type: ${eventType}`)
        return NextResponse.json({ status: 'ignored', message: `Event type ${eventType} not handled` })
    }
    
  } catch (error) {
    console.error('Cashfree webhook error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * Handle successful payment
 */
async function handlePaymentSuccess(event: any) {
  try {
    const payment = event.data.payment || event.data
    const orderId = payment.order_id
    
    // Check if payment already processed (idempotency)
    const { data: existingPayment, error: checkError } = await supabaseAdmin
      .from('payments')
      .select('*')
      .eq('provider_payment_id', payment.cf_payment_id)
      .single()
    
    if (existingPayment && existingPayment.status === 'succeeded') {
      return NextResponse.json({ status: 'already_processed' })
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
      .single()
    
    if (paymentError || !paymentRecord) {
      return NextResponse.json({ error: 'Payment record not found' }, { status: 404 })
    }
    
    const registration = paymentRecord.registrations
    
    // Update payment status
    const { error: updatePaymentError } = await supabaseAdmin
      .from('payments')
      .update({
        provider_payment_id: payment.cf_payment_id,
        status: 'succeeded',
        raw_event: event
      })
      .eq('id', paymentRecord.id)
    
    if (updatePaymentError) {
      return NextResponse.json({ error: 'Failed to update payment' }, { status: 500 })
    }
    
    // Update registration status
    const { error: updateRegError } = await supabaseAdmin
      .from('registrations')
      .update({ status: 'paid' })
      .eq('id', registration.id)
    
    if (updateRegError) {
      return NextResponse.json({ error: 'Failed to update registration' }, { status: 500 })
    }
    
    // Atomically decrement event seats
    const { error: decrementError } = await supabaseAdmin
      .rpc('decrement_event_seats', {
        event_uuid: registration.event_id,
        seats_to_decrement: registration.tickets
      })
    
    if (decrementError) {
      // Note: In production, you might want to implement a compensation mechanism
    }
    
    // Send confirmation emails to all attendees
    if (process.env.RESEND_API_KEY) {
      const eventData = registration.events
      const eventDate = new Date(eventData.start_datetime).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
      const eventTime = `${new Date(eventData.start_datetime).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      })} - ${new Date(eventData.end_datetime).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      })}`

      // Send emails to all attendees
      sendEmailsToAllAttendees({
        mainRegistrant: {
          email: registration.email,
          name: registration.name || 'Attendee',
          roll_no: registration.roll_no || 'N/A',
        },
        ticketDetails: registration.ticket_details || [],
        eventName: eventData.title,
        eventDate,
        eventTime,
        eventLocation: 'TBD', // Add venue field to events table if needed
        paymentId: payment.cf_payment_id,
      }).catch((emailError) => {
        // Don't fail the webhook if email fails
      })
    }
    
    return NextResponse.json({ status: 'success' })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to process payment success' }, { status: 500 })
  }
}

/**
 * Handle failed payment
 */
async function handlePaymentFailed(event: any) {
  try {
    const payment = event.data.payment || event.data
    const orderId = payment.order_id
    
    // Update payment status to failed
    const { error: updateError } = await supabaseAdmin
      .from('payments')
      .update({
        status: 'failed',
        raw_event: event
      })
      .eq('provider_order_id', orderId)
    
    if (updateError) {
      // Log error but don't fail
    }
    
    // Update registration status to failed
    const { error: regUpdateError } = await supabaseAdmin
      .from('registrations')
      .update({ status: 'payment_failed' })
      .eq('id', (await supabaseAdmin
        .from('payments')
        .select('registration_id')
        .eq('provider_order_id', orderId)
        .single()).data?.registration_id)
    
    if (regUpdateError) {
      // Log error but don't fail
    }
    
    return NextResponse.json({ status: 'success' })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to process payment failure' }, { status: 500 })
  }
}

/**
 * Handle user dropped (closed payment page)
 */
async function handleUserDropped(event: any) {
  try {
    const payment = event.data.payment || event.data
    const orderId = payment.order_id
    
    console.log(`User dropped payment for order ${orderId}`)
    
    // Optionally update payment status or log the event
    // You might want to keep the payment as 'initiated' or mark it as 'cancelled'
    
    return NextResponse.json({ status: 'success' })
  } catch (error) {
    console.error('Error handling Cashfree user dropped:', error)
    return NextResponse.json({ error: 'Failed to process user dropped' }, { status: 500 })
  }
}

