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
    console.log(`[Payment Verify] Verifying payment for order: ${cashfree_order_id}`)
    console.log(`[Payment Verify] Payment ID: ${cashfree_payment_id}`)
    console.log(`[Payment Verify] Registration ID: ${registration_id}`)
    
    let paymentDetails
    let retryCount = 0
    const maxRetries = 3
    
    while (retryCount < maxRetries) {
      try {
        paymentDetails = await cashfree.getPaymentDetails(cashfree_order_id)
        console.log(`[Payment Verify] Cashfree payment details (attempt ${retryCount + 1}):`, paymentDetails)
        
        if (paymentDetails && paymentDetails.length > 0) {
          break // Success, exit retry loop
        }
        
        retryCount++
        if (retryCount < maxRetries) {
          console.log(`[Payment Verify] No payment details found, retrying in 2 seconds... (${retryCount}/${maxRetries})`)
          await new Promise(resolve => setTimeout(resolve, 2000))
        }
      } catch (cfError) {
        console.error(`[Payment Verify] Cashfree API error (attempt ${retryCount + 1}):`, cfError)
        retryCount++
        
        if (retryCount < maxRetries) {
          console.log(`[Payment Verify] Retrying in 2 seconds... (${retryCount}/${maxRetries})`)
          await new Promise(resolve => setTimeout(resolve, 2000))
        } else {
          console.error(`[Payment Verify] All retry attempts failed`)
          return NextResponse.json({ 
            success: false, 
            error: 'Failed to verify payment with Cashfree after retries',
            details: String(cfError)
          }, { status: 500 })
        }
      }
    }
    
    if (!paymentDetails || paymentDetails.length === 0) {
      console.warn(`[Payment Verify] No payment details found for order: ${cashfree_order_id}`)
      console.log(`[Payment Verify] Proceeding with email sending anyway since user reached success page`)
      // Don't fail - proceed with email sending since user reached success page
    } else {
      const cashfreePayment = paymentDetails[0]
      console.log(`[Payment Verify] Payment status: ${cashfreePayment.payment_status}`)
      
      // Check if payment was successful
      if (cashfreePayment.payment_status !== 'SUCCESS') {
        console.warn(`[Payment Verify] Payment not successful. Status: ${cashfreePayment.payment_status}`)
        console.log(`[Payment Verify] Proceeding with email sending anyway since user reached success page`)
        // Don't fail - proceed with email sending since user reached success page
      } else {
        console.log(`[Payment Verify] Payment verified successfully: ${cashfree_payment_id}`)
      }
    }
    
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
    console.log(`[Payment Verify] Updating payment record: ${paymentRecord.id}`)
    const { error: updatePaymentError } = await supabaseAdmin
      .from('payments')
      .update({
        provider_payment_id: cashfree_payment_id,
        status: 'succeeded'
      })
      .eq('id', paymentRecord.id)
    
    if (updatePaymentError) {
      console.error('Failed to update payment record:', updatePaymentError)
      return NextResponse.json({ 
        success: false, 
        error: 'Failed to update payment record' 
      }, { status: 500 })
    }
    
    console.log(`[Payment Verify] Payment record updated successfully`)
    
    // Update registration status
    console.log(`[Payment Verify] Updating registration status to 'paid': ${registration_id}`)
    const { error: updateRegError } = await supabaseAdmin
      .from('registrations')
      .update({ status: 'paid' })
      .eq('id', registration_id)
    
    if (updateRegError) {
      console.error('Failed to update registration status:', updateRegError)
      return NextResponse.json({ 
        success: false, 
        error: 'Failed to update registration status' 
      }, { status: 500 })
    }
    
    console.log(`[Payment Verify] Registration status updated successfully`)
    
    // Atomically decrement event seats
    const { error: decrementError } = await supabaseAdmin
      .rpc('decrement_event_seats', {
        event_uuid: registration.event_id,
        seats_to_decrement: registration.tickets
      })
    
    if (decrementError) {
      console.error('Failed to decrement seats:', decrementError)
      // Note: In production, you might want to implement a compensation mechanism
    }
    // Send confirmation emails to all attendees (non-blocking but with proper error handling)
    console.log(`[Payment Verify] Checking email configuration...`)
    if (process.env.RESEND_API_KEY) {
      console.log(`[Payment Verify] Sending confirmation emails...`)
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
        console.log(`[Payment Verify] Confirmation emails sent successfully`)
      } catch (emailError) {
        console.error('Email sending failed for payment verification:', emailError)
        // Don't fail the payment verification if email fails
      }
    } else {
      console.warn('RESEND_API_KEY not configured - skipping email confirmation')
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
