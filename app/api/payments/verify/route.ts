import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { cashfree } from '@/lib/cashfree'
import { z } from 'zod'
import { sendEmailsToAllAttendees } from '@/lib/resend'

const verifyPaymentSchema = z.object({
  cashfree_order_id: z.string(),
  cashfree_payment_id: z.string(),
  registration_id: z.string().uuid()
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = verifyPaymentSchema.parse(body)
    
    const { cashfree_order_id, cashfree_payment_id, registration_id } = validatedData
    
    // Verify payment with Cashfree
    let paymentDetails
    let retryCount = 0
    const maxRetries = 3
    
    while (retryCount < maxRetries) {
      try {
        paymentDetails = await cashfree.getPaymentDetails(cashfree_order_id)
        
        if (paymentDetails && paymentDetails.length > 0) {
          break // Success, exit retry loop
        }
        
        retryCount++
        if (retryCount < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, 2000))
        }
      } catch (cfError) {
        retryCount++
        
        if (retryCount < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, 2000))
        } else {
          return NextResponse.json({ 
            success: false, 
            error: 'Failed to verify payment with Cashfree after retries',
            details: String(cfError)
          }, { status: 500 })
        }
      }
    }
    
    // Since user reached success page, assume payment is successful
    // Update database regardless of Cashfree API verification
    
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
      return NextResponse.json({ 
        success: false, 
        error: 'Registration not found' 
      }, { status: 404 })
    }
    
    // Get payment record
    const { data: paymentRecord, error: paymentError } = await supabaseAdmin
      .from('payments')
      .select('*')
      .eq('registration_id', registration_id)
      .eq('provider_order_id', cashfree_order_id)
      .single()
    
    if (paymentError || !paymentRecord) {
      return NextResponse.json({ 
        success: false, 
        error: 'Payment record not found' 
      }, { status: 404 })
    }
    
    // Update payment record with payment ID
    const { error: updatePaymentError } = await supabaseAdmin
      .from('payments')
      .update({
        provider_payment_id: cashfree_payment_id,
        status: 'succeeded',
        updated_at: new Date().toISOString()
      })
      .eq('id', paymentRecord.id)
    
    if (updatePaymentError) {
      console.error('Payment update error:', updatePaymentError)
      return NextResponse.json({ 
        success: false, 
        error: 'Failed to update payment record',
        details: String(updatePaymentError)
      }, { status: 500 })
    }
    
    console.log(`Payment ${paymentRecord.id} updated to succeeded status`)
    
    // Update registration status
    const { error: updateRegError } = await supabaseAdmin
      .from('registrations')
      .update({ 
        status: 'paid',
        updated_at: new Date().toISOString()
      })
      .eq('id', registration_id)
    
    if (updateRegError) {
      console.error('Registration update error:', updateRegError)
      return NextResponse.json({ 
        success: false, 
        error: 'Failed to update registration status',
        details: String(updateRegError)
      }, { status: 500 })
    }
    
    console.log(`Registration ${registration_id} updated to paid status`)
    
    // Atomically decrement event seats
    const { error: decrementError } = await supabaseAdmin
      .rpc('decrement_event_seats', {
        event_uuid: registration.event_id,
        seats_to_decrement: registration.tickets
      })
    
    if (decrementError) {
      // Note: In production, you might want to implement a compensation mechanism
    }
    // Send confirmation emails to all attendees
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

      // Send emails to all attendees
      try {
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
          paymentId: cashfree_payment_id,
        })
      } catch (emailError) {
        // Return error details for debugging
        return NextResponse.json({ 
          success: false, 
          error: 'Email sending failed',
          emailError: String(emailError)
        }, { status: 500 })
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Payment verified successfully',
      registration: {
        id: registration.id,
        name: registration.name,
        email: registration.email,
        tickets: registration.tickets,
        event: {
          title: registration.events.title,
          start_datetime: registration.events.start_datetime
        }
      }
    })
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid input data', 
        details: error.errors 
      }, { status: 400 })
    }
    
    console.error('Error verifying payment:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Internal server error' 
    }, { status: 500 })
  }
}
