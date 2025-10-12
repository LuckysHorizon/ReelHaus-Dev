import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { verifyAdminToken } from '@/lib/admin-auth'

// GET /api/admin/events/[id]/registrations - Get event registrations
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const admin = verifyAdminToken(request)
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const status = searchParams.get('status')
    const offset = (page - 1) * limit
    
    let query = supabaseAdmin
      .from('registrations')
      .select(`
        *,
        payments(*)
      `)
      .eq('event_id', params.id)
      .order('created_at', { ascending: false })
    
    if (status) {
      query = query.eq('status', status)
    }
    
    const { data: registrations, error } = await query
      .range(offset, offset + limit - 1)
    
    if (error) {
      return NextResponse.json({ error: 'Failed to fetch registrations' }, { status: 500 })
    }
    
    // Get total count
    let countQuery = supabaseAdmin
      .from('registrations')
      .select('*', { count: 'exact', head: true })
      .eq('event_id', params.id)
    
    if (status) {
      countQuery = countQuery.eq('status', status)
    }
    
    const { count } = await countQuery
    
    return NextResponse.json({
      registrations,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching registrations:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
