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

          <div className="space-y-6 text-neutral-200">
            <p>Your privacy is important to us. This policy describes how ReelHaus collects, uses, and protects your data.</p>

            <h2 className="text-2xl font-semibold text-white">1. Information We Collect</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Personal Information: name, email, phone number, roll number, and college details (via registration form).</li>
              <li>Transaction Data: event registrations, payment reference IDs, and Razorpay order IDs.</li>
              <li>Technical Data: browser type, device info, and analytics cookies (for usage insights).</li>
            </ul>

            <h2 className="text-2xl font-semibold text-white">2. How We Use Your Data</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Process event registrations and payments.</li>
              <li>Send payment confirmations, QR tickets, and event updates.</li>
              <li>Improve the platform experience and detect fraud.</li>
            </ul>

            <h2 className="text-2xl font-semibold text-white">3. Sharing & Security</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>We do not sell or rent user data.</li>
              <li>Payment information is handled exclusively by Razorpay.</li>
              <li>All communication is encrypted (HTTPS/TLS 1.2+).</li>
              <li>Stored data is protected by Supabase-managed databases and access controls.</li>
            </ul>

            <h2 className="text-2xl font-semibold text-white">4. Your Rights</h2>
            <p>
              You can request to access or correct your data, or delete your account and stored personal data.
              Contact us at <span className="text-red-400">privacy@reelhaus.club</span> for assistance.
            </p>

            <h2 className="text-2xl font-semibold text-white">5. Cookies</h2>
            <p>We use cookies for session management and analytics. You may disable cookies in your browser settings.</p>
          </div>
        </div>
      </section>

      <AppverseFooter />
    </main>
  )
}


