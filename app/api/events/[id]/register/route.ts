import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import Razorpay from 'razorpay'
import { z } from 'zod'

const registrationSchema = z.object({
  event_id: z.string().uuid(),
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().regex(/^(\+91)?[6-9]\d{9}$/, 'Invalid Indian phone number'),
  roll_no: z.string().min(1),
  tickets: z.number().min(1).max(10),
  ticket_details: z.array(z.object({
    name: z.string().min(1),
    roll_no: z.string().min(1),
    email: z.string().email().optional()
  })).optional()
})

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!
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
    
    // Create Razorpay order
    const amount = event.price_cents * validatedData.tickets
    const razorpayOrder = await razorpay.orders.create({
      amount: amount,
      currency: event.currency,
      receipt: registration.id,
      notes: {
        event_id: event.id,
        registration_id: registration.id,
        tickets: validatedData.tickets.toString()
      }
    })
    
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
        provider: 'razorpay',
        provider_order_id: razorpayOrder.id,
        amount_cents: amount,
        currency: event.currency,
        status: 'initiated'
      })
    
    if (paymentError) {
      console.error('Failed to create payment record:', paymentError)
    }
    
    return NextResponse.json({
      registration_id: registration.id,
      razorpay_order_id: razorpayOrder.id,
      razorpay_key_id: process.env.RAZORPAY_KEY_ID,
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
