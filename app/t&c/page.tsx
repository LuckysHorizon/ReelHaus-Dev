import { SiteHeader } from "@/components/site-header"
import { AppverseFooter } from "@/components/appverse-footer"
import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Terms and Conditions — ReelHaus",
  description: "Terms and conditions for ReelHaus services and website.",
  robots: {
    index: false,
    follow: false,
    noarchive: true,
    nosnippet: true,
  },
}

export default function TermsPage() {
  return (
    <>
      <SiteHeader />
      <section className="bg-[#0a0a0a] text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#0f0f0f] p-6 sm:p-10 shadow-xl">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(225,29,72,0.12),transparent_55%)]" />
              <div className="relative space-y-12">
                <header className="space-y-4">
                  <h1 className="text-4xl font-bold tracking-tight text-red-300">Terms and Conditions</h1>
                  <p className="text-neutral-400 text-lg">Welcome to ReelHaus. By using our website and services, you agree to the following terms.</p>
                </header>

                <section className="space-y-3">
                  <h2 className="text-2xl font-semibold text-white">1. Introduction</h2>
                  <p className="text-neutral-300">These Terms govern your use of the ReelHaus website and services. If you disagree with any part, please discontinue use.</p>
                </section>

                <section className="space-y-3">
                  <h2 className="text-2xl font-semibold text-white">2. Intellectual Property</h2>
                  <p className="text-neutral-300">All content, branding, assets, and media on this site are owned by ReelHaus or our partners and are protected by applicable laws.</p>
                  <ul className="list-disc list-inside space-y-2 text-neutral-400">
                    <li>No reproduction, distribution, or modification without prior written consent.</li>
                    <li>Materials shared with clients remain subject to license terms agreed per project.</li>
                  </ul>
                </section>

                <section className="space-y-3">
                  <h2 className="text-2xl font-semibold text-white">3. Acceptable Use</h2>
                  <p className="text-neutral-300">Do not use the site to engage in unlawful activity, disrupt services, or overload infrastructure. Automated scraping is prohibited without consent.</p>
                </section>

                <section className="space-y-3">
                  <h2 className="text-2xl font-semibold text-white">4. Limitation of Liability & Creative Subjectivity</h2>
                  <p className="text-neutral-300">ReelHaus is not liable for indirect or consequential losses. Creative output involves subjective judgment; changes beyond agreed scope are handled via our <Link href="/revisions" className="text-red-300 underline">revision policy</Link>.</p>
                </section>

                <section className="space-y-3">
                  <h2 className="text-2xl font-semibold text-white">5. Changes to These Terms</h2>
                  <p className="text-neutral-300">We may update these Terms periodically. Continued use of the site constitutes acceptance of the latest version.</p>
                </section>

                <section className="space-y-3">
                  <h2 className="text-2xl font-semibold text-white">6. Contact Us</h2>
                  <p className="text-neutral-300">Questions about these Terms? Reach us via our <Link href="/legal/contact" className="text-red-300 underline">Contact page</Link>.</p>
                </section>
              </div>
            </div>
          </div>
        </div>
      </section>
      <AppverseFooter />
    </>
  )
}
