
import { SiteHeader } from "@/components/site-header"
import { AppverseFooter } from "@/components/appverse-footer"
import { NeonGradientCard } from "@/components/ui/neon-gradient-card"
import { ShinyButton } from "@/components/ui/shiny-button"
import Image from "next/image"

export const metadata = {
  title: "Core Team | ReelHaus",
  description: "Meet the passionate leaders driving ReelHaus's mission to transform IARE's digital presence.",
}

const teamMembers = [
  {
    name: "Nandana",
    designation: "President",
    year: "3rd Yr CSE",
    description: "Leading the club's vision and strategic direction with innovative thinking and exceptional leadership skills.",
    icon: "👑",
    photo: "/team-photos/president.jpg"
  },
  {
    name: "Pallapati Levi",
    designation: "Vice President",
    year: "2nd Yr IT",
    description: "Supporting the president in strategic planning and ensuring smooth execution of all club initiatives.",
    icon: "🎯",
    photo: "/team-photos/vice.jpg"
  },
  {
    name: "P.Sai Jaswanth",
    designation: "Secretary",
    year: "2nd Yr IT",
    description: "Managing club communications, documentation, and maintaining records of all club activities.",
    icon: "📝",
    photo: "/team-photos/jas.jpg"
  },
  {
    name: "L.UdayKumar",
    designation: "Content & Design Head",
    year: "2nd Yr",
    description: "Creating compelling visual content and managing the club's creative direction across all platforms.",
    icon: "🎨",
    photo: "/team-photos/uday.jpg"
  },
  {
    name: "Tharun",
    designation: "Co Head",
    year: "2nd Yr",
    description: "Assisting in creative and design leadership across all platforms.",
    icon: "💻",
    photo: "/team-photos/tharun.jpg"
  },
  {
    name: "Yeshwanth Reddy",
    designation: "Technical Head",
    year: "2nd Yr Mech", 
    description: "Managing Technical Infrastructure and Development",
    icon: "📢",
    photo: "/team-photos/yesh.jpg"
  },
  {
    name: "Akshitha",
    designation: "CP/PR Head",
    year: "2nd Yr CSE",
    description: "Handling Corporate Partnerships and Public Relations",
    icon: "🎪",
    photo: "/team-photos/akshitha.jpg"
  },
  {
    name: "Akhil B",
    designation: "Co Head",
    year: "2nd Yr Mech",
    description: "Supporting various club activities and initiatives",
    icon: "💰",
    photo: "/team-photos/akil.jpg"
  },
  {
    name: "Aasrith",
    designation: "Events Head",
    year: "2nd Yr CSM",
    description: "Organizing workshops,events and other activities",
    icon: "💰",
    photo: "/team-photos/ashrith.jpg"
  },
  {
    name: "Manikanta",
    designation: "Events Co-Head",
    year: "3rd Yr",
    description: "Building relationships with external partners and managing the club's public image.",
    icon: "🤝",
    photo: "/team-photos/mani.jpg"
  },
  {
    name: "M.Sridhanya Reddy",
    designation: "Events Co-Head",
    year: "2nd Yr IT",
    description: "Supporting various club activities and initiatives",
    icon: "📸",
    photo: "/team-photos/dhanya.jpg"
  },
  {
    name: "Eshwar Reddy",
    designation: "Social Media Head",
    year: "3rd Yr",
    description: "Managing Social Media Accounts and creating engaging content",
    icon: "🎬",
    photo: "/team-photos/esw-ar.jpg"
  },
  {
    name: "Bramhani",
    designation: "Social Media Manager",
    year: "2nd Yr CSE",
    description: "Managing Social Media Accounts and creating engaging content",
    icon: "🌐",
    photo: "/team-photos/brahmani.jpg"
  },
  {
    name: "Sankeerthana",
    designation: "Social Media Manager",
    year: "2nd Yr CSE",
    description: "Managing Social Media Accounts and creating engaging content",
    icon: "🎭",
    photo: "/team-photos/sankeerthana-manager.jpg"
  },
  {
    name: "Charan",
    designation: "Logistics and Media",
    year: "2nd Yr ECE",
    description: "Managing Logistics and Media for club events.",
    icon: "🔊",
    photo: "/team-photos/Charan.jpg"
  },
  {
    name: "Ashvith",
    designation: "Logistics and Media Co-Head",
    year: "2nd Yr",
    description: "Managing Logistics and Media for club events.",
    icon: "✍️",
    photo: "/team-photos/ashvith.jpg"
  },
  {
    name: "Snehas",
    designation: "Video Editor",
    year: "2nd Yr AERO",
    description: "Editing videos for club events.",
    icon: "📦",
    photo: "/team-photos/snehas.jpg"
  },
  {
    name: "Sri Harsha",
    designation: "Video Editor and Content Writer",
    year: "2nd Yr AIML",
    description: "Editing videos and creating content for club events.",
    icon: "👥",
    photo: "/team-photos/harsha.jpg"
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
            Core Team
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Meet the passionate leaders driving ReelHaus's mission to transform IARE's digital presence.
          </p>
        </div>
      </section>

      {/* Team Grid */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="group perspective-1000">
                <div className="relative w-full h-96 transform-gpu transition-transform duration-1000 ease-in-out group-hover:rotate-y-180">
                  {/* Front of card */}
                  <div className="absolute inset-0 w-full h-full backface-hidden">
                    <div className="h-96 w-full cursor-pointer relative overflow-hidden rounded-2xl border-2 border-transparent group-hover:border-red-500 group-hover:shadow-[0_0_20px_rgba(255,0,0,0.5)] transition-all duration-1000">
                      {/* Background Image */}
                      <div className="absolute inset-0 z-0">
                        <Image 
                          src={member.photo} 
                          alt={member.name}
                          fill
                          className="object-cover"
                        />
                        {/* Dark overlay for better text readability */}
                        <div className="absolute inset-0 bg-black/30"></div>
                      </div>
                      
                      {/* Footer Content */}
                      <div className="absolute bottom-0 left-0 right-0 z-10 p-4 bg-gradient-to-t from-black/80 to-transparent text-center">
                        {/* Name */}
                        <h3 className="text-xl font-bold text-white leading-tight drop-shadow-lg">
                          {member.name}
                        </h3>
                        
                        {/* Designation */}
                        <p className="text-sm font-medium text-white drop-shadow-lg">
                          {member.designation}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Back of card - Details */}
                  <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180">
                    <div className="h-96 w-full cursor-pointer relative overflow-hidden rounded-2xl border-2 border-red-500 shadow-[0_0_30px_rgba(255,0,0,0.8)] bg-gradient-to-br from-gray-900 to-black">
                      {/* Content */}
                      <div className="relative z-10 flex flex-col items-center justify-center h-full p-6 space-y-4">
                        {/* Name */}
                        <h3 className="text-2xl font-bold text-white leading-tight">
                          {member.name}
                        </h3>
                        
                        {/* Designation */}
                        <p className="text-lg font-medium text-red-400">
                          {member.designation}
                        </p>
                        
                        {/* Description */}
                        <p className="text-sm text-white/90 text-center leading-relaxed">
                          {member.description}
                        </p>
                        
                        {/* Year */}
                        <p className="text-xs text-white/70">
                          {member.year}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-black/50 to-gray-900/50">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-4xl font-bold text-center mb-12 text-red-400">Our Mission</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="glass-border rounded-xl p-6">
              <h3 className="text-xl font-semibold mb-4 text-red-400">Creativity</h3>
              <p className="text-gray-300">
              At ReelHaus, we push the boundaries of storytelling and visual artistry, blending creativity with technology to craft powerful, engaging content that leaves a lasting impact..
              </p>
            </div>
            <div className="glass-border rounded-xl p-6">
              <h3 className="text-xl font-semibold mb-4 text-red-400">Excellence</h3>
              <p className="text-gray-300">
              We aim for perfection in every frame and every event — from conceptualization to execution by ensuring top-tier quality and unforgettable audience experiences.
              </p>
            </div>
            <div className="glass-border rounded-xl p-6">
              <h3 className="text-xl font-semibold mb-4 text-red-400">Community</h3>
              <p className="text-gray-300">
              ReelHaus is more than a team — it’s a creative family. We thrive on collaboration, supporting passionate creators and fostering a space where ideas come alive and inspire others.
              </p>
            </div>
            <div className="glass-border rounded-xl p-6">
              <h3 className="text-xl font-semibold mb-4 text-red-400">Growth</h3>
              <p className="text-gray-300">
              We believe in constant evolution — learning, experimenting, and growing together as creators to redefine what’s possible in the world of digital content and live experiences.
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
            Are you passionate about creating amazing experiences and driving digital innovation? 
            We're always looking for talented individuals to join our core team.
          </p>
          <ShinyButton asChild className="px-8 py-4">
            <a href="/join">
              View Open Positions
            </a>
          </ShinyButton>
        </div>
      </section>

      <AppverseFooter />
    </main>
  )
}
