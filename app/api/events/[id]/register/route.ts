import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { cashfree } from '@/lib/cashfree'
import { z } from 'zod'

const registrationSchema = z.object({
  event_id: z.string().uuid(),
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().regex(/^(\+91)?[6-9]\d{9}$/, 'Invalid Indian phone number'),
  roll_no: z.string().min(1),
  tickets: z.number().min(1).max(6),
  ticket_details: z.array(z.object({
    name: z.string().min(1),
    roll_no: z.string().min(1),
    email: z.string().email().optional()
  })).optional()
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = registrationSchema.parse(body)
    
    // Get event details
    const { data: event, error: eventError } = await supabaseAdmin
      .from('events')
      .select('*')
      .eq('id', validatedData.event_id)
      .eq('is_active', true)
      .single()
    
    if (eventError || !event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }
    
    // Check if enough seats are available
    if (event.seats_available < validatedData.tickets) {
      return NextResponse.json({ error: 'Not enough seats available' }, { status: 400 })
    }
    
    // Create registration
    const { data: registration, error: regError } = await supabaseAdmin
      .from('registrations')
      .insert({
        event_id: validatedData.event_id,
        name: validatedData.name,
        email: validatedData.email,
        phone: validatedData.phone,
        roll_no: validatedData.roll_no,
        tickets: validatedData.tickets,
        ticket_details: validatedData.ticket_details,
        status: 'pending'
      })
      .select()
      .single()
    
    if (regError) {
      return NextResponse.json({ error: 'Failed to create registration' }, { status: 500 })
    }
    
    // Create Cashfree order
    const amount = event.price_cents * validatedData.tickets // cents
    const amountRupees = Number((amount / 100).toFixed(2))
    const orderId = `ORDER_${registration.id}_${Date.now()}`
    
    let cashfreeOrder
    try {
      cashfreeOrder = await cashfree.createOrder({
      orderId: orderId,
      orderAmount: amountRupees,
      orderCurrency: event.currency,
      orderNote: `Event Registration: ${event.title}`,
      customerDetails: {
        customerId: registration.id,
        customerName: validatedData.name,
        customerEmail: validatedData.email,
        customerPhone: validatedData.phone
      },
      orderMeta: {
        returnUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/events/payment/success?registration_id=${registration.id}`,
        notifyUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/api/webhooks/cashfree`,
        paymentMethods: 'cc,dc,upi,nb,paylater'
      }
      })
    } catch (cfErr: any) {
      console.error('Cashfree createOrder failed (event register):', cfErr)
      return NextResponse.json({ error: 'Payment gateway error', provider: 'cashfree', details: String(cfErr?.message || cfErr) }, { status: 502 })
    }
    
    // Update registration with payment info
    const { error: updateError } = await supabaseAdmin
      .from('registrations')
      .update({ status: 'payment_initiated' })
      .eq('id', registration.id)
    
    if (updateError) {
      console.error('Failed to update registration status:', updateError)
    }
    
    // Create payment record
    const { error: paymentError } = await supabaseAdmin
      .from('payments')
      .insert({
        registration_id: registration.id,
        provider: 'cashfree',
        provider_order_id: cashfreeOrder.cf_order_id,
        amount_cents: amount,
        currency: event.currency,
        status: 'initiated'
      })
    
    if (paymentError) {
      console.error('Failed to create payment record:', paymentError)
    }
    
    return NextResponse.json({
      registration_id: registration.id,
      cashfree_order_id: cashfreeOrder.cf_order_id,
      cashfree_payment_session_id: cashfreeOrder.payment_session_id,
      cashfree_order_token: cashfreeOrder.order_token,
      amount: amount,
      currency: event.currency
    })
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input data', details: error.errors }, { status: 400 })
    }
    
    console.error('Error creating registration:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
