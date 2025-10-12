"use client"

import { useState } from "react"
import { SiteHeader } from "@/components/site-header"
import { AppverseFooter } from "@/components/appverse-footer"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Calendar, MapPin, Users, Clock, CheckCircle2, Plus, Minus } from "lucide-react"
import Link from "next/link"

// Mock event data
const mockEvent = {
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
  category: "Electronic",
  duration: "4 hours"
}

interface TicketDetail {
  name: string
  roll_no: string
  email?: string
}

export default function EventRegistrationPage({ params }: { params: { id: string } }) {
  const event = mockEvent // In production, fetch based on params.id
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    roll_no: "",
    tickets: 1
  })
  
  const [ticketDetails, setTicketDetails] = useState<TicketDetail[]>([
    { name: "", roll_no: "", email: "" }
  ])
  
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.name.trim()) newErrors.name = "Name is required"
    if (!formData.email.trim()) newErrors.email = "Email is required"
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Invalid email format"
    
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required"
    else if (!/^(\+91)?[6-9]\d{9}$/.test(formData.phone.replace(/\s/g, ""))) {
      newErrors.phone = "Invalid Indian phone number"
    }
    
    if (!formData.roll_no.trim()) newErrors.roll_no = "Roll number is required"
    
    // Validate ticket details
    ticketDetails.forEach((detail, index) => {
      if (!detail.name.trim()) newErrors[`ticket_${index}_name`] = "Attendee name is required"
      if (!detail.roll_no.trim()) newErrors[`ticket_${index}_roll`] = "Roll number is required"
      if (detail.email && !/\S+@\S+\.\S+/.test(detail.email)) {
        newErrors[`ticket_${index}_email`] = "Invalid email format"
      }
    })
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setLoading(true)
    
    try {
      const response = await fetch(`/api/events/${event.id}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          ticket_details: ticketDetails
        })
      })
      
      const data = await response.json()
      
      if (response.ok) {
        // Redirect to payment or success page
        window.location.href = `/events/${event.id}/payment?registration_id=${data.registration_id}`
      } else {
        setErrors({ submit: data.error || 'Registration failed' })
      }
    } catch (error) {
      setErrors({ submit: 'Network error. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  const updateTicketCount = (newCount: number) => {
    if (newCount < 1 || newCount > event.seats_available) return
    
    setFormData(prev => ({ ...prev, tickets: newCount }))
    
    // Adjust ticket details array
    if (newCount > ticketDetails.length) {
      const newDetails = [...ticketDetails]
      for (let i = ticketDetails.length; i < newCount; i++) {
        newDetails.push({ name: "", roll_no: "", email: "" })
      }
      setTicketDetails(newDetails)
    } else if (newCount < ticketDetails.length) {
      setTicketDetails(ticketDetails.slice(0, newCount))
    }
  }

  const updateTicketDetail = (index: number, field: keyof TicketDetail, value: string) => {
    const newDetails = [...ticketDetails]
    newDetails[index] = { ...newDetails[index], [field]: value }
    setTicketDetails(newDetails)
  }

  return (
    <main className="min-h-[100dvh] text-white">
      <SiteHeader />
      
      {/* Event Summary */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <h1 className="text-4xl font-bold mb-6 text-yellow-400">Register for {event.title}</h1>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Information */}
                <Card className="glass-border-enhanced p-6">
                  <h2 className="text-xl font-semibold mb-4 text-yellow-400">Personal Information</h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name" className="text-yellow-400">Full Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        className="bg-gray-900/50 border-gray-700 text-white"
                        placeholder="Enter your full name"
                      />
                      {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
                    </div>
                    <div>
                      <Label htmlFor="email" className="text-yellow-400">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        className="bg-gray-900/50 border-gray-700 text-white"
                        placeholder="Enter your email"
                      />
                      {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
                    </div>
                    <div>
                      <Label htmlFor="phone" className="text-yellow-400">Phone Number *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                        className="bg-gray-900/50 border-gray-700 text-white"
                        placeholder="+91 98765 43210"
                      />
                      {errors.phone && <p className="text-red-400 text-sm mt-1">{errors.phone}</p>}
                    </div>
                    <div>
                      <Label htmlFor="roll_no" className="text-yellow-400">Roll Number *</Label>
                      <Input
                        id="roll_no"
                        value={formData.roll_no}
                        onChange={(e) => setFormData(prev => ({ ...prev, roll_no: e.target.value }))}
                        className="bg-gray-900/50 border-gray-700 text-white"
                        placeholder="Enter your roll number"
                      />
                      {errors.roll_no && <p className="text-red-400 text-sm mt-1">{errors.roll_no}</p>}
                    </div>
                  </div>
                </Card>

                {/* Ticket Selection */}
                <Card className="glass-border-enhanced p-6">
                  <h2 className="text-xl font-semibold mb-4 text-yellow-400">Ticket Selection</h2>
                  <div className="flex items-center gap-4 mb-6">
                    <Label className="text-white">Number of Tickets:</Label>
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => updateTicketCount(formData.tickets - 1)}
                        disabled={formData.tickets <= 1}
                        className="border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black"
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-12 text-center font-semibold">{formData.tickets}</span>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => updateTicketCount(formData.tickets + 1)}
                        disabled={formData.tickets >= event.seats_available}
                        className="border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <span className="text-gray-400 text-sm">
                      (Max {event.seats_available} available)
                    </span>
                  </div>

                  {/* Ticket Details */}
                  {formData.tickets > 1 && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-yellow-400">Attendee Details</h3>
                      {ticketDetails.map((detail, index) => (
                        <div key={index} className="glass-border p-4 rounded-lg">
                          <h4 className="font-medium text-white mb-3">Attendee {index + 1}</h4>
                          <div className="grid md:grid-cols-3 gap-4">
                            <div>
                              <Label className="text-yellow-400">Name *</Label>
                              <Input
                                value={detail.name}
                                onChange={(e) => updateTicketDetail(index, 'name', e.target.value)}
                                className="bg-gray-900/50 border-gray-700 text-white"
                                placeholder="Attendee name"
                              />
                              {errors[`ticket_${index}_name`] && (
                                <p className="text-red-400 text-sm mt-1">{errors[`ticket_${index}_name`]}</p>
                              )}
                            </div>
                            <div>
                              <Label className="text-yellow-400">Roll Number *</Label>
                              <Input
                                value={detail.roll_no}
                                onChange={(e) => updateTicketDetail(index, 'roll_no', e.target.value)}
                                className="bg-gray-900/50 border-gray-700 text-white"
                                placeholder="Roll number"
                              />
                              {errors[`ticket_${index}_roll`] && (
                                <p className="text-red-400 text-sm mt-1">{errors[`ticket_${index}_roll`]}</p>
                              )}
                            </div>
                            <div>
                              <Label className="text-yellow-400">Email (Optional)</Label>
                              <Input
                                type="email"
                                value={detail.email || ""}
                                onChange={(e) => updateTicketDetail(index, 'email', e.target.value)}
                                className="bg-gray-900/50 border-gray-700 text-white"
                                placeholder="Email address"
                              />
                              {errors[`ticket_${index}_email`] && (
                                <p className="text-red-400 text-sm mt-1">{errors[`ticket_${index}_email`]}</p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </Card>

                {errors.submit && (
                  <div className="bg-red-900/20 border border-red-500 rounded-lg p-4">
                    <p className="text-red-400">{errors.submit}</p>
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-semibold hover:from-yellow-300 hover:to-yellow-400 py-4"
                >
                  {loading ? "Processing..." : `Proceed to Payment - ₹${event.price * formData.tickets}`}
                </Button>
              </form>
            </div>

            {/* Event Summary Sidebar */}
            <div>
              <Card className="glass-border-enhanced p-6 sticky top-24">
                <h3 className="text-xl font-semibold mb-4 text-yellow-400">Event Summary</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-gray-300">
                    <Calendar className="h-5 w-5 text-yellow-400" />
                    <span>{new Date(event.date).toLocaleDateString()}</span>
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
                
                <div className="border-t border-gray-700 mt-6 pt-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-300">Tickets ({formData.tickets})</span>
                    <span className="text-white">₹{event.price} each</span>
                  </div>
                  <div className="flex justify-between items-center text-lg font-semibold">
                    <span className="text-yellow-400">Total</span>
                    <span className="text-yellow-400">₹{event.price * formData.tickets}</span>
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
