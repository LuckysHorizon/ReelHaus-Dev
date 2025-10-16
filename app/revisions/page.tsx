import { SiteHeader } from "@/components/site-header";
import { AppverseFooter } from "@/components/appverse-footer";

export default function RevisionPolicyPage() {
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
                  <h1 className="text-4xl font-bold tracking-tight text-red-300">Revision Policy</h1>
                  <p className="text-neutral-400 text-lg">
                    At ReelHaus, revisions help us refine work without expanding scope. This policy keeps the process fast, fair, and focused on outcomes.
                  </p>
                </header>

                <section className="space-y-3">
                  <h2 className="text-2xl font-semibold text-white">1. Included Revisions</h2>
                  <p className="text-neutral-300">Each engagement includes a defined number of revision rounds agreed at kickoff. A “round” means consolidated feedback delivered at once.</p>
                </section>

                <section className="space-y-3">
                  <h2 className="text-2xl font-semibold text-white">2. Additional Revisions</h2>
                  <p className="text-neutral-300">Extra rounds beyond the included amount are billed according to the project’s rate card or a mutually agreed per‑round fee.</p>
                </section>

                <section className="space-y-3">
                  <h2 className="text-2xl font-semibold text-white">3. Scope of Revisions</h2>
                  <p className="text-neutral-300">Revisions polish the approved concept. Requests that change the core idea, deliverables, or timelines are considered scope changes and will be quoted separately.</p>
                </section>

                <section className="space-y-3">
                  <h2 className="text-2xl font-semibold text-white">4. Turnaround Time</h2>
                  <p className="text-neutral-300">Typical turnaround for a revision round is 1–3 business days depending on complexity and queue. We’ll confirm timelines when feedback is received.</p>
                </section>

                <section className="space-y-3">
                  <h2 className="text-2xl font-semibold text-white">5. Contact Us</h2>
                  <p className="text-neutral-300">Questions about revisions or timelines?</p>
                  <p className="text-neutral-300">Reach us via our <a href="/legal/contact" className="text-red-300 underline">Contact page</a>.</p>
                </section>
              </div>
            </div>
          </div>
        </div>
      </section>
      <AppverseFooter />
    </>
  );
}
