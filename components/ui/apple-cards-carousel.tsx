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
      className="relative select-none overflow-hidden rounded-3xl bg-black/40 shadow-lg transform-gpu will-change-transform backface-hidden w-[36vw] h-[52vw] max-w-[280px] max-h-[380px] sm:w-[300px] sm:h-[420px] md:w-[320px] md:h-[440px]"
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
      <div className="absolute top-10 left-4 right-4 text-white font-extrabold text-sm sm:text-xl leading-snug transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]">
        {card.title}
      </div>
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
    const id = setInterval(() => setCurrent((c) => wrap(c + 1)), 7000)
    return () => clearInterval(id)
  }, [paused, total])

  const startX = useRef<number | null>(null)

  const goPrev = () => setCurrent((c) => wrap(c - 1))
  const goNext = () => setCurrent((c) => wrap(c + 1))

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
      {/* Desktop arrows */}
      <button
        aria-label="Prev"
        className="hidden md:flex absolute left-2 top-1/2 -translate-y-1/2 z-20 h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
        onClick={goPrev}
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      <div className="flex items-center justify-center gap-1 md:gap-4">
        {[items[left], items[current], items[right]].map((node, i) => {
          const isCenter = i === 1
          return (
            <div
              key={i}
              className={[
                "group transition-[transform,opacity,filter] will-change-transform transform-gpu",
                "duration-[1400ms] ease-[cubic-bezier(0.25,1,0.5,1)]",
                isCenter
                  ? "z-20 scale-[1.08] md:scale-[1.1] opacity-100 shadow-[0_20px_60px_rgba(0,0,0,0.5)] md:hover:[transform:perspective(1000px)_rotateY(2deg)]"
                  : "z-10 opacity-60 scale-95 shadow-[0_10px_40px_rgba(0,0,0,0.4)]",
                !isCenter && i === 0
                  ? "-translate-x-[2.25rem] sm:-translate-x-[2.5rem] md:-translate-x-[1.5rem] -rotate-[8deg]"
                  : "",
                !isCenter && i === 2
                  ? "translate-x-[2.25rem] sm:translate-x-[2.5rem] md:translate-x-[1.5rem] rotate-[8deg]"
                  : "",
                isCenter ? "hover:shadow-[0_24px_72px_rgba(0,0,0,0.55)]" : "",
              ].join(" ")}
              style={{ transition: "transform 1.4s cubic-bezier(0.25, 1, 0.5, 1), opacity 1s ease-in-out 0.2s" }}
            >
              <div className={isCenter ? "[&_.title]:opacity-100 [&_.title]:translate-y-0" : "[&_.title]:opacity-60 [&_.title]:translate-y-[10px]"}>
                {node}
              </div>
            </div>
          )
        })}
      </div>

      <button
        aria-label="Next"
        className="hidden md:flex absolute right-2 top-1/2 -translate-y-1/2 z-20 h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
        onClick={goNext}
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  )
}
