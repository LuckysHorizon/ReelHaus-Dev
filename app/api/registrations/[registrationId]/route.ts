import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(
  request: NextRequest,
  { params }: { params: { registrationId: string } }
) {
  try {
    const { registrationId } = params

    if (!registrationId) {
      return NextResponse.json({ error: 'Registration ID is required' }, { status: 400 })
    }

    // Get registration data with event details
    const { data: registration, error } = await supabaseAdmin
      .from('registrations')
      .select(`
        *,
        events!inner(
          id,
          title,
          description,
          start_datetime,
          end_datetime,
          price_cents,
          currency,
          seats_total,
          seats_available
        )
      `)
      .eq('id', registrationId)
      .single()

    if (error || !registration) {
      return NextResponse.json({ error: 'Registration not found' }, { status: 404 })
    }

    return NextResponse.json(registration)

  } catch (error) {
    console.error('Error fetching registration data:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
