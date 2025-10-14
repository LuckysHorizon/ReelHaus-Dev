import { Resend } from 'resend'

const apiKey = process.env.RESEND_API_KEY

export const resendClient = apiKey ? new Resend(apiKey) : null

export async function sendPaymentConfirmationEmail(params: {
  email: string
  name: string
  eventName: string
}) {
  if (!resendClient) {
    throw new Error('RESEND_API_KEY is not configured')
  }

  const { email, name, eventName } = params

  return await resendClient.emails.send({
    from: 'ReelHaus <no-reply@reelhaus.in>',
    to: [email],
    subject: 'Your Event Registration is Confirmed',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 640px; margin: 0 auto; background: #0a0a0a; color: #fafafa; padding: 24px;">
        <h1 style="margin: 0 0 16px; font-size: 22px; color: #ffffff;">Hello ${name},</h1>
        <p style="margin: 0 0 12px;">Thank you for registering for <strong>${eventName}</strong>.</p>
        <p style="margin: 0 0 12px;">Your payment has been successfully received.</p>
        <p style="margin: 0 0 12px;">We look forward to seeing you at the event!</p>
        <p style="margin: 24px 0 0; color: #e5e7eb;">— Team ReelHaus</p>
      </div>
    `,
  })
}


