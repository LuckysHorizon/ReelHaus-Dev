import { SiteHeader } from "@/components/site-header"
import { AppverseFooter } from "@/components/appverse-footer"

export const metadata = {
  title: "Contact Us | ReelHaus",
  description: "Reach ReelHaus for queries, support, or refunds.",
}

export default function ContactPage() {
  return (
    <main className="min-h-[100dvh] text-white">
      <SiteHeader />

      <section className="relative py-16 px-4">
        <div className="container mx-auto max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">Contact Us</h1>
          <p className="text-sm text-neutral-400 mb-10">Last Updated: October 2025</p>

          <div className="space-y-6 text-neutral-200">
            <div>
              <h2 className="text-2xl font-semibold text-white mb-2">ReelHaus — Club Events Portal</h2>
              <p>Hyderabad, India</p>
            </div>
            <div className="space-y-1">
              <p><span className="text-neutral-400">Email:</span> <span className="text-white">reelhaus.in@gmail.com</span></p>
              <p><span className="text-neutral-400">Website:</span> <span className="text-white">www.reelhaus.in</span></p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-white mb-1">Business Hours</h3>
              <p>Monday to Saturday — 9:00 AM to 4:00 PM (IST)</p>
            </div>
          </div>
        </div>
      </section>

      <AppverseFooter />
    </main>
  )
}


