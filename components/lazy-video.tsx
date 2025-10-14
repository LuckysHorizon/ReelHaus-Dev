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
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    const el = videoRef.current
    if (!el) return

    const playVideo = async () => {
      try {
        // Reduce autoplay on mobile to prevent flickering
        if (isMobile) {
          // Delay autoplay on mobile
          setTimeout(async () => {
            try {
              await el.play()
            } catch (error) {
              // Silently fail on mobile autoplay issues
            }
          }, 1000)
        } else {
          await el.play()
        }
      } catch (error) {
        // Silently fail on autoplay issues
      }
    }

    // Load and play immediately when component mounts
    el.src = src
    el.load()
    if (autoplay) playVideo()
  }, [src, autoplay, isMobile])

  return (
    <video
      ref={videoRef}
      className={className}
      muted={muted}
      loop={loop}
      playsInline={playsInline}
      controls={controls}
      preload="auto"
      poster={poster}
      aria-label={ariaLabel}
      {...props}
    >
      Your browser does not support the video tag.
    </video>
  )
}
