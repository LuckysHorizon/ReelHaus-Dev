import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { data: registration, error } = await supabaseAdmin
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
      .eq('id', id)
      .single()

    if (error || !registration) {
      return NextResponse.json({ error: 'Registration not found' }, { status: 404 })
    }

    // Format the response
    const response = {
      id: registration.id,
      name: registration.name,
      email: registration.email,
      phone: registration.phone,
      roll_no: registration.roll_no,
      tickets: registration.tickets,
      ticket_details: registration.ticket_details,
      status: registration.status,
      event: {
        id: registration.events.id,
        title: registration.events.title,
        start_datetime: registration.events.start_datetime,
        end_datetime: registration.events.end_datetime,
        price_cents: registration.events.price_cents,
        currency: registration.events.currency
      }
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error fetching registration:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
