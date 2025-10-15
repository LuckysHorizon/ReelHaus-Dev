"use client"

import React from "react"
import dynamic from "next/dynamic"

// Defer heavy, animation-rich sections to lower hydration/CPU on initial load
const DynamicEventHighlights = dynamic(() => import("@/components/event-highlights").then(m => m.EventHighlights), {
  ssr: false,
  loading: () => null,
})

const DynamicPricing = dynamic(() => import("@/components/pricing").then(m => m.Pricing), {
  ssr: false,
  loading: () => null,
})

export function HomeHeavySections() {
  return (
    <>
      <DynamicEventHighlights />
      <DynamicPricing />
    </>
  )
}


