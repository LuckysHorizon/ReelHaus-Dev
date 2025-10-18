import { Resend } from 'resend'

const apiKey = process.env.RESEND_API_KEY

export const resendClient = apiKey ? new Resend(apiKey) : null

// Helper function to send emails to all attendees
export async function sendEmailsToAllAttendees(params: {
  mainRegistrant: {
    email: string
    name: string
    roll_no: string
  }
  ticketDetails?: Array<{
    name: string
    roll_no: string
    email: string
  }>
  eventName: string
  eventDate: string
  eventTime: string
  eventLocation: string
  paymentId: string
}) {
  if (!resendClient) {
    console.error('RESEND_API_KEY is not configured')
    return
  }

  const { mainRegistrant, ticketDetails, eventName, eventDate, eventTime, eventLocation, paymentId } = params

  // Send email to main registrant
  await sendPaymentConfirmationEmail({
    email: mainRegistrant.email,
    name: mainRegistrant.name,
    eventName,
    eventDate,
    eventTime,
    eventLocation,
    paymentId,
    attendeeEmail: mainRegistrant.email,
    rollNumber: mainRegistrant.roll_no,
  }).catch((error) => {
    console.error(`Failed to send email to main registrant ${mainRegistrant.email}:`, error)
  })

  // Send emails to additional attendees if any
  if (ticketDetails && ticketDetails.length > 0) {
    for (const attendee of ticketDetails) {
      if (attendee.email && attendee.email.trim() !== '') {
        await sendPaymentConfirmationEmail({
          email: attendee.email,
          name: attendee.name,
          eventName,
          eventDate,
          eventTime,
          eventLocation,
          paymentId,
          attendeeEmail: attendee.email,
          rollNumber: attendee.roll_no,
        }).catch((error) => {
          console.error(`Failed to send email to attendee ${attendee.email}:`, error)
        })
      }
    }
  }
}

export async function sendPaymentConfirmationEmail(params: {
  email: string
  name: string
  eventName: string
  eventDate?: string
  eventTime?: string
  eventLocation?: string
  paymentId?: string
  attendeeEmail?: string
  rollNumber?: string
}) {
  if (!resendClient) {
    console.error('RESEND_API_KEY is not configured')
    throw new Error('RESEND_API_KEY is not configured')
  }

  const { 
    email, 
    name, 
    eventName, 
    eventDate = 'TBD', 
    eventTime = 'TBD', 
    eventLocation = 'TBD',
    paymentId = 'N/A',
    attendeeEmail = email,
    rollNumber = 'N/A'
  } = params


  try {
    const result = await resendClient.emails.send({
    from: 'ReelHaus <no-reply@reelhaus.in>',
    to: [email],
    subject: 'Your Event Registration is Confirmed – See You at ReelHaus!',
    html: `
      <!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>ReelHaus Event Registration Confirmation</title>
    <style>
      body {
        font-family: "Segoe UI", Roboto, sans-serif;
        background-color: #f9fafb;
        margin: 0;
        padding: 0;
      }

      .container {
        background-color: #ffffff;
        max-width: 600px;
        margin: 40px auto;
        border-radius: 20px; /* smoother curved edges */
        padding: 35px;
        border: 2.5px solid #111827; /* premium black border */
        box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08); /* soft shadow for depth */
        color: #333333;
      }

      /* ReelHaus text logo styling */
      .logo {
        text-align: center;
        margin-bottom: 25px;
      }

      .brand-logo {
        font-size: 36px;
        font-weight: 800;
        letter-spacing: 1px;
        text-align: center;
        color: #111827;
        margin: 0;
      }

      .brand-logo span {
        color: #e11d48; /* ReelHaus red accent */
      }

      h1 {
        color: #111827;
        text-align: center;
        font-size: 26px;
        margin-bottom: 10px;
      }

      p {
        color: #374151;
        line-height: 1.7;
        font-size: 15px;
      }

      .details {
        background-color: #f3f4f6;
        padding: 15px 20px;
        border-radius: 12px;
        margin: 20px 0;
        border: 1px solid #d1d5db; /* subtle border for detail boxes */
      }

      .details p {
        margin: 6px 0;
        color: #1f2937;
      }

      .highlight {
        color: #111827;
        font-weight: 600;
      }

      .footer {
        text-align: center;
        font-size: 13px;
        color: #6b7280;
        margin-top: 25px;
      }

      .brand {
        color: #e11d48;
        font-weight: 700;
      }

      a {
        color: #e11d48;
        text-decoration: none;
      }

      .divider {
        border-top: 1px solid #e5e7eb;
        margin: 25px 0;
      }
    </style>
  </head>

  <body>
    <div class="container">
      <!-- Brand text logo -->
      <div class="logo">
        <h2 class="brand-logo">
          <span>REEL</span>HAUS
        </h2>
      </div>

      <h1>Registration Confirmed!</h1>
      <p>Hi <span class="highlight">${name}</span>,</p>

      <p>
        Thank you for registering for <strong>${eventName}</strong> hosted by
        <span class="brand">ReelHaus</span>. Your payment has been received successfully,
        and your seat is confirmed!
      </p>

      <div class="details">
        <p><strong>Event Details:</strong></p>
        <p>📅 <strong>Date:</strong> ${eventDate}</p>
        <p>🕒 <strong>Time:</strong> ${eventTime}</p>
        <p>📍 <strong>Venue:</strong> ${eventLocation}</p>
      </div>

      <div class="details">
        <p><strong>Attendee Information:</strong></p>
        <p>👤 <strong>Name:</strong> ${name}</p>
        <p>📧 <strong>Email:</strong> ${attendeeEmail}</p>
        <p>🎓 <strong>Roll Number:</strong> ${rollNumber.toUpperCase()}</p>
        <p>💳 <strong>Payment ID:</strong> ${paymentId}</p>
      </div>

      <p>
        Please arrive at least <strong>15 minutes early</strong> for check-in and
        seating. We can't wait to share this amazing event experience with you!
      </p>

      <p>
        For assistance, reach us anytime at
        <a href="mailto:support@reelhaus.in">support@reelhaus.in</a>.
      </p>

      <div class="divider"></div>

      <div class="footer">
        <p>— The <span class="brand">ReelHaus</span> Team</p>
        <p>© 2025 ReelHaus. All rights reserved.</p>
      </div>
    </div>
  </body>
</html>
    `,
    })

    console.log(`Email sent successfully to ${email}. Resend ID: ${result.data?.id}`)
    return result
  } catch (error) {
    console.error(`Failed to send email to ${email}:`, error)
    throw error
  }
}


 