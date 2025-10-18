import { SiteHeader } from "@/components/site-header"
import { AppverseFooter } from "@/components/appverse-footer"

export const metadata = {
  title: "Terms & Conditions | ReelHaus",
  description: "Terms and Conditions governing the use of the ReelHaus events platform.",
}

export default function TermsPage() {
  return (
    <main className="min-h-[100dvh] text-white">
      <SiteHeader />

      <section className="relative py-16 px-4">
        <div className="container mx-auto max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">Terms & Conditions</h1>
          <p className="text-sm text-neutral-400 mb-10">Last Updated: October 2025</p>

          <div className="space-y-8 text-neutral-200">
            <p>
              Welcome to ReelHaus, the official digital platform of our college club for hosting and managing campus-based
              events, workshops, and conferences (the “Platform”). By accessing or using this Platform, you agree to
              comply with and be bound by the following Terms and Conditions (“Terms”).
            </p>

            <section className="space-y-3">
              <h2 className="text-2xl font-semibold text-white">1. Purpose and Use of Platform</h2>
              <p>
                ReelHaus is an internal event management platform intended solely for legitimate, college-affiliated
                events, including cultural programs, workshops, and academic conferences. By using this Platform, you
                agree that:
              </p>
              <ul className="list-disc list-inside space-y-2 text-neutral-300">
                <li>You are a currently enrolled student, faculty member, or an invited participant authorized by the club.</li>
                <li>You will provide accurate and complete information during registration.</li>
                <li>You will not use the Platform for any commercial, fraudulent, or unlawful purpose.</li>
                <li>You will comply with all applicable college policies and codes of conduct when participating in any event or conference.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-semibold text-white">2. Event Registrations and Payments</h2>
              <ul className="list-disc list-inside space-y-2 text-neutral-300">
                <li>Event registrations and payments are processed through secure, RBI-compliant payment gateways (Cashfree).</li>
                <li>Upon successful payment, a confirmation email and a QR-coded digital pass will be sent to your registered email ID.</li>
                <li>ReelHaus does not store or have access to your card, UPI, or banking details. All transactions are securely handled by the respective payment processor.</li>
                <li>Registration fees, where applicable, are non-refundable unless an event, workshop, or conference is cancelled or rescheduled by the organizers.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-semibold text-white">3. Intellectual Property</h2>
              <p>
                All content on this Platform — including event names, conference materials, designs, graphics, photos, and
                digital assets — is the intellectual property of ReelHaus and/or the respective event organizers.
              </p>
              <p>You may not reproduce, modify, or distribute any materials without prior written permission from the club or its authorized representatives.</p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-semibold text-white">4. Event Participation and Liability</h2>
              <ul className="list-disc list-inside space-y-2 text-neutral-300">
                <li>ReelHaus functions solely as a digital facilitator for event, workshop, and conference registrations.</li>
                <li>The club and its volunteers take reasonable measures to ensure the safety and legitimacy of all activities. However, participation is voluntary and at your own risk.</li>
                <li>The Platform and its organizers shall not be held liable for any personal injury, loss, or damage arising out of attendance or participation in any listed event, workshop, or conference.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-semibold text-white">5. Modifications to Terms</h2>
              <p>
                ReelHaus reserves the right to update or modify these Terms at any time. Any changes will be reflected on
                this page with a revised “Last Updated” date. Continued use of the Platform after updates constitutes
                acceptance of the revised Terms.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-semibold text-white">6. Contact Us</h2>
              <p>For questions, clarifications, or concerns regarding these Terms, please contact us at:</p>
              <p className="text-white">📧 reelhaus.in@gmail.com</p>
            </section>
          </div>
        </div>
      </section>

      <AppverseFooter />
    </main>
  )
}

