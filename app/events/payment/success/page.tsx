"use client"

import { Suspense, useEffect, useState } from "react"
import { SiteHeader } from "@/components/site-header"
import { AppverseFooter } from "@/components/appverse-footer"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Download, Mail, QrCode, Calendar, MapPin } from "lucide-react"
import { useSearchParams } from "next/navigation"

function PaymentSuccessInner() {
  const searchParams = useSearchParams()
  const paymentId = searchParams.get('payment_id')
  const registrationId = searchParams.get('registration_id')
  
  const [registrationData, setRegistrationData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null)

  useEffect(() => {
    if (!paymentId || !registrationId) {
      setLoading(false)
      return
    }

    // Simulate fetching registration data
    setTimeout(() => {
      setRegistrationData({
        id: registrationId,
        event: {
          title: "Neon Nights",
          date: "2024-02-15",
          time: "21:00",
          venue: "Club Aurora"
        },
        name: "John Doe",
        email: "john@example.com",
        tickets: 2,
        amount: 3000
      })
      setQrCodeUrl("/placeholder.jpg") // In production, this would be the actual QR code URL
      setLoading(false)
    }, 2000)
  }, [paymentId, registrationId])

  const downloadQRCode = () => {
    if (qrCodeUrl) {
      const link = document.createElement('a')
      link.href = qrCodeUrl
      link.download = `reelhaus-ticket-${registrationId}.png`
      link.click()
    }
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
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-red-500 to-red-600 rounded-full mb-6">
              <CheckCircle2 className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-red-400 via-red-500 to-red-600 bg-clip-text text-transparent">
              Payment Successful!
            </h1>
            <p className="text-xl text-gray-300 mb-2">
              Your registration has been confirmed
            </p>
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
                    {registrationData?.event.title}
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 text-gray-300">
                      <Calendar className="h-4 w-4 text-red-400" />
                      <span>{new Date(registrationData?.event.date).toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric',
                        month: 'long', 
                        day: 'numeric' 
                      })}</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-300">
                      <MapPin className="h-4 w-4 text-red-400" />
                      <span>{registrationData?.event.venue}</span>
                    </div>
                  </div>
                </div>
                
                <div className="border-t border-gray-700 pt-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-300">Attendee</span>
                    <span className="text-white">{registrationData?.name}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-300">Tickets</span>
                    <span className="text-white">{registrationData?.tickets}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Amount Paid</span>
                    <span className="text-red-400 font-semibold">₹{registrationData?.amount}</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* QR Code */}
            <Card className="glass-border-enhanced p-6">
              <h2 className="text-xl font-semibold mb-4 text-red-400">Your Entry Pass</h2>
              <div className="text-center">
                {qrCodeUrl ? (
                  <div className="space-y-4">
                    <div className="bg-white p-4 rounded-lg inline-block">
                      <img 
                        src={qrCodeUrl} 
                        alt="Event QR Code"
                        className="w-48 h-48 mx-auto"
                      />
                    </div>
                    <p className="text-sm text-gray-400">
                      Show this QR code at the event entrance
                    </p>
                    <Button
                      onClick={downloadQRCode}
                      variant="outline"
                      className="border-red-400 text-red-400 hover:bg-red-400 hover:text-white"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download QR Code
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="bg-gray-800 rounded-lg p-8">
                      <QrCode className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                      <p className="text-gray-400">Generating your QR code...</p>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Next Steps */}
          <Card className="glass-border-enhanced p-6 mt-8">
            <h2 className="text-xl font-semibold mb-4 text-red-400">What's Next?</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="bg-red-500/20 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                  <Mail className="h-6 w-6 text-red-400" />
                </div>
                <h3 className="font-semibold text-white mb-2">Email Confirmation</h3>
                <p className="text-sm text-gray-400">
                  A confirmation email with your ticket details has been sent to {registrationData?.email}
                </p>
              </div>
              <div className="text-center">
                <div className="bg-red-500/20 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                  <QrCode className="h-6 w-6 text-red-400" />
                </div>
                <h3 className="font-semibold text-white mb-2">QR Code</h3>
                <p className="text-sm text-gray-400">
                  Your QR code is ready! Download it and keep it handy for event entry
                </p>
              </div>
              <div className="text-center">
                <div className="bg-red-500/20 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                  <Calendar className="h-6 w-6 text-red-400" />
                </div>
                <h3 className="font-semibold text-white mb-2">Event Day</h3>
                <p className="text-sm text-gray-400">
                  Arrive 30 minutes early and show your QR code at the entrance
                </p>
              </div>
            </div>
          </Card>

          {/* Action Buttons */}
          <div className="text-center mt-8 space-x-4">
            <Button asChild className="bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-400 hover:to-red-500">
              <a href="/events">Browse More Events</a>
            </Button>
            <Button asChild variant="outline" className="border-red-400 text-red-400 hover:bg-red-400 hover:text-white">
              <a href="/">Back to Home</a>
            </Button>
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
