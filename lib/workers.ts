import { Queue, Worker, Job } from 'bullmq'
import { createClient } from '@supabase/supabase-js'
import QRCode from 'qrcode'
import crypto from 'crypto'
import * as XLSX from 'xlsx'
import sgMail from '@sendgrid/mail'

// Initialize services
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

sgMail.setApiKey(process.env.SENDGRID_API_KEY!)

// Redis connection
const connection = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD,
}

// Queue definitions
export const qrGenerationQueue = new Queue('qr-generation', { connection })
export const emailQueue = new Queue('email-sending', { connection })
export const exportQueue = new Queue('export-generation', { connection })

// QR Generation Worker
export const qrGenerationWorker = new Worker('qr-generation', async (job: Job) => {
  const { registrationId, eventId, attendeeName } = job.data

  try {
    // Generate QR payload
    const payload = {
      r: registrationId,
      e: eventId,
      t: Date.now(),
      n: attendeeName
    }

    // Create HMAC signature
    const signature = crypto
      .createHmac('sha256', process.env.QR_HMAC_SECRET!)
      .update(JSON.stringify(payload))
      .digest('base64url')

    // Generate QR code
    const qrData = `${Buffer.from(JSON.stringify(payload)).toString('base64url')}.${signature}`
    const qrCodeBuffer = await QRCode.toBuffer(qrData, {
      type: 'png',
      width: 300,
      margin: 2,
      color: {
        dark: '#DC2626',
        light: '#FFFFFF'
      }
    })

    // Upload to Supabase Storage
    const fileName = `qr-${registrationId}.png`
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('qrs')
      .upload(fileName, qrCodeBuffer, {
        contentType: 'image/png',
        upsert: true
      })

    if (uploadError) {
      throw new Error(`Upload failed: ${uploadError.message}`)
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('qrs')
      .getPublicUrl(fileName)

    // Update registration with QR code URL
    await supabase
      .from('registrations')
      .update({ 
        metadata: { 
          qr_code_url: urlData.publicUrl,
          qr_generated_at: new Date().toISOString()
        }
      })
      .eq('id', registrationId)

    // Enqueue email sending
    await emailQueue.add('send-confirmation', {
      registrationId,
      qrCodeUrl: urlData.publicUrl,
      attendeeName
    })

    return { success: true, qrCodeUrl: urlData.publicUrl }
  } catch (error) {
    console.error('QR generation failed:', error)
    throw error
  }
}, { connection })

// Email Worker
export const emailWorker = new Worker('email-sending', async (job: Job) => {
  const { registrationId, qrCodeUrl, attendeeName } = job.data

  try {
    // Get registration details
    const { data: registration, error } = await supabase
      .from('registrations')
      .select(`
        *,
        events!inner(title, start_datetime, venue)
      `)
      .eq('id', registrationId)
      .single()

    if (error || !registration) {
      throw new Error('Registration not found')
    }

    const event = registration.events

    // Prepare email content
    const emailContent = {
      to: registration.email,
      from: {
        email: 'noreply@reelhaus.com',
        name: 'ReelHaus'
      },
      subject: `Your ticket for ${event.title} is ready!`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #000; color: #fff; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #DC2626; font-size: 28px; margin: 0;">ReelHaus</h1>
            <h2 style="color: #fff; font-size: 24px; margin: 10px 0;">Your Event Ticket is Ready!</h2>
          </div>
          
          <div style="background: #1a1a1a; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="color: #DC2626; margin-top: 0;">Event Details</h3>
            <p><strong>Event:</strong> ${event.title}</p>
            <p><strong>Date:</strong> ${new Date(event.start_datetime).toLocaleDateString()}</p>
            <p><strong>Venue:</strong> ${event.venue}</p>
            <p><strong>Attendee:</strong> ${attendeeName}</p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <p style="color: #DC2626; font-weight: bold;">Your QR Code Entry Pass</p>
            <img src="${qrCodeUrl}" alt="QR Code" style="max-width: 200px; border: 2px solid #DC2626; border-radius: 8px;">
            <p style="font-size: 14px; color: #ccc;">Show this QR code at the event entrance</p>
          </div>
          
          <div style="background: #1a1a1a; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
            <h4 style="color: #DC2626; margin-top: 0;">Important Instructions:</h4>
            <ul style="color: #ccc;">
              <li>Arrive 30 minutes before the event starts</li>
              <li>Keep your QR code handy on your phone</li>
              <li>Valid ID required for entry</li>
              <li>No refunds for missed events</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin-top: 30px;">
            <p style="color: #ccc; font-size: 14px;">
              Questions? Contact us at support@reelhaus.com
            </p>
            <p style="color: #666; font-size: 12px;">
              © 2024 ReelHaus. All rights reserved.
            </p>
          </div>
        </div>
      `
    }

    // Send email
    await sgMail.send(emailContent)

    // Update registration with email sent status
    await supabase
      .from('registrations')
      .update({ 
        metadata: { 
          email_sent_at: new Date().toISOString(),
          email_sent: true
        }
      })
      .eq('id', registrationId)

    return { success: true }
  } catch (error) {
    console.error('Email sending failed:', error)
    throw error
  }
}, { connection })

// Export Worker
export const exportWorker = new Worker('export-generation', async (job: Job) => {
  const { eventId, adminId } = job.data

  try {
    // Get event and registrations data
    const { data: event, error: eventError } = await supabase
      .from('events')
      .select('*')
      .eq('id', eventId)
      .single()

    if (eventError || !event) {
      throw new Error('Event not found')
    }

    const { data: registrations, error: regError } = await supabase
      .from('registrations')
      .select(`
        *,
        payments(*)
      `)
      .eq('event_id', eventId)
      .order('created_at', { ascending: false })

    if (regError) {
      throw new Error('Failed to fetch registrations')
    }

    // Prepare Excel data
    const excelData = registrations.map(reg => ({
      'Registration ID': reg.id,
      'Event ID': reg.event_id,
      'Name': reg.name,
      'Email': reg.email,
      'Phone': reg.phone,
      'Roll Number': reg.roll_no,
      'Tickets': reg.tickets,
      'Status': reg.status,
      'Payment Status': reg.payments?.[0]?.status || 'N/A',
      'Payment ID': reg.payments?.[0]?.provider_payment_id || 'N/A',
      'Amount (₹)': reg.payments?.[0]?.amount_cents ? reg.payments[0].amount_cents / 100 : 0,
      'Registration Date': new Date(reg.created_at).toLocaleString()
    }))

    // Create Excel workbook
    const workbook = XLSX.utils.book_new()
    const worksheet = XLSX.utils.json_to_sheet(excelData)
    
    // Add styling
    const range = XLSX.utils.decode_range(worksheet['!ref']!)
    for (let row = range.s.r; row <= range.e.r; row++) {
      for (let col = range.s.c; col <= range.e.c; col++) {
        const cellAddress = XLSX.utils.encode_cell({ r: row, c: col })
        if (!worksheet[cellAddress]) continue
        
        if (row === 0) {
          // Header row
          worksheet[cellAddress].s = {
            font: { bold: true, color: { rgb: "FFFFFF" } },
            fill: { fgColor: { rgb: "DC2626" } }
          }
        } else {
          // Data rows
          worksheet[cellAddress].s = {
            font: { color: { rgb: "000000" } },
            fill: { fgColor: { rgb: row % 2 === 0 ? "F5F5F5" : "FFFFFF" } }
          }
        }
      }
    }

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Registrations')

    // Generate Excel buffer
    const excelBuffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' })

    // Upload to Supabase Storage
    const fileName = `export-${eventId}-${Date.now()}.xlsx`
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('exports')
      .upload(fileName, excelBuffer, {
        contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        upsert: true
      })

    if (uploadError) {
      throw new Error(`Upload failed: ${uploadError.message}`)
    }

    // Get signed URL
    const { data: urlData } = supabase.storage
      .from('exports')
      .getPublicUrl(fileName)

    // Create export record
    await supabase
      .from('exports')
      .insert({
        event_id: eventId,
        file_url: urlData.publicUrl,
        generated_by: adminId
      })

    return { success: true, fileUrl: urlData.publicUrl }
  } catch (error) {
    console.error('Export generation failed:', error)
    throw error
  }
}, { connection })

// Error handling for all workers
qrGenerationWorker.on('error', (error) => {
  console.error('QR Generation Worker error:', error)
})

emailWorker.on('error', (error) => {
  console.error('Email Worker error:', error)
})

exportWorker.on('error', (error) => {
  console.error('Export Worker error:', error)
})

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down workers...')
  await qrGenerationWorker.close()
  await emailWorker.close()
  await exportWorker.close()
  process.exit(0)
})
