import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { sendPaymentConfirmationEmail } from '@/lib/resend'

const bodySchema = z.object({
  email: z.string().email(),
  name: z.string().min(1),
  eventName: z.string().min(1)
})

export async function POST(request: NextRequest) {
  try {
    const json = await request.json()
    const { email, name, eventName } = bodySchema.parse(json)

    await sendPaymentConfirmationEmail({ email, name, eventName })

    return NextResponse.json({ message: 'Email sent' })
  } catch (error: any) {
    if (error?.issues) {
      return NextResponse.json({ error: 'Invalid input', details: error.issues }, { status: 400 })
    }
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
  }
}


