"use client"

import React, { useEffect, useRef, useState } from "react"
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
      <LazySection>
        <DynamicEventHighlights />
      </LazySection>
      <LazySection>
        <DynamicPricing />
      </LazySection>
    </>
  )
}

function LazySection({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)
  const ref = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!ref.current) return
    const el = ref.current
    let io: IntersectionObserver | null = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setMounted(true)
        io && io.disconnect()
      }
    }, { rootMargin: "200px 0px" })
    io.observe(el)
    return () => io && io.disconnect()
  }, [])

  return <div ref={ref}>{mounted ? children : null}</div>
}


