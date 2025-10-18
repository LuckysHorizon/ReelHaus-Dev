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

          <div className="space-y-8 text-neutral-200">
            <p>
              This Cancellation & Refund Policy outlines how ReelHaus, the official college platform for student-run events,
              workshops, and conferences, manages cancellations and refunds. By registering for an event on our Platform,
              you agree to the following terms.
            </p>

            <section className="space-y-3">
              <h2 className="text-2xl font-semibold text-white">1. Event Cancellations</h2>
              <ul className="list-disc list-inside space-y-2 text-neutral-300">
                <li>If an event, workshop, or conference is cancelled by ReelHaus or the respective organizing club, all registered participants will receive a full refund of the registration fee.</li>
                <li>Refunds will be processed within 7–10 working days through Cashfree, directly to the original payment method used.</li>
                <li>No administrative or processing fee will be deducted for organizer-initiated cancellations.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-semibold text-white">2. User-Initiated Cancellations</h2>
              <p>Once a payment is successfully processed, user-initiated cancellations are non-refundable.</p>
              <p>Refunds may be considered only in exceptional circumstances, such as:</p>
              <ul className="list-disc list-inside space-y-2 text-neutral-300">
                <li>Duplicate or accidental payment.</li>
                <li>Technical error during the transaction that prevented registration.</li>
              </ul>
              <p>
                To request such exceptions, users must contact <span className="text-red-400">refunds@reelhaus.club</span> within 24 hours of the transaction,
                providing proof of payment and a short explanation.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-semibold text-white">3. Refund Process</h2>
              <ul className="list-disc list-inside space-y-2 text-neutral-300">
                <li>All approved refunds will be processed only through Cashfree, using the same payment reference ID used during registration.</li>
                <li>Refunds cannot be redirected to any other account or payment method.</li>
                <li>Users will receive an email confirmation once the refund is initiated, followed by a Cashfree notification when the transaction is completed.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-semibold text-white">4. Event Rescheduling</h2>
              <ul className="list-disc list-inside space-y-2 text-neutral-300">
                <li>If an event, workshop, or conference is rescheduled, all existing registrations will remain valid for the new date.</li>
                <li>If you are unable to attend on the revised schedule, you may request a refund via <span className="text-red-400">refunds@reelhaus.club</span> within 48 hours of the reschedule announcement.</li>
                <li>Standard refund timelines (7–10 working days) will apply once the request is approved.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-semibold text-white">5. Contact Us</h2>
              <p>For any refund or cancellation-related inquiries, please reach out to our support team:</p>
              <p className="text-white">📧 reelhaus.in@gmail.com</p>
            </section>
          </div>
        </div>
      </section>

      <AppverseFooter />
    </main>
  )
}


