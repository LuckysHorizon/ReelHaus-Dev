"use client"

import { useState, useEffect } from "react"
import { SiteHeader } from "@/components/site-header"
import { AppverseFooter } from "@/components/appverse-footer"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  Users, 
  Search,
  Download,
  Eye,
  Mail,
  Phone,
  Calendar,
  DollarSign,
  ArrowLeft,
  Filter,
  RefreshCw
} from "lucide-react"
import { useRouter } from "next/navigation"
import { getAdminToken } from "@/lib/admin-auth"

interface Registration {
  id: string
  event_id: string
  name: string
  email: string
  phone: string
  roll_no?: string
  tickets: number
  ticket_details?: Array<{
    name: string
    roll_no?: string
    email?: string
  }>
  status: 'pending' | 'payment_initiated' | 'paid' | 'failed' | 'refunded'
  created_at: string
  events?: {
    title: string
    start_datetime: string
    price_cents: number
    currency: string
  }
}

export default function AdminRegistrationsPage() {
  const router = useRouter()
  const [registrations, setRegistrations] = useState<Registration[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedEvent, setSelectedEvent] = useState('all')

  useEffect(() => {
    const token = getAdminToken()
    if (!token) {
      router.push('/admin/login')
      return
    }

    fetchRegistrations(token)
  }, [router])

  const fetchRegistrations = async (token: string) => {
    try {
      const response = await fetch('/api/admin/registrations', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setRegistrations(data.registrations || [])
      } else {
        setError('Failed to fetch registrations')
      }
    } catch (error) {
      setError('Network error')
    } finally {
      setLoading(false)
    }
  }

  const handleExport = async () => {
    const token = getAdminToken()
    if (!token) return

    try {
      const response = await fetch('/api/admin/export/registrations', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `registrations-${new Date().toISOString().split('T')[0]}.xlsx`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      } else {
        alert('Failed to export registrations')
      }
    } catch (error) {
      alert('Export failed')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-500/20 text-green-400'
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400'
      case 'payment_initiated':
        return 'bg-blue-500/20 text-blue-400'
      case 'failed':
        return 'bg-red-500/20 text-red-400'
      case 'refunded':
        return 'bg-gray-500/20 text-gray-400'
      default:
        return 'bg-gray-500/20 text-gray-400'
    }
  }

  const filteredRegistrations = registrations.filter(reg => {
    const matchesSearch = 
      reg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.phone.includes(searchTerm) ||
      (reg.roll_no && reg.roll_no.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesStatus = statusFilter === 'all' || reg.status === statusFilter
    const matchesEvent = selectedEvent === 'all' || reg.event_id === selectedEvent
    
    return matchesSearch && matchesStatus && matchesEvent
  })

  const uniqueEvents = Array.from(
    new Set(registrations.map(reg => reg.event_id))
  ).map(eventId => {
    const reg = registrations.find(r => r.event_id === eventId)
    return {
      id: eventId,
      title: reg?.events?.title || 'Unknown Event'
    }
  })

  if (loading) {
    return (
      <main className="min-h-[100dvh] text-white">
        <SiteHeader />
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-md mx-auto text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
            <p className="text-gray-300">Loading registrations...</p>
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
                Registrations Management
              </h1>
              <p className="text-gray-400">View and manage event registrations</p>
            </div>
          </div>
          <Button 
            onClick={handleExport}
            className="bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-400 hover:to-green-500 w-full sm:w-auto rounded-full"
          >
            <Download className="h-4 w-4 mr-2" />
            Export Excel
          </Button>
        </div>

        {/* Filters */}
        <Card className="glass-border-enhanced p-5 sm:p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-red-400 mb-2">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by name, email, phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-gray-900/50 border-gray-700 text-white pl-10"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-red-400 mb-2">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full p-2 bg-gray-900/50 border border-gray-700 rounded-md text-white"
              >
                <option value="all">All Statuses</option>
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
                <option value="payment_initiated">Payment Initiated</option>
                <option value="failed">Failed</option>
                <option value="refunded">Refunded</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-red-400 mb-2">Event</label>
              <select
                value={selectedEvent}
                onChange={(e) => setSelectedEvent(e.target.value)}
                className="w-full p-2 bg-gray-900/50 border border-gray-700 rounded-md text-white"
              >
                <option value="all">All Events</option>
                {uniqueEvents.map(event => (
                  <option key={event.id} value={event.id}>{event.title}</option>
                ))}
              </select>
            </div>
            
            {/* Refresh button removed as requested */}
          </div>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
          <Card className="glass-border-enhanced p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Registrations</p>
                <p className="text-2xl font-bold text-white">{registrations.length}</p>
              </div>
              <Users className="h-8 w-8 text-red-400" />
            </div>
          </Card>
          
          <Card className="glass-border-enhanced p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Paid</p>
                <p className="text-2xl font-bold text-white">
                  {registrations.filter(r => r.status === 'paid').length}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-green-400" />
            </div>
          </Card>
          
          <Card className="glass-border-enhanced p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Pending</p>
                <p className="text-2xl font-bold text-white">
                  {registrations.filter(r => r.status === 'pending').length}
                </p>
              </div>
              <Calendar className="h-8 w-8 text-yellow-400" />
            </div>
          </Card>
          
          <Card className="glass-border-enhanced p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Revenue</p>
                <p className="text-2xl font-bold text-white">
                  ₹{registrations
                    .filter(r => r.status === 'paid')
                    .reduce((sum, r) => sum + (r.tickets * (r.events?.price_cents || 0)), 0) / 100}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-green-400" />
            </div>
          </Card>
        </div>

        {/* Registrations Table */}
        <Card className="glass-border-enhanced">
          <div className="p-6 border-b border-gray-700">
            <h2 className="text-xl font-semibold text-red-400">
              Registrations ({filteredRegistrations.length})
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left p-4 text-gray-400">Attendee</th>
                  <th className="text-left p-4 text-gray-400">Event</th>
                  <th className="text-left p-4 text-gray-400">Tickets</th>
                  <th className="text-left p-4 text-gray-400">Status</th>
                  <th className="text-left p-4 text-gray-400">Date</th>
                  <th className="text-left p-4 text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRegistrations.map((registration) => (
                  <tr key={registration.id} className="border-b border-gray-800 hover:bg-gray-900/50">
                    <td className="p-4">
                      <div>
                        <h3 className="font-semibold text-white">{registration.name}</h3>
                        <p className="text-sm text-gray-400">{registration.email}</p>
                        <p className="text-sm text-gray-400">{registration.phone}</p>
                        {registration.roll_no && (
                          <p className="text-sm text-gray-400">Roll: {registration.roll_no}</p>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <div>
                        <p className="text-white font-medium">{registration.events?.title || 'Unknown Event'}</p>
                        <p className="text-sm text-gray-400">
                          {registration.events?.start_datetime 
                            ? new Date(registration.events.start_datetime).toLocaleDateString()
                            : 'N/A'
                          }
                        </p>
                      </div>
                    </td>
                    <td className="p-4 text-gray-300">
                      {registration.tickets}
                    </td>
                    <td className="p-4">
                      <Badge className={getStatusColor(registration.status)}>
                        {registration.status.replace('_', ' ').toUpperCase()}
                      </Badge>
                    </td>
                    <td className="p-4 text-gray-300">
                      {new Date(registration.created_at).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="border-gray-700 text-gray-400 hover:bg-gray-800">
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="outline" className="border-gray-700 text-gray-400 hover:bg-gray-800">
                          <Mail className="h-3 w-3" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {filteredRegistrations.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">No Registrations Found</h3>
            <p className="text-gray-500">No registrations match your current filters</p>
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
