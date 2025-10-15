"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import Image from "next/image"
import { Carousel, Card } from "@/components/ui/apple-cards-carousel"

type Highlight = {
  id: string
  title: string
  date: string
  imageUrl: string
}

const DEFAULT_HIGHLIGHTS: Highlight[] = [
  {
    id: "1",
    title: "DJ Night 2024",
    date: "Oct 28, 2024",
    imageUrl:
      "https://images.unsplash.com/photo-1704823629706-42716691a9ac?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop",
  },
  {
    id: "2",
    title: "Car Expo Showcase",
    date: "July 18, 2025",
    imageUrl:
      "https://images.unsplash.com/photo-1580274455191-1c62238fa333?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop",
  },
  {
    id: "3",
    title: "Traditional Day",
    date: "July 29, 2025",
    imageUrl:
      "https://media.istockphoto.com/id/2165337355/photo/people-enjoying-holi-outdoors.jpg?s=612x612&w=0&k=20&c=Qj4RP_Wj0xYwsntO6R4umL3bW8VDHeXHDvCsgL-SOOM=",
  },
  {
    id: "4",
    title: "Workshop Marathon",
    date: "Aug 12, 2025",
    imageUrl:
      "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "5",
    title: "Gaming Arena Finals",
    date: "Jul 27, 2025",
    imageUrl:
      "https://media.istockphoto.com/id/1407832935/photo/illuminated-interior-of-esports-cybercafe-with-video-game-competition-setup.jpg?s=612x612&w=0&k=20&c=txEhnrT9Jh-tuUoxX-ucMlxOyvJvjJJ6v3ReTxkGmCY=",
  },
]

export function EventHighlights({ highlights = DEFAULT_HIGHLIGHTS }: { highlights?: Highlight[] }) {
  const [current, setCurrent] = useState(0)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [visible, setVisible] = useState(false)
  const [isPaused, setIsPaused] = useState(false)

  // Fade-in on scroll
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) setVisible(true)
      },
      { threshold: 0.15 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  const total = highlights.length

  const goPrev = () => setCurrent((c) => (c - 1 + total) % total)
  const goNext = () => setCurrent((c) => (c + 1) % total)

  const positions = useMemo(() => {
    // Indices for left, center, right
    const left = (current - 1 + total) % total
    const right = (current + 1) % total
    return { left, center: current, right }
  }, [current, total])

  // Touch (swipe) support
  const touchStart = useRef<number | null>(null)
  const onTouchStart = (e: React.TouchEvent) => {
    setIsPaused(true)
    touchStart.current = e.touches[0].clientX
  }
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStart.current == null) return
    const delta = e.changedTouches[0].clientX - touchStart.current
    if (Math.abs(delta) > 40) {
      delta > 0 ? goPrev() : goNext()
    }
    touchStart.current = null
    setTimeout(() => setIsPaused(false), 400)
  }

  // Auto-scroll every 3s (paused while interacting)
  useEffect(() => {
    if (isPaused) return
    const id = setInterval(() => {
      setCurrent((c) => (c + 1) % total)
    }, 3000)
    return () => clearInterval(id)
  }, [isPaused, total])

  return (
    <section ref={containerRef} className="relative isolate py-16 sm:py-20 overflow-visible [content-visibility:auto]">
      {/* Heading */}
      <div className={`container mx-auto px-4 text-center transition-opacity duration-700 motion-reduce:transition-none ${visible ? "opacity-100" : "opacity-0 translate-y-2"}`}>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">
          <span className="text-red-500">Highlights</span> <span className="text-white">from Our Successful Events</span>
        </h2>
      </div>

      {/* Apple-like Cards Carousel */}
      <div className="w-full px-0 md:px-4 mt-8 overflow-hidden md:overflow-visible">
        {/* Lazy-mount carousel after first interaction/scroll to avoid jank on initial paint */}
        <LazyMount>
          <Carousel
          items={highlights.map((h, i) => (
            <Card
              key={h.id}
              card={{ category: "Event", title: `${h.title} · ${h.date}`, src: h.imageUrl }}
              index={i}
            />
          ))}
          />
        </LazyMount>
      </div>
    </section>
  )
}

function CardContent({ item }: { item: Highlight }) {
  return (
    <div className="group relative size-full rounded-2xl">
      {/* Background image */}
      <Image
        src={item.imageUrl}
        alt={item.title}
        fill
        priority={false}
        sizes="(max-width: 768px) 85vw, 340px"
        className="object-cover"
      />
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/30 to-black/70" />

      {/* Footer info */}
      <div className="absolute inset-x-0 bottom-0 p-5">
        <div className="rounded-2xl bg-black/30 backdrop-blur-md p-4 border border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
          <div className="text-xl font-bold text-white">{item.title}</div>
          <div className="text-sm text-gray-300 mt-1">{item.date}</div>
        </div>
      </div>

      {/* Hover lift */}
      <div className="absolute inset-0 rounded-2xl transition-transform duration-300 group-hover:-translate-y-1" />
    </div>
  )
}

function LazyMount({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)
  const triggered = useRef(false)

  useEffect(() => {
    const enable = () => {
      if (triggered.current) return
      triggered.current = true
      setMounted(true)
      window.removeEventListener('scroll', enable)
      window.removeEventListener('touchstart', enable)
      window.removeEventListener('keydown', enable)
    }
    // Mount on first interaction or scroll
    window.addEventListener('scroll', enable, { passive: true })
    window.addEventListener('touchstart', enable, { passive: true })
    window.addEventListener('keydown', enable)

    // Fallback timer in case there's no interaction but section is above the fold
    const t = setTimeout(() => enable(), 1200)

    return () => {
      clearTimeout(t)
      window.removeEventListener('scroll', enable)
      window.removeEventListener('touchstart', enable)
      window.removeEventListener('keydown', enable)
    }
  }, [])

  if (!mounted) return null
  return <>{children}</>
}


