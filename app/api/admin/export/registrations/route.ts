import { NextRequest, NextResponse } from 'next/server'
import { withAdminAuth } from '@/lib/admin-auth'
import { supabaseAdmin } from '@/lib/supabase'
import * as XLSX from 'xlsx'

// GET /api/admin/export/registrations - Export registrations as Excel
export const GET = withAdminAuth(async (request: NextRequest, admin) => {
  try {
    const { searchParams } = new URL(request.url)
    const eventId = searchParams.get('eventId')
    
    let query = supabaseAdmin
      .from('registrations')
      .select(`
        *,
        events!inner(
          id,
          title,
          start_datetime,
          price_cents,
          currency
        )
      `)
      .order('created_at', { ascending: false })
    
    if (eventId) {
      query = query.eq('event_id', eventId)
    }
    
    const { data: registrations, error } = await query
    
    if (error) {
      console.error('Error fetching registrations for export:', error)
      return NextResponse.json({ error: 'Failed to fetch registrations' }, { status: 500 })
    }
    
    // Prepare Excel data
    const excelData = registrations.map(reg => ({
      'Registration ID': reg.id,
      'Event': reg.events?.title || 'Unknown',
      'Event Date': reg.events?.start_datetime 
        ? new Date(reg.events.start_datetime).toLocaleDateString()
        : 'N/A',
      'Attendee Name': reg.name,
      'Email': reg.email,
      'Phone': reg.phone,
      'Roll Number': reg.roll_no || '',
      'Tickets': reg.tickets,
      'Status': reg.status.replace('_', ' ').toUpperCase(),
      'Amount (₹)': reg.events?.price_cents 
        ? (reg.events.price_cents * reg.tickets) / 100 
        : 0,
      'Registration Date': new Date(reg.created_at).toLocaleString(),
      'Ticket Details': reg.ticket_details 
        ? JSON.stringify(reg.ticket_details)
        : ''
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
    
    // Return Excel file
    return new NextResponse(excelBuffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="registrations-${new Date().toISOString().split('T')[0]}.xlsx"`
      }
    })
  } catch (error) {
    console.error('Error exporting registrations:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
})
