"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { SiteHeader } from "@/components/site-header"
import { AppverseFooter } from "@/components/appverse-footer"
import { Card } from "@/components/ui/card"
import { ShinyButton } from "@/components/ui/shiny-button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Users, MapPin, CheckCircle2 } from "lucide-react"
import Link from "next/link"

type Event = {
  id: string
  title: string
  description: string
  start_datetime: string
  end_datetime: string
  price_cents: number
  currency: string
  seats_total: number
  seats_available: number
  cover_image_url?: string
  is_active: boolean
}

export default function EventDetailsPage() {
  const params = useParams()
  const [event, setEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await fetch(`/api/events?id=${params.id}`)
        if (response.ok) {
          const data = await response.json()
          setEvent(data.event)
        } else {
          setError('Event not found')
        }
      } catch (error) {
        setError('Failed to load event')
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchEvent()
    }
  }, [params.id])

  if (loading) {
    return (
      <main className="min-h-[100dvh] text-white">
        <SiteHeader />
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading event...</p>
          </div>
        </div>
        <AppverseFooter />
      </main>
    )
  }

  if (error || !event) {
    return (
      <main className="min-h-[100dvh] text-white">
        <SiteHeader />
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <h1 className="text-2xl font-semibold text-gray-400 mb-4">Event Not Found</h1>
            <p className="text-gray-500 mb-6">The event you're looking for doesn't exist or has been removed.</p>
            <ShinyButton asChild>
              <Link href="/events">Back to Events</Link>
            </ShinyButton>
          </div>
        </div>
        <AppverseFooter />
      </main>
    )
  }

  return (
    <main className="min-h-[100dvh] text-white">
      <SiteHeader />
      
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 bg-clip-text text-transparent">
                {event.title}
              </h1>
              <p className="text-xl text-gray-300 mb-8">
                {event.description}
              </p>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3 text-lg">
                  <Calendar className="h-5 w-5 text-yellow-400" />
                  <span>{new Date(event.start_datetime).toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}</span>
                </div>
                <div className="flex items-center gap-3 text-lg">
                  <Clock className="h-5 w-5 text-yellow-400" />
                  <span>{new Date(event.start_datetime).toLocaleTimeString('en-US', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })} - {new Date(event.end_datetime).toLocaleTimeString('en-US', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}</span>
                </div>
                <div className="flex items-center gap-3 text-lg">
                  <Users className="h-5 w-5 text-yellow-400" />
                  <span>{event.seats_available} seats available</span>
                </div>
              </div>

              <div className="flex gap-4">
                <ShinyButton 
                  asChild
                  className="px-8 py-3"
                >
                  <Link href={`/events/${event.id}/register`}>
                    Register Now
                  </Link>
                </ShinyButton>
                <ShinyButton 
                  asChild
                  variant="outline"
                  className="px-8 py-3"
                >
                  <Link href="/events">
                    Back to Events
                  </Link>
                </ShinyButton>
              </div>
            </div>

            <div className="relative">
              <Card className="overflow-hidden">
                <div className="relative h-80">
                  <img 
                    src={event.cover_image_url || '/placeholder.jpg'} 
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black">
                      {event.seats_available > 0 ? 'Available' : 'Sold Out'}
                    </Badge>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-3xl font-bold text-yellow-400">
                      ₹{(event.price_cents / 100).toLocaleString('en-IN')}
                    </div>
                    <div className="text-sm text-gray-400">per person</div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <Users className="h-4 w-4" />
                      {event.seats_total - event.seats_available} / {event.seats_total} registered
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <CheckCircle2 className="h-4 w-4" />
                      Secure online registration
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <CheckCircle2 className="h-4 w-4" />
                      Instant confirmation
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <CheckCircle2 className="h-4 w-4" />
                      QR code tickets
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <AppverseFooter />
    </main>
  )
}