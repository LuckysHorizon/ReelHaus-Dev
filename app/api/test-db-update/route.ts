import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { registration_id } = body
    
    if (!registration_id) {
      return NextResponse.json({ error: 'Registration ID is required' }, { status: 400 })
    }
    
    // Check current registration status
    const { data: registration, error: regError } = await supabaseAdmin
      .from('registrations')
      .select('id, status, name, email')
      .eq('id', registration_id)
      .single()
    
    if (regError || !registration) {
      return NextResponse.json({ error: 'Registration not found' }, { status: 404 })
    }
    
    // Check payment status
    const { data: payment, error: paymentError } = await supabaseAdmin
      .from('payments')
      .select('id, status, provider_payment_id, provider_order_id')
      .eq('registration_id', registration_id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()
    
    return NextResponse.json({
      success: true,
      registration: {
        id: registration.id,
        status: registration.status,
        name: registration.name,
        email: registration.email
      },
      payment: payment ? {
        id: payment.id,
        status: payment.status,
        provider_payment_id: payment.provider_payment_id,
        provider_order_id: payment.provider_order_id
      } : null,
      paymentError: paymentError ? String(paymentError) : null
    })
    
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to check database status',
      details: String(error)
    }, { status: 500 })
  }
}
