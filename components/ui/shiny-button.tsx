"use client"

import React, { useEffect, useState } from "react"
import { motion, type MotionProps } from "motion/react"
import { Slot } from "@radix-ui/react-slot"

import { cn } from "@/lib/utils"

const animationProps: MotionProps = {
  initial: { "--x": "100%", scale: 0.8 },
  animate: { "--x": "-100%", scale: 1 },
  whileTap: { scale: 0.95 },
  transition: {
    repeat: Infinity,
    repeatType: "loop",
    repeatDelay: 3,
    type: "tween",
    duration: 2,
    ease: "easeInOut",
    scale: {
      type: "spring",
      stiffness: 200,
      damping: 5,
      mass: 0.5,
    },
  },
}

interface ShinyButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof MotionProps>,
    MotionProps {
  children: React.ReactNode
  className?: string
  variant?: "default" | "outline"
  asChild?: boolean
}

export const ShinyButton = React.forwardRef<
  HTMLButtonElement,
  ShinyButtonProps
>(({ children, className, variant = "default", asChild = false, ...props }, ref) => {
  const [isMobile, setIsMobile] = useState(false)
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const baseClasses = "relative cursor-pointer rounded-lg px-6 py-2 font-medium backdrop-blur-xl transition-all duration-300 ease-in-out"
  
  const variantClasses = {
    default: "bg-black text-white border border-white/20 hover:bg-white hover:text-black hover:border-black",
    outline: "bg-transparent text-white border border-white/40 hover:bg-white hover:text-black hover:border-white"
  }

  const Comp = asChild ? Slot : motion.button
  
  // Use reduced animations on mobile
  const mobileAnimationProps = isMobile ? {
    initial: { "--x": "100%", scale: 0.8 },
    animate: { "--x": "-100%", scale: 1 },
    whileTap: { scale: 0.95 },
    transition: {
      repeat: Infinity,
      repeatType: "loop",
      repeatDelay: 5,
      type: "tween",
      duration: 3,
      ease: "easeInOut",
    },
  } : animationProps

  return (
    <Comp
      ref={ref}
      className={cn(
        baseClasses,
        variantClasses[variant],
        "hover:shadow-[0_0_20px_rgba(255,255,255,0.3)]",
        className
      )}
      {...(asChild ? {} : mobileAnimationProps)}
      {...props}
    >
      {asChild ? (
        children
      ) : (
        <>
          <span
            className="relative block size-full text-sm tracking-wide font-semibold"
            style={{
              maskImage:
                "linear-gradient(-75deg,white calc(var(--x) + 20%),transparent calc(var(--x) + 30%),white calc(var(--x) + 100%))",
            }}
          >
            {children}
          </span>
          <span
            style={{
              mask: "linear-gradient(rgb(0,0,0), rgb(0,0,0)) content-box exclude,linear-gradient(rgb(0,0,0), rgb(0,0,0))",
              WebkitMask:
                "linear-gradient(rgb(0,0,0), rgb(0,0,0)) content-box exclude,linear-gradient(rgb(0,0,0), rgb(0,0,0))",
              backgroundImage:
                "linear-gradient(-75deg,rgba(255,255,255,0.1) calc(var(--x)+20%),rgba(255,255,255,0.5) calc(var(--x)+25%),rgba(255,255,255,0.1) calc(var(--x)+100%))",
            }}
            className="absolute inset-0 z-10 block rounded-[inherit] p-px"
          />
        </>
      )}
    </Comp>
  )
})

ShinyButton.displayName = "ShinyButton"
