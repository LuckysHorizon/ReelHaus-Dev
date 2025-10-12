import { NextRequest, NextResponse } from 'next/server'

// Mock events data for testing without Supabase
const mockEvents = [
  {
    id: "1",
    title: "Neon Nights",
    description: "An electrifying night of electronic music and neon lights",
    cover_image_url: "/placeholder.jpg",
    start_datetime: "2024-03-15T21:00:00Z",
    end_datetime: "2024-03-16T01:00:00Z",
    seats_total: 100,
    seats_available: 45,
    price_cents: 150000,
    currency: "INR",
    is_active: true,
    created_at: "2024-01-15T10:00:00Z"
  },
  {
    id: "2",
    title: "Sunset Sessions",
    description: "Chill vibes and sunset views with acoustic performances",
    cover_image_url: "/placeholder.jpg",
    start_datetime: "2024-03-20T18:00:00Z",
    end_datetime: "2024-03-20T21:00:00Z",
    seats_total: 50,
    seats_available: 25,
    price_cents: 80000,
    currency: "INR",
    is_active: true,
    created_at: "2024-01-20T10:00:00Z"
  },
  {
    id: "3",
    title: "VIP Experience",
    description: "Exclusive members-only event with luxury amenities",
    cover_image_url: "/placeholder.jpg",
    start_datetime: "2024-03-25T20:00:00Z",
    end_datetime: "2024-03-26T01:00:00Z",
    seats_total: 30,
    seats_available: 15,
    price_cents: 500000,
    currency: "INR",
    is_active: true,
    created_at: "2024-01-25T10:00:00Z"
  }
]

// GET /api/admin/events - Mock events for testing
export async function GET(request: NextRequest) {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))
    
    return NextResponse.json({
      events: mockEvents,
      pagination: {
        page: 1,
        limit: 10,
        total: mockEvents.length,
        totalPages: 1
      }
    })
  } catch (error) {
    console.error('Error fetching mock events:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/admin/events - Mock event creation
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const newEvent = {
      id: (mockEvents.length + 1).toString(),
      ...body,
      created_at: new Date().toISOString()
    }
    
    mockEvents.unshift(newEvent)
    
    return NextResponse.json({ event: newEvent }, { status: 201 })
  } catch (error) {
    console.error('Error creating mock event:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
