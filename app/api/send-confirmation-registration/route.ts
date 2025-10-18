import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { sendEmailsToAllAttendees } from '@/lib/resend'
import { z } from 'zod'

const bodySchema = z.object({
  registration_id: z.string().uuid()
})

export async function POST(request: NextRequest) {
  try {
    const json = await request.json()
    const { registration_id } = bodySchema.parse(json)

    // Get registration details with event information
    const { data: registration, error: regError } = await supabaseAdmin
      .from('registrations')
      .select(`
        *,
        events!inner(
          id,
          title,
          start_datetime,
          end_datetime,
          description
        )
      `)
      .eq('id', registration_id)
      .single()

    if (regError || !registration) {
      return NextResponse.json({ error: 'Registration not found' }, { status: 404 })
    }

    // Get payment details to get the payment ID
    const { data: payment, error: paymentError } = await supabaseAdmin
      .from('payments')
      .select('provider_payment_id, provider_order_id')
      .eq('registration_id', registration_id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    const paymentId = payment?.provider_payment_id || payment?.provider_order_id || 'N/A'

    // Send confirmation emails
    if (process.env.RESEND_API_KEY) {
      const event = registration.events
      const eventDate = new Date(event.start_datetime).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
      const eventTime = `${new Date(event.start_datetime).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      })} - ${new Date(event.end_datetime).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      })}`

      await sendEmailsToAllAttendees({
        mainRegistrant: {
          email: registration.email,
          name: registration.name || 'Attendee',
          roll_no: registration.roll_no || 'N/A',
        },
        ticketDetails: registration.ticket_details || [],
        eventName: event.title,
        eventDate,
        eventTime,
        eventLocation: 'TBD', // Add venue field to events table if needed
        paymentId: paymentId,
      })
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Confirmation email sent successfully' 
    })

  } catch (error: any) {
    if (error?.issues) {
      return NextResponse.json({ error: 'Invalid input', details: error.issues }, { status: 400 })
    }
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to send confirmation email',
      details: String(error)
    }, { status: 500 })
  }
}
