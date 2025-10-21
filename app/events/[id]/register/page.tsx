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
import { formatUTCDate, formatUTCTime12 } from "@/lib/utils"

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
        const response = await fetch(`/api/events?id=${params?.id}`)
        
        if (response.ok) {
          const data = await response.json()
          if (data.event) {
            setEvent(data.event)
            setError(null)
          } else {
            throw new Error('No event data in response')
          }
        } else {
          const errorText = await response.text()
          throw new Error(`Event fetch failed: ${response.status} - ${errorText}`)
        }
      } catch (error) {
        if (retryCount < 3) {
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

    if (params?.id) {
      fetchEvent()
    } else {
      setError('Invalid event ID')
      setLoading(false)
    }
  }, [params?.id])

  // Preload Cashfree SDK on any /events/*/register route so checkout opens reliably
  useEffect(() => {
    const existing = document.querySelector('script[src="https://sdk.cashfree.com/js/v3/cashfree.js"]')
    if (!existing) {
      const script = document.createElement('script')
      script.src = 'https://sdk.cashfree.com/js/v3/cashfree.js'
      script.async = true
      document.body.appendChild(script)
    }
  }, [])

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
    
    if (!event) {
      setError('Event data not available. Please refresh the page and try again.')
      setSubmitting(false)
      return
    }

    if (!event.id) {
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
      // Step 1: Create Cashfree order
      const response = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          roll_no: formData.roll_no,
          tickets: formData.tickets,
          event_id: event.id,
          // Only include ticket_details if there are additional attendees
          ...(formData.tickets > 1 && formData.ticket_details && formData.ticket_details.length > 0 
            ? { ticket_details: formData.ticket_details } 
            : {})
        })
      })

      if (response.ok) {
        const data = await response.json()
        
        // Load Cashfree SDK and open checkout
        const script = document.createElement('script')
        script.src = 'https://sdk.cashfree.com/js/v3/cashfree.js'
        script.onload = () => {
          console.log('Cashfree SDK loaded, initializing...')
          const cashfree = new (window as any).Cashfree({
            mode: process.env.NEXT_PUBLIC_CASHFREE_ENVIRONMENT || 'sandbox'
          })
          console.log('Cashfree initialized with mode:', process.env.NEXT_PUBLIC_CASHFREE_ENVIRONMENT || 'sandbox')

          const checkoutOptions = {
            paymentSessionId: data.cashfree_payment_session_id,
            redirectTarget: '_self'
          }

          cashfree.checkout(checkoutOptions)
            .then(async (resp: any) => {
              // Handle different response formats
              const paymentId = resp?.cf_payment_id || resp?.payment_id || resp?.id || resp
              
              if (!paymentId) {
                setError('Payment completed but verification failed')
                setSubmitting(false)
                return
              }
              
              try {
                // Step 2: Verify payment on backend
                const verifyResponse = await fetch('/api/payments/verify', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    cashfree_order_id: data.cashfree_order_id,
                    cashfree_payment_id: paymentId,
                    registration_id: data.registration_id
                  })
                })
                
                const verifyJson = await verifyResponse.json().catch(() => ({}))
                
                if (verifyResponse.ok && verifyJson?.success) {
                  console.log('Payment verification successful')
                  router.push(`/events/payment/success?status=success&payment_id=${paymentId}&registration_id=${data.registration_id}`)
                } else {
                  console.error('Payment verification failed:', verifyJson)
                  
                  // Handle different failure scenarios
                  const status = verifyJson?.status || 'verification_failed'
                  const paymentStatus = verifyJson?.payment_status || 'unknown'
                  
                  if (status === 'failed' || paymentStatus === 'failed' || paymentStatus === 'cancelled' || paymentStatus === 'expired') {
                    // Payment failed - redirect to failure page
                    router.push(`/events/payment/failure?status=failure&reason=payment_failed&payment_id=${paymentId}&registration_id=${data.registration_id}`)
                  } else if (status === 'pending' || paymentStatus === 'pending') {
                    // Payment pending - redirect to failure page with pending reason
                    router.push(`/events/payment/failure?status=pending&reason=payment_pending&payment_id=${paymentId}&registration_id=${data.registration_id}`)
                  } else {
                    // Verification failed or other issues - redirect to failure page
                    router.push(`/events/payment/failure?status=failure&reason=verification_failed&payment_id=${paymentId}&registration_id=${data.registration_id}`)
                  }
                }
              } catch (verifyError) {
                const reason = encodeURIComponent('network_error')
                router.push(`/events/payment/failure?status=failure&reason=${reason}`)
              }
            })
            .catch((error: any) => {
              console.error('Cashfree checkout error:', error)
              setError('Failed to open payment gateway')
            })
            .finally(() => {
              setSubmitting(false)
            })
        }
        script.onerror = () => {
          setError('Failed to load payment gateway')
          setSubmitting(false)
        }
        document.body.appendChild(script)
      } else {
        const errorData = await response.json()
        console.error('Registration API error:', errorData)
        if (errorData.details) {
          setError(`Validation error: ${errorData.details.map((d: any) => d.message).join(', ')}`)
        } else if (errorData.provider === 'cashfree') {
          setError(`Payment gateway error: ${errorData.details || errorData.error}`)
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
    return (
      <main className="min-h-[100dvh] text-white">
        <SiteHeader />
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <h1 className="text-2xl font-semibold text-gray-400 mb-4">Event Not Found</h1>
            <p className="text-gray-500 mb-6">The event you're looking for doesn't exist or has been removed.</p>
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
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Event Summary */}
          <Card className="glass-border-enhanced">
            <div className="p-6">
              <h2 className="text-2xl font-semibold mb-4 text-white">Event Details</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-white" />
                  <span>{formatUTCDate(event.start_datetime)}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-white" />
                  <span>{formatUTCTime12(event.start_datetime)} - {formatUTCTime12(event.end_datetime)}</span>
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
                  <Label htmlFor="name" className="text-gray-300 mb-2 block">Full Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="bg-gray-900/50 border-gray-700 text-white"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="email" className="text-gray-300 mb-2 block">Email *</Label>
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
                  <Label htmlFor="phone" className="text-gray-300 mb-2 block">Phone Number *</Label>
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
                  <Label htmlFor="roll_no" className="text-gray-300 mb-2 block">Roll Number *</Label>
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
                  <Label htmlFor="tickets" className="text-gray-300 mb-2 block">Number of Tickets *</Label>
                  <div className="relative">
                    <Input
                      id="tickets"
                      type="number"
                      inputMode="numeric"
                      min={1}
                      max={Math.min(6, event.seats_available)}
                      value={formData.tickets}
                      readOnly
                      className="bg-gray-900/50 border-gray-700 text-white pr-24 text-center no-number-spin"
                      required
                    />
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
                      <button
                        type="button"
                        aria-label="Decrease tickets"
                        onClick={() => handleTicketChange((formData.tickets || 1) - 1)}
                        className="h-8 w-8 rounded-full bg-gray-800 border border-gray-700 text-white grid place-items-center hover:bg-gray-700 active:scale-95 transition"
                      >
                        −
                      </button>
                      <button
                        type="button"
                        aria-label="Increase tickets"
                        onClick={() => handleTicketChange((formData.tickets || 1) + 1)}
                        className="h-8 w-8 rounded-full bg-red-600 text-white grid place-items-center hover:bg-red-500 active:scale-95 transition"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 mt-2">Maximum 6 tickets per registration</p>
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