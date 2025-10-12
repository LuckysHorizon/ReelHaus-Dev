"use client"

import { useEffect, useRef } from "react"

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

  useEffect(() => {
    const el = videoRef.current
    if (!el) return

    const playVideo = async () => {
      try {
        await el.play()
      } catch (error) {
        console.warn("Autoplay blocked:", error)
      }
    }

    // Load and play immediately when component mounts
    el.src = src
    el.load()
    if (autoplay) playVideo()
  }, [src, autoplay])

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
