import { SiteHeader } from "@/components/site-header"
import { AppverseFooter } from "@/components/appverse-footer"

export const metadata = {
  title: "Shipping / Delivery | ReelHaus",
  description: "Electronic delivery of tickets and confirmations for events.",
}

export default function ShippingPage() {
  return (
    <main className="min-h-[100dvh] text-white">
      <SiteHeader />

      <section className="relative py-16 px-4">
        <div className="container mx-auto max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">Shipping / Delivery Policy</h1>
          <p className="text-sm text-neutral-400 mb-10">Last Updated: October 2025</p>

          <div className="space-y-8 text-neutral-200">
            <p>
              Since ReelHaus operates as a digital events platform for college-hosted events, workshops, and conferences,
              we do not deliver any physical goods. All event confirmations and passes are issued electronically upon
              successful registration and payment.
            </p>

            <section className="space-y-3">
              <h2 className="text-2xl font-semibold text-white">1. Digital Ticket Delivery</h2>
              <ul className="list-disc list-inside space-y-2 text-neutral-300">
                <li>Once your payment is successfully processed through our secure payment gateway (Cashfree), a confirmation email containing your digital event ticket and QR code is automatically generated and sent to your registered email address.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-semibold text-white">2. Delivery Time</h2>
              <ul className="list-disc list-inside space-y-2 text-neutral-300">
                <li>Digital confirmations and QR tickets are typically sent within 1–3 minutes of successful payment.</li>
                <li>Delivery times may occasionally vary due to network delays, email server latency, or payment gateway confirmation time.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-semibold text-white">3. Non-Receipt of Ticket</h2>
              <ul className="list-disc list-inside space-y-2 text-neutral-300">
                <li>Please check your spam or promotions folder if you do not see the email.</li>
                <li>If still not found after 15 minutes, contact <span className="text-red-400">support@reelhaus.club</span> with your payment reference number or transaction ID for quick assistance.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-semibold text-white">4. No Physical Shipping</h2>
              <p>
                ReelHaus does not ship or deliver any physical merchandise, certificates, or event materials. All
                participation materials (if applicable) are distributed digitally or provided in person during the event
                or conference on campus.
              </p>
            </section>
          </div>
        </div>
      </section>

      <AppverseFooter />
    </main>
  )
}


