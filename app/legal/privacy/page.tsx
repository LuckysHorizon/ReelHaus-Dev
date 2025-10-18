import { SiteHeader } from "@/components/site-header"
import { AppverseFooter } from "@/components/appverse-footer"

export const metadata = {
  title: "Privacy Policy | ReelHaus",
  description: "How ReelHaus collects, uses, and protects user data.",
}

export default function PrivacyPage() {
  return (
    <main className="min-h-[100dvh] text-white">
      <SiteHeader />

      <section className="relative py-16 px-4">
        <div className="container mx-auto max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">Privacy Policy</h1>
          <p className="text-sm text-neutral-400 mb-10">Last Updated: October 2025</p>

          <div className="space-y-8 text-neutral-200">
            <p>
              Your privacy is important to us. This Privacy Policy explains how ReelHaus, the official digital platform of
              our college club for managing events, workshops, and conferences ("we," "our," or "us"), collects, uses, and
              safeguards your personal information.
            </p>

            <section className="space-y-3">
              <h2 className="text-2xl font-semibold text-white">1. Information We Collect</h2>
              <p>We collect only the information necessary to manage event participation and maintain platform security. This includes:</p>
              <ul className="list-disc list-inside space-y-2 text-neutral-300">
                <li>
                  <span className="text-white">Personal Information:</span> Your name, email address, phone number, roll number,
                  and college details submitted via registration forms.
                </li>
                <li>
                  <span className="text-white">Transaction Data:</span> Details related to event or conference registrations, payment
                  reference numbers, and Cashfree order IDs for verification.
                </li>
                <li>
                  <span className="text-white">Technical Data:</span> Browser type, device information, IP address, and limited analytics
                  cookies — used solely for improving the user experience and ensuring site performance.
                </li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-semibold text-white">2. How We Use Your Data</h2>
              <p>We use the collected data only for legitimate purposes related to college events and platform operations:</p>
              <ul className="list-disc list-inside space-y-2 text-neutral-300">
                <li>To process event, workshop, or conference registrations and payments.</li>
                <li>To send confirmation emails, QR-coded tickets, and event updates.</li>
                <li>To ensure transaction security, prevent fraudulent activity, and improve the website’s functionality.</li>
                <li>To comply with institutional and regulatory requirements for event management and payment reporting.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-semibold text-white">3. Data Sharing & Security</h2>
              <ul className="list-disc list-inside space-y-2 text-neutral-300">
                <li>We do not sell, rent, or trade your personal data with third parties.</li>
                <li>Payment information (such as card or UPI details) is not stored by ReelHaus. All payment processing is securely handled by Cashfree, a PCI DSS–compliant payment gateway.</li>
                <li>All communication between your browser and our platform is encrypted using HTTPS / TLS 1.2+ protocols.</li>
                <li>Data is stored securely in Supabase-managed databases with strict access controls and authentication policies.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-semibold text-white">4. Your Rights</h2>
              <p>You have the right to:</p>
              <ul className="list-disc list-inside space-y-2 text-neutral-300">
                <li>Request access to the personal information we hold about you.</li>
                <li>Correct inaccuracies in your data.</li>
                <li>Request deletion of your account and stored data, subject to institutional recordkeeping obligations.</li>
              </ul>
              <p>To exercise these rights, please contact us at <span className="text-red-400">privacy@reelhaus.club</span>.</p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-semibold text-white">5. Cookies</h2>
              <p>
                We use cookies for essential session management, analytics, and platform performance. You can disable cookies
                in your browser settings, but doing so may limit certain platform features.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-semibold text-white">6. Policy Updates</h2>
              <p>
                We may update this Privacy Policy periodically to reflect improvements or institutional changes. Any updates
                will be posted here with a revised “Last Updated” date.
              </p>
            </section>
          </div>
        </div>
      </section>

      <AppverseFooter />
    </main>
  )
}


