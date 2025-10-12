import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET() {
  try {
    // Test basic connection by checking if we can access the database
    const { data, error } = await supabaseAdmin
      .from('events')
      .select('id')
      .limit(1)

    if (error) {
      // If events table doesn't exist, try to check what tables do exist
      if (error.code === '42501' || error.message.includes('permission denied')) {
        return NextResponse.json({ 
          success: false, 
          error: 'Database tables not found or no permissions',
          details: error,
          suggestion: 'Please run the database migration first'
        }, { status: 500 })
      }
      
      return NextResponse.json({ 
        success: false, 
        error: error.message,
        details: error
      }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Supabase connection successful',
      data: data || [],
      tableExists: true
    })
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: 'Connection failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
