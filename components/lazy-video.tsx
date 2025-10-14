"use client"

import { useEffect, useRef, useState } from "react"

interface LazyVideoProps {
  src: string
  className?: string
  poster?: string
  autoplay?: boolean
  loop?: boolean
  muted?: boolean
  controls?: boolean
  playsInline?: boolean
  "aria-label"?: string
}

export default function LazyVideo({
  src,
  className = "",
  poster,
  autoplay = true,
  loop = true,
  muted = true,
  controls = false,
  playsInline = true,
  "aria-label": ariaLabel,
  ...props
}: LazyVideoProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const el = videoRef.current
    if (!el) return

    let io: IntersectionObserver | null = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (!el) return

        // When approaching viewport, attach src and play
        if (entry.isIntersecting && !loaded) {
          el.src = src
          el.load()
          setLoaded(true)
          if (autoplay) {
            el.play().catch(() => {})
          }
        }

        // Pause when out of view to avoid jank on scroll
        if (!entry.isIntersecting && !el.paused) {
          try { el.pause() } catch {}
        }
      },
      { rootMargin: "200px 0px" }
    )

    io.observe(el)
    return () => {
      io && io.disconnect()
    }
  }, [src, autoplay, loaded])

  return (
    <video
      ref={videoRef}
      className={`transform-gpu will-change-transform backface-hidden ${className}`}
      muted={muted}
      loop={loop}
      playsInline={playsInline}
      controls={controls}
      preload="none"
      poster={poster}
      aria-label={ariaLabel}
      {...props}
    >
      Your browser does not support the video tag.
    </video>
  )
}
