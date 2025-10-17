"use client"

import { Suspense, useEffect, useState } from "react"
import { SiteHeader } from "@/components/site-header"
import { AppverseFooter } from "@/components/appverse-footer"
import { Card } from "@/components/ui/card"
import { ShinyButton } from "@/components/ui/shiny-button"
import { CheckCircle2, Clock, CreditCard, Shield } from "lucide-react"
import { useSearchParams } from "next/navigation"

declare global {
  interface Window {
    Cashfree: any
  }
}

interface PaymentData {
  registration_id: string
  cashfree_order_id: string
  cashfree_payment_session_id: string
  cashfree_order_token: string
  amount: number
  currency: string
}

function PaymentPageInner() {
  const searchParams = useSearchParams()
  const registrationId = searchParams.get('registration_id')
  
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [processing, setProcessing] = useState(false)

  useEffect(() => {
    if (!registrationId) {
      setError('Invalid registration ID')
      setLoading(false)
      return
    }

    // Fetch payment data from API
    const fetchPaymentData = async () => {
      try {
        const response = await fetch(`/api/payments/${registrationId}`)
        if (response.ok) {
          const data = await response.json()
          setPaymentData(data)
        } else {
          const errorData = await response.json()
          setError(errorData.error || 'Failed to load payment details')
        }
      } catch (error) {
        setError('Network error. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    fetchPaymentData()
  }, [registrationId])

  const handlePayment = async () => {
    if (!paymentData) return

    setProcessing(true)

    try {
      // Load Cashfree script
      const script = document.createElement('script')
      script.src = 'https://sdk.cashfree.com/js/v3/cashfree.js'
      script.onload = () => {
        const cashfree = new window.Cashfree({
          mode: process.env.NEXT_PUBLIC_CASHFREE_ENVIRONMENT || 'sandbox'
        })
        
        const checkoutOptions = {
          paymentSessionId: paymentData.cashfree_payment_session_id,
          redirectTarget: "_self"
        }
        
        cashfree.checkout(checkoutOptions)
          .then((response: any) => {
            // Payment successful
            window.location.href = `/events/payment/success?payment_id=${response.cf_payment_id}&registration_id=${paymentData.registration_id}`
          })
          .catch((error: any) => {
            console.error('Payment failed:', error)
            setError('Payment failed. Please try again.')
            setProcessing(false)
          })
      }
      script.onerror = () => {
        setError('Failed to load payment gateway')
        setProcessing(false)
      }
      document.body.appendChild(script)
    } catch (error) {
      setError('Payment initialization failed')
      setProcessing(false)
    }
  }

  if (loading) {
    return (
      <main className="min-h-[100dvh] text-white">
        <SiteHeader />
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-md mx-auto text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
            <p className="text-gray-300">Loading payment details...</p>
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
            <div className="bg-red-900/20 border border-red-500 rounded-lg p-6 mb-6">
              <p className="text-red-400">{error}</p>
            </div>
            <ShinyButton asChild className="bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-400 hover:to-red-500">
              <a href="/events">Back to Events</a>
            </ShinyButton>
          </div>
        </div>
        <AppverseFooter />
      </main>
    )
  }

  return (
    <main className="min-h-[100dvh] text-white">
      <SiteHeader />
      
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-red-400 via-red-500 to-red-600 bg-clip-text text-transparent">
              Complete Your Payment
            </h1>
            <p className="text-gray-300">
              Secure your spot for this exclusive event
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Payment Summary */}
            <Card className="glass-border-enhanced p-6">
              <h2 className="text-xl font-semibold mb-4 text-red-400">Payment Summary</h2>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-300">Event Registration</span>
                  <span className="text-white">₹{paymentData?.amount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Processing Fee</span>
                  <span className="text-white">₹0</span>
                </div>
                <div className="border-t border-gray-700 pt-4">
                  <div className="flex justify-between text-lg font-semibold">
                    <span className="text-red-400">Total Amount</span>
                    <span className="text-red-400">₹{paymentData?.amount}</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Payment Security */}
            <Card className="glass-border-enhanced p-6">
              <h2 className="text-xl font-semibold mb-4 text-red-400">Secure Payment</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-red-400" />
                  <span className="text-gray-300">256-bit SSL encryption</span>
                </div>
                <div className="flex items-center gap-3">
                  <CreditCard className="h-5 w-5 text-red-400" />
                  <span className="text-gray-300">PCI DSS compliant</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-red-400" />
                  <span className="text-gray-300">Instant confirmation</span>
                </div>
                
              </div>
            </Card>
          </div>

          {/* Payment Button */}
          <div className="text-center mt-8">
            <ShinyButton
              onClick={handlePayment}
              disabled={processing}
              className="bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold px-8 py-4 hover:from-red-400 hover:to-red-500 disabled:opacity-50"
            >
              {processing ? 'Processing...' : `Pay ₹${paymentData?.amount}`}
            </ShinyButton>
            <p className="text-sm text-gray-400 mt-4">
              You will be redirected to Cashfree's secure payment page
            </p>
          </div>

          {/* Payment Methods */}
          <Card className="glass-border-enhanced p-6 mt-8">
            <h3 className="text-lg font-semibold mb-4 text-red-400">Accepted Payment Methods</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="bg-gray-800 rounded-lg p-3 mb-2">
                  <span className="text-sm font-medium">Credit Cards</span>
                </div>
              </div>
              <div className="text-center">
                <div className="bg-gray-800 rounded-lg p-3 mb-2">
                  <span className="text-sm font-medium">Debit Cards</span>
                </div>
              </div>
              <div className="text-center">
                <div className="bg-gray-800 rounded-lg p-3 mb-2">
                  <span className="text-sm font-medium">UPI</span>
                </div>
              </div>
              <div className="text-center">
                <div className="bg-gray-800 rounded-lg p-3 mb-2">
                  <span className="text-sm font-medium">Net Banking</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <AppverseFooter />
    </main>
  )
}

export default function PaymentPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-[100dvh] text-white">
          <SiteHeader />
          <div className="container mx-auto px-4 py-20">
            <div className="max-w-md mx-auto text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
              <p className="text-gray-300">Loading payment...</p>
            </div>
          </div>
          <AppverseFooter />
        </main>
      }
    >
      <PaymentPageInner />
    </Suspense>
  )
}
