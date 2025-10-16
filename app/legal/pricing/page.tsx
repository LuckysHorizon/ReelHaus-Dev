import { SiteHeader } from "@/components/site-header"
import { AppverseFooter } from "@/components/appverse-footer"

export const metadata = {
  title: "Pricing / Product Details | ReelHaus",
  description: "What we sell and how much it costs, including taxes.",
}

export default function PricingPage() {
  return (
    <main className="min-h-[100dvh] text-white">
      <SiteHeader />

      <section className="relative py-16 px-4">
        <div className="container mx-auto max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">Pricing / Product Details</h1>
          <p className="text-sm text-neutral-400 mb-10">Last Updated: October 2025</p>

          <div className="space-y-8 text-neutral-200">
            <p>
              ReelHaus manages and hosts event registrations for clubs, communities, and professional gatherings. All
              prices listed on the platform are in Indian Rupees (INR ₹) and include applicable taxes unless stated otherwise.
            </p>

            <h2 className="text-2xl font-semibold text-white">1. Pricing Structure</h2>
            <ul className="list-disc list-inside space-y-2 text-neutral-300">
              <li>Each event has its own ticket price as defined by the organizer.</li>
              <li>The price displayed during registration is final. There are no hidden charges — payment gateway fees are included in the shown amount.</li>
            </ul>

            <h2 className="text-2xl font-semibold text-white">2. Event Details</h2>
            <p>Each event page provides clear and transparent information, including:</p>
            <ul className="list-disc list-inside space-y-2 text-neutral-300">
              <li>Event title, date, time, and venue.</li>
              <li>Ticket price and seat availability.</li>
              <li>Description and participation rules.</li>
            </ul>

            <h2 className="text-2xl font-semibold text-white">3. Invoices</h2>
            <p>Digital invoices are automatically generated and sent to the registrant via email after payment.</p>

            <h3 className="text-xl font-semibold text-white">Business Classification for Payment Processing</h3>
            <p className="text-neutral-300">
              ReelHaus operates under Professional Services → Event Management Services or Business Services → Event Promotion / Marketing,
              with no involvement in adult content, gambling, or other restricted categories.
            </p>
          </div>
        </div>
      </section>

      <AppverseFooter />
    </main>
  )
}


