import { SiteHeader } from "@/components/site-header"
import { AppverseFooter } from "@/components/appverse-footer"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin, Users, Clock, Star, CheckCircle2 } from "lucide-react"
import Link from "next/link"

export const metadata = {
  title: "Event Details | ReelHaus",
  description: "View detailed information about this exclusive ReelHaus event.",
}

// Mock event data - in production this would come from the API
const mockEvent = {
  id: "1",
  title: "Neon Nights",
  description: "An electrifying night of electronic music and neon lights that will transport you to another dimension. Experience cutting-edge sound design, immersive visual effects, and a carefully curated lineup of world-class DJs.",
  longDescription: `Prepare yourself for an unforgettable journey into the future of electronic music. Neon Nights brings together the most innovative artists in the industry for a night of pure sonic exploration.

Our carefully curated lineup features:
• International headliner DJ sets
• Live electronic performances
• Immersive neon light installations
• State-of-the-art sound system
• Interactive visual experiences

This isn't just a party - it's a complete sensory experience that will redefine your understanding of what a club event can be.`,
  date: "2024-02-15",
  time: "21:00",
  venue: "Club Aurora",
  venueAddress: "123 Neon Street, Downtown District, Mumbai",
  price: 1500,
  currency: "INR",
  seats_available: 45,
  seats_total: 100,
  cover_image_url: "/placeholder.jpg",
  category: "Electronic",
  duration: "4 hours",
  ageRestriction: "18+",
  dressCode: "Neon/Black attire encouraged",
  features: [
    "Premium DJ lineup featuring international artists",
    "Immersive neon light show with interactive elements",
    "VIP bottle service with premium spirits",
    "Complimentary welcome drink for all attendees",
    "Professional photography and videography",
    "Secure valet parking available",
    "Multiple bars with craft cocktails",
    "Late-night food options",
    "Merchandise booth with exclusive items",
    "Social media photo opportunities"
  ],
  lineup: [
    { name: "DJ Neon", time: "21:00 - 22:30", genre: "Progressive House" },
    { name: "Electric Dreams", time: "22:30 - 00:00", genre: "Techno" },
    { name: "Cyber Pulse", time: "00:00 - 01:30", genre: "Future Bass" },
    { name: "Neon Master", time: "01:30 - 03:00", genre: "Trance" }
  ],
  reviews: [
    { name: "Sarah M.", rating: 5, comment: "Absolutely incredible night! The visuals were mind-blowing." },
    { name: "Alex K.", rating: 5, comment: "Best electronic event I've been to this year. Highly recommended!" },
    { name: "Priya S.", rating: 4, comment: "Amazing atmosphere and great music. Will definitely come again." }
  ]
}

export default function EventDetailsPage({ params }: { params: { id: string } }) {
  const event = mockEvent // In production, fetch based on params.id

  return (
    <main className="min-h-[100dvh] text-white">
      <SiteHeader />
      
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black">
                {event.category}
              </Badge>
              <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 bg-clip-text text-transparent">
                {event.title}
              </h1>
              <p className="text-xl text-gray-300 mb-8">
                {event.description}
              </p>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3 text-gray-300">
                  <Calendar className="h-5 w-5 text-yellow-400" />
                  <span>{new Date(event.date).toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric',
                    month: 'long', 
                    day: 'numeric' 
                  })}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <Clock className="h-5 w-5 text-yellow-400" />
                  <span>{event.time} • {event.duration}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <MapPin className="h-5 w-5 text-yellow-400" />
                  <span>{event.venue}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <Users className="h-5 w-5 text-yellow-400" />
                  <span>{event.seats_available} seats remaining</span>
                </div>
              </div>
              
              <div className="flex items-center gap-4 mb-8">
                <div className="text-4xl font-bold text-yellow-400">
                  ₹{event.price}
                </div>
                <div className="text-gray-400">per person</div>
              </div>
              
              <Button 
                asChild
                size="lg"
                className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-semibold hover:from-yellow-300 hover:to-yellow-400 px-8 py-4"
              >
                <Link href={`/events/${event.id}/register`}>
                  Register Now
                </Link>
              </Button>
            </div>
            
            <div className="relative">
              <Card className="glass-border-enhanced overflow-hidden">
                <img 
                  src={event.cover_image_url} 
                  alt={event.title}
                  className="w-full h-96 object-cover"
                />
                <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1 text-sm text-yellow-300">
                  {event.seats_available} seats left
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Event Details */}
      <section className="py-16 px-4 bg-gradient-to-r from-black/50 to-gray-900/50">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <h2 className="text-3xl font-bold mb-6 text-yellow-400">About This Event</h2>
              <div className="glass-border-enhanced rounded-xl p-6 mb-8">
                <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                  {event.longDescription}
                </p>
              </div>
              
              <h3 className="text-2xl font-bold mb-4 text-yellow-400">Event Lineup</h3>
              <div className="space-y-4 mb-8">
                {event.lineup.map((artist, index) => (
                  <Card key={index} className="glass-border p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-semibold text-white">{artist.name}</h4>
                        <p className="text-sm text-gray-400">{artist.genre}</p>
                      </div>
                      <div className="text-yellow-400 font-medium">
                        {artist.time}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-2xl font-bold mb-6 text-yellow-400">Event Information</h3>
              <Card className="glass-border-enhanced p-6 mb-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-white mb-2">Age Restriction</h4>
                    <p className="text-gray-300">{event.ageRestriction}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-2">Dress Code</h4>
                    <p className="text-gray-300">{event.dressCode}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-2">Venue Address</h4>
                    <p className="text-gray-300">{event.venueAddress}</p>
                  </div>
                </div>
              </Card>
              
              <h3 className="text-2xl font-bold mb-4 text-yellow-400">What's Included</h3>
              <Card className="glass-border-enhanced p-6">
                <ul className="space-y-3">
                  {event.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12 text-yellow-400">What Members Say</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {event.reviews.map((review, index) => (
              <Card key={index} className="glass-border-enhanced p-6">
                <div className="flex items-center gap-1 mb-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star 
                      key={i} 
                      className={`h-4 w-4 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}`} 
                    />
                  ))}
                </div>
                <p className="text-gray-300 mb-3">"{review.comment}"</p>
                <p className="text-sm text-gray-400">- {review.name}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-black/50 to-gray-900/50">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-bold mb-6 text-yellow-400">Ready to Join?</h2>
          <p className="text-xl text-gray-300 mb-8">
            Don't miss out on this exclusive experience. Register now to secure your spot.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              asChild
              size="lg"
              className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-semibold hover:from-yellow-300 hover:to-yellow-400 px-8 py-4"
            >
              <Link href={`/events/${event.id}/register`}>
                Register Now - ₹{event.price}
              </Link>
            </Button>
            <Button 
              asChild
              variant="outline"
              size="lg"
              className="border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black px-8 py-4"
            >
              <Link href="/events">
                View Other Events
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <AppverseFooter />
    </main>
  )
}
