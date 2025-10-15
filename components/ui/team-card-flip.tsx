"use client"

import React, { useState } from "react"

export function TeamCardFlip({ children }: { children: React.ReactNode }) {
  const [flipped, setFlipped] = useState(false)

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    // Prevent duplicate click after touch on mobile (iOS/Android)
    e.preventDefault()
    e.stopPropagation()
    setFlipped((prev) => !prev)
    // Minimal log to confirm which event fired in mobile debugging
    // console.log('FlipCard pointerup toggled:', !flipped)
  }

  return (
    <div
      className={[
        "relative w-full h-96 cursor-pointer transform-gpu transition-transform will-change-transform",
        "[transform-style:preserve-3d]",
        "[touch-action:manipulation]",
        "[transform:rotateY(0deg)] data-[flipped=true]:[transform:rotateY(180deg)]",
        "duration-500 md:duration-[1600ms] ease-out md:ease-[cubic-bezier(0.25,1,0.5,1)]",
        "md:group-hover:rotate-y-180",
        "motion-reduce:transition-none",
      ].join(" ")}
      style={{ transformStyle: 'preserve-3d' as any, WebkitTransformStyle: 'preserve-3d' as any, touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent' as any, pointerEvents: 'auto' }}
      onPointerUp={handlePointerUp}
      onClick={(e) => e.preventDefault()}
      data-flipped={flipped ? "true" : "false"}
      role="button"
      aria-pressed={flipped}
    >
      {children}
    </div>
  )
}


