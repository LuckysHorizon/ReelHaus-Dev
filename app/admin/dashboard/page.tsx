"use client"

import { useState, useEffect } from "react"
import { SiteHeader } from "@/components/site-header"
import { AppverseFooter } from "@/components/appverse-footer"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Calendar, 
  Users, 
  DollarSign, 
  TrendingUp, 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  Download,
  LogOut,
  Database,
  RefreshCw
} from "lucide-react"
import { useRouter } from "next/navigation"
import { getAdminToken, removeAdminToken } from "@/lib/admin-auth"

interface Event {
  id: string
  title: string
  description: string
  start_datetime: string
  seats_total: number
  seats_available: number
  price_cents: number
  is_active: boolean
  created_at: string
}

interface DashboardStats {
  totalEvents: number
  totalRegistrations: number
  totalRevenue: number
  activeEvents: number
}

export default function AdminDashboardPage() {
  const router = useRouter()
  const [events, setEvents] = useState<Event[]>([])
  const [stats, setStats] = useState<DashboardStats>({
    totalEvents: 0,
    totalRegistrations: 0,
    totalRevenue: 0,
    activeEvents: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [seeding, setSeeding] = useState(false)

  useEffect(() => {
    const token = getAdminToken()
    if (!token) {
      router.push('/admin/login')
      return
    }

    fetchDashboardData(token)
  }, [router])

  const fetchDashboardData = async (token: string) => {
    try {
      // Use real Supabase API
      const eventsResponse = await fetch('/api/admin/events', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (eventsResponse.ok) {
        const eventsData = await eventsResponse.json()
        setEvents(eventsData.events)
        
        // Calculate stats
        const totalEvents = eventsData.events.length
        const activeEvents = eventsData.events.filter((e: Event) => e.is_active).length
        const totalRegistrations = eventsData.events.reduce((sum: number, e: Event) => 
          sum + (e.seats_total - e.seats_available), 0)
        const totalRevenue = eventsData.events.reduce((sum: number, e: Event) => 
          sum + ((e.seats_total - e.seats_available) * e.price_cents), 0)

        setStats({
          totalEvents,
          totalRegistrations,
          totalRevenue: totalRevenue / 100, // Convert from cents
          activeEvents
        })
      } else {
        setError('Failed to fetch events')
      }
    } catch (error) {
      setError('Network error')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    removeAdminToken()
    router.push('/admin/login')
  }

  const handleSeedData = async () => {
    const token = getAdminToken()
    if (!token) return

    setSeeding(true)
    try {
      // Call the real seed API endpoint
      const response = await fetch('/api/admin/seed', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        // Refresh the dashboard data
        await fetchDashboardData(token)
        alert('Sample events seeded successfully!')
      } else {
        alert('Failed to seed data')
      }
    } catch (error) {
      alert('Error seeding data')
    } finally {
      setSeeding(false)
    }
  }

  const handleRefresh = async () => {
    const token = getAdminToken()
    if (!token) return

    setLoading(true)
    await fetchDashboardData(token)
  }

  const deleteEvent = async (eventId: string) => {
    const token = getAdminToken()
    if (!token) return

    if (!confirm('Are you sure you want to delete this event?')) return

    try {
      const response = await fetch(`/api/admin/events/${eventId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      const data = await response.json()

      if (response.ok) {
        setEvents(events.filter(e => e.id !== eventId))
        // Refresh stats
        await fetchDashboardData(token)
        alert(data.message || 'Event deleted successfully!')
      } else {
        alert(data.details || data.error || 'Failed to delete event')
      }
    } catch (error) {
      alert('Network error')
    }
  }

  if (loading) {
    return (
      <main className="min-h-[100dvh] text-white">
        <SiteHeader />
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-md mx-auto text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
            <p className="text-gray-300">Loading dashboard...</p>
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
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-red-400 via-red-500 to-red-600 bg-clip-text text-transparent">
              ReelHaus Admin Dashboard
            </h1>
            <p className="text-gray-400">Manage your events, registrations, and analytics</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button 
              onClick={handleRefresh}
              disabled={loading}
              variant="outline"
              className="border-gray-700 text-gray-400 hover:bg-gray-800 hover:text-white"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button 
              onClick={handleSeedData}
              disabled={seeding}
              variant="outline"
              className="border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white"
            >
              <Database className={`h-4 w-4 mr-2 ${seeding ? 'animate-pulse' : ''}`} />
              {seeding ? 'Seeding...' : 'Seed Data'}
            </Button>
            <Button className="bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-400 hover:to-red-500" onClick={() => router.push('/admin/events')}>
              <Plus className="h-4 w-4 mr-2" />
              New Event
            </Button>
            <Button 
              onClick={handleLogout}
              variant="outline"
              className="border-gray-700 text-gray-400 hover:bg-gray-800 hover:text-white"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="glass-border-enhanced p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Events</p>
                <p className="text-2xl font-bold text-white">{stats.totalEvents}</p>
              </div>
              <Calendar className="h-8 w-8 text-red-400" />
            </div>
          </Card>
          
          <Card className="glass-border-enhanced p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Active Events</p>
                <p className="text-2xl font-bold text-white">{stats.activeEvents}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-red-400" />
            </div>
          </Card>
          
          <Card className="glass-border-enhanced p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Registrations</p>
                <p className="text-2xl font-bold text-white">{stats.totalRegistrations}</p>
              </div>
              <Users className="h-8 w-8 text-red-400" />
            </div>
          </Card>
          
          <Card className="glass-border-enhanced p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Revenue</p>
                <p className="text-2xl font-bold text-white">₹{stats.totalRevenue.toLocaleString()}</p>
              </div>
              <DollarSign className="h-8 w-8 text-red-400" />
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="glass-border-enhanced p-6 hover:bg-gray-900/50 transition-colors cursor-pointer" onClick={() => router.push('/admin/events')}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Events Management</h3>
                <p className="text-gray-400 text-sm">Create, edit, and manage events</p>
                <p className="text-red-400 text-sm mt-2">{stats.totalEvents} total events</p>
              </div>
              <Calendar className="h-8 w-8 text-red-400" />
            </div>
          </Card>
          
          <Card className="glass-border-enhanced p-6 hover:bg-gray-900/50 transition-colors cursor-pointer" onClick={() => router.push('/admin/registrations')}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Registrations</h3>
                <p className="text-gray-400 text-sm">View and manage registrations</p>
                <p className="text-red-400 text-sm mt-2">{stats.totalRegistrations} total registrations</p>
              </div>
              <Users className="h-8 w-8 text-red-400" />
            </div>
          </Card>
          
          <Card className="glass-border-enhanced p-6 hover:bg-gray-900/50 transition-colors cursor-pointer">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Analytics</h3>
                <p className="text-gray-400 text-sm">View detailed analytics and reports</p>
                <p className="text-red-400 text-sm mt-2">Coming soon</p>
              </div>
              <TrendingUp className="h-8 w-8 text-red-400" />
            </div>
          </Card>
        </div>

        {/* Recent Events */}
        <Card className="glass-border-enhanced">
          <div className="p-6 border-b border-gray-700">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-red-400">Recent Events</h2>
              <Button 
                asChild
                variant="outline"
                size="sm"
                className="border-gray-700 text-gray-400 hover:bg-gray-800 hover:text-white"
              >
                <a href="/admin/events">View All</a>
              </Button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left p-4 text-gray-400">Event</th>
                  <th className="text-left p-4 text-gray-400">Date</th>
                  <th className="text-left p-4 text-gray-400">Seats</th>
                  <th className="text-left p-4 text-gray-400">Price</th>
                  <th className="text-left p-4 text-gray-400">Status</th>
                  <th className="text-left p-4 text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                {events.slice(0, 5).map((event) => (
                  <tr key={event.id} className="border-b border-gray-800 hover:bg-gray-900/50">
                    <td className="p-4">
                      <div>
                        <h3 className="font-semibold text-white">{event.title}</h3>
                        <p className="text-sm text-gray-400 line-clamp-1">{event.description}</p>
                      </div>
                    </td>
                    <td className="p-4 text-gray-300">
                      {new Date(event.start_datetime).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-gray-300">
                      {event.seats_total - event.seats_available} / {event.seats_total}
                    </td>
                    <td className="p-4 text-gray-300">
                      ₹{event.price_cents / 100}
                    </td>
                    <td className="p-4">
                      <Badge className={event.is_active ? "bg-green-500/20 text-green-400" : "bg-gray-500/20 text-gray-400"}>
                        {event.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="border-gray-700 text-gray-400 hover:bg-gray-800"
                          onClick={() => router.push(`/admin/events?edit=${event.id}`)}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="border-red-500 text-red-400 hover:bg-red-500 hover:text-white"
                          onClick={() => deleteEvent(event.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

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
