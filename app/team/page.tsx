import { SiteHeader } from "@/components/site-header"
import { AppverseFooter } from "@/components/appverse-footer"

export const metadata = {
  title: "Our Team | ReelHaus",
  description: "Meet the passionate team behind ReelHaus, dedicated to creating unforgettable club experiences.",
}

const teamMembers = [
  {
    name: "Alex Chen",
    role: "Founder & CEO",
    bio: "Visionary leader with 10+ years in event management and hospitality.",
    image: "/placeholder-user.jpg"
  },
  {
    name: "Sarah Johnson",
    role: "Creative Director",
    bio: "Design enthusiast who brings artistic vision to every event experience.",
    image: "/placeholder-user.jpg"
  },
  {
    name: "Marcus Rodriguez",
    role: "Operations Manager",
    bio: "Logistics expert ensuring every event runs smoothly and efficiently.",
    image: "/placeholder-user.jpg"
  },
  {
    name: "Emma Thompson",
    role: "Community Manager",
    bio: "Connects with our members to understand what makes events truly special.",
    image: "/placeholder-user.jpg"
  },
  {
    name: "David Kim",
    role: "Technical Lead",
    bio: "Tech innovator building the platform that powers our seamless experiences.",
    image: "/placeholder-user.jpg"
  },
  {
    name: "Lisa Wang",
    role: "Marketing Director",
    bio: "Brand storyteller who spreads the word about our amazing events.",
    image: "/placeholder-user.jpg"
  }
]

export default function TeamPage() {
  return (
    <main className="min-h-[100dvh] text-white">
      <SiteHeader />
      
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-red-400 via-red-500 to-red-600 bg-clip-text text-transparent">
            Our Team
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Meet the passionate individuals who make ReelHaus events extraordinary.
          </p>
        </div>
      </section>

      {/* Team Grid */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="glass-border-enhanced rounded-2xl p-6 text-center group hover:scale-105 transition-transform">
                <div className="relative mb-6">
                  <div className="w-32 h-32 mx-auto rounded-full overflow-hidden glass-border">
                    <img 
                      src={member.image} 
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">✓</span>
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-red-400">{member.name}</h3>
                <p className="text-red-300 mb-3 font-medium">{member.role}</p>
                <p className="text-gray-300 text-sm">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Culture Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-black/50 to-gray-900/50">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-4xl font-bold text-center mb-12 text-red-400">Our Culture</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="glass-border rounded-xl p-6">
              <h3 className="text-xl font-semibold mb-4 text-red-400">Collaboration</h3>
              <p className="text-gray-300">
                We believe that the best ideas come from working together. Our team collaborates closely 
                to ensure every event exceeds expectations.
              </p>
            </div>
            <div className="glass-border rounded-xl p-6">
              <h3 className="text-xl font-semibold mb-4 text-red-400">Growth</h3>
              <p className="text-gray-300">
                We're committed to continuous learning and improvement, both as individuals and as a team.
              </p>
            </div>
            <div className="glass-border rounded-xl p-6">
              <h3 className="text-xl font-semibold mb-4 text-red-400">Passion</h3>
              <p className="text-gray-300">
                Every team member shares a genuine passion for creating memorable experiences for our members.
              </p>
            </div>
            <div className="glass-border rounded-xl p-6">
              <h3 className="text-xl font-semibold mb-4 text-red-400">Innovation</h3>
              <p className="text-gray-300">
                We constantly explore new ways to enhance our events and improve the member experience.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Join Team CTA */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-bold mb-6 text-red-400">Join Our Team</h2>
          <p className="text-xl text-gray-300 mb-8">
            Are you passionate about creating amazing experiences? We're always looking for talented individuals to join our team.
          </p>
          <a 
            href="/join" 
            className="inline-block bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold px-8 py-4 rounded-lg hover:from-red-400 hover:to-red-500 transition-all hover:scale-105"
          >
            View Open Positions
          </a>
        </div>
      </section>

      <AppverseFooter />
    </main>
  )
}
