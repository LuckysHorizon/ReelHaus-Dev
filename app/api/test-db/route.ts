import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET() {
  try {
    // Test 1: Check if we can connect to Supabase
    console.log('Testing Supabase connection...')
    
    // Test 2: Check if events table exists and get its structure
    const { data: events, error: eventsError } = await supabaseAdmin
      .from('events')
      .select('*')
      .limit(1)
    
    if (eventsError) {
      return NextResponse.json({ 
        success: false, 
        error: 'Events table error',
        details: eventsError.message,
        code: eventsError.code,
        hint: eventsError.hint
      }, { status: 500 })
    }
    
    // Test 3: Try to insert a test event (then delete it)
    const testEvent = {
      title: 'Test Event',
      description: 'Test Description',
      seats_total: 10,
      seats_available: 10,
      price_cents: 1000,
      currency: 'INR',
      is_active: true
    }
    
    const { data: insertData, error: insertError } = await supabaseAdmin
      .from('events')
      .insert(testEvent)
      .select()
      .single()
    
    if (insertError) {
      return NextResponse.json({ 
        success: false, 
        error: 'Insert test failed',
        details: insertError.message,
        code: insertError.code,
        hint: insertError.hint
      }, { status: 500 })
    }
    
    // Clean up test event
    await supabaseAdmin
      .from('events')
      .delete()
      .eq('id', insertData.id)
    
    return NextResponse.json({ 
      success: true, 
      message: 'Database connection and table structure are working correctly',
      testEvent: insertData
    })
    
  } catch (error) {
    console.error('Database test error:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Database test failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
