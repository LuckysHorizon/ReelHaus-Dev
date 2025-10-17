"use client"

import { Suspense } from "react"
import { SiteHeader } from "@/components/site-header"
import { AppverseFooter } from "@/components/appverse-footer"
import { ShinyButton } from "@/components/ui/shiny-button"
import { CheckCircle2 } from "lucide-react"
import { useSearchParams } from "next/navigation"

function PaymentFailureInner() {
  const searchParams = useSearchParams()
  const reason = searchParams.get('reason')

  return (
    <main className="min-h-[100dvh] text-white">
      <SiteHeader />
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-md mx-auto text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-red-500 to-red-600 rounded-full mb-6">
            <CheckCircle2 className="h-10 w-10 text-white rotate-45 opacity-70" />
          </div>
          <h1 className="text-4xl font-bold mb-2 text-red-400">Payment Failed</h1>
          <p className="text-gray-300 mb-6">
            {reason === 'verification_failed' 
              ? 'Payment verification failed. Please contact support if money was deducted.'
              : reason === 'network_error'
              ? 'Network error occurred during payment verification. Please try again.'
              : 'Your payment could not be completed. If money was deducted, it will be auto-refunded by Cashfree.'
            }
          </p>
          <div className="space-x-4">
            <ShinyButton asChild>
              <a href="/events">Back to Events</a>
            </ShinyButton>
            <ShinyButton asChild variant="outline" className="border-red-400 text-red-400 hover:bg-red-400 hover:text-white">
              <a href="/">Back to Home</a>
            </ShinyButton>
          </div>
        </div>
      </div>
      <AppverseFooter />
    </main>
  )
}

export default function PaymentFailurePage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-[100dvh] text-white">
          <SiteHeader />
          <div className="container mx-auto px-4 py-20">
            <div className="max-w-md mx-auto text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
              <p className="text-gray-300">Loading...</p>
            </div>
          </div>
          <AppverseFooter />
        </main>
      }
    >
      <PaymentFailureInner />
    </Suspense>
  )
}
