"use client"

import { useEffect, useRef, useState } from "react"

interface LazyVideoProps {
  src: string
  mobileSrc?: string
  type?: string
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
  mobileSrc,
  type = 'video/mp4',
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
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  const lastScrollY = useRef(0)
  const rafPending = useRef(false)

  useEffect(() => {
    const el = videoRef.current
    if (!el) return

    let io: IntersectionObserver | null = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (!el) return

        // When approaching viewport, attach src and play
        if (entry.isIntersecting && !loaded) {
          const isSmall = typeof window !== 'undefined' && window.innerWidth <= 768
          const chosen = isSmall && mobileSrc ? mobileSrc : src
          // Prefer <source> for codec negotiation
          let s = el.querySelector('source') as HTMLSourceElement | null
          if (!s) {
            s = document.createElement('source')
            el.appendChild(s)
          }
          s.setAttribute('type', type)
          s.setAttribute('src', chosen)
          el.load()
          setLoaded(true)
          if (autoplay && !prefersReducedMotion) {
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
  }, [src, mobileSrc, type, autoplay, loaded, prefersReducedMotion])

  // Pause when tab is hidden to reduce decode/render on low-end devices
  useEffect(() => {
    const el = videoRef.current
    if (!el) return
    const handler = () => { try { document.hidden ? el.pause() : (autoplay && el.play().catch(() => {})) } catch {} }
    document.addEventListener('visibilitychange', handler, { passive: true } as any)
    return () => document.removeEventListener('visibilitychange', handler as any)
  }, [autoplay])

  // Throttle playback during fast scrolls (stabilizes on high-Hz devices)
  useEffect(() => {
    const el = videoRef.current
    if (!el) return
    const onScroll = () => {
      if (rafPending.current) return
      rafPending.current = true
      requestAnimationFrame(() => {
        const y = window.scrollY || 0
        const speed = Math.abs(y - lastScrollY.current)
        if (speed > 40) {
          try { el.pause() } catch {}
        } else if (!prefersReducedMotion) {
          if (autoplay) el.play().catch(() => {})
        }
        lastScrollY.current = y
        rafPending.current = false
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [autoplay, prefersReducedMotion])

  // Respect reduced motion and disable autoplay if requested
  useEffect(() => {
    if (typeof window === 'undefined') return
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const apply = () => setPrefersReducedMotion(!!mq.matches)
    apply()
    mq.addEventListener?.('change', apply)
    return () => mq.removeEventListener?.('change', apply)
  }, [])

  return (
    <div className={`rv-container ${className}`} style={{ isolation: 'isolate' }}>
      <video
        ref={videoRef}
        className="gpu-video will-change-transform backface-hidden"
        muted={muted}
        loop={loop}
        playsInline={playsInline}
        controls={controls}
        preload="none"
        poster={poster}
        aria-label={ariaLabel}
        disablePictureInPicture
        // Disable autoplay when user prefers reduced motion
        {...(prefersReducedMotion ? { autoPlay: false } : {})}
        {...props}
      >
        Your browser does not support the video tag.
      </video>
    </div>
  )
}
