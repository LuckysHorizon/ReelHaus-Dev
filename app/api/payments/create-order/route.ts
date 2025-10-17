import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { cashfree } from '@/lib/cashfree'
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
  })).optional()
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = createOrderSchema.parse(body)
    
    // Additional validation: if tickets > 1, ticket_details must be provided and valid
    if (validatedData.tickets > 1) {
      if (!validatedData.ticket_details || validatedData.ticket_details.length === 0) {
        return NextResponse.json({ 
          error: 'Attendee details are required for multiple tickets',
          message: 'Please provide details for additional attendees'
        }, { status: 400 })
      }
      
      // Validate each attendee detail
      for (let i = 0; i < validatedData.ticket_details.length; i++) {
        const attendee = validatedData.ticket_details[i]
        if (!attendee.name.trim()) {
          return NextResponse.json({ 
            error: `Attendee ${i + 2} name is required`,
            message: 'Please provide name for all additional attendees'
          }, { status: 400 })
        }
        if (!attendee.roll_no.trim()) {
          return NextResponse.json({ 
            error: `Attendee ${i + 2} roll number is required`,
            message: 'Please provide roll number for all additional attendees'
          }, { status: 400 })
        }
      }
    }
    
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
    
    // Calculate total amount (store cents in DB, send rupees to Cashfree)
    const amount = event.price_cents * validatedData.tickets // cents
    const amountRupees = Number((amount / 100).toFixed(2))
    
    // Generate unique order ID for Cashfree
    const orderId = `ORDER_${registration.id}_${Date.now()}`
    
    // Create Cashfree order
    const cashfreeOrder = await cashfree.createOrder({
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
        paymentMethods: 'cc,dc,upi,wallet,netbanking,paylater'
      }
    })
    
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
      return NextResponse.json({ error: 'Failed to create payment record' }, { status: 500 })
    }
    
    return NextResponse.json({
      success: true,
      order: {
        id: cashfreeOrder.cf_order_id,
        amount: amount,
        currency: event.currency,
        receipt: registration.id
      },
      registration_id: registration.id,
      cashfree_order_id: cashfreeOrder.cf_order_id,
      cashfree_payment_session_id: cashfreeOrder.payment_session_id,
      cashfree_order_token: cashfreeOrder.order_token,
      event: {
        title: event.title,
        price_cents: event.price_cents
      }
    })
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ 
        error: 'Invalid input data', 
        details: error.errors,
        message: 'Please check your form data and try again'
      }, { status: 400 })
    }
    
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
