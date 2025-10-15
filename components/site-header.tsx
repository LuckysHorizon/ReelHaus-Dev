"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ShinyButton } from "@/components/ui/shiny-button"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import Image from "next/image"
import { Menu, Briefcase, Tag, HelpCircle, FileText, Info, UserCog, LogOut } from "lucide-react"
import { getAdminToken, removeAdminToken } from "@/lib/admin-auth"

export function SiteHeader() {
  const [isAdmin, setIsAdmin] = useState(false)
  const [isHidden, setIsHidden] = useState(false)
  const [lastScrollY, setLastScrollY] = useState(0)

  useEffect(() => {
    const token = getAdminToken()
    setIsAdmin(!!token)
  }, [])

  useEffect(() => {
    let ticking = false
    const threshold = 16

    const onScroll = () => {
      const currentY = Math.max(0, window.scrollY || 0)

      if (!ticking) {
        window.requestAnimationFrame(() => {
          const isScrollingDown = currentY > lastScrollY
          const movedEnough = Math.abs(currentY - lastScrollY) > threshold
          if (movedEnough) {
            setIsHidden(isScrollingDown && currentY > 40)
            setLastScrollY(currentY)
          }
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [lastScrollY])

  const handleLogout = () => {
    removeAdminToken()
    setIsAdmin(false)
    window.location.href = '/'
  }

  const links = [
    { href: "/", label: "Home", icon: Briefcase },
    { href: "/about", label: "About Us", icon: Info },
    { href: "/team", label: "Team", icon: Briefcase },
    { href: "/join", label: "Join Us", icon: Tag },
    { href: "/admin/login", label: "Admin", icon: UserCog },
  ]

  const adminLinks = [
    { href: "/admin/dashboard", label: "Dashboard", icon: UserCog },
    { href: "/admin/events", label: "Events", icon: Briefcase },
    { href: "/admin/careers", label: "Careers", icon: FileText },
    { href: "/admin/registrations", label: "Registrations", icon: Tag },
  ]

  return (
    <header className={`sticky top-0 z-50 p-4 transition-transform duration-300 ease-out will-change-transform ${isHidden ? "-translate-y-full" : "translate-y-0"}`}>
      <div className="container mx-auto max-w-4xl">
        <div className="flex h-14 items-center justify-between px-6 liquid-glass-header rounded-full">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-1.5">
            <Image
              src="/icons/reelhaus-white.svg"
              alt="ReelHaus logo"
              width={20}
              height={20}
              className="h-5 w-5"
            />
            <span className="font-semibold tracking-wide text-white">ReelHaus</span>
          </Link>

          {/* Desktop Nav - Centered */}
          <nav className="hidden items-center gap-6 text-sm text-gray-300 md:flex absolute left-1/2 transform -translate-x-1/2">
            {isAdmin ? (
              <>
                {adminLinks.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    className="hover:text-red-300 transition-colors"
                  >
                    {l.label}
                  </Link>
                ))}
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  className="text-sm px-4 py-2 rounded-full border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                {links.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    className="hover:text-red-300 transition-colors"
                  >
                    {l.label}
                  </Link>
                ))}
              </>
            )}
          </nav>

          {/* Spacer for layout balance */}
          <div className="hidden md:block w-24"></div>

          {/* Mobile Nav */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <ShinyButton
                  variant="outline"
                  className="p-2"
                >
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Open menu</span>
                </ShinyButton>
              </SheetTrigger>
              <SheetContent
                side="right"
                aria-label="Navigation menu"
                className="liquid-glass border-gray-800 p-0 w-64 flex flex-col"
              >
                {/* Brand Header */}
                <div className="flex items-center gap-1.5 px-4 py-4 border-b border-gray-800">
                  <Image
                    src="/icons/reelhaus-white.svg"
                    alt="ReelHaus logo"
                    width={24}
                    height={24}
                    className="h-6 w-6"
                  />
                  <span className="font-semibold tracking-wide text-white text-lg">ReelHaus</span>
                </div>

                        {/* Nav Links */}
                        <nav className="flex flex-col gap-1 mt-2 text-gray-200">
                          {isAdmin ? (
                            <>
                              {adminLinks.map((l) => (
                                <Link
                                  key={l.href}
                                  href={l.href}
                                  className="flex items-center gap-3 px-4 py-3 hover:bg-gray-900 hover:text-red-300 transition-colors"
                                >
                                  <span className="inline-flex items-center justify-center w-5 h-5 text-gray-400">
                                    <l.icon className="h-4 w-4" />
                                  </span>
                                  <span className="text-sm">{l.label}</span>
                                </Link>
                              ))}
                              <button
                                onClick={handleLogout}
                                className="flex items-center gap-3 px-4 py-3 hover:bg-gray-900 hover:text-red-300 transition-colors text-left"
                              >
                                <span className="inline-flex items-center justify-center w-5 h-5 text-gray-400">
                                  <LogOut className="h-4 w-4" />
                                </span>
                                <span className="text-sm">Logout</span>
                              </button>
                            </>
                          ) : (
                            <>
                              {links.map((l) => (
                                <Link
                                  key={l.href}
                                  href={l.href}
                                  className="flex items-center gap-3 px-4 py-3 hover:bg-gray-900 hover:text-red-300 transition-colors"
                                >
                                  <span className="inline-flex items-center justify-center w-5 h-5 text-gray-400">
                                    <l.icon className="h-4 w-4" />
                                  </span>
                                  <span className="text-sm">{l.label}</span>
                                </Link>
                              ))}
                            </>
                          )}
                        </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}
