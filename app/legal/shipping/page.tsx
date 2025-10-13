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

          <div className="space-y-6 text-neutral-200">
            <p>Since ReelHaus operates as a digital events platform, we do not deliver physical goods. However, we ensure prompt electronic delivery of your event confirmation and digital ticket.</p>

            <h2 className="text-2xl font-semibold text-white">1. Ticket Delivery</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>After successful payment, your QR-based e-ticket and confirmation email are automatically generated.</li>
              <li>Tickets can also be accessed under your account dashboard (if logged in).</li>
            </ul>

            <h2 className="text-2xl font-semibold text-white">2. Delivery Time</h2>
            <p>Typically, confirmation emails are sent within 1–3 minutes after successful payment.</p>

            <h2 className="text-2xl font-semibold text-white">3. Non-receipt of Ticket</h2>
            <p>If you do not receive your ticket within 15 minutes, contact <span className="text-red-400">support@reelhaus.club</span> with your payment reference number.</p>
          </div>
        </div>
      </section>

      <AppverseFooter />
    </main>
  )
}


