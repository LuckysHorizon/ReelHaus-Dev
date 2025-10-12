import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const eventId = searchParams.get('id')
    
    if (eventId) {
      // Get single event
      const { data: event, error } = await supabase
        .from('events')
        .select('*')
        .eq('id', eventId)
        .eq('is_active', true)
        .single()
      
      if (error) {
        return NextResponse.json({ error: 'Event not found' }, { status: 404 })
      }
      
      return NextResponse.json({ event })
    } else {
      // Get all active events
      const { data: events, error } = await supabase
        .from('events')
        .select('*')
        .eq('is_active', true)
        .order('start_datetime', { ascending: true })
      
      if (error) {
        return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 })
      }
      
      return NextResponse.json({ events })
    }
  } catch (error) {
    console.error('Error fetching events:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
