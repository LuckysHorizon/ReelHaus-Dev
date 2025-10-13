"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { SiteHeader } from "@/components/site-header"
import { AppverseFooter } from "@/components/appverse-footer"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Calendar, Clock, Users, ArrowLeft } from "lucide-react"
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

type RegistrationForm = {
  name: string
  email: string
  phone: string
  roll_no: string
  tickets: number
  ticket_details: Array<{
    name: string
    roll_no: string
    email: string
  }>
}

export default function EventRegistrationPage() {
  const params = useParams()
  const router = useRouter()
  const [event, setEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<RegistrationForm>({
    name: '',
    email: '',
    phone: '',
    roll_no: '',
    tickets: 1,
    ticket_details: [{ name: '', roll_no: '', email: '' }]
  })

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

  const handleTicketChange = (tickets: number) => {
    // Ensure tickets is between 1 and 6
    const validTickets = Math.min(Math.max(tickets, 1), 6)
    
    // Create ticket details for the number of tickets (excluding the main registrant)
    const newTicketDetails = Array.from({ length: validTickets - 1 }, (_, i) => 
      formData.ticket_details[i] || { name: '', roll_no: '', email: '' }
    )
    setFormData(prev => ({ ...prev, tickets: validTickets, ticket_details: newTicketDetails }))
  }

  const handleTicketDetailChange = (index: number, field: string, value: string) => {
    const newTicketDetails = [...formData.ticket_details]
    newTicketDetails[index] = { ...newTicketDetails[index], [field]: value }
    setFormData(prev => ({ ...prev, ticket_details: newTicketDetails }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!event) return

    setSubmitting(true)
    setError(null)

    try {
      const response = await fetch(`/api/events/${event.id}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          event_id: event.id
        })
      })

      if (response.ok) {
        const data = await response.json()
        
        // Load Razorpay script
        const script = document.createElement('script')
        script.src = 'https://checkout.razorpay.com/v1/checkout.js'
        script.onload = () => {
          const options = {
            key: data.razorpay_key_id,
            amount: data.amount,
            currency: data.currency,
            name: event.title,
            description: `Registration for ${event.title}`,
            order_id: data.razorpay_order_id,
            handler: function (response: any) {
              router.push(`/events/payment/success?payment_id=${response.razorpay_payment_id}&registration_id=${data.registration_id}`)
            },
            prefill: {
              name: formData.name,
              email: formData.email,
              contact: formData.phone
            },
            theme: {
              color: '#DC2626'
            },
            modal: {
              ondismiss: function() {
                setSubmitting(false)
              }
            }
          }
          
          // @ts-ignore
          const rzp = new window.Razorpay(options)
          rzp.open()
        }
        script.onerror = () => {
          setError('Failed to load payment gateway')
          setSubmitting(false)
        }
        document.body.appendChild(script)
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Registration failed')
      }
    } catch (error) {
      setError('Network error. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

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
            <Button asChild className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black">
              <Link href="/events">Back to Events</Link>
            </Button>
          </div>
        </div>
        <AppverseFooter />
      </main>
    )
  }

  return (
    <main className="min-h-[100dvh] text-white">
      <SiteHeader />
      
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="mb-8">
          <Button asChild variant="outline" className="mb-6 border-gray-700 text-gray-400 hover:bg-gray-800">
            <Link href={`/events/${event.id}`}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Event
            </Link>
          </Button>
          
          <h1 className="text-4xl font-bold mb-4 text-white">
            Register for {event.title}
          </h1>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Event Summary */}
          <Card className="glass-border-enhanced">
            <div className="p-6">
              <h2 className="text-2xl font-semibold mb-4 text-white">Event Details</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-white" />
                  <span>{new Date(event.start_datetime).toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-white" />
                  <span>{new Date(event.start_datetime).toLocaleTimeString('en-US', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })} - {new Date(event.end_datetime).toLocaleTimeString('en-US', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-white" />
                  <span>{event.seats_available} seats available</span>
                </div>
              </div>

              <div className="border-t border-gray-700 pt-4">
                <div className="flex items-center justify-between">
                  <span className="text-lg">Price per ticket:</span>
                  <span className="text-2xl font-bold text-white">
                    ₹{(event.price_cents / 100).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>
          </Card>

          {/* Registration Form */}
          <Card className="glass-border-enhanced">
            <div className="p-6">
              <h2 className="text-2xl font-semibold mb-6 text-white">Registration Form</h2>
              
              {error && (
                <div className="bg-red-900/20 border border-red-500 rounded-lg p-4 mb-6">
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="name" className="text-gray-300">Full Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="bg-gray-900/50 border-gray-700 text-white"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="email" className="text-gray-300">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="bg-gray-900/50 border-gray-700 text-white"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="phone" className="text-gray-300">Phone Number *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    className="bg-gray-900/50 border-gray-700 text-white"
                    placeholder="+91 9876543210"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="roll_no" className="text-gray-300">Roll Number</Label>
                  <Input
                    id="roll_no"
                    value={formData.roll_no}
                    onChange={(e) => setFormData(prev => ({ ...prev, roll_no: e.target.value }))}
                    className="bg-gray-900/50 border-gray-700 text-white"
                    placeholder="Optional"
                  />
                </div>

                <div>
                  <Label htmlFor="tickets" className="text-gray-300">Number of Tickets *</Label>
                  <Input
                    id="tickets"
                    type="number"
                    min="1"
                    max={Math.min(6, event.seats_available)}
                    value={formData.tickets}
                    onChange={(e) => handleTicketChange(parseInt(e.target.value) || 1)}
                    className="bg-gray-900/50 border-gray-700 text-white"
                    required
                  />
                  <p className="text-xs text-gray-400 mt-1">Maximum 6 tickets per registration</p>
                </div>

                {/* Dynamic ticket details */}
                {formData.tickets > 1 && (
                  <div>
                    <Label className="text-gray-300">Additional Attendee Details</Label>
                    <p className="text-xs text-gray-400 mb-3">Fill details for {formData.tickets - 1} additional attendee{formData.tickets - 1 > 1 ? 's' : ''}</p>
                    <div className="space-y-4 mt-2">
                      {formData.ticket_details.map((detail, index) => (
                        <div key={index} className="border border-gray-700 rounded-lg p-4">
                          <h4 className="text-sm font-medium text-gray-300 mb-3">Attendee {index + 2}</h4>
                          <div className="grid gap-3">
                            <Input
                              placeholder="Full Name"
                              value={detail.name}
                              onChange={(e) => handleTicketDetailChange(index, 'name', e.target.value)}
                              className="bg-gray-900/50 border-gray-700 text-white"
                              required
                            />
                            <Input
                              placeholder="Roll Number"
                              value={detail.roll_no}
                              onChange={(e) => handleTicketDetailChange(index, 'roll_no', e.target.value)}
                              className="bg-gray-900/50 border-gray-700 text-white"
                            />
                            <Input
                              placeholder="Email"
                              type="email"
                              value={detail.email}
                              onChange={(e) => handleTicketDetailChange(index, 'email', e.target.value)}
                              className="bg-gray-900/50 border-gray-700 text-white"
                              required
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={submitting || event.seats_available === 0}
                  className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold hover:from-red-400 hover:to-red-500 disabled:opacity-50"
                >
                  {submitting ? 'Processing...' : event.seats_available === 0 ? 'Sold Out' : 'Proceed to Payment'}
                </Button>
              </form>
            </div>
          </Card>
        </div>
      </div>

      <AppverseFooter />
    </main>
  )
}