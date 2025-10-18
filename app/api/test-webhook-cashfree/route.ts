import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import crypto from 'crypto'

/**
 * Test endpoint to simulate Cashfree webhook for debugging
 * This helps test the webhook logic without actual Cashfree webhook calls
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { order_id, registration_id, test_mode = true } = body
    
    if (!order_id || !registration_id) {
      return NextResponse.json({ 
        error: 'Missing order_id or registration_id' 
      }, { status: 400 })
    }
    
    console.log('[Test Webhook] Simulating payment success for order:', order_id)
    
    // Get payment record
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
      .eq('provider_order_id', order_id)
      .single()
    
    if (paymentError || !paymentRecord) {
      return NextResponse.json({ 
        error: 'Payment record not found',
        details: paymentError 
      }, { status: 404 })
    }
    
    const registration = paymentRecord.registrations
    
    // Update payment status
    const { error: updatePaymentError } = await supabaseAdmin
      .from('payments')
      .update({
        provider_payment_id: `TEST_${Date.now()}`,
        status: 'succeeded',
        raw_event: { test: true, order_id, registration_id }
      })
      .eq('id', paymentRecord.id)
    
    if (updatePaymentError) {
      return NextResponse.json({ 
        error: 'Failed to update payment',
        details: updatePaymentError 
      }, { status: 500 })
    }
    
    // Update registration status
    const { error: updateRegError } = await supabaseAdmin
      .from('registrations')
      .update({ status: 'paid' })
      .eq('id', registration.id)
    
    if (updateRegError) {
      return NextResponse.json({ 
        error: 'Failed to update registration',
        details: updateRegError 
      }, { status: 500 })
    }
    
    // Atomically decrement event seats
    const { error: decrementError } = await supabaseAdmin
      .rpc('decrement_event_seats', {
        event_uuid: registration.event_id,
        seats_to_decrement: registration.tickets
      })
    
    if (decrementError) {
      console.error('Failed to decrement seats:', decrementError)
    }
    
    return NextResponse.json({
      success: true,
      message: 'Test webhook processed successfully',
      order_id,
      registration_id,
      payment_id: paymentRecord.id,
      registration_status: 'paid',
      payment_status: 'succeeded'
    })
    
  } catch (error) {
    console.error('Test webhook error:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: String(error)
    }, { status: 500 })
  }
}
