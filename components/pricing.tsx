"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { CheckCircle2, Calendar, MapPin, Users } from "lucide-react"

type Feature = { text: string; muted?: boolean }
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
  features?: string[]
}

const ACCENT = "#DC2626"

function FeatureItem({ text, muted = false }: Feature) {
  return (
    <li className="flex items-start gap-2">
      <CheckCircle2 className="mt-0.5 h-4 w-4" style={{ color: ACCENT }} />
      <span className={`text-sm ${muted ? "text-neutral-500" : "text-neutral-200"}`}>{text}</span>
    </li>
  )
}

// No mock data - only real events from API

export function Pricing() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch events from API
    const fetchEvents = async () => {
      try {
        const response = await fetch('/api/events')
        if (response.ok) {
          const data = await response.json()
          setEvents(data.events || [])
        } else {
          console.error('Failed to fetch events')
          setEvents([]) // No fallback - show empty state
        }
      } catch (error) {
        console.error('Error fetching events:', error)
        setEvents([]) // No fallback - show empty state
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [])

  if (loading) {
    return (
      <section id="events" className="text-white">
        <div className="container mx-auto px-4 py-16 sm:py-20">
          <div className="text-center">
            <div className="text-2xl">Loading events...</div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="events" className="text-white">
      <div className="container mx-auto px-4 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <div
            className="mx-auto mb-4 inline-flex items-center rounded-full px-3 py-1 text-xs font-medium"
            style={{ backgroundColor: "rgba(255,215,0,0.12)", color: ACCENT }}
          >
            Upcoming Events
          </div>
          <h2 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
            Exclusive Events.
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-sm text-neutral-400">
            Discover our curated selection of premium club events and experiences.
          </p>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {events.length === 0 ? (
            <div className="col-span-full text-center py-16">
              <h3 className="text-2xl font-semibold text-gray-400 mb-4">No Events Available</h3>
              <p className="text-gray-500">Check back later for new events!</p>
            </div>
          ) : (
            events.map((event) => (
            <Card
              key={event.id}
              className="relative overflow-hidden rounded-2xl liquid-glass shadow-[0_12px_40px_rgba(0,0,0,0.3)] transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            >
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={event.cover_image_url || '/placeholder.jpg'} 
                  alt={event.title || 'Event'}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1 text-sm text-yellow-300">
                  {event.seats_available || 0} seats left
                </div>
              </div>

              <CardHeader className="space-y-3 pb-4">
                <div className="text-sm font-semibold text-neutral-200">
                  {event.title || 'Untitled Event'}
                </div>
                <p className="text-sm text-neutral-400 line-clamp-2">
                  {event.description || 'No description available'}
                </p>
                <div className="flex items-end gap-2 text-neutral-100">
                  <div className="text-xl font-bold tracking-tight">
                    ₹{((event.price_cents || 0) / 100).toLocaleString('en-IN')}
                  </div>
                  <span className="pb-0.5 text-[11px] text-neutral-400">per person</span>
                </div>
                
                <div className="flex items-center gap-4 text-xs text-neutral-400">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {event.start_datetime ? new Date(event.start_datetime).toLocaleDateString() : 'TBD'}
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {(event.seats_total || 0) - (event.seats_available || 0)} / {event.seats_total || 0} sold
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    asChild
                    className="flex-1 rounded-full px-4 py-2 text-sm font-medium text-white shadow-lg hover:shadow-xl transition-all duration-200 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-400 hover:to-red-500"
                  >
                    <Link href={`/events/${event.id}`}>View Details</Link>
                  </Button>
                  <Button
                    asChild
                    className="flex-1 rounded-full px-4 py-2 text-sm font-medium border-2 border-red-400 text-red-400 hover:bg-red-500 hover:text-white shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    <Link href={`/events/${event.id}/register`}>Register</Link>
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                <ul className="grid gap-2">
                  {event.features ? (
                    <>
                      {event.features.slice(0, 4).map((feature: string, i: number) => (
                        <FeatureItem key={i} text={feature} />
                      ))}
                      {event.features.length > 4 && (
                        <FeatureItem text={`+${event.features.length - 4} more features`} muted />
                      )}
                    </>
                  ) : (
                    // Default features for real API events
                    <>
                      <FeatureItem text="Secure online registration" />
                      <FeatureItem text="Instant confirmation" />
                      <FeatureItem text="QR code tickets" />
                      <FeatureItem text="24/7 customer support" />
                    </>
                  )}
                </ul>
              </CardContent>
              <CardFooter />
            </Card>
            ))
          )}
        </div>

        <div className="mt-12 text-center">
          <Button
            asChild
            className="rounded-full px-8 py-3 text-neutral-900 hover:brightness-95"
            style={{ backgroundColor: ACCENT }}
          >
            <Link href="/events">
              View All Events
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}