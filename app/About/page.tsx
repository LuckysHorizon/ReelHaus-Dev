import { SiteHeader } from "@/components/site-header"
import { AppverseFooter } from "@/components/appverse-footer"

export const metadata = {
  title: "About Us | ReelHaus",
  description: "Learn about ReelHaus - your premier destination for exclusive club events and experiences.",
}

export default function AboutPage() {
  return (
    <main className="min-h-[100dvh] text-white">
      <SiteHeader />
      
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-red-400 via-red-500 to-red-600 bg-clip-text text-transparent">
            About ReelHaus
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
            We're passionate about creating unforgettable experiences and bringing people together through exclusive club events.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6 text-red-400">Our Mission</h2>
              <p className="text-lg text-gray-300 mb-6">
                At ReelHaus, we believe that great experiences create lasting memories. Our mission is to curate 
                exceptional club events that bring together like-minded individuals in an atmosphere of excitement, 
                creativity, and connection.
              </p>
              <p className="text-lg text-gray-300">
                From intimate gatherings to large-scale celebrations, we ensure every event is meticulously planned 
                and executed to perfection, providing our members with experiences they'll treasure forever.
              </p>
            </div>
            <div className="glass-border-enhanced rounded-2xl p-8">
              <div className="aspect-video bg-gradient-to-br from-yellow-400/20 to-yellow-600/20 rounded-xl flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl mb-4">🎉</div>
                  <p className="text-red-400 font-semibold">Creating Memories</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-black/50 to-gray-900/50">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-4xl font-bold text-center mb-12 text-red-400">Our Values</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="glass-border rounded-xl p-6 text-center">
              <div className="text-4xl mb-4">✨</div>
              <h3 className="text-xl font-semibold mb-3 text-red-400">Excellence</h3>
              <p className="text-gray-300">
                We strive for excellence in every aspect of our events, from planning to execution.
              </p>
            </div>
            <div className="glass-border rounded-xl p-6 text-center">
              <div className="text-4xl mb-4">🤝</div>
              <h3 className="text-xl font-semibold mb-3 text-red-400">Community</h3>
              <p className="text-gray-300">
                Building a strong community of members who share our passion for exceptional experiences.
              </p>
            </div>
            <div className="glass-border rounded-xl p-6 text-center">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-semibold mb-3 text-red-400">Innovation</h3>
              <p className="text-gray-300">
                Continuously innovating to bring fresh, exciting experiences to our members.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-4xl font-bold text-center mb-12 text-red-400">Our Story</h2>
          <div className="glass-border-enhanced rounded-2xl p-8">
            <p className="text-lg text-gray-300 mb-6">
              ReelHaus was born from a simple idea: that life's most memorable moments happen when we step out 
              of our comfort zones and embrace new experiences. Founded by a group of event enthusiasts who 
              believed that club culture deserved more than just another night out.
            </p>
            <p className="text-lg text-gray-300 mb-6">
              What started as small gatherings among friends has grown into a thriving community of members 
              who trust us to deliver extraordinary experiences. Every event we create is infused with our 
              passion for bringing people together and creating moments that matter.
            </p>
            <p className="text-lg text-gray-300">
              Today, ReelHaus stands as a beacon of quality and innovation in the events space, always pushing 
              boundaries and setting new standards for what a club event can be.
            </p>
          </div>
        </div>
      </section>

      <AppverseFooter />
    </main>
  )
}