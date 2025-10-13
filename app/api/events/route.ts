import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const eventId = searchParams.get('id')
    
    if (eventId) {
      console.log('Fetching event with ID:', eventId)
      
      // Get single event (first try with is_active filter)
      let { data: event, error } = await supabase
        .from('events')
        .select('*')
        .eq('id', eventId)
        .eq('is_active', true)
        .single()
      
      // If not found, try without is_active filter
      if (error && error.code === 'PGRST116') {
        console.log('Event not found with is_active=true, trying without filter')
        const { data: eventFallback, error: errorFallback } = await supabase
          .from('events')
          .select('*')
          .eq('id', eventId)
          .single()
        
        event = eventFallback
        error = errorFallback
      }
      
      console.log('Supabase query result:', { event, error })
      
      if (error) {
        console.error('Supabase error:', error)
        return NextResponse.json({ error: 'Event not found', details: error.message }, { status: 404 })
      }
      
      if (!event) {
        console.error('No event found for ID:', eventId)
        return NextResponse.json({ error: 'Event not found' }, { status: 404 })
      }
      
      console.log('Event found:', event.title)
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
