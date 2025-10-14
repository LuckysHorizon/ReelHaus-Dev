import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { sendPaymentConfirmationEmail } from '@/lib/resend'

const bodySchema = z.object({
  email: z.string().email(),
  name: z.string().min(1),
  eventName: z.string().min(1),
  eventDate: z.string().optional(),
  eventTime: z.string().optional(),
  eventLocation: z.string().optional(),
  paymentId: z.string().optional(),
  attendeeEmail: z.string().email().optional(),
  rollNumber: z.string().optional()
})

export async function POST(request: NextRequest) {
  try {
    const json = await request.json()
    const { 
      email, 
      name, 
      eventName, 
      eventDate, 
      eventTime, 
      eventLocation, 
      paymentId, 
      attendeeEmail,
      rollNumber
    } = bodySchema.parse(json)

    await sendPaymentConfirmationEmail({ 
      email, 
      name, 
      eventName, 
      eventDate, 
      eventTime, 
      eventLocation, 
      paymentId, 
      attendeeEmail,
      rollNumber
    })

    return NextResponse.json({ message: 'Email sent' })
  } catch (error: any) {
    if (error?.issues) {
      return NextResponse.json({ error: 'Invalid input', details: error.issues }, { status: 400 })
    }
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
  }
}


