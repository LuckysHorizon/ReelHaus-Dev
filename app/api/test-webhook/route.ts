import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { sendEmailsToAllAttendees } from '@/lib/resend'

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
    
    // Send confirmation emails to all attendees
    if (process.env.RESEND_API_KEY) {
      console.log(`[Test Webhook] Sending confirmation emails...`)
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
          eventLocation: 'TBD', // Add venue field to events table if needed
          paymentId: 'TEST_' + registration_id,
        })
        console.log(`[Test Webhook] Confirmation emails sent successfully`)
      } catch (emailError) {
        console.error(`[Test Webhook] Email sending failed:`, emailError)
      }
    } else {
      console.warn(`[Test Webhook] RESEND_API_KEY not configured - skipping email confirmation`)
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
