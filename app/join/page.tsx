import { SiteHeader } from "@/components/site-header"
import { AppverseFooter } from "@/components/appverse-footer"
import { ShinyButton } from "@/components/ui/shiny-button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

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

      {/* Membership Form */}
      <section className="py-16 px-4 bg-gradient-to-r from-black/50 to-gray-900/50">
        <div className="container mx-auto max-w-2xl">
          <h2 className="text-4xl font-bold text-center mb-12 text-red-400">Apply for Membership</h2>
          <Card className="glass-border-enhanced p-8">
            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="firstName" className="text-red-400">First Name</Label>
                  <Input 
                    id="firstName" 
                    type="text" 
                    className="bg-gray-900/50 border-gray-700 text-white"
                    placeholder="Enter your first name"
                  />
                </div>
                <div>
                  <Label htmlFor="lastName" className="text-red-400">Last Name</Label>
                  <Input 
                    id="lastName" 
                    type="text" 
                    className="bg-gray-900/50 border-gray-700 text-white"
                    placeholder="Enter your last name"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="email" className="text-red-400">Email Address</Label>
                <Input 
                  id="email" 
                  type="email" 
                  className="bg-gray-900/50 border-gray-700 text-white"
                  placeholder="Enter your email"
                />
              </div>
              
              <div>
                <Label htmlFor="phone" className="text-red-400">Phone Number</Label>
                <Input 
                  id="phone" 
                  type="tel" 
                  className="bg-gray-900/50 border-gray-700 text-white"
                  placeholder="+91 98765 43210"
                />
              </div>
              
              <div>
                <Label htmlFor="interests" className="text-red-400">Event Interests</Label>
                <Textarea 
                  id="interests" 
                  className="bg-gray-900/50 border-gray-700 text-white"
                  placeholder="Tell us about your interests in club events, music preferences, etc."
                  rows={4}
                />
              </div>
              
              <div>
                <Label htmlFor="experience" className="text-red-400">Previous Experience</Label>
                <Textarea 
                  id="experience" 
                  className="bg-gray-900/50 border-gray-700 text-white"
                  placeholder="Share any relevant experience with events, hospitality, or community management"
                  rows={3}
                />
              </div>
              
              <ShinyButton 
                type="submit" 
                className="w-full"
              >
                Submit Application
              </ShinyButton>
            </form>
          </Card>
        </div>
      </section>

      {/* Career Opportunities */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-4xl font-bold text-center mb-12 text-red-400">Career Opportunities</h2>
          <div className="space-y-6">
            {openPositions.map((position, index) => (
              <Card key={index} className="glass-border-enhanced p-6 hover:scale-[1.02] transition-transform">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div className="mb-4 md:mb-0">
                    <h3 className="text-xl font-semibold text-red-400 mb-2">{position.title}</h3>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-300">
                      <span>{position.department}</span>
                      <span>•</span>
                      <span>{position.location}</span>
                      <span>•</span>
                      <span>{position.type}</span>
                    </div>
                    <p className="text-gray-300 mt-2">{position.description}</p>
                  </div>
                  <ShinyButton>
                    Apply Now
                  </ShinyButton>
                </div>
              </Card>
            ))}
          </div>
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
