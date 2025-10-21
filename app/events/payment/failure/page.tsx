"use client"

import { Suspense } from "react"
import { SiteHeader } from "@/components/site-header"
import { AppverseFooter } from "@/components/appverse-footer"
import { ShinyButton } from "@/components/ui/shiny-button"
import { CheckCircle2 } from "lucide-react"
import { useSearchParams } from "next/navigation"

function PaymentFailureInner() {
  const searchParams = useSearchParams()
  const reason = searchParams?.get('reason')
  const status = searchParams?.get('status')
  const paymentId = searchParams?.get('payment_id')
  const registrationId = searchParams?.get('registration_id')

  const getFailureMessage = () => {
    switch (reason) {
      case 'payment_failed':
        return 'Your payment was not successful. Please try again with a different payment method.'
      case 'payment_pending':
        return 'Your payment is still being processed. Please wait a few minutes and check your email for updates.'
      case 'verification_failed':
        return 'Payment verification failed. Please contact support if money was deducted from your account.'
      case 'network_error':
        return 'Network error occurred during payment verification. Please try again.'
      case 'payment_cancelled':
        return 'Payment was cancelled. You can try again with a different payment method.'
      case 'payment_expired':
        return 'Payment session expired. Please initiate a new payment.'
      default:
        return 'Your payment could not be completed. If money was deducted, it will be auto-refunded by Cashfree.'
    }
  }

  const getTitle = () => {
    if (status === 'pending') {
      return 'Payment Pending'
    }
    return 'Payment Failed'
  }

  const getIconColor = () => {
    if (status === 'pending') {
      return 'from-yellow-500 to-yellow-600'
    }
    return 'from-red-500 to-red-600'
  }

  const getTitleColor = () => {
    if (status === 'pending') {
      return 'text-yellow-400'
    }
    return 'text-red-400'
  }

  return (
    <main className="min-h-[100dvh] text-white">
      <SiteHeader />
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-md mx-auto text-center">
          <div className={`inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r ${getIconColor()} rounded-full mb-6`}>
            <CheckCircle2 className="h-10 w-10 text-white rotate-45 opacity-70" />
          </div>
          <h1 className={`text-4xl font-bold mb-2 ${getTitleColor()}`}>{getTitle()}</h1>
          <p className="text-gray-300 mb-6">
            {getFailureMessage()}
          </p>
          
          {/* Show additional info if available */}
          {(paymentId || registrationId) && (
            <div className="bg-gray-800/50 rounded-lg p-4 mb-6 text-left">
              <h3 className="text-sm font-semibold text-gray-400 mb-2">Transaction Details:</h3>
              {paymentId && <p className="text-xs text-gray-300">Payment ID: {paymentId}</p>}
              {registrationId && <p className="text-xs text-gray-300">Registration ID: {registrationId}</p>}
            </div>
          )}
          
          <div className="space-x-4">
            <ShinyButton asChild>
              <a href="/events">Back to Events</a>
            </ShinyButton>
            <ShinyButton asChild variant="outline" className={`border-${status === 'pending' ? 'yellow' : 'red'}-400 text-${status === 'pending' ? 'yellow' : 'red'}-400 hover:bg-${status === 'pending' ? 'yellow' : 'red'}-400 hover:text-white`}>
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
