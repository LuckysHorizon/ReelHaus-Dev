import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { verifyAdminToken } from '@/lib/admin-auth'
import { z } from 'zod'

const eventUpdateSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional().or(z.literal('')),
  cover_image_url: z.string().optional().or(z.literal('')),
  start_datetime: z.string().optional().or(z.literal('')),
  end_datetime: z.string().optional().or(z.literal('')),
  seats_total: z.coerce.number().min(0).optional(),
  seats_available: z.coerce.number().min(0).optional(),
  price_cents: z.coerce.number().min(0).optional(),
  currency: z.string().optional(),
  is_active: z.coerce.boolean().optional()
})

// GET /api/admin/events/[id] - Get single event
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const admin = verifyAdminToken(request)
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const { data: event, error } = await supabaseAdmin
      .from('events')
      .select('*')
      .eq('id', params.id)
      .single()
    
    if (error) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }
    
    return NextResponse.json({ event })
  } catch (error) {
    console.error('Error fetching event:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT /api/admin/events/[id] - Update event
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const admin = verifyAdminToken(request)
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const body = await request.json()
    const validatedData = eventUpdateSchema.parse(body)
    
    const { data: event, error } = await supabaseAdmin
      .from('events')
      .update(validatedData)
      .eq('id', params.id)
      .select()
      .single()
    
    if (error) {
      return NextResponse.json({ error: 'Failed to update event' }, { status: 500 })
    }
    
    // Log admin action
    await supabaseAdmin
      .from('audit_log')
      .insert({
        admin_id: admin.username,
        action: 'update_event',
        resource_type: 'event',
        resource_id: params.id,
        details: { updates: validatedData },
        ip_address: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
        user_agent: request.headers.get('user-agent')
      })
    
    return NextResponse.json({ event })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input data', details: error.errors }, { status: 400 })
    }
    
    console.error('Error updating event:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE /api/admin/events/[id] - Delete event
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const admin = verifyAdminToken(request)
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    console.log(`[Delete Event] Admin ${admin.username} attempting to delete event ${params.id}`)
    
    // First, check if there are any registrations for this event
    const { data: registrations, error: regError } = await supabaseAdmin
      .from('registrations')
      .select('id, status')
      .eq('event_id', params.id)
    
    if (regError) {
      console.error('Error checking registrations:', regError)
      return NextResponse.json({ error: 'Failed to check event registrations' }, { status: 500 })
    }
    
    if (registrations && registrations.length > 0) {
      console.log(`[Delete Event] Found ${registrations.length} registrations for event ${params.id}`)
      
      // Check if any registrations are paid
      const paidRegistrations = registrations.filter(reg => reg.status === 'paid')
      if (paidRegistrations.length > 0) {
        // Check if this is a force delete request
        const url = new URL(request.url)
        const forceDelete = url.searchParams.get('force') === 'true'
        
        if (!forceDelete) {
          return NextResponse.json({ 
            error: 'Cannot delete event with paid registrations', 
            details: `This event has ${paidRegistrations.length} paid registration(s). Please contact support to handle refunds before deletion.`,
            forceDeleteAvailable: true
          }, { status: 400 })
        }
        
        console.log(`[Delete Event] Force deleting event with ${paidRegistrations.length} paid registrations`)
      }
      
      // Delete unpaid registrations first
      const { error: deleteRegError } = await supabaseAdmin
        .from('registrations')
        .delete()
        .eq('event_id', params.id)
      
      if (deleteRegError) {
        console.error('Error deleting registrations:', deleteRegError)
        return NextResponse.json({ error: 'Failed to delete event registrations' }, { status: 500 })
      }
      
      console.log(`[Delete Event] Deleted ${registrations.length} unpaid registrations`)
    }
    
    // Delete related payments
    const { error: deletePaymentsError } = await supabaseAdmin
      .from('payments')
      .delete()
      .eq('registration_id', 
        supabaseAdmin
          .from('registrations')
          .select('id')
          .eq('event_id', params.id)
      )
    
    if (deletePaymentsError) {
      console.error('Error deleting payments:', deletePaymentsError)
      // Don't fail the deletion for payment cleanup errors
    }
    
    // Delete related exports
    const { error: deleteExportsError } = await supabaseAdmin
      .from('exports')
      .delete()
      .eq('event_id', params.id)
    
    if (deleteExportsError) {
      console.error('Error deleting exports:', deleteExportsError)
      // Don't fail the deletion for export cleanup errors
    } else {
      console.log('✅ Exports deleted successfully')
    }
    
    // Now delete the event
    const { error: deleteEventError } = await supabaseAdmin
      .from('events')
      .delete()
      .eq('id', params.id)
    
    if (deleteEventError) {
      console.error('Error deleting event:', deleteEventError)
      return NextResponse.json({ 
        error: 'Failed to delete event', 
        details: deleteEventError.message 
      }, { status: 500 })
    }
    
    console.log(`[Delete Event] Successfully deleted event ${params.id}`)
    
    // Log admin action
    await supabaseAdmin
      .from('audit_log')
      .insert({
        admin_id: admin.username,
        action: 'delete_event',
        resource_type: 'event',
        resource_id: params.id,
        details: { 
          registrations_deleted: registrations?.length || 0,
          had_paid_registrations: registrations?.some(reg => reg.status === 'paid') || false
        },
        ip_address: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
        user_agent: request.headers.get('user-agent')
      })
    
    return NextResponse.json({ 
      success: true, 
      message: 'Event deleted successfully',
      registrations_deleted: registrations?.length || 0
    })
  } catch (error) {
    console.error('Error deleting event:', error)
    return NextResponse.json({ 
      error: 'Internal server error', 
      details: String(error) 
    }, { status: 500 })
  }
}
