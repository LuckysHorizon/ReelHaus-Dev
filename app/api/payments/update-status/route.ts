import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { z } from 'zod'

const updateStatusSchema = z.object({
  registration_id: z.string().uuid(),
  payment_id: z.string().optional()
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = updateStatusSchema.parse(body)
    
    const { registration_id, payment_id } = validatedData
    
    console.log('[Update Status API] Received request:', {
      registration_id,
      payment_id
    })
    
    // Check if registration is already paid
    const { data: existingRegistration, error: regCheckError } = await supabaseAdmin
      .from('registrations')
      .select('status')
      .eq('id', registration_id)
      .single()
    
    if (regCheckError) {
      console.log('[Update Status API] Registration check error:', regCheckError)
      return NextResponse.json({ 
        success: false, 
        error: 'Registration not found' 
      }, { status: 404 })
    }
    
    console.log('[Update Status API] Current registration status:', existingRegistration.status)
    
    if (existingRegistration.status === 'paid') {
      console.log('[Update Status API] Registration already paid, skipping update')
      return NextResponse.json({
        success: true,
        message: 'Registration is already paid',
        registration_id
      })
    }
    
    // Get the latest payment record for this registration
    const { data: paymentRecord, error: paymentError } = await supabaseAdmin
      .from('payments')
      .select('*')
      .eq('registration_id', registration_id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()
    
    if (paymentError || !paymentRecord) {
      console.log('[Update Status API] Payment record error:', paymentError)
      return NextResponse.json({ 
        success: false, 
        error: 'Payment record not found' 
      }, { status: 404 })
    }
    
    console.log('[Update Status API] Found payment record:', {
      id: paymentRecord.id,
      status: paymentRecord.status,
      provider_order_id: paymentRecord.provider_order_id
    })
    
    // Update payment status to succeeded
    console.log('[Update Status API] Updating payment status to succeeded...')
    
    const { error: updatePaymentError } = await supabaseAdmin
      .from('payments')
      .update({
        provider_payment_id: payment_id || paymentRecord.provider_payment_id,
        status: 'succeeded'
      })
      .eq('id', paymentRecord.id)
    
    if (updatePaymentError) {
      console.log('[Update Status API] Payment update error:', updatePaymentError)
      return NextResponse.json({ 
        success: false, 
        error: 'Failed to update payment status',
        details: String(updatePaymentError)
      }, { status: 500 })
    }
    
    console.log('[Update Status API] Payment status updated successfully')
    
    // Update registration status to paid
    console.log('[Update Status API] Updating registration status to paid...')
    
    const { error: updateRegError } = await supabaseAdmin
      .from('registrations')
      .update({ status: 'paid' })
      .eq('id', registration_id)
    
    if (updateRegError) {
      console.log('[Update Status API] Registration update error:', updateRegError)
      return NextResponse.json({ 
        success: false, 
        error: 'Failed to update registration status',
        details: String(updateRegError)
      }, { status: 500 })
    }
    
    console.log('[Update Status API] Registration status updated successfully')
    
    // Atomically decrement event seats
    const { data: registration, error: regError } = await supabaseAdmin
      .from('registrations')
      .select('event_id, tickets')
      .eq('id', registration_id)
      .single()
    
    if (!regError && registration) {
      const { error: decrementError } = await supabaseAdmin
        .rpc('decrement_event_seats', {
          event_uuid: registration.event_id,
          seats_to_decrement: registration.tickets
        })
      
      if (decrementError) {
        // Log error but don't fail the request
        console.error('Failed to decrement seats:', decrementError)
      }
    }
    
    return NextResponse.json({
      success: true,
      message: 'Payment status updated successfully',
      registration_id,
      payment_id: payment_id || paymentRecord.provider_payment_id
    })
    
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid input data', 
        details: error.issues 
      }, { status: 400 })
    }
    
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to update payment status',
      details: String(error)
    }, { status: 500 })
  }
}
