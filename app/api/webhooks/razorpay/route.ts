import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import crypto from 'crypto'

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get('X-Razorpay-Signature')
    
    if (!signature) {
      return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
    }
    
    // Verify webhook signature
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET!)
      .update(body)
      .digest('hex')
    
    if (signature !== expectedSignature) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }
    
    const event = JSON.parse(body)
    const eventType = event.event
    const orderId = event.payload?.payment?.entity?.order_id || event.payload?.qr_code?.entity?.order_id || event.payload?.payment_link?.entity?.id
    
    console.log(`Razorpay Webhook Event: ${eventType}, Order ID: ${orderId}`)
    
    // Handle different event types
    switch (eventType) {
      case 'payment.captured':
        return await handlePaymentCaptured(event)
      case 'payment.failed':
        return await handlePaymentFailed(event)
      case 'payment.authorized':
        return await handlePaymentAuthorized(event)
      case 'payment.dispute.created':
      case 'payment.dispute.won':
      case 'payment.dispute.lost':
      case 'payment.dispute.closed':
      case 'payment.dispute.under_review':
      case 'payment.dispute.action_required':
        return await handlePaymentDispute(event)
      case 'payment.downtime.started':
      case 'payment.downtime.updated':
      case 'payment.downtime.resolved':
        return await handlePaymentDowntime(event)
      case 'qr_code.closed':
      case 'qr_code.created':
      case 'qr_code.credited':
        return await handleQRCodeEvent(event)
      case 'payment_link.paid':
      case 'payment_link.partially_paid':
      case 'payment_link.expired':
      case 'payment_link.cancelled':
        return await handlePaymentLinkEvent(event)
      default:
        console.log(`Unhandled event type: ${eventType}`)
        return NextResponse.json({ status: 'ignored', message: `Event type ${eventType} not handled` })
    }
    
  } catch (error) {
    console.error('Webhook processing error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Handle payment.captured events
async function handlePaymentCaptured(event: any) {
  try {
    const payment = event.payload.payment.entity
    const orderId = payment.order_id
    
    // Check if payment already processed (idempotency)
    const { data: existingPayment, error: checkError } = await supabaseAdmin
      .from('payments')
      .select('*')
      .eq('provider_payment_id', payment.id)
      .single()
    
    if (existingPayment && existingPayment.status === 'succeeded') {
      return NextResponse.json({ status: 'already_processed' })
    }
    
    // Get registration details
    const { data: paymentRecord, error: paymentError } = await supabaseAdmin
      .from('payments')
      .select(`
        *,
        registrations!inner(*)
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
        provider_payment_id: payment.id,
        status: 'succeeded',
        raw_event: event
      })
      .eq('id', paymentRecord.id)
    
    if (updatePaymentError) {
      console.error('Failed to update payment:', updatePaymentError)
      return NextResponse.json({ error: 'Failed to update payment' }, { status: 500 })
    }
    
    // Update registration status
    const { error: updateRegError } = await supabaseAdmin
      .from('registrations')
      .update({ status: 'paid' })
      .eq('id', registration.id)
    
    if (updateRegError) {
      console.error('Failed to update registration:', updateRegError)
      return NextResponse.json({ error: 'Failed to update registration' }, { status: 500 })
    }
    
    // Atomically decrement event seats
    const { error: decrementError } = await supabaseAdmin
      .rpc('decrement_event_seats', {
        event_uuid: registration.event_id,
        seats_to_decrement: registration.tickets
      })
    
    if (decrementError) {
      console.error('Failed to decrement seats:', decrementError)
      // Note: In production, you might want to implement a compensation mechanism
    }
    
    // TODO: Enqueue background jobs for QR generation and email sending
    // This will be implemented in Phase 7
    
    return NextResponse.json({ status: 'success' })
  } catch (error) {
    console.error('Error handling payment.captured:', error)
    return NextResponse.json({ error: 'Failed to process payment.captured' }, { status: 500 })
  }
}

// Handle payment.failed events
async function handlePaymentFailed(event: any) {
  try {
    const payment = event.payload.payment.entity
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
      console.error('Failed to update payment status to failed:', updateError)
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
      console.error('Failed to update registration status:', regUpdateError)
    }
    
    return NextResponse.json({ status: 'success' })
  } catch (error) {
    console.error('Error handling payment.failed:', error)
    return NextResponse.json({ error: 'Failed to process payment.failed' }, { status: 500 })
  }
}

// Handle payment.authorized events
async function handlePaymentAuthorized(event: any) {
  try {
    const payment = event.payload.payment.entity
    const orderId = payment.order_id
    
    // Update payment status to authorized
    const { error: updateError } = await supabaseAdmin
      .from('payments')
      .update({
        status: 'authorized',
        raw_event: event
      })
      .eq('provider_order_id', orderId)
    
    if (updateError) {
      console.error('Failed to update payment status to authorized:', updateError)
    }
    
    return NextResponse.json({ status: 'success' })
  } catch (error) {
    console.error('Error handling payment.authorized:', error)
    return NextResponse.json({ error: 'Failed to process payment.authorized' }, { status: 500 })
  }
}

// Handle payment dispute events
async function handlePaymentDispute(event: any) {
  try {
    const dispute = event.payload.dispute.entity
    const paymentId = dispute.payment_id
    
    // Log dispute event
    console.log(`Payment dispute: ${event.event} for payment ${paymentId}`)
    
    // Update payment status based on dispute type
    let newStatus = 'disputed'
    if (event.event === 'payment.dispute.won') {
      newStatus = 'dispute_won'
    } else if (event.event === 'payment.dispute.lost') {
      newStatus = 'dispute_lost'
    } else if (event.event === 'payment.dispute.closed') {
      newStatus = 'dispute_closed'
    }
    
    const { error: updateError } = await supabaseAdmin
      .from('payments')
      .update({
        status: newStatus,
        raw_event: event
      })
      .eq('provider_payment_id', paymentId)
    
    if (updateError) {
      console.error('Failed to update payment status for dispute:', updateError)
    }
    
    return NextResponse.json({ status: 'success' })
  } catch (error) {
    console.error('Error handling payment dispute:', error)
    return NextResponse.json({ error: 'Failed to process dispute event' }, { status: 500 })
  }
}

// Handle payment downtime events
async function handlePaymentDowntime(event: any) {
  try {
    console.log(`Payment downtime: ${event.event}`)
    // Log downtime events for monitoring
    // You might want to store these in a separate table for monitoring purposes
    
    return NextResponse.json({ status: 'success' })
  } catch (error) {
    console.error('Error handling payment downtime:', error)
    return NextResponse.json({ error: 'Failed to process downtime event' }, { status: 500 })
  }
}

// Handle QR code events
async function handleQRCodeEvent(event: any) {
  try {
    const qrCode = event.payload.qr_code.entity
    console.log(`QR Code event: ${event.event} for QR ${qrCode.id}`)
    
    // Handle QR code events as needed
    // These might be used for tracking QR code usage or generating new codes
    
    return NextResponse.json({ status: 'success' })
  } catch (error) {
    console.error('Error handling QR code event:', error)
    return NextResponse.json({ error: 'Failed to process QR code event' }, { status: 500 })
  }
}

// Handle payment link events
async function handlePaymentLinkEvent(event: any) {
  try {
    const paymentLink = event.payload.payment_link.entity
    console.log(`Payment Link event: ${event.event} for link ${paymentLink.id}`)
    
    // Handle payment link events as needed
    // These might be used for tracking payment link usage
    
    return NextResponse.json({ status: 'success' })
  } catch (error) {
    console.error('Error handling payment link event:', error)
    return NextResponse.json({ error: 'Failed to process payment link event' }, { status: 500 })
  }
}
