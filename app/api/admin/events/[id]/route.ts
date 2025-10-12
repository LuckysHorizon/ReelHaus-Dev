import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { verifyAdminToken } from '@/lib/admin-auth'
import { z } from 'zod'

const eventUpdateSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  cover_image_url: z.string().url().optional(),
  start_datetime: z.string().datetime().optional(),
  end_datetime: z.string().datetime().optional(),
  seats_total: z.number().min(0).optional(),
  seats_available: z.number().min(0).optional(),
  price_cents: z.number().min(0).optional(),
  currency: z.string().optional(),
  is_active: z.boolean().optional()
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
    
    const { error } = await supabaseAdmin
      .from('events')
      .delete()
      .eq('id', params.id)
    
    if (error) {
      return NextResponse.json({ error: 'Failed to delete event' }, { status: 500 })
    }
    
    // Log admin action
    await supabaseAdmin
      .from('audit_log')
      .insert({
        admin_id: admin.username,
        action: 'delete_event',
        resource_type: 'event',
        resource_id: params.id,
        details: {},
        ip_address: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
        user_agent: request.headers.get('user-agent')
      })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting event:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
