import { SiteHeader } from "@/components/site-header"
import { AppverseFooter } from "@/components/appverse-footer"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin, Users, Clock } from "lucide-react"
import Link from "next/link"

export const metadata = {
  title: "Events | ReelHaus",
  description: "Discover and register for exclusive ReelHaus club events and experiences.",
}

// Mock events data - in production this would come from the API
const mockEvents = [
  {
    id: "1",
    title: "Neon Nights",
    description: "An electrifying night of electronic music and neon lights that will transport you to another dimension.",
    date: "2024-02-15",
    time: "21:00",
    venue: "Club Aurora",
    price: 1500,
    currency: "INR",
    seats_available: 45,
    seats_total: 100,
    cover_image_url: "/placeholder.jpg",
    category: "Electronic",
    duration: "4 hours"
  },
  {
    id: "2", 
    title: "Sunset Sessions",
    description: "Chill vibes and sunset views with acoustic performances in an intimate rooftop setting.",
    date: "2024-02-20",
    time: "18:00",
    venue: "Rooftop Lounge",
    price: 800,
    currency: "INR",
    seats_available: 25,
    seats_total: 50,
    cover_image_url: "/placeholder.jpg",
    category: "Acoustic",
    duration: "3 hours"
  },
  {
    id: "3",
    title: "VIP Experience",
    description: "Exclusive members-only event with luxury amenities and premium service throughout the evening.",
    date: "2024-02-25",
    time: "20:00",
    venue: "Private Venue",
    price: 5000,
    currency: "INR",
    seats_available: 15,
    seats_total: 30,
    cover_image_url: "/placeholder.jpg",
    category: "VIP",
    duration: "5 hours"
  },
  {
    id: "4",
    title: "Jazz & Wine",
    description: "Sophisticated evening of live jazz music paired with premium wine selections.",
    date: "2024-03-01",
    time: "19:30",
    venue: "Wine Bar",
    price: 2000,
    currency: "INR",
    seats_available: 30,
    seats_total: 60,
    cover_image_url: "/placeholder.jpg",
    category: "Jazz",
    duration: "3 hours"
  },
  {
    id: "5",
    title: "Tech House Night",
    description: "Cutting-edge tech house beats with immersive visual experiences and state-of-the-art sound.",
    date: "2024-03-05",
    time: "22:00",
    venue: "Warehouse District",
    price: 1200,
    currency: "INR",
    seats_available: 80,
    seats_total: 150,
    cover_image_url: "/placeholder.jpg",
    category: "Tech House",
    duration: "6 hours"
  },
  {
    id: "6",
    title: "Poolside Chill",
    description: "Relaxed poolside vibes with tropical cocktails and ambient music under the stars.",
    date: "2024-03-10",
    time: "17:00",
    venue: "Resort Pool",
    price: 1000,
    currency: "INR",
    seats_available: 40,
    seats_total: 80,
    cover_image_url: "/placeholder.jpg",
    category: "Chill",
    duration: "4 hours"
  }
]

const categories = ["All", "Electronic", "Acoustic", "VIP", "Jazz", "Tech House", "Chill"]

export default function EventsPage() {
  return (
    <main className="min-h-[100dvh] text-white">
      <SiteHeader />
      
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 bg-clip-text text-transparent">
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
                    ? "bg-gradient-to-r from-yellow-400 to-yellow-500 text-black" 
                    : "border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black"
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
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {mockEvents.map((event) => (
              <Card key={event.id} className="glass-border-enhanced overflow-hidden hover:scale-105 transition-transform group">
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={event.cover_image_url} 
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1 text-sm text-yellow-300">
                    {event.seats_available} seats left
                  </div>
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black">
                      {event.category}
                    </Badge>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2 text-yellow-400">{event.title}</h3>
                  <p className="text-gray-300 text-sm mb-4 line-clamp-2">{event.description}</p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <Calendar className="h-4 w-4" />
                      {new Date(event.date).toLocaleDateString('en-US', { 
                        weekday: 'short', 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <Clock className="h-4 w-4" />
                      {event.time} • {event.duration}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <MapPin className="h-4 w-4" />
                      {event.venue}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <Users className="h-4 w-4" />
                      {event.seats_total - event.seats_available} / {event.seats_total} registered
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-2xl font-bold text-yellow-400">
                      ₹{event.price}
                    </div>
                    <div className="text-sm text-gray-400">per person</div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      asChild
                      className="flex-1 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-semibold hover:from-yellow-300 hover:to-yellow-400"
                    >
                      <Link href={`/events/${event.id}/register`}>
                        Register Now
                      </Link>
                    </Button>
                    <Button 
                      asChild
                      variant="outline"
                      className="border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black"
                    >
                      <Link href={`/events/${event.id}`}>
                        Details
                      </Link>
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-16 px-4 bg-gradient-to-r from-black/50 to-gray-900/50">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-bold mb-6 text-yellow-400">Stay Updated</h2>
          <p className="text-xl text-gray-300 mb-8">
            Subscribe to our newsletter for early access to new events and exclusive member benefits.
          </p>
          <div className="max-w-md mx-auto flex gap-4">
            <input 
              type="email" 
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400"
            />
            <button className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-semibold px-6 py-3 rounded-lg hover:from-yellow-300 hover:to-yellow-400 transition-all">
              Subscribe
            </button>
          </div>
        </div>
      </section>

      <AppverseFooter />
    </main>
  )
}
