"use client"

import { useEffect, useState } from 'react'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  color?: 'red' | 'white' | 'gray'
  text?: string
}

export function LoadingSpinner({ size = 'md', color = 'red', text }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  }

  const colorClasses = {
    red: 'border-red-500',
    white: 'border-white',
    gray: 'border-gray-500'
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <div className={`animate-spin rounded-full border-2 border-t-transparent ${sizeClasses[size]} ${colorClasses[color]}`}></div>
      {text && (
        <p className={`mt-2 text-sm ${color === 'red' ? 'text-red-400' : color === 'white' ? 'text-white' : 'text-gray-400'}`}>
          {text}
        </p>
      )}
    </div>
  )
}

export function PageLoader() {
  const [dots, setDots] = useState('')

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.')
    }, 500)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-2 border-red-500 border-t-transparent mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-white mb-2">Loading ReelHaus</h2>
        <p className="text-gray-400">Please wait{dots}</p>
      </div>
    </div>
  )
}

export function SkeletonLoader({ className = '' }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-gray-800 rounded ${className}`}></div>
  )
}

export function EventCardSkeleton() {
  return (
    <div className="glass-border-enhanced rounded-xl overflow-hidden">
      <SkeletonLoader className="h-48 w-full" />
      <div className="p-6 space-y-3">
        <SkeletonLoader className="h-4 w-3/4" />
        <SkeletonLoader className="h-3 w-full" />
        <SkeletonLoader className="h-3 w-2/3" />
        <div className="flex justify-between items-center pt-4">
          <SkeletonLoader className="h-6 w-16" />
          <SkeletonLoader className="h-8 w-24" />
        </div>
      </div>
    </div>
  )
}
