"use client"

import { Suspense, useEffect, useState } from "react"
import { SiteHeader } from "@/components/site-header"
import { AppverseFooter } from "@/components/appverse-footer"
import { Card } from "@/components/ui/card"
import { ShinyButton } from "@/components/ui/shiny-button"
import { CheckCircle2, Mail, Calendar, MapPin, Clock } from "lucide-react"
import { useSearchParams } from "next/navigation"

function PaymentSuccessInner() {
  const searchParams = useSearchParams()
  const paymentId = searchParams.get('payment_id')
  const registrationId = searchParams.get('registration_id')
  const status = searchParams.get('status')
  const pendingVerification = searchParams.get('pending_verification')
  
  const [registrationData, setRegistrationData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [retryCount, setRetryCount] = useState(0)
  

  useEffect(() => {
    if (!paymentId || !registrationId) {
      setLoading(false)
      return
    }

    // Fetch registration data from API
    const fetchRegistrationData = async () => {
      try {
        console.log(`Fetching registration data for ID: ${registrationId}`)
        const response = await fetch(`/api/registrations/${registrationId}`)
        if (response.ok) {
          const data = await response.json()
          console.log('Registration data received:', data)
          setRegistrationData(data)
        } else {
          const errorData = await response.json().catch(() => ({}))
          console.error('Failed to fetch registration data:', errorData)
          
          // If verification is pending, retry a few times
          if (pendingVerification && retryCount < 5) {
            console.log(`Retrying fetch (attempt ${retryCount + 1}/5)...`)
            setTimeout(() => {
              setRetryCount(prev => prev + 1)
              fetchRegistrationData()
            }, 2000) // Wait 2 seconds before retry
            return
          }
        }
      } catch (error) {
        console.error('Error fetching registration data:', error)
        
        // If verification is pending, retry a few times
        if (pendingVerification && retryCount < 5) {
          console.log(`Retrying fetch after error (attempt ${retryCount + 1}/5)...`)
          setTimeout(() => {
            setRetryCount(prev => prev + 1)
            fetchRegistrationData()
          }, 2000)
          return
        }
      } finally {
        if (!pendingVerification || retryCount >= 5) {
          setLoading(false)
        }
      }
    }

    fetchRegistrationData()
  }, [paymentId, registrationId])

  

  if (status === 'failure') {
    return (
      <main className="min-h-[100dvh] text-white">
        <SiteHeader />
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-md mx-auto text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-red-500 to-red-600 rounded-full mb-6">
              <CheckCircle2 className="h-10 w-10 text-white rotate-45 opacity-70" />
            </div>
            <h1 className="text-4xl font-bold mb-2 text-red-400">Payment Failed</h1>
            <p className="text-gray-300 mb-6">Your payment could not be verified. If money was deducted, it will be auto-refunded by Cashfree.</p>
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

  if (loading) {
    return (
      <main className="min-h-[100dvh] text-white">
        <SiteHeader />
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-md mx-auto text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
            <p className="text-gray-300">Confirming your payment...</p>
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
        <div className="max-w-4xl mx-auto">
          {/* Success Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 md:w-24 md:h-24 rounded-full mb-6 bg-green-600/90 shadow-[0_8px_40px_rgba(16,185,129,0.25)]">
              <CheckCircle2 className="h-10 w-10 md:h-12 md:w-12 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-green-500">
              Payment Successful
            </h1>
            <p className="text-xl text-gray-300 mb-2">Thank you for registering.</p>
            {pendingVerification ? (
              <p className="text-lg text-yellow-400 font-semibold mb-2">
                Payment verification is in progress. Please wait...
              </p>
            ) : (
              <p className="text-lg text-green-400 font-semibold mb-2">Please check your email for details.</p>
            )}
            <p className="text-gray-400">
              Payment ID: {paymentId}
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Event Details */}
            <Card className="glass-border-enhanced p-6">
              <h2 className="text-xl font-semibold mb-4 text-red-400">Event Details</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {registrationData?.event?.title || 'Event Details Loading...'}
                  </h3>
                  {registrationData?.event ? (
                    <div className="space-y-2">
                      <div className="flex items-center gap-3 text-gray-300">
                        <Calendar className="h-4 w-4 text-red-400" />
                        <span>{new Date(registrationData.event.start_datetime).toLocaleDateString('en-US', { 
                          weekday: 'long', 
                          year: 'numeric',
                          month: 'long', 
                          day: 'numeric' 
                        })}</span>
                      </div>
                      <div className="flex items-center gap-3 text-gray-300">
                        <Clock className="h-4 w-4 text-red-400" />
                        <span>{new Date(registrationData.event.start_datetime).toLocaleTimeString('en-US', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })} - {new Date(registrationData.event.end_datetime).toLocaleTimeString('en-US', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex items-center gap-3 text-gray-300">
                        <Calendar className="h-4 w-4 text-red-400" />
                        <span>Loading event details...</span>
                      </div>
                      <div className="flex items-center gap-3 text-gray-300">
                        <Clock className="h-4 w-4 text-red-400" />
                        <span>Please wait...</span>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="border-t border-gray-700 pt-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-300">Attendee</span>
                    <span className="text-white">{registrationData?.name || 'Loading...'}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-300">Tickets</span>
                    <span className="text-white">{registrationData?.tickets || 'Loading...'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Amount Paid</span>
                    <span className="text-red-400 font-semibold">
                      {registrationData?.event ? 
                        `₹${((registrationData.event.price_cents || 0) * (registrationData.tickets || 1) / 100).toLocaleString('en-IN')}` : 
                        'Loading...'
                      }
                    </span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Info Card */}
            <Card className="glass-border-enhanced p-6">
              <h2 className="text-xl font-semibold mb-4 text-red-400">Next Steps</h2>
              <p className="text-sm text-gray-300">
                We’ve emailed your registration confirmation. Please keep the email handy on event day.
              </p>
            </Card>
          </div>

          {/* Next Steps */}
          <Card className="glass-border-enhanced p-6 mt-8">
            <h2 className="text-xl font-semibold mb-4 text-red-400">What's Next?</h2>
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="text-center px-2">
                <div className="bg-red-500/15 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                  <Mail className="h-6 w-6 text-red-400" />
                </div>
                <h3 className="font-semibold text-white mb-2">Email Confirmation</h3>
                <p className="text-sm text-gray-400 max-w-xs mx-auto">
                  A confirmation email with your ticket details has been sent to {registrationData?.email || 'your registered email'}
                </p>
              </div>
              <div className="text-center px-2">
                <div className="bg-red-500/15 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                  <Calendar className="h-6 w-6 text-red-400" />
                </div>
                <h3 className="font-semibold text-white mb-2">Event Day</h3>
                <p className="text-sm text-gray-400 max-w-xs mx-auto">
                  Arrive 30 minutes early and keep your email confirmation accessible
                </p>
              </div>
            </div>
          </Card>

          {/* Action Buttons */}
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
            <ShinyButton asChild className="bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-400 hover:to-red-500 w-[82%] sm:w-auto max-w-xs rounded-full py-3 text-sm md:py-4 md:text-base">
              <a href="/events">Browse More Events</a>
            </ShinyButton>
            <ShinyButton asChild variant="outline" className="border-red-400 text-red-400 hover:bg-red-400 hover:text-white w-[82%] sm:w-auto max-w-xs rounded-full py-3 text-sm md:py-4 md:text-base">
              <a href="/">Back to Home</a>
            </ShinyButton>
          </div>
        </div>
      </div>

      <AppverseFooter />
    </main>
  )
}

export default function PaymentSuccessPage() {
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
      <PaymentSuccessInner />
    </Suspense>
  )
}
