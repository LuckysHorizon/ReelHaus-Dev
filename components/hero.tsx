import { ShinyButton } from "@/components/ui/shiny-button"
import Image from "next/image"
import HeroThreadsStatic from "@/components/HeroThreadsStatic"

export function Hero() {
  const buttonNew = (
    <ShinyButton asChild className="rounded-full">
      <a href="#events">
        Explore Events
      </a>
    </ShinyButton>
  )

  return (
    <section className="relative isolate overflow-hidden">
      <div className="container mx-auto px-4" style={{ position: "relative", zIndex: 10 }}>
        <div className="flex flex-col items-center justify-center py-14 sm:py-20">
          <div className="mb-5 flex items-center gap-2">
            <Image src="/icons/reelhaus-white.svg" alt="ReelHaus logo" width={32} height={32} className="h-8 w-8" />
            <p className="text-sm uppercase tracking-[0.25em] text-white-300/80">reelhaus</p>
          </div>
          <h1 className="mt-3 text-center text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
            <span className="block">EXCLUSIVE</span>
            <span className="block text-red-300 drop-shadow-[0_0_20px_rgba(220,38,38,0.35)]">CLUB EVENTS</span>
            <span className="block">BY REELHAUS</span>
          </h1>
          <div className="mt-6">{buttonNew}</div>
          {/* No spacer: ribbons start immediately below CTA */}
        </div>
      </div>
      {/* Full-bleed ribbons area (fluid on desktop) */}
      <div
        className="" 
        style={{
          position: "relative",
          width: "100vw",
          left: "50%",
          marginLeft: "-50vw",
          height: "35vh",
          zIndex: -1
        }}
      >
        <HeroThreadsStatic />
      </div>
    </section>
  )
}
