import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { registration_id } = body
    
    if (!registration_id) {
      return NextResponse.json({ error: 'Registration ID is required' }, { status: 400 })
    }
    
    console.log(`[Test Webhook] Processing registration: ${registration_id}`)
    
    // Get registration with event details
    const { data: registration, error: regError } = await supabaseAdmin
      .from('registrations')
      .select(`
        *,
        events!inner(
          id,
          title,
          start_datetime,
          end_datetime,
          price_cents,
          currency
        )
      `)
      .eq('id', registration_id)
      .single()
    
    if (regError || !registration) {
      console.error(`[Test Webhook] Registration not found: ${registration_id}`)
      return NextResponse.json({ error: 'Registration not found' }, { status: 404 })
    }
    
    console.log(`[Test Webhook] Found registration:`, {
      id: registration.id,
      name: registration.name,
      email: registration.email,
      status: registration.status,
      event_title: registration.events.title
    })
    
    // Update registration status to paid
    const { error: updateError } = await supabaseAdmin
      .from('registrations')
      .update({ status: 'paid' })
      .eq('id', registration_id)
    
    if (updateError) {
      console.error(`[Test Webhook] Failed to update registration status:`, updateError)
      return NextResponse.json({ error: 'Failed to update registration status' }, { status: 500 })
    }
    
    // Update payment status
    const { error: paymentError } = await supabaseAdmin
      .from('payments')
      .update({ status: 'succeeded' })
      .eq('registration_id', registration_id)
    
    if (paymentError) {
      console.error(`[Test Webhook] Failed to update payment status:`, paymentError)
    }
    
    // Decrement seats
    const { error: decrementError } = await supabaseAdmin
      .rpc('decrement_event_seats', {
        event_uuid: registration.event_id,
        seats_to_decrement: registration.tickets
      })
    
    if (decrementError) {
      console.error(`[Test Webhook] Failed to decrement seats:`, decrementError)
    }
    
    console.log(`[Test Webhook] Successfully processed registration: ${registration_id}`)
    
    return NextResponse.json({ 
      success: true, 
      message: 'Registration processed successfully',
      registration: {
        id: registration.id,
        name: registration.name,
        email: registration.email,
        status: 'paid',
        event_title: registration.events.title
      }
    })
    
  } catch (error) {
    console.error('[Test Webhook] Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
