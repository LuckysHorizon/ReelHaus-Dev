import { supabaseAdmin } from '@/lib/supabase'

// Sample events data for testing
const sampleEvents = [
  {
    title: "Neon Nights",
    description: "An electrifying night of electronic music and neon lights that will transport you to another dimension.",
    cover_image_url: "/placeholder.jpg",
    start_datetime: "2024-03-15T21:00:00Z",
    end_datetime: "2024-03-16T01:00:00Z",
    seats_total: 100,
    seats_available: 45,
    price_cents: 150000, // ₹1500
    currency: "INR",
    is_active: true,
    created_by: "admin"
  },
  {
    title: "Sunset Sessions",
    description: "Chill vibes and sunset views with acoustic performances in an intimate rooftop setting.",
    cover_image_url: "/placeholder.jpg",
    start_datetime: "2024-03-20T18:00:00Z",
    end_datetime: "2024-03-20T21:00:00Z",
    seats_total: 50,
    seats_available: 25,
    price_cents: 80000, // ₹800
    currency: "INR",
    is_active: true,
    created_by: "admin"
  },
  {
    title: "VIP Experience",
    description: "Exclusive members-only event with luxury amenities and premium service throughout the evening.",
    cover_image_url: "/placeholder.jpg",
    start_datetime: "2024-03-25T20:00:00Z",
    end_datetime: "2024-03-26T01:00:00Z",
    seats_total: 30,
    seats_available: 15,
    price_cents: 500000, // ₹5000
    currency: "INR",
    is_active: true,
    created_by: "admin"
  },
  {
    title: "Jazz & Wine",
    description: "Sophisticated evening of live jazz music paired with premium wine selections.",
    cover_image_url: "/placeholder.jpg",
    start_datetime: "2024-04-01T19:30:00Z",
    end_datetime: "2024-04-01T22:30:00Z",
    seats_total: 60,
    seats_available: 30,
    price_cents: 200000, // ₹2000
    currency: "INR",
    is_active: true,
    created_by: "admin"
  },
  {
    title: "Tech House Night",
    description: "Cutting-edge tech house beats with immersive visual experiences and state-of-the-art sound.",
    cover_image_url: "/placeholder.jpg",
    start_datetime: "2024-04-05T22:00:00Z",
    end_datetime: "2024-04-06T04:00:00Z",
    seats_total: 150,
    seats_available: 80,
    price_cents: 120000, // ₹1200
    currency: "INR",
    is_active: true,
    created_by: "admin"
  },
  {
    title: "Poolside Chill",
    description: "Relaxed poolside vibes with tropical cocktails and ambient music under the stars.",
    cover_image_url: "/placeholder.jpg",
    start_datetime: "2024-04-10T17:00:00Z",
    end_datetime: "2024-04-10T21:00:00Z",
    seats_total: 80,
    seats_available: 40,
    price_cents: 100000, // ₹1000
    currency: "INR",
    is_active: true,
    created_by: "admin"
  }
]

export async function seedSampleEvents() {
  try {
    console.log('🌱 Seeding sample events...')
    
    // Clear existing events (optional - remove if you want to keep existing data)
    // await supabaseAdmin.from('events').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    
    // Insert sample events
    const { data, error } = await supabaseAdmin
      .from('events')
      .insert(sampleEvents)
      .select()
    
    if (error) {
      console.error('❌ Error seeding events:', error)
      return { success: false, error }
    }
    
    console.log('✅ Successfully seeded', data?.length, 'events')
    return { success: true, data }
  } catch (error) {
    console.error('❌ Error seeding events:', error)
    return { success: false, error }
  }
}

// Sample registrations for testing
const sampleRegistrations = [
  {
    event_id: '', // Will be filled with actual event ID
    name: "John Doe",
    email: "john@example.com",
    phone: "+919876543210",
    roll_no: "CS2024001",
    tickets: 2,
    ticket_details: [
      { name: "John Doe", roll_no: "CS2024001", email: "john@example.com" },
      { name: "Jane Doe", roll_no: "CS2024002", email: "jane@example.com" }
    ],
    status: "paid",
    metadata: {
      payment_id: "pay_test_123",
      qr_generated: true
    }
  },
  {
    event_id: '', // Will be filled with actual event ID
    name: "Alice Smith",
    email: "alice@example.com",
    phone: "+919876543211",
    roll_no: "EE2024001",
    tickets: 1,
    ticket_details: [
      { name: "Alice Smith", roll_no: "EE2024001", email: "alice@example.com" }
    ],
    status: "paid",
    metadata: {
      payment_id: "pay_test_124",
      qr_generated: true
    }
  }
]

export async function seedSampleRegistrations(eventId: string) {
  try {
    console.log('🌱 Seeding sample registrations for event:', eventId)
    
    const registrationsWithEventId = sampleRegistrations.map(reg => ({
      ...reg,
      event_id: eventId
    }))
    
    const { data, error } = await supabaseAdmin
      .from('registrations')
      .insert(registrationsWithEventId)
      .select()
    
    if (error) {
      console.error('❌ Error seeding registrations:', error)
      return { success: false, error }
    }
    
    console.log('✅ Successfully seeded', data?.length, 'registrations')
    return { success: true, data }
  } catch (error) {
    console.error('❌ Error seeding registrations:', error)
    return { success: false, error }
  }
}
