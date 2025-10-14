"use client"

import Image from "next/image"
import React, { useEffect, useMemo, useRef, useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

type CardData = {
  category: string
  title: string
  src: string
  content?: React.ReactNode
}

export function Card({ card, index }: { card: CardData; index: number }) {
  return (
    <div
      data-index={index}
      className="relative select-none overflow-hidden rounded-3xl bg-black/40 border border-white/10 shadow-xl w-[36vw] h-[56vw] max-w-[260px] max-h-[380px] sm:w-[300px] sm:h-[420px] md:w-[320px] md:h-[440px]"
    >
      <Image
        src={card.src}
        alt={card.title}
        fill
        sizes="(max-width:768px) 36vw, 320px"
        className="object-cover"
        priority={false}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/30 to-black/70" />
      <div className="absolute top-4 left-4 text-[11px] tracking-wide uppercase text-white/80">
        {card.category}
      </div>
      <div className="absolute top-10 left-4 right-4 text-white font-extrabold text-base sm:text-xl leading-snug">
        {card.title}
      </div>
      {/* Optional rich content */}
    </div>
  )
}

export function Carousel({ items }: { items: React.ReactNode[] }) {
  const [current, setCurrent] = useState(0)
  const total = items.length
  const [paused, setPaused] = useState(false)
  const wrap = (n: number) => (n + total) % total

  const left = wrap(current - 1)
  const right = wrap(current + 1)

  useEffect(() => {
    if (paused) return
    const id = setInterval(() => setCurrent((c) => wrap(c + 1)), 5000) // slower auto-scroll for smooth feel
    return () => clearInterval(id)
  }, [paused, total])

  const startX = useRef<number | null>(null)

  return (
    <div
      className="relative mx-auto max-w-6xl"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={(e) => {
        startX.current = e.touches[0].clientX
        setPaused(true)
      }}
      onTouchEnd={(e) => {
        if (startX.current == null) return
        const dx = e.changedTouches[0].clientX - startX.current
        if (Math.abs(dx) > 40) setCurrent((c) => wrap(c + (dx < 0 ? 1 : -1)))
        startX.current = null
        setTimeout(() => setPaused(false), 300)
      }}
    >
      {/* arrows */}
      <button
        aria-label="Prev"
        className="hidden md:flex absolute left-2 top-1/2 -translate-y-1/2 z-20 h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
        onClick={() => setCurrent((c) => wrap(c - 1))}
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      <div className="flex items-center justify-center gap-2 md:gap-6">
        {[items[left], items[current], items[right]].map((node, i) => (
          <div
            key={i}
            className={[
              // smooth slow-mo transitions
              "transition-all duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform",
              // highlighted center vs shadowed sides
              i === 1
                ? "z-20 scale-110 opacity-100 drop-shadow-[0_12px_28px_rgba(0,0,0,0.35)]"
                : "z-10 opacity-70 scale-95 drop-shadow-[0_10px_22px_rgba(0,0,0,0.45)]",
              // desktop slants: left tilts left, right tilts right; mobile stays straight but scaled
              i === 0 ? "md:-rotate-[3deg] md:-translate-x-1" : "",
              i === 2 ? "md:rotate-[3deg] md:translate-x-1" : "",
            ].join(" ")}
          >
            {node}
          </div>
        ))}
      </div>

      <button
        aria-label="Next"
        className="hidden md:flex absolute right-2 top-1/2 -translate-y-1/2 z-20 h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
        onClick={() => setCurrent((c) => wrap(c + 1))}
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  )
}
