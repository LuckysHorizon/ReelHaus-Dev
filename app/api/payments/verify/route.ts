import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import crypto from 'crypto'
import { z } from 'zod'
import { sendPaymentConfirmationEmail } from '@/lib/resend'

const verifyPaymentSchema = z.object({
  razorpay_order_id: z.string(),
  razorpay_payment_id: z.string(),
  razorpay_signature: z.string(),
  registration_id: z.string().uuid()
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = verifyPaymentSchema.parse(body)
    
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, registration_id } = validatedData
    
    // Create signature for verification
    const sign = razorpay_order_id + "|" + razorpay_payment_id
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(sign)
      .digest('hex')
    
    // Verify signature
    if (razorpay_signature !== expectedSignature) {
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid payment signature' 
      }, { status: 400 })
    }
    
    // Get registration details
    const { data: registration, error: regError } = await supabaseAdmin
      .from('registrations')
      .select(`
        *,
        events!inner(*)
      `)
      .eq('id', registration_id)
      .single()
    
    if (regError || !registration) {
      return NextResponse.json({ 
        success: false, 
        error: 'Registration not found' 
      }, { status: 404 })
    }
    
    // Get payment record
    const { data: payment, error: paymentError } = await supabaseAdmin
      .from('payments')
      .select('*')
      .eq('registration_id', registration_id)
      .eq('provider_order_id', razorpay_order_id)
      .single()
    
    if (paymentError || !payment) {
      return NextResponse.json({ 
        success: false, 
        error: 'Payment record not found' 
      }, { status: 404 })
    }
    
    // Update payment record with payment ID
    const { error: updatePaymentError } = await supabaseAdmin
      .from('payments')
      .update({
        provider_payment_id: razorpay_payment_id,
        status: 'succeeded'
      })
      .eq('id', payment.id)
    
    if (updatePaymentError) {
      console.error('Failed to update payment record:', updatePaymentError)
      return NextResponse.json({ 
        success: false, 
        error: 'Failed to update payment record' 
      }, { status: 500 })
    }
    
    // Update registration status
    const { error: updateRegError } = await supabaseAdmin
      .from('registrations')
      .update({ status: 'paid' })
      .eq('id', registration_id)
    
    if (updateRegError) {
      console.error('Failed to update registration status:', updateRegError)
      return NextResponse.json({ 
        success: false, 
        error: 'Failed to update registration status' 
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
      // Note: In production, you might want to implement a compensation mechanism
    }
    // Fire-and-forget email (do not block response on email network latency)
    if (process.env.RESEND_API_KEY) {
      sendPaymentConfirmationEmail({
        email: registration.email,
        name: registration.name || 'Attendee',
        eventName: registration.events.title,
      }).catch(() => {})
    }

    return NextResponse.json({
      success: true,
      message: 'Payment verified successfully',
      registration: {
        id: registration.id,
        name: registration.name,
        email: registration.email,
        tickets: registration.tickets,
        event: {
          title: registration.events.title,
          start_datetime: registration.events.start_datetime
        }
      }
    })
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid input data', 
        details: error.errors 
      }, { status: 400 })
    }
    
    console.error('Error verifying payment:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Internal server error' 
    }, { status: 500 })
  }
}
