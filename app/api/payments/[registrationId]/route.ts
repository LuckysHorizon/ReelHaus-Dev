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

    // Get payment data with registration and event details
    const { data: paymentData, error } = await supabaseAdmin
      .from('payments')
      .select(`
        *,
        registrations!inner(
          *,
          events!inner(
            id,
            title,
            price_cents,
            currency
          )
        )
      `)
      .eq('registration_id', registrationId)
      .eq('status', 'initiated')
      .single()

    if (error || !paymentData) {
      return NextResponse.json({ error: 'Payment not found' }, { status: 404 })
    }

    const registration = paymentData.registrations
    const event = registration.events

    return NextResponse.json({
      registration_id: registration.id,
      cashfree_order_id: paymentData.provider_order_id,
      cashfree_payment_session_id: paymentData.provider_payment_id || '', // This will be set after order creation
      cashfree_order_token: '', // This will be set after order creation
      amount: paymentData.amount_cents / 100, // Convert cents to rupees
      currency: event.currency,
      event_title: event.title
    })

  } catch (error) {
    console.error('Error fetching payment data:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
