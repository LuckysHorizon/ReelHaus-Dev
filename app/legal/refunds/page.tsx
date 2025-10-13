import { SiteHeader } from "@/components/site-header"
import { AppverseFooter } from "@/components/appverse-footer"

export const metadata = {
  title: "Cancellation & Refunds | ReelHaus",
  description: "Policy describing cancellations and refunds for event registrations.",
}

export default function RefundsPage() {
  return (
    <main className="min-h-[100dvh] text-white">
      <SiteHeader />

      <section className="relative py-16 px-4">
        <div className="container mx-auto max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">Cancellation & Refund Policy</h1>
          <p className="text-sm text-neutral-400 mb-10">Last Updated: October 2025</p>

          <div className="space-y-6 text-neutral-200">
            <h2 className="text-2xl font-semibold text-white">1. Event Cancellations</h2>
            <p>
              If an event is cancelled by ReelHaus or the organizing club, registered users will receive a full refund within 7–10 working days through Razorpay to the original payment method.
            </p>

            <h2 className="text-2xl font-semibold text-white">2. User-Initiated Cancellations</h2>
            <p>
              Cancellations by users are not refundable once payment is processed, except in special cases (technical failure, double payment).
              Requests must be made within 24 hours of payment at <span className="text-red-400">refunds@reelhaus.club</span>.
            </p>

            <h2 className="text-2xl font-semibold text-white">3. Refund Process</h2>
            <p>Refunds are processed only via the same Razorpay payment reference used during registration. You will be notified via email when the refund is initiated.</p>

            <h2 className="text-2xl font-semibold text-white">4. Event Rescheduling</h2>
            <p>If an event is rescheduled, your existing registration remains valid. You can request a refund only if the new date is unsuitable.</p>
          </div>
        </div>
      </section>

      <AppverseFooter />
    </main>
  )
}


