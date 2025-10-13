import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
const Razorpay = require('razorpay')
import { z } from 'zod'

const createOrderSchema = z.object({
  event_id: z.string().uuid(),
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email format'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits').max(15, 'Phone number too long'),
  roll_no: z.string().min(1, 'Roll number is required'),
  tickets: z.number().min(1).max(6),
  ticket_details: z.array(z.object({
    name: z.string().min(1, 'Attendee name is required'),
    roll_no: z.string().min(1, 'Attendee roll number is required'),
    email: z.string().email('Invalid attendee email format').or(z.literal(''))
  })).optional().or(z.literal([]))
})

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('Payment order request body:', JSON.stringify(body, null, 2))
    
    const validatedData = createOrderSchema.parse(body)
    console.log('Validation successful:', validatedData)
    
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
    
    // Create registration first
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
    
    // Calculate total amount
    const amount = event.price_cents * validatedData.tickets
    
    // Create Razorpay order
    const razorpayOrder = await razorpay.orders.create({
      amount: amount,
      currency: event.currency,
      receipt: registration.id,
      notes: {
        event_id: event.id,
        registration_id: registration.id,
        tickets: validatedData.tickets.toString(),
        event_title: event.title
      }
    })
    
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
      return NextResponse.json({ error: 'Failed to create payment record' }, { status: 500 })
    }
    
    return NextResponse.json({
      success: true,
      order: {
        id: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        receipt: razorpayOrder.receipt
      },
      registration_id: registration.id,
      razorpay_key_id: process.env.RAZORPAY_KEY_ID,
      event: {
        title: event.title,
        price_cents: event.price_cents
      }
    })
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('Validation error:', error.errors)
      return NextResponse.json({ 
        error: 'Invalid input data', 
        details: error.errors,
        message: 'Please check your form data and try again'
      }, { status: 400 })
    }
    
    console.error('Error creating Razorpay order:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
