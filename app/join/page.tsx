import React from "react"
import { SiteHeader } from "@/components/site-header"
import { AppverseFooter } from "@/components/appverse-footer"
import { ShinyButton } from "@/components/ui/shiny-button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { JoinCareersList } from "@/components/join-careers-list"
import { Playfair_Display } from "next/font/google"
import { Cormorant_Garamond } from "next/font/google"

const premiumHeading = Playfair_Display({ subsets: ["latin"], weight: ["600", "700", "800"] })
const standoutDisplay = Cormorant_Garamond({ subsets: ["latin"], weight: ["600"] })

export const metadata = {
  title: "Join Us | ReelHaus",
  description: "Join the ReelHaus community and be part of exclusive club events and experiences.",
}

// Membership Benefits removed per request; open positions are fetched dynamically via JoinCareersList

export default function JoinPage() {
  return (
    <main className="min-h-[100dvh] text-white">
      <SiteHeader />
      
      {/* Hero Section */}
      <section className="relative pt-20 pb-6 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className={`${standoutDisplay.className} text-5xl md:text-7xl font-semibold tracking-tight mb-6 bg-gradient-to-r from-red-400 via-red-500 to-red-600 bg-clip-text text-transparent`} style={{ fontFamily: standoutDisplay.style.fontFamily }}>
            Join ReelHaus
          </h1>
          <p className={`${standoutDisplay.className} text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto`}>
            Become part of an exclusive community that values exceptional experiences and meaningful connections.
          </p>
        </div>
      </section>
      {/* Career Opportunities moved up */}
      <section className="pt-0 pb-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className={`${standoutDisplay.className} text-4xl font-semibold tracking-tight text-center mb-12 text-red-400`} style={{ fontFamily: standoutDisplay.style.fontFamily }}>Career Opportunities</h2>
          <JoinCareersList />
        </div>
      </section>

      {/* About ReelHaus Content */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <h2 className={`${premiumHeading.className} text-4xl md:text-5xl font-extrabold mb-6 text-white`}>Where Stories Move at 24 Frames per Second</h2>
          <p className="text-gray-300 leading-relaxed mb-6">
            ReelHaus is a student-led creative collective built for the era of short attention spans and long-lasting impressions.
            We tell stories that move — through video, motion design, and social content that make people stop scrolling and start feeling.
          </p>

          <h3 className={`${premiumHeading.className} text-2xl md:text-3xl font-semibold mb-4 text-red-400`}>What We Do</h3>
          <p className="text-gray-300 leading-relaxed mb-4">At ReelHaus, we turn concepts into cinematic, scroll-stopping stories:</p>
          <ul className="space-y-3 text-gray-300 mb-8 list-disc pl-6">
            <li><span className="font-semibold text-white">Video Production:</span> We plan, shoot, and edit videos that blend storytelling with aesthetic precision — from campus documentaries to brand features.</li>
            <li><span className="font-semibold text-white">Reel Creation:</span> We craft short-form content designed for Instagram and TikTok — fast, dynamic, and emotionally charged.</li>
            <li><span className="font-semibold text-white">Creative Direction:</span> Every project begins with a strong concept — a message worth sharing — and ends with visuals that stick.</li>
            <li><span className="font-semibold text-white">Content Strategy:</span> We understand trends, audience behavior, and algorithms — and use them to deliver content that performs.</li>
          </ul>

          <h3 className={`${premiumHeading.className} text-2xl md:text-3xl font-semibold mb-3 text-red-400`}>Our Mission</h3>
          <p className="text-gray-300 leading-relaxed mb-8">
            To help students and brands express bold ideas through motion — by merging storytelling, creativity, and platform fluency into one culture-making engine.
          </p>

          <h3 className={`${premiumHeading.className} text-2xl md:text-3xl font-semibold mb-3 text-red-400`}>Our Vision</h3>
          <p className="text-gray-300 leading-relaxed mb-8">
            A community of next-gen filmmakers, editors, and digital storytellers who redefine how student voices are seen and heard — on campus and beyond.
          </p>

          <h3 className={`${premiumHeading.className} text-2xl md:text-3xl font-semibold mb-3 text-red-400`}>Why Join ReelHaus</h3>
          <p className="text-gray-300 leading-relaxed mb-4">
            If you live for visual storytelling, thrive on collaboration, and believe in the power of content to move people — ReelHaus is your home. You’ll learn how to:
          </p>
          <ul className="space-y-2 text-gray-300 mb-8">
            <li>🎥 Create high-impact short-form videos</li>
            <li>💡 Build story concepts that connect emotionally</li>
            <li>📱 Master digital storytelling for social platforms</li>
            <li>🚀 Collaborate with like-minded creators and brands</li>
          </ul>

          <h3 className={`${premiumHeading.className} text-2xl md:text-3xl font-semibold mb-3 text-red-400`}>Who We’re Looking For</h3>
          <p className="text-gray-300 leading-relaxed mb-8">
            Creators. Editors. Strategists. Cinematographers. Scriptwriters. If you have a story to tell — or want to learn how — ReelHaus will help you shape it. No prior experience needed. Just passion, curiosity, and the drive to create.
          </p>

          <h3 className={`${premiumHeading.className} text-2xl md:text-3xl font-semibold mb-3 text-red-400`}>How to Join</h3>
          <ul className="space-y-2 text-gray-300 mb-8 list-disc pl-6">
            <li>→ Attend our next open workshop</li>
            <li>→ Apply through the our join us page</li>
          </ul>

          <p className="text-gray-300 leading-relaxed mb-2">Build Stories. Shape Culture. Make It Reel.</p>
          <p className="text-white font-semibold">ReelHaus — The Studio for the Next Generation of Storytellers.</p>
        </div>
      </section>
      <AppverseFooter />
    </main>
  )
}
