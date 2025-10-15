import React from "react"
import { SiteHeader } from "@/components/site-header"
import { AppverseFooter } from "@/components/appverse-footer"
import { ShinyButton } from "@/components/ui/shiny-button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { JoinCareersList } from "@/components/join-careers-list"

export const metadata = {
  title: "Join Us | ReelHaus",
  description: "Join the ReelHaus community and be part of exclusive club events and experiences.",
}

const membershipBenefits = [
  {
    icon: "🎉",
    title: "Exclusive Events",
    description: "Access to members-only events and early bird registrations"
  },
  {
    icon: "🎵",
    title: "Premium Experiences",
    description: "Curated experiences with top-tier venues and performers"
  },
  {
    icon: "👥",
    title: "Community Access",
    description: "Connect with like-minded individuals and expand your network"
  },
  {
    icon: "🎁",
    title: "Special Perks",
    description: "Member discounts, VIP treatment, and exclusive merchandise"
  }
]

const openPositions = [
  {
    title: "Event Coordinator",
    department: "Operations",
    location: "Remote",
    type: "Full-time",
    description: "Coordinate and manage club events from planning to execution."
  },
  {
    title: "Community Manager",
    department: "Community",
    location: "Hybrid",
    type: "Full-time",
    description: "Build and engage our community of members across all platforms."
  },
  {
    title: "Marketing Specialist",
    department: "Marketing",
    location: "Remote",
    type: "Part-time",
    description: "Create compelling content and manage social media presence."
  }
]

export default function JoinPage() {
  return (
    <main className="min-h-[100dvh] text-white">
      <SiteHeader />
      
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-red-400 via-red-500 to-red-600 bg-clip-text text-transparent">
            Join ReelHaus
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Become part of an exclusive community that values exceptional experiences and meaningful connections.
          </p>
        </div>
      </section>

      {/* Membership Benefits */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-4xl font-bold text-center mb-12 text-red-400">Membership Benefits</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {membershipBenefits.map((benefit, index) => (
              <Card key={index} className="glass-border-enhanced p-6 text-center hover:scale-105 transition-transform">
                <div className="text-4xl mb-4">{benefit.icon}</div>
                <h3 className="text-lg font-semibold mb-3 text-red-400">{benefit.title}</h3>
                <p className="text-gray-300 text-sm">{benefit.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Membership Form removed as requested */}

      {/* Career Opportunities (fetched from API) */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-4xl font-bold text-center mb-12 text-red-400">Career Opportunities</h2>
          <JoinCareersList />
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-black/50 to-gray-900/50">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-bold mb-6 text-red-400">Questions?</h2>
          <p className="text-xl text-gray-300 mb-8">
            Have questions about membership or career opportunities? We'd love to hear from you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <ShinyButton>
              Contact Us
            </ShinyButton>
            <ShinyButton variant="outline">
              Schedule a Call
            </ShinyButton>
          </div>
        </div>
      </section>

      <AppverseFooter />
    </main>
  )
}
