"use client"

import { SiteHeader } from "@/components/site-header"
import { AppverseFooter } from "@/components/appverse-footer"
import { motion } from "motion/react"

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <motion.section
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
    viewport={{ once: true, margin: "-80px" }}
    className="mb-12"
  >
    <h2 className="text-2xl md:text-3xl font-bold mb-4 text-white">{title}</h2>
    <div className="text-gray-300 leading-relaxed space-y-3">{children}</div>
  </motion.section>
)

export default function AboutPage() {
  return (
    <main className="min-h-[100dvh] text-white relative overflow-hidden">
      <SiteHeader />

      {/* Subtle animated background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <motion.div
          initial={{ opacity: 0.35, scale: 1 }}
          animate={{ opacity: [0.35, 0.5, 0.35], scale: [1, 1.12, 1], x: [0, 24, 0], y: [0, -16, 0] }}
          transition={{ duration: 18, ease: "easeInOut", repeat: Infinity }}
          className="absolute -top-40 -left-40 h-[44rem] w-[44rem] rounded-full bg-red-500/20 blur-3xl"
        />
        <motion.div
          initial={{ opacity: 0.25, scale: 1 }}
          animate={{ opacity: [0.25, 0.4, 0.25], scale: [1, 1.1, 1], x: [0, -18, 0], y: [0, 14, 0] }}
          transition={{ duration: 22, ease: "easeInOut", repeat: Infinity, delay: 2 }}
          className="absolute bottom-[-20rem] right-[-20rem] h-[50rem] w-[50rem] rounded-full bg-purple-500/20 blur-3xl"
        />
      </div>

      <div className="container mx-auto px-4 py-16 max-w-5xl">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.25, 1, 0.5, 1] }}
          className="text-4xl md:text-6xl font-extrabold mb-6 bg-gradient-to-r from-red-400 via-red-300 to-white bg-clip-text text-transparent"
        >
          About Reelhaus
        </motion.h1>

        <Section title="What is Reelhaus?">
          <p>
            Reelhaus is a student-led creative powerhouse that fuses brand building, digital marketing, and experiential
            event design into one relentless engine for cultural impact. We’re not a club that organizes events — we
            prototyping future-focussed brand experiences, craft digital narratives that stick, and train makers who can turn
            ideas into campaigns, communities, and measurable growth.
          </p>
        </Section>

        <Section title="Our Mission">
          <p>
            To transform bold ideas into magnetic brands and unforgettable experiences. We empower students to master brand
            strategy, content design, data-driven marketing, and event production — so they can launch campaigns that move
            people and metrics alike.
          </p>
        </Section>

        <Section title="Our Vision">
          <p>
            A campus where every creative concept finds an audience, every student gains hands-on commercial skills, and every
            event becomes a laboratory for experimentation and real-world impact.
          </p>
        </Section>

        <Section title="What We Do">
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Brand Building:</strong> From naming and positioning to full identity systems — we teach and deliver
              end-to-end brand creation that’s lean, research-led, and wildly original.
            </li>
            <li>
              <strong>Digital Marketing:</strong> Social strategy, performance campaigns, SEO, influencer collaboratives, analytics
              dashboards — we run playbooks that are creative and accountable.
            </li>
            <li>
              <strong>Event Management:</strong> We design immersive campus experiences: launch nights, pop-ups, speaker series,
              product showcases, and hybrid events that blend physical + digital.
            </li>
            <li>
              <strong>Workshops & Labs:</strong> Weekly hands-on workshops cover UX copy, short-form video, analytics, Adobe/Figma
              toolchains, campaign planning, and pitch practice.
            </li>
            <li>
              <strong>Student Projects & Client Work:</strong> We partner with start-ups, campus clubs, and local SMBs so members get
              real deliverables, client feedback, and portfolio pieces.
            </li>
          </ul>
        </Section>

        <Section title="Our Approach — Fast, Measured, Human">
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Research First.</strong> We start with people — user discovery, brand audits, and competitive teardown.</li>
            <li><strong>Prototype Fast.</strong> Rapid creative sprints produce MVP campaigns and event experiences to test assumptions.</li>
            <li><strong>Measure Relentlessly.</strong> Every campaign has KPIs: reach, engagement, conversion, and brand sentiment.</li>
            <li><strong>Iterate Boldly.</strong> Data informs design; we refine content and tactics until impact scales.</li>
          </ul>
        </Section>

        <Section title="Values">
          <ul className="grid md:grid-cols-2 gap-3 list-disc pl-6">
            <li><strong>Curiosity:</strong> We ask better questions than anyone else in the room.</li>
            <li><strong>Craft:</strong> We obsess over detail — copy, design, timing, and flow.</li>
            <li><strong>Collaboration:</strong> Great work is cross-disciplinary; everyone ships.</li>
            <li><strong>Courage:</strong> We back creative risks with rapid learning.</li>
            <li><strong>Accountability:</strong> Creative ideas must move people and numbers.</li>
          </ul>
        </Section>

        <Section title="Impact">
          <ul className="list-disc pl-6 space-y-2">
            <li>Multiple campus campaigns that boosted event attendance by 3x and increased social followers by 50% within a semester.</li>
            <li>Real-world client projects: branding and digital campaigns for local startups and student initiatives.</li>
          </ul>
        </Section>

        <Section title="Join Us">
          <p>
            If you love storytelling, analytics, design, or the logistics that make large experiences feel effortless — Reelhaus is your lab.
            We welcome creators, strategists, coders, videographers, and organisers. No prior experience required; only curiosity and hustle.
          </p>
          <p>How to join: Drop us a DM on our socials, attend our open workshop night, or apply via the club portal.</p>
        </Section>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
          className="mt-10 rounded-3xl border border-white/10 bg-black/30 p-6 backdrop-blur-xl text-center"
        >
          <p className="text-lg md:text-2xl font-semibold">Build brands. Make noise. Create impact.</p>
          <p className="text-sm text-gray-400 mt-1">— Reelhaus: Where ideas become experiences.</p>
        </motion.div>
      </div>

      <AppverseFooter />
    </main>
  )
}