"use client"

import React from "react"
import { Card } from "@/components/ui/card"
import { ShinyButton } from "@/components/ui/shiny-button"

export function JoinCareersList() {
  const [items, setItems] = React.useState<Array<{ id: string; title: string; description: string | null; google_form_url: string }>>([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    let mounted = true
    fetch('/api/careers')
      .then((r) => r.json())
      .then((data) => {
        if (!mounted) return
        if (Array.isArray(data)) setItems(data)
      })
      .finally(() => mounted && setLoading(false))
    return () => { mounted = false }
  }, [])

  if (loading) return <p className="text-center text-gray-400">Loading opportunities...</p>
  if (!items.length) return <p className="text-center text-gray-400">No opportunities available right now. Please check back soon.</p>

  return (
    <div className="space-y-6">
      {items.map((item) => (
        <Card key={item.id} className="glass-border-enhanced p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h3 className="text-xl font-semibold text-red-400 mb-2">{item.title}</h3>
              {item.description ? (
                <p className="text-gray-300 text-sm max-w-3xl">{item.description}</p>
              ) : null}
            </div>
            <ShinyButton asChild className="w-full md:w-auto rounded-full">
              <a href={item.google_form_url} target="_blank" rel="noopener noreferrer">Apply via Google Form</a>
            </ShinyButton>
          </div>
        </Card>
      ))}
    </div>
  )
}


