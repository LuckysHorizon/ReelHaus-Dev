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
    
    // Only process payment.captured events
    if (event.event !== 'payment.captured') {
      return NextResponse.json({ status: 'ignored' })
    }
    
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
    console.error('Webhook processing error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
