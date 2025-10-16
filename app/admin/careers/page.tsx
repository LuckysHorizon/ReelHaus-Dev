"use client"

import React, { useEffect, useMemo, useState } from "react"
import { SiteHeader } from "@/components/site-header"
import { AppverseFooter } from "@/components/appverse-footer"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { getAdminToken } from "@/lib/admin-auth"
import { Plus, Edit, Trash2, Save, X, RefreshCw, ExternalLink } from "lucide-react"

type Career = {
  id: string
  title: string
  description: string | null
  google_form_url: string
  is_active?: boolean
}

export default function AdminCareersPage() {
  const [items, setItems] = useState<Career[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editing, setEditing] = useState<Career | null>(null)
  const [form, setForm] = useState<Partial<Career>>({ title: "", description: "", google_form_url: "", is_active: true })

  const getAuthHeaders = () => {
    const token = getAdminToken()
    return {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    }
  }

  const fetchItems = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/admin/careers", { headers: getAuthHeaders() })
      const data = await res.json()
      if (Array.isArray(data)) setItems(data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const token = getAdminToken()
    if (!token) {
      window.location.href = '/admin/login'
      return
    }
    fetchItems()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const resetForm = () => {
    setEditing(null)
    setForm({ title: "", description: "", google_form_url: "", is_active: true })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title || !form.google_form_url) return
    setSaving(true)
    try {
      const method = editing ? "PUT" : "POST"
      const body = editing ? { id: editing.id, ...form } : form
      const res = await fetch("/api/admin/careers", { method, headers: getAuthHeaders(), body: JSON.stringify(body) })
      if (!res.ok) {
        const text = await res.text().catch(() => "")
        console.error("Failed to save career:", res.status, text)
        throw new Error("Failed to save")
      }
      resetForm()
      await fetchItems()
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (item: Career) => {
    setEditing(item)
    setForm({ title: item.title, description: item.description ?? "", google_form_url: item.google_form_url, is_active: item.is_active ?? true })
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this opportunity?")) return
    setSaving(true)
    try {
      await fetch(`/api/admin/careers?id=${id}`, { method: "DELETE", headers: getAuthHeaders() })
      await fetchItems()
    } finally {
      setSaving(false)
    }
  }

  return (
    <main className="min-h-[100dvh] text-white">
      <SiteHeader />

      <section className="py-8 px-3 sm:px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
            <h1 className="text-3xl md:text-4xl font-bold">Manage Career Opportunities</h1>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <Button onClick={fetchItems} variant="outline" className="w-full sm:w-auto border-gray-700 text-gray-300 hover:bg-gray-800">
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} /> Refresh
              </Button>
            </div>
          </div>

          {/* Editor */}
          <Card className="glass-border-enhanced p-5 sm:p-6 mb-8">
            <form onSubmit={handleSubmit} className="grid gap-4 grid-cols-1 md:grid-cols-2">
              <div className="md:col-span-1">
                <Label htmlFor="title">Position Name</Label>
                <Input id="title" value={form.title ?? ''} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} placeholder="e.g., Community Manager" className="bg-gray-900/50 border-gray-700 text-white mt-1" />
              </div>
              <div className="md:col-span-1">
                <Label htmlFor="url">Google Form Link</Label>
                <Input id="url" value={form.google_form_url ?? ''} onChange={(e) => setForm((f) => ({ ...f, google_form_url: e.target.value }))} placeholder="https://forms.gle/..." className="bg-gray-900/50 border-gray-700 text-white mt-1" />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="desc">Description</Label>
                <Textarea id="desc" value={form.description ?? ''} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} rows={3} placeholder="Brief role overview..." className="bg-gray-900/50 border-gray-700 text-white mt-1" />
              </div>
              <div className="md:col-span-2 flex flex-col sm:flex-row gap-3">
                <Button type="submit" disabled={saving} className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white">
                  <Save className="h-4 w-4 mr-2" /> {editing ? 'Update' : 'Create'}
                </Button>
                {editing && (
                  <Button type="button" onClick={resetForm} variant="outline" className="w-full sm:w-auto border-gray-700 text-gray-300 hover:bg-gray-800">
                    <X className="h-4 w-4 mr-2" /> Cancel
                  </Button>
                )}
              </div>
            </form>
          </Card>

          {/* List */}
          <div className="space-y-4">
            {loading ? (
              <p className="text-gray-400">Loading...</p>
            ) : items.length === 0 ? (
              <p className="text-gray-400">No opportunities yet.</p>
            ) : (
              items.map((it) => (
                <Card key={it.id} className="glass-border-enhanced p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-3">
                        <h3 className="text-xl font-semibold text-red-400">{it.title}</h3>
                        <Badge variant="secondary" className="bg-white/10 text-white">Active</Badge>
                      </div>
                      {it.description ? (<p className="text-gray-300 text-sm mt-2 max-w-3xl">{it.description}</p>) : null}
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                      <Button asChild variant="outline" className="w-full sm:w-auto border-gray-700 text-gray-300 hover:bg-gray-800">
                        <a href={it.google_form_url} target="_blank" rel="noopener noreferrer"><ExternalLink className="h-4 w-4 mr-2" /> Open Form</a>
                      </Button>
                      <Button onClick={() => handleEdit(it)} variant="outline" className="w-full sm:w-auto border-blue-500 text-blue-400 hover:bg-blue-600 hover:text-white">
                        <Edit className="h-4 w-4 mr-2" /> Edit
                      </Button>
                      <Button onClick={() => handleDelete(it.id)} variant="outline" className="w-full sm:w-auto border-red-500 text-red-400 hover:bg-red-600 hover:text-white">
                        <Trash2 className="h-4 w-4 mr-2" /> Delete
                      </Button>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>
      </section>

      <AppverseFooter />
    </main>
  )
}


