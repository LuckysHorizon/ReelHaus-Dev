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
  const [retryCount, setRetryCount] = useState(0)
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
        console.log('Fetching event with ID:', params.id, 'Retry count:', retryCount)
        const response = await fetch(`/api/events?id=${params.id}`)
        console.log('Event fetch response:', response.status)
        
        if (response.ok) {
          const data = await response.json()
          console.log('Event data received:', data)
          if (data.event) {
            setEvent(data.event)
            setError(null)
            console.log('Event set successfully:', data.event.title)
          } else {
            console.error('No event data in response:', data)
            throw new Error('No event data in response')
          }
        } else {
          console.error('Event fetch failed:', response.status, response.statusText)
          const errorText = await response.text()
          console.error('Error response:', errorText)
          throw new Error(`Event fetch failed: ${response.status} - ${errorText}`)
        }
      } catch (error) {
        console.error('Event fetch error:', error)
        if (retryCount < 3) {
          console.log('Retrying event fetch...')
          setTimeout(() => {
            setRetryCount(prev => prev + 1)
            setLoading(true)
            // Retry the fetch
            fetchEvent()
          }, 1000)
        } else {
          setError('Failed to load event. Please refresh the page and try again.')
        }
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchEvent()
    } else {
      setError('Invalid event ID')
      setLoading(false)
    }
  }, [params.id])

  const handleTicketChange = (tickets: number) => {
    // Ensure tickets is between 1 and 6
    const validTickets = Math.min(Math.max(tickets, 1), 6)
    
    // Only create ticket details for additional attendees (tickets > 1)
    const newTicketDetails = validTickets > 1 
      ? Array.from({ length: validTickets - 1 }, (_, i) => 
          formData.ticket_details[i] || { name: '', roll_no: '', email: '' }
        )
      : []
    setFormData(prev => ({ ...prev, tickets: validTickets, ticket_details: newTicketDetails }))
  }

  const handleTicketDetailChange = (index: number, field: string, value: string) => {
    const newTicketDetails = [...formData.ticket_details]
    newTicketDetails[index] = { ...newTicketDetails[index], [field]: value }
    setFormData(prev => ({ ...prev, ticket_details: newTicketDetails }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    console.log('Form submission started')
    console.log('Event data:', event)
    console.log('Form data:', formData)
    
    if (!event) {
      console.error('No event data available for submission')
      setError('Event data not available. Please refresh the page and try again.')
      setSubmitting(false)
      return
    }

    if (!event.id) {
      console.error('Event ID not available for submission')
      setError('Event ID not available. Please refresh the page and try again.')
      setSubmitting(false)
      return
    }

    // Client-side validation
    if (!formData.name.trim()) {
      setError('Name is required')
      return
    }
    if (!formData.email.trim()) {
      setError('Email is required')
      return
    }
    if (!formData.phone.trim()) {
      setError('Phone number is required')
      return
    }
    if (!formData.roll_no.trim()) {
      setError('Roll number is required')
      return
    }
    if (formData.phone.length < 10) {
      setError('Phone number must be at least 10 digits')
      return
    }
    if (!formData.email.includes('@')) {
      setError('Please enter a valid email address')
      return
    }

    // Validate attendee details for multiple tickets
    if (formData.tickets > 1 && formData.ticket_details && formData.ticket_details.length > 0) {
      for (let i = 0; i < formData.ticket_details.length; i++) {
        const attendee = formData.ticket_details[i]
        if (!attendee.name.trim()) {
          setError(`Attendee ${i + 2} name is required`)
          return
        }
        if (!attendee.roll_no.trim()) {
          setError(`Attendee ${i + 2} roll number is required`)
          return
        }
        if (attendee.email && attendee.email.trim() && !attendee.email.includes('@')) {
          setError(`Attendee ${i + 2} email format is invalid`)
          return
        }
      }
    }

    setSubmitting(true)
    setError(null)

    try {
      console.log('Creating Razorpay order for event:', event.id)
      
      // Step 1: Create Razorpay order
      const response = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          event_id: event.id
        })
      })
      
      console.log('Order creation response:', response.status)

      if (response.ok) {
        const data = await response.json()
        
        // Load Razorpay script
        const script = document.createElement('script')
        script.src = 'https://checkout.razorpay.com/v1/checkout.js'
        script.onload = () => {
          const options = {
            key: data.razorpay_key_id,
            amount: data.order.amount,
            currency: data.order.currency,
            name: 'ReelHaus',
            description: `Registration for ${data.event.title}`,
            order_id: data.order.id,
            handler: async function (response: any) {
              try {
                // Step 2: Verify payment on backend
                const verifyResponse = await fetch('/api/payments/verify', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify({
                    razorpay_order_id: response.razorpay_order_id,
                    razorpay_payment_id: response.razorpay_payment_id,
                    razorpay_signature: response.razorpay_signature,
                    registration_id: data.registration_id
                  })
                })

                if (verifyResponse.ok) {
                  // Payment verified successfully
                  router.push(`/events/payment/success?payment_id=${response.razorpay_payment_id}&registration_id=${data.registration_id}`)
                } else {
                  // Payment verification failed
                  setError('Payment verification failed. Please contact support.')
                  setSubmitting(false)
                }
              } catch (verifyError) {
                console.error('Payment verification error:', verifyError)
                setError('Payment verification failed. Please contact support.')
                setSubmitting(false)
              }
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
        console.error('Payment order creation failed:', errorData)
        if (errorData.details) {
          setError(`Validation error: ${errorData.details.map((d: any) => d.message).join(', ')}`)
        } else {
          setError(errorData.error || 'Registration failed')
        }
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
    console.log('Rendering error state. Error:', error, 'Event:', event)
    return (
      <main className="min-h-[100dvh] text-white">
        <SiteHeader />
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <h1 className="text-2xl font-semibold text-gray-400 mb-4">Event Not Found</h1>
            <p className="text-gray-500 mb-6">The event you're looking for doesn't exist or has been removed.</p>
            <p className="text-sm text-gray-600 mb-4">Event ID: {params.id}</p>
            <p className="text-sm text-gray-600 mb-4">Error: {error}</p>
            <p className="text-sm text-gray-600 mb-4">Retry attempts: {retryCount}/3</p>
            <div className="space-x-4">
              <Button asChild className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black">
                <Link href="/events">Back to Events</Link>
              </Button>
              {retryCount < 3 && (
                <Button 
                  onClick={() => {
                    setError(null)
                    setLoading(true)
                    setRetryCount(0)
                  }}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 text-white"
                >
                  Retry Loading Event
                </Button>
              )}
            </div>
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
          <p className="text-sm text-gray-400 mb-4">Event ID: {event.id}</p>
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
                    placeholder="9876543210"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="roll_no" className="text-gray-300">Roll Number *</Label>
                  <Input
                    id="roll_no"
                    value={formData.roll_no}
                    onChange={(e) => setFormData(prev => ({ ...prev, roll_no: e.target.value }))}
                    className="bg-gray-900/50 border-gray-700 text-white"
                    placeholder="Enter your roll number"
                    required
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
                              required
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