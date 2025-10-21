"use client"

import { Suspense, useEffect, useState } from "react"
import { SiteHeader } from "@/components/site-header"
import { AppverseFooter } from "@/components/appverse-footer"
import { useSearchParams, useRouter } from "next/navigation"

function PaymentVerificationInner() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const registrationId = searchParams?.get('registration_id')
  const paymentId = searchParams?.get('payment_id')
  
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const verifyPayment = async () => {
      if (!registrationId) {
        setError('Missing registration ID')
        setLoading(false)
        return
      }

      try {
        // Wait a moment for webhook to process (if it hasn't already)
        await new Promise(resolve => setTimeout(resolve, 2000))

        // Check payment status from database (webhook should have updated this)
        const paymentResponse = await fetch(`/api/payments/${registrationId}`)
        if (!paymentResponse.ok) {
          throw new Error('Failed to fetch payment details')
        }
        
        const paymentData = await paymentResponse.json()
        
        // Check registration status
        const registrationResponse = await fetch(`/api/registrations/${registrationId}`)
        if (!registrationResponse.ok) {
          throw new Error('Failed to fetch registration details')
        }
        
        const registrationData = await registrationResponse.json()
        
        console.log('Payment verification data:', {
          payment: paymentData,
          registration: registrationData
        })

        // Check if payment is successful based on database status
        if (registrationData.status === 'paid' && paymentData.cashfree_order_id) {
          // Payment successful - redirect to success page
          router.push(`/events/payment/success?status=success&payment_id=${paymentId}&registration_id=${registrationId}`)
        } else if (registrationData.status === 'payment_initiated') {
          // Payment still processing - wait a bit more and retry
          console.log('Payment still processing, waiting for webhook...')
          setTimeout(() => {
            window.location.reload() // Reload to check again
          }, 3000)
        } else {
          // Payment failed or other status - redirect to failure page
          const reason = encodeURIComponent('payment_not_successful')
          router.push(`/events/payment/failure?status=failure&reason=${reason}&payment_id=${paymentId}&registration_id=${registrationId}`)
        }
      } catch (error) {
        console.error('Payment verification error:', error)
        const reason = encodeURIComponent('verification_failed')
        router.push(`/events/payment/failure?status=failure&reason=${reason}&registration_id=${registrationId}`)
      }
    }

    verifyPayment()
  }, [registrationId, paymentId, router])

  if (loading) {
    return (
      <main className="min-h-[100dvh] text-white">
        <SiteHeader />
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-md mx-auto text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
            <h1 className="text-2xl font-bold mb-2">Verifying Payment</h1>
            <p className="text-gray-300">Please wait while we verify your payment status...</p>
          </div>
        </div>
        <AppverseFooter />
      </main>
    )
  }

  if (error) {
    return (
      <main className="min-h-[100dvh] text-white">
        <SiteHeader />
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-md mx-auto text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-red-500 to-red-600 rounded-full mb-6">
              <svg className="h-10 w-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h1 className="text-4xl font-bold mb-2 text-red-400">Verification Error</h1>
            <p className="text-gray-300 mb-6">{error}</p>
            <div className="space-x-4">
              <button 
                onClick={() => window.location.href = '/events'}
                className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Back to Events
              </button>
            </div>
          </div>
        </div>
        <AppverseFooter />
      </main>
    )
  }

  return null
}

export default function PaymentVerificationPage() {
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
      <PaymentVerificationInner />
    </Suspense>
  )
}
