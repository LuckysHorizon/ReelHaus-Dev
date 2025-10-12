import { NextRequest, NextResponse } from 'next/server'
import { withAdminAuth } from '@/lib/admin-auth'
import { seedSampleEvents, seedSampleRegistrations } from '@/lib/seed-data'

// POST /api/admin/seed - Seed sample data
export const POST = withAdminAuth(async (request: NextRequest, admin) => {
  try {
    const { type } = await request.json()
    
    if (type === 'events') {
      const result = await seedSampleEvents()
      return NextResponse.json(result)
    }
    
    if (type === 'registrations') {
      const { eventId } = await request.json()
      if (!eventId) {
        return NextResponse.json({ error: 'Event ID required' }, { status: 400 })
      }
      
      const result = await seedSampleRegistrations(eventId)
      return NextResponse.json(result)
    }
    
    return NextResponse.json({ error: 'Invalid seed type' }, { status: 400 })
  } catch (error) {
    console.error('Error seeding data:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
})
