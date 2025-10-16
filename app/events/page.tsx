"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Head from "next/head"
import { SiteHeader } from "@/components/site-header"
import { AppverseFooter } from "@/components/appverse-footer"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ShinyButton } from "@/components/ui/shiny-button"
import { Calendar, MapPin, Users, Clock } from "lucide-react"
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

// Metadata removed - cannot export from client component

// No mock data - only real events from API
const categories = ["All", "Electronic", "Acoustic", "VIP", "Jazz", "Tech House", "Chill"]

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('/api/events')
        if (response.ok) {
          const data = await response.json()
          setEvents(data.events || [])
        } else {
          console.error('Failed to fetch events')
        }
      } catch (error) {
        console.error('Error fetching events:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [])

  if (loading) {
    return (
      <main className="min-h-[100dvh] text-white">
        <SiteHeader />
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading events...</p>
          </div>
        </div>
        <AppverseFooter />
      </main>
    )
  }

  return (
    <>
      <Head>
        <title>Events | ReelHaus</title>
        <meta name="description" content="Discover and register for exclusive ReelHaus club events and experiences." />
      </Head>
      <main className="min-h-[100dvh] text-white">
        <SiteHeader />
      
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-red-400 via-red-500 to-red-600 bg-clip-text text-transparent">
            Upcoming Events
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Discover our curated selection of exclusive club events and unforgettable experiences.
          </p>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category) => (
              <Badge 
                key={category}
                variant={category === "All" ? "default" : "outline"}
                className={`px-4 py-2 cursor-pointer transition-all ${
                  category === "All" 
                    ? "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg" 
                    : "border-red-400 text-red-400 hover:bg-red-500 hover:text-white hover:shadow-lg"
                }`}
              >
                {category}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      {/* Events Grid */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.length === 0 ? (
              <div className="col-span-full text-center py-16">
                <h3 className="text-2xl font-semibold text-gray-400 mb-4">No Events Available</h3>
                <p className="text-gray-500">Check back later for new events!</p>
              </div>
            ) : (
              events.map((event) => (
              <Card key={event.id} className="glass-border-enhanced overflow-hidden hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 group">
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={event.cover_image_url}
                    alt={event.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    priority={false}
                  />
                  <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1 text-sm text-white">
                    {event.seats_available} seats left
                  </div>
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg">
                      Event
                    </Badge>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2 text-red-400">{event.title}</h3>
                  <p className="text-gray-300 text-sm mb-4 line-clamp-2">{event.description}</p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <Calendar className="h-4 w-4" />
                      {new Date(event.start_datetime).toLocaleDateString('en-US', { 
                        weekday: 'short', 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <Clock className="h-4 w-4" />
                      {new Date(event.start_datetime).toLocaleTimeString('en-US', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <Users className="h-4 w-4" />
                      {event.seats_total - event.seats_available} / {event.seats_total} registered
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-2xl font-bold text-red-400">
                      ₹{(event.price_cents / 100).toLocaleString('en-IN')}
                    </div>
                    <div className="text-sm text-gray-400">per person</div>
                  </div>
                  
                  <div className="flex gap-2">
                    <ShinyButton 
                      asChild
                      className="flex-1 inline-flex items-center justify-center text-center"
                    >
                      <Link href={`/events/${event.id}/register`} className="w-full inline-flex items-center justify-center">
                        Register Now
                      </Link>
                    </ShinyButton>
                    <ShinyButton 
                      asChild
                      variant="outline"
                      className="flex-1 inline-flex items-center justify-center text-center"
                    >
                      <Link href={`/events/${event.id}`} className="w-full inline-flex items-center justify-center">
                        Details
                      </Link>
                    </ShinyButton>
                  </div>
                </div>
              </Card>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-16 px-4 bg-gradient-to-r from-black/50 to-gray-900/50">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-bold mb-6 text-red-400">Stay Updated</h2>
          <p className="text-xl text-gray-300 mb-8">
            Subscribe to our newsletter for early access to new events and exclusive member benefits.
          </p>
          <div className="max-w-md mx-auto flex gap-4">
            <input 
              type="email" 
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400"
            />
            <ShinyButton className="px-6 py-3">
              Subscribe
            </ShinyButton>
          </div>
        </div>
      </section>

      <AppverseFooter />
    </main>
    </>
  )
}
