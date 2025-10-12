"use client"

import { useState, useEffect } from "react"
import { SiteHeader } from "@/components/site-header"
import { AppverseFooter } from "@/components/appverse-footer"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { 
  Calendar, 
  Users, 
  DollarSign, 
  MapPin,
  Image as ImageIcon,
  Save,
  X,
  Plus,
  Edit,
  Trash2,
  Eye,
  Download,
  ArrowLeft
} from "lucide-react"
import { useRouter } from "next/navigation"
import { getAdminToken, removeAdminToken } from "@/lib/admin-auth"

interface Event {
  id: string
  title: string
  description: string
  cover_image_url: string
  start_datetime: string
  end_datetime: string
  seats_total: number
  seats_available: number
  price_cents: number
  currency: string
  is_active: boolean
  created_at: string
}

export default function AdminEventsPage() {
  const router = useRouter()
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [editingEvent, setEditingEvent] = useState<Event | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    cover_image_url: '',
    start_datetime: '',
    end_datetime: '',
    seats_total: 0,
    price_cents: 0,
    currency: 'INR',
    is_active: true
  })

  useEffect(() => {
    const token = getAdminToken()
    if (!token) {
      router.push('/admin/login')
      return
    }

    fetchEvents(token)
  }, [router])

  const fetchEvents = async (token: string) => {
    try {
      const response = await fetch('/api/admin/events', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setEvents(data.events || [])
      } else {
        setError('Failed to fetch events')
      }
    } catch (error) {
      setError('Network error')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const token = getAdminToken()
    if (!token) return

    try {
      const url = editingEvent 
        ? `/api/admin/events/${editingEvent.id}`
        : '/api/admin/events'
      
      const method = editingEvent ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        await fetchEvents(token)
        resetForm()
        alert(editingEvent ? 'Event updated successfully!' : 'Event created successfully!')
      } else {
        alert('Failed to save event')
      }
    } catch (error) {
      alert('Network error')
    }
  }

  const handleEdit = (event: Event) => {
    setEditingEvent(event)
    setFormData({
      title: event.title,
      description: event.description || '',
      cover_image_url: event.cover_image_url || '',
      start_datetime: event.start_datetime ? new Date(event.start_datetime).toISOString().slice(0, 16) : '',
      end_datetime: event.end_datetime ? new Date(event.end_datetime).toISOString().slice(0, 16) : '',
      seats_total: event.seats_total,
      price_cents: event.price_cents,
      currency: event.currency,
      is_active: event.is_active
    })
    setShowForm(true)
  }

  const handleDelete = async (eventId: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return

    const token = getAdminToken()
    if (!token) return

    try {
      const response = await fetch(`/api/admin/events/${eventId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        await fetchEvents(token)
        alert('Event deleted successfully!')
      } else {
        alert('Failed to delete event')
      }
    } catch (error) {
      alert('Network error')
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      cover_image_url: '',
      start_datetime: '',
      end_datetime: '',
      seats_total: 0,
      price_cents: 0,
      currency: 'INR',
      is_active: true
    })
    setEditingEvent(null)
    setShowForm(false)
  }

  if (loading) {
    return (
      <main className="min-h-[100dvh] text-white">
        <SiteHeader />
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-md mx-auto text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
            <p className="text-gray-300">Loading events...</p>
          </div>
        </div>
        <AppverseFooter />
      </main>
    )
  }

  return (
    <main className="min-h-[100dvh] text-white">
      <SiteHeader />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <Button 
              onClick={() => router.push('/admin/dashboard')}
              variant="outline"
              className="border-gray-700 text-gray-400 hover:bg-gray-800 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-red-400 via-red-500 to-red-600 bg-clip-text text-transparent">
                Events Management
              </h1>
              <p className="text-gray-400">Create, edit, and manage your events</p>
            </div>
          </div>
          <Button 
            onClick={() => setShowForm(true)}
            className="bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-400 hover:to-red-500"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Event
          </Button>
        </div>

        {/* Event Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <Card className="glass-border-enhanced w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-red-400">
                    {editingEvent ? 'Edit Event' : 'Create New Event'}
                  </h2>
                  <Button 
                    onClick={resetForm}
                    variant="outline"
                    size="sm"
                    className="border-gray-700 text-gray-400 hover:bg-gray-800 hover:text-white"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="title" className="text-red-400">Event Title *</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                        className="bg-gray-900/50 border-gray-700 text-white"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="currency" className="text-red-400">Currency</Label>
                      <select
                        id="currency"
                        value={formData.currency}
                        onChange={(e) => setFormData(prev => ({ ...prev, currency: e.target.value }))}
                        className="w-full p-2 bg-gray-900/50 border border-gray-700 rounded-md text-white"
                      >
                        <option value="INR">INR (₹)</option>
                        <option value="USD">USD ($)</option>
                        <option value="EUR">EUR (€)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description" className="text-red-400">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      className="bg-gray-900/50 border-gray-700 text-white"
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="cover_image_url" className="text-red-400">Cover Image URL</Label>
                    <Input
                      id="cover_image_url"
                      type="url"
                      value={formData.cover_image_url}
                      onChange={(e) => setFormData(prev => ({ ...prev, cover_image_url: e.target.value }))}
                      className="bg-gray-900/50 border-gray-700 text-white"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="start_datetime" className="text-red-400">Start Date & Time *</Label>
                      <Input
                        id="start_datetime"
                        type="datetime-local"
                        value={formData.start_datetime}
                        onChange={(e) => setFormData(prev => ({ ...prev, start_datetime: e.target.value }))}
                        className="bg-gray-900/50 border-gray-700 text-white"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="end_datetime" className="text-red-400">End Date & Time *</Label>
                      <Input
                        id="end_datetime"
                        type="datetime-local"
                        value={formData.end_datetime}
                        onChange={(e) => setFormData(prev => ({ ...prev, end_datetime: e.target.value }))}
                        className="bg-gray-900/50 border-gray-700 text-white"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="seats_total" className="text-red-400">Total Seats *</Label>
                      <Input
                        id="seats_total"
                        type="number"
                        min="1"
                        value={formData.seats_total}
                        onChange={(e) => setFormData(prev => ({ ...prev, seats_total: parseInt(e.target.value) || 0 }))}
                        className="bg-gray-900/50 border-gray-700 text-white"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="price_cents" className="text-red-400">Price (in cents) *</Label>
                      <Input
                        id="price_cents"
                        type="number"
                        min="0"
                        value={formData.price_cents}
                        onChange={(e) => setFormData(prev => ({ ...prev, price_cents: parseInt(e.target.value) || 0 }))}
                        className="bg-gray-900/50 border-gray-700 text-white"
                        required
                      />
                      <p className="text-sm text-gray-400 mt-1">
                        Current: ₹{formData.price_cents / 100}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="is_active"
                      checked={formData.is_active}
                      onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
                      className="rounded border-gray-700 bg-gray-900/50 text-red-500"
                    />
                    <Label htmlFor="is_active" className="text-red-400">Active Event</Label>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <Button 
                      type="submit"
                      className="bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-400 hover:to-red-500"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      {editingEvent ? 'Update Event' : 'Create Event'}
                    </Button>
                    <Button 
                      type="button"
                      onClick={resetForm}
                      variant="outline"
                      className="border-gray-700 text-gray-400 hover:bg-gray-800 hover:text-white"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </div>
            </Card>
          </div>
        )}

        {/* Events Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <Card key={event.id} className="glass-border-enhanced overflow-hidden">
              <div className="relative">
                {event.cover_image_url && (
                  <img 
                    src={event.cover_image_url} 
                    alt={event.title}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="absolute top-4 right-4">
                  <Badge className={event.is_active ? "bg-green-500/20 text-green-400" : "bg-gray-500/20 text-gray-400"}>
                    {event.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-semibold text-white mb-2">{event.title}</h3>
                <p className="text-gray-400 text-sm mb-4 line-clamp-2">{event.description}</p>
                
                <div className="space-y-2 text-sm text-gray-300 mb-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-red-400" />
                    <span>{new Date(event.start_datetime).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-red-400" />
                    <span>{event.seats_total - event.seats_available} / {event.seats_total} seats</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-red-400" />
                    <span>₹{event.price_cents / 100}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="flex-1 border-gray-700 text-gray-400 hover:bg-gray-800"
                    onClick={() => handleEdit(event)}
                  >
                    <Edit className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="border-red-500 text-red-400 hover:bg-red-500 hover:text-white"
                    onClick={() => handleDelete(event.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {events.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">No Events Found</h3>
            <p className="text-gray-500 mb-6">Create your first event to get started</p>
            <Button 
              onClick={() => setShowForm(true)}
              className="bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-400 hover:to-red-500"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Event
            </Button>
          </div>
        )}

        {error && (
          <div className="mt-6 bg-red-900/20 border border-red-500 rounded-lg p-4">
            <p className="text-red-400">{error}</p>
          </div>
        )}
      </div>

      <AppverseFooter />
    </main>
  )
}
