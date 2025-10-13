import { SiteHeader } from "@/components/site-header"
import { AppverseFooter } from "@/components/appverse-footer"

export const metadata = {
  title: "Terms & Conditions | ReelHaus",
  description: "Rules governing use of the ReelHaus site and terms of sale.",
}

export default function TermsPage() {
  return (
    <main className="min-h-[100dvh] text-white">
      <SiteHeader />

      <section className="relative py-16 px-4">
        <div className="container mx-auto max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">Terms & Conditions</h1>
          <p className="text-sm text-neutral-400 mb-10">Last Updated: October 2025</p>

          <div className="space-y-6 text-neutral-200">
            <p>
              Welcome to ReelHaus — the official digital platform for club events, workshops, and cultural experiences.
              By accessing or using this website (the “Platform”), you agree to be bound by these Terms and Conditions.
            </p>

            <h2 className="text-2xl font-semibold text-white">1. Use of Platform</h2>
            <p>ReelHaus is designed for students and registered users to view, register, and pay for events hosted by the club. By using this site, you confirm that:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>You are at least 18 years old or using it with parental consent.</li>
              <li>All information you provide during registration is accurate and complete.</li>
              <li>You will not engage in fraudulent, abusive, or unlawful activity on the platform.</li>
            </ul>

            <h2 className="text-2xl font-semibold text-white">2. Event Registrations & Payments</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>All event registrations are processed through Razorpay using secure payment gateways.</li>
              <li>Once the payment is completed successfully, you’ll receive a confirmation email with a QR-based entry receipt.</li>
              <li>ReelHaus does not store any card or payment data; all transactions are handled securely by Razorpay.</li>
            </ul>

            <h2 className="text-2xl font-semibold text-white">3. Intellectual Property</h2>
            <p>
              All content on this website — including event materials, graphics, and logos — is owned or licensed by ReelHaus.
              You may not reproduce or distribute any content without prior written consent.
            </p>

            <h2 className="text-2xl font-semibold text-white">4. Limitation of Liability</h2>
            <p>
              ReelHaus acts as a digital facilitator for events and is not responsible for any loss, damage, or injury resulting from participation in events.
            </p>

            <h2 className="text-2xl font-semibold text-white">5. Modification of Terms</h2>
            <p>
              We may revise these Terms at any time. Updates will be posted on this page with an updated “Last Updated” date.
            </p>

            <h2 className="text-2xl font-semibold text-white">6. Contact</h2>
            <p>For any clarification, reach us at <span className="text-red-400">support@reelhaus.club</span>.</p>
          </div>
        </div>
      </section>

      <AppverseFooter />
    </main>
  )
}


