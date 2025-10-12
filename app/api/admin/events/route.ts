import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { withAdminAuth } from '@/lib/admin-auth'
import { z } from 'zod'

const eventSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  cover_image_url: z.string().url().optional(),
  start_datetime: z.string().datetime().optional(),
  end_datetime: z.string().datetime().optional(),
  seats_total: z.number().min(0),
  seats_available: z.number().min(0),
  price_cents: z.number().min(0),
  currency: z.string().default('INR'),
  is_active: z.boolean().default(true)
})

// GET /api/admin/events - List all events
export const GET = withAdminAuth(async (request: NextRequest, admin) => {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = (page - 1) * limit
    
    const { data: events, error } = await supabaseAdmin
      .from('events')
      .select('*')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)
    
    if (error) {
      return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 })
    }
    
    // Get total count
    const { count, error: countError } = await supabaseAdmin
      .from('events')
      .select('*', { count: 'exact', head: true })
    
    if (countError) {
      console.error('Count error:', countError)
    }
    
    return NextResponse.json({
      events,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching events:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
})

// POST /api/admin/events - Create new event
export const POST = withAdminAuth(async (request: NextRequest, admin) => {
  try {
    const body = await request.json()
    const validatedData = eventSchema.parse(body)
    
    const { data: event, error } = await supabaseAdmin
      .from('events')
      .insert({
        ...validatedData,
        created_by: admin.username
      })
      .select()
      .single()
    
    if (error) {
      return NextResponse.json({ error: 'Failed to create event' }, { status: 500 })
    }
    
    // Log admin action
    await supabaseAdmin
      .from('audit_log')
      .insert({
        admin_id: admin.username,
        action: 'create_event',
        resource_type: 'event',
        resource_id: event.id,
        details: { event_title: event.title },
        ip_address: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
        user_agent: request.headers.get('user-agent')
      })
    
    return NextResponse.json({ event }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input data', details: error.errors }, { status: 400 })
    }
    
    console.error('Error creating event:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
})
