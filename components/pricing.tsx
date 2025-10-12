"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { CheckCircle2, Calendar, MapPin, Users } from "lucide-react"

type Feature = { text: string; muted?: boolean }

const ACCENT = "#DC2626"

function FeatureItem({ text, muted = false }: Feature) {
  return (
    <li className="flex items-start gap-2">
      <CheckCircle2 className="mt-0.5 h-4 w-4" style={{ color: ACCENT }} />
      <span className={`text-sm ${muted ? "text-neutral-500" : "text-neutral-200"}`}>{text}</span>
    </li>
  )
}

// Mock events data - in production this would come from the API
const mockEvents = [
  {
    id: "1",
    title: "Neon Nights",
    description: "An electrifying night of electronic music and neon lights",
    date: "2024-02-15",
    time: "21:00",
    venue: "Club Aurora",
    price: 1500,
    currency: "INR",
    seats_available: 45,
    seats_total: 100,
    cover_image_url: "/placeholder.jpg",
    features: [
      "Premium DJ lineup",
      "Neon light show",
      "VIP bottle service",
      "Complimentary welcome drink",
      "Professional photography",
      "Secure parking"
    ]
  },
  {
    id: "2", 
    title: "Sunset Sessions",
    description: "Chill vibes and sunset views with acoustic performances",
    date: "2024-02-20",
    time: "18:00",
    venue: "Rooftop Lounge",
    price: 800,
    currency: "INR",
    seats_available: 25,
    seats_total: 50,
    cover_image_url: "/placeholder.jpg",
    features: [
      "Live acoustic performances",
      "Sunset rooftop views",
      "Craft cocktails",
      "Artisan food menu",
      "Intimate setting",
      "Free parking"
    ]
  },
  {
    id: "3",
    title: "VIP Experience",
    description: "Exclusive members-only event with luxury amenities",
    date: "2024-02-25",
    time: "20:00",
    venue: "Private Venue",
    price: 5000,
    currency: "INR",
    seats_available: 15,
    seats_total: 30,
    cover_image_url: "/placeholder.jpg",
    features: [
      "Exclusive venue access",
      "Premium open bar",
      "Gourmet dining",
      "Personal concierge",
      "Luxury transportation",
      "Gift bag included"
    ]
  }
]

export function Pricing() {
  const [events, setEvents] = useState(mockEvents)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // In production, fetch from API
    const fetchEvents = async () => {
      try {
        // const response = await fetch('/api/events')
        // const data = await response.json()
        // setEvents(data.events)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching events:', error)
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

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {events.map((event) => (
            <Card
              key={event.id}
              className="relative overflow-hidden rounded-2xl liquid-glass shadow-[0_12px_40px_rgba(0,0,0,0.3)] transition-all duration-300 hover:scale-105"
            >
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={event.cover_image_url} 
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1 text-sm text-yellow-300">
                  {event.seats_available} seats left
                </div>
              </div>

              <CardHeader className="space-y-3 pb-4">
                <div className="text-sm font-semibold text-neutral-200">
                  {event.title}
                </div>
                <p className="text-sm text-neutral-400 line-clamp-2">
                  {event.description}
                </p>
                <div className="flex items-end gap-2 text-neutral-100">
                  <div className="text-xl font-bold tracking-tight">
                    ₹{event.price}
                  </div>
                  <span className="pb-0.5 text-[11px] text-neutral-400">per person</span>
                </div>
                
                <div className="flex items-center gap-4 text-xs text-neutral-400">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(event.date).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {event.venue}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    asChild
                    className="flex-1 rounded-full px-4 py-2 text-sm font-medium text-black shadow transition-[box-shadow,transform,filter] active:translate-y-[1px]"
                    style={{ backgroundColor: ACCENT }}
                  >
                    <Link href={`/events/${event.id}`}>View Details</Link>
                  </Button>
                  <Button
                    asChild
                    className="flex-1 rounded-full px-4 py-2 text-sm font-medium transition-colors"
                    style={{
                      backgroundColor: "#0a0a0a",
                      color: "#ffffff",
                      border: "1px solid #333",
                    }}
                  >
                    <Link href={`/events/${event.id}/register`}>Register</Link>
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                <ul className="grid gap-2">
                  {event.features.slice(0, 4).map((feature, i) => (
                    <FeatureItem key={i} text={feature} />
                  ))}
                  {event.features.length > 4 && (
                    <FeatureItem text={`+${event.features.length - 4} more features`} muted />
                  )}
                </ul>
              </CardContent>
              <CardFooter />
            </Card>
          ))}
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