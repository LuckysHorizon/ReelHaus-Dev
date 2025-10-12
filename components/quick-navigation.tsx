"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { 
  Home, 
  Calendar, 
  Users, 
  FileText, 
  Info, 
  UserPlus, 
  Settings,
  ArrowUp
} from 'lucide-react'

const quickNavItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/events', label: 'Events', icon: Calendar },
  { href: '/about', label: 'About', icon: Info },
  { href: '/team', label: 'Team', icon: Users },
  { href: '/join', label: 'Join', icon: UserPlus },
  { href: '/blog', label: 'Blog', icon: FileText },
]

export function QuickNavigation() {
  const [isVisible, setIsVisible] = useState(false)
  const [showScrollTop, setShowScrollTop] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop
      setIsVisible(scrollTop > 100)
      setShowScrollTop(scrollTop > 300)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (!isVisible) return null

  return (
    <>
      {/* Quick Navigation Bar */}
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
        <div className="glass-border-enhanced rounded-full px-4 py-2 flex items-center gap-2">
          {quickNavItems.map((item) => (
            <Button
              key={item.href}
              asChild
              size="sm"
              variant="ghost"
              className="text-gray-300 hover:text-red-400 hover:bg-red-500/20 rounded-full"
            >
              <Link href={item.href}>
                <item.icon className="h-4 w-4" />
                <span className="sr-only">{item.label}</span>
              </Link>
            </Button>
          ))}
        </div>
      </div>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <Button
          onClick={scrollToTop}
          className="fixed bottom-20 right-4 z-50 bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-400 hover:to-red-500 rounded-full w-12 h-12 shadow-lg"
          size="icon"
        >
          <ArrowUp className="h-5 w-5" />
        </Button>
      )}
    </>
  )
}

export function BreadcrumbNavigation({ items }: { items: Array<{ label: string; href?: string }> }) {
  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-400 mb-6">
      {items.map((item, index) => (
        <div key={index} className="flex items-center">
          {index > 0 && <span className="mx-2">/</span>}
          {item.href ? (
            <Link 
              href={item.href} 
              className="hover:text-red-400 transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-white">{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  )
}

export function ProgressIndicator({ current, total }: { current: number; total: number }) {
  const percentage = (current / total) * 100

  return (
    <div className="w-full bg-gray-800 rounded-full h-2 mb-6">
      <div 
        className="bg-gradient-to-r from-red-500 to-red-600 h-2 rounded-full transition-all duration-300"
        style={{ width: `${percentage}%` }}
      ></div>
    </div>
  )
}

export function SearchSuggestions({ 
  suggestions, 
  onSelect 
}: { 
  suggestions: string[]
  onSelect: (suggestion: string) => void 
}) {
  return (
    <div className="absolute top-full left-0 right-0 bg-gray-900 border border-gray-700 rounded-lg mt-1 z-50 max-h-60 overflow-y-auto">
      {suggestions.map((suggestion, index) => (
        <button
          key={index}
          onClick={() => onSelect(suggestion)}
          className="w-full text-left px-4 py-2 hover:bg-gray-800 text-gray-300 hover:text-white transition-colors"
        >
          {suggestion}
        </button>
      ))}
    </div>
  )
}
