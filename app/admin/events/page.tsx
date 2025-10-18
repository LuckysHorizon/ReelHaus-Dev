"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { SiteHeader } from "@/components/site-header"
import { AppverseFooter } from "@/components/appverse-footer"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ImageUpload } from "@/components/image-upload"
import { DatePicker } from "@/components/ui/heroui-shim"
import { now, getLocalTimeZone } from "@internationalized/date"
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
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [editingEvent, setEditingEvent] = useState<Event | null>(null)
  const [exporting, setExporting] = useState<string | null>(null)
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    cover_image_url: '',
    start_datetime: '',
    end_datetime: '',
    seats_total: 0,
    seats_available: 0,
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

  const validateForm = () => {
    const errors: Record<string, string> = {}
    
    if (!formData.title.trim()) {
      errors.title = 'Title is required'
    }
    
    if (formData.seats_total < 0) {
      errors.seats_total = 'Seats must be 0 or greater'
    }
    
    if (formData.price_cents < 0) {
      errors.price_cents = 'Price must be 0 or greater'
    }
    
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const token = getAdminToken()
    if (!token) return

    setSaving(true)
    setError(null)
    setFormErrors({})

    // Validate form
    if (!validateForm()) {
      setError('Please fix the form errors below')
      setSaving(false)
      return
    }

    try {
      const url = editingEvent 
        ? `/api/admin/events/${editingEvent.id}`
        : '/api/admin/events'
      
      const method = editingEvent ? 'PUT' : 'POST'
      
      // For new events, set seats_available = seats_total
      const submitData = editingEvent 
        ? {
            ...formData,
            seats_total: Number(formData.seats_total),
            seats_available: Number(formData.seats_available),
            price_cents: Number(formData.price_cents),
            is_active: Boolean(formData.is_active)
          }
        : { 
            ...formData, 
            seats_available: Number(formData.seats_total),
            seats_total: Number(formData.seats_total),
            price_cents: Number(formData.price_cents),
            is_active: Boolean(formData.is_active)
          }
      
      console.log('Sending data:', JSON.stringify(submitData, null, 2))
      console.log('Data types:', Object.entries(submitData).map(([key, value]) => `${key}: ${typeof value} (${value})`))
      
      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(submitData)
      })

      if (response.ok) {
        await fetchEvents(token)
        resetForm()
        // Show success message with better UI
        const successMessage = editingEvent ? 'Event updated successfully!' : 'Event created successfully!'
        setError(null)
        setSuccess(successMessage)
        // Auto-hide success message after 3 seconds
        setTimeout(() => setSuccess(null), 3000)
      } else {
        const errorData = await response.json()
        console.error('API Error:', errorData)
        
        if (errorData.validationErrors) {
          const validationMessages = errorData.validationErrors.map((err: any) => 
            `${err.path.join('.')}: ${err.message}`
          ).join(', ')
          setError(`Validation failed: ${validationMessages}`)
        } else {
          setError(`${errorData.error || 'Failed to save event'}${errorData.details ? ` - ${errorData.details}` : ''}`)
        }
      }
    } catch (error) {
      setError('Network error. Please try again.')
    } finally {
      setSaving(false)
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
      seats_available: event.seats_available,
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

      const data = await response.json()

      if (response.ok) {
        await fetchEvents(token)
        alert(data.message || 'Event deleted successfully!')
      } else {
        alert(data.details || data.error || 'Failed to delete event')
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
      seats_available: 0,
      price_cents: 0,
      currency: 'INR',
      is_active: true
    })
    setEditingEvent(null)
    setShowForm(false)
  }

  // Debug functions removed for production

  const handleExportRegistrations = async (eventId: string) => {
    const token = getAdminToken()
    if (!token) return

    setExporting(eventId)
    try {
      const response = await fetch(`/api/admin/export/registrations?eventId=${eventId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `registrations-${eventId}-${new Date().toISOString().split('T')[0]}.xlsx`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
        setSuccess('Excel file downloaded successfully!')
        setTimeout(() => setSuccess(null), 3000)
      } else {
        setError('Failed to export registrations')
      }
    } catch (error) {
      setError('Network error during export')
    } finally {
      setExporting(null)
    }
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
      
      <div className="container mx-auto px-3 sm:px-4 py-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
          <div className="flex items-center gap-3 flex-wrap">
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
            className="bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-400 hover:to-red-500 w-full sm:w-auto rounded-full px-4 py-2"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Event
          </Button>
        </div>

        {/* Event Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-3">
            <Card className="glass-border-enhanced w-full max-w-[680px] max-h-[92vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
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

                {error && (
                  <div className="bg-red-900/20 border border-red-500 rounded-lg p-4 mb-6">
                    <p className="text-red-400 text-sm">{error}</p>
                  </div>
                )}

                {success && (
                  <div className="bg-green-900/20 border border-green-500 rounded-lg p-4 mb-6">
                    <p className="text-green-400 text-sm">{success}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="title" className="text-white mb-2">
                        Event Title <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => {
                          setFormData(prev => ({ ...prev, title: e.target.value }))
                          if (formErrors.title) {
                            setFormErrors(prev => ({ ...prev, title: '' }))
                          }
                        }}
                        className={`bg-gray-900/50 text-white ${
                          formErrors.title 
                            ? 'border-red-500 focus:border-red-400' 
                            : 'border-gray-700 focus:border-red-400'
                        }`}
                        placeholder="Enter event title"
                        required
                      />
                      {formErrors.title && (
                        <p className="text-red-400 text-sm mt-1">{formErrors.title}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="currency" className="text-white mb-2">Currency</Label>
                      <select
                        id="currency"
                        value={formData.currency}
                        onChange={(e) => setFormData(prev => ({ ...prev, currency: 'INR' }))}
                        disabled
                        className="w-full p-2 bg-gray-900/50 border border-gray-700 rounded-md text-white disabled:opacity-70"
                      >
                        <option value="INR">INR (₹)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description" className="text-white mb-2">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      className="bg-gray-900/50 border-gray-700 text-white"
                      rows={3}
                    />
                  </div>

                  <ImageUpload
                    value={formData.cover_image_url}
                    onChange={(url) => setFormData(prev => ({ ...prev, cover_image_url: url }))}
                    onError={(error) => setError(error)}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div>
                       <Label className="text-white mb-2">Start Date & Time *</Label>
                       <DatePicker
                         hideTimeZone
                         showMonthAndYearPickers
                         value={formData.start_datetime || undefined}
                         onChange={(val: any) => {
                           if (typeof val === 'string') {
                             setFormData(prev => ({ ...prev, start_datetime: val }))
                             return
                           }
                           if ((val as any)?.toDate) {
                             const jsDate = (val as any).toDate(getLocalTimeZone())
                             const iso = jsDate ? new Date(jsDate).toISOString() : ''
                             setFormData(prev => ({ ...prev, start_datetime: iso }))
                             return
                           }
                           if (val instanceof Date) {
                             setFormData(prev => ({ ...prev, start_datetime: val.toISOString() }))
                             return
                           }
                         }}
                         variant="bordered"
                       />
                     </div>
                     <div>
                       <Label className="text-white mb-2">End Date & Time *</Label>
                       <DatePicker
                         hideTimeZone
                         showMonthAndYearPickers
                         value={formData.end_datetime || undefined}
                         onChange={(val: any) => {
                           if (typeof val === 'string') {
                             setFormData(prev => ({ ...prev, end_datetime: val }))
                             return
                           }
                           if ((val as any)?.toDate) {
                             const jsDate = (val as any).toDate(getLocalTimeZone())
                             const iso = jsDate ? new Date(jsDate).toISOString() : ''
                             setFormData(prev => ({ ...prev, end_datetime: iso }))
                             return
                           }
                           if (val instanceof Date) {
                             setFormData(prev => ({ ...prev, end_datetime: val.toISOString() }))
                             return
                           }
                         }}
                         variant="bordered"
                       />
                     </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="seats_total" className="text-white mb-2">
                        Total Seats <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="seats_total"
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        value={formData.seats_total === 0 ? '' : formData.seats_total}
                        onChange={(e) => {
                          const digits = e.target.value.replace(/\D+/g, '')
                          setFormData(prev => ({ ...prev, seats_total: digits === '' ? 0 : parseInt(digits) }))
                        }}
                        className={`bg-gray-900/50 text-white ${
                          formErrors.seats_total 
                            ? 'border-red-500 focus:border-red-400' 
                            : 'border-gray-700 focus:border-red-400'
                        }`}
                        placeholder="Enter total seats"
                        required
                      />
                      {formErrors.seats_total && (
                        <p className="text-red-400 text-sm mt-1">{formErrors.seats_total}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="price_cents" className="text-white mb-2">
                        Price (₹) <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="price_cents"
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        value={formData.price_cents === 0 ? '' : Math.round(formData.price_cents / 100).toString()}
                        onChange={(e) => {
                          const digits = e.target.value.replace(/\D+/g, '')
                          const rupees = digits === '' ? 0 : parseInt(digits)
                          setFormData(prev => ({ ...prev, price_cents: rupees * 100 }))
                        }}
                        className={`bg-gray-900/50 text-white ${
                          formErrors.price_cents 
                            ? 'border-red-500 focus:border-red-400' 
                            : 'border-gray-700 focus:border-red-400'
                        }`}
                        placeholder="1500"
                        required
                      />
                      {formErrors.price_cents && (
                        <p className="text-red-400 text-sm mt-1">{formErrors.price_cents}</p>
                      )}
                      <p className="text-sm text-gray-400 mt-1">
                        Enter price in rupees (e.g., 1500 for ₹1,500)
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
                    <Label htmlFor="is_active" className="text-white">Active Event</Label>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 pt-3">
                    <Button 
                      type="submit"
                      disabled={saving}
                      className="bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-400 hover:to-red-500 disabled:opacity-50"
                    >
                      <Save className={`h-4 w-4 mr-2 ${saving ? 'animate-spin' : ''}`} />
                      {saving ? 'Saving...' : (editingEvent ? 'Update Event' : 'Create Event')}
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
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <Card key={event.id} className="glass-border-enhanced overflow-hidden">
              <div className="relative">
                {event.cover_image_url && (
                  <Image
                    src={event.cover_image_url}
                    alt={event.title}
                    width={1200}
                    height={600}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="w-full h-48 object-cover"
                    priority={false}
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
                    <span>₹{(event.price_cents / 100).toLocaleString('en-IN')}</span>
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
                    disabled={exporting === event.id}
                    className="border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white disabled:opacity-50"
                    onClick={() => handleExportRegistrations(event.id)}
                    title="Export Registrations"
                  >
                    <Download className={`h-3 w-3 ${exporting === event.id ? 'animate-spin' : ''}`} />
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
