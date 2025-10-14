import { NextRequest, NextResponse } from 'next/server'
import { sendEmailsToAllAttendees } from '@/lib/resend'

export async function POST(request: NextRequest) {
  try {
    const { email, name, eventName, testMultiple = false } = await request.json()

    if (!email || !name || !eventName) {
      return NextResponse.json({ 
        error: 'Missing required fields: email, name, eventName' 
      }, { status: 400 })
    }

    console.log(`Testing email to: ${email}`)
    
    if (testMultiple) {
      // Test multiple attendees
      await sendEmailsToAllAttendees({
        mainRegistrant: {
          email,
          name,
          roll_no: 'MAIN123',
        },
        ticketDetails: [
          {
            name: 'Additional Attendee 1',
            roll_no: 'ADD001',
            email: 'attendee1@example.com',
          },
          {
            name: 'Additional Attendee 2', 
            roll_no: 'ADD002',
            email: 'attendee2@example.com',
          }
        ],
        eventName,
        eventDate: 'Friday, January 15, 2025',
        eventTime: '7:00 PM - 10:00 PM',
        eventLocation: 'Main Auditorium',
        paymentId: 'test_payment_123',
      })

      return NextResponse.json({ 
        success: true, 
        message: 'Test emails sent to all attendees successfully'
      })
    } else {
      // Test single attendee (legacy behavior)
      const { sendPaymentConfirmationEmail } = await import('@/lib/resend')
      const result = await sendPaymentConfirmationEmail({
        email,
        name,
        eventName,
        eventDate: 'Friday, January 15, 2025',
        eventTime: '7:00 PM - 10:00 PM',
        eventLocation: 'Main Auditorium',
        paymentId: 'test_payment_123',
        attendeeEmail: email,
        rollNumber: 'TEST123',
      })

      return NextResponse.json({ 
        success: true, 
        message: 'Test email sent successfully',
        resendId: result.data?.id 
      })
    }
  } catch (error: any) {
    console.error('Test email failed:', error)
    return NextResponse.json({ 
      error: 'Failed to send test email',
      details: error.message 
    }, { status: 500 })
  }
}
