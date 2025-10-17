import { NextRequest, NextResponse } from 'next/server'
import { sendPaymentConfirmationEmail } from '@/lib/resend'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, name, eventName } = body

    if (!email || !name || !eventName) {
      return NextResponse.json({ 
        error: 'Missing required fields: email, name, eventName' 
      }, { status: 400 })
    }

    // Test email sending
    await sendPaymentConfirmationEmail({
      email,
      name,
      eventName,
      eventDate: 'Test Date',
      eventTime: 'Test Time',
      eventLocation: 'Test Venue',
      paymentId: 'TEST_PAYMENT_ID',
      attendeeEmail: email,
      rollNumber: 'TEST_ROLL'
    })

    return NextResponse.json({
      success: true,
      message: 'Test email sent successfully'
    })

  } catch (error: any) {
    console.error('Test email error:', error)
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to send test email'
    }, { status: 500 })
  }
}