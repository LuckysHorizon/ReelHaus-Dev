import { SiteHeader } from "@/components/site-header"
import NextDynamic from "next/dynamic"
import { Hero } from "@/components/hero"
import { Features } from "@/components/features"
// import { LogoMarquee } from "@/components/logo-marquee"
import { AppverseFooter } from "@/components/appverse-footer"
import Script from "next/script"

// ✅ Force static generation for low TTFB
export const dynamic = "force-static"

export default function Page() {
  // Structured data for events
  const eventsStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebPageElement",
    "@id": "https://reelhaus.com/#events",
    name: "Event Registration",
    description: "Premium club events registration with secure payments and instant email confirmations",
    url: "https://reelhaus.com/#events",
    mainEntity: {
      "@type": "Service",
      name: "Event Registration Service",
      description: "Secure event registration with Razorpay payments and email confirmations",
      offers: [
        {
          "@type": "Offer",
          name: "Event Registration",
          description: "Register for exclusive club events with instant confirmation",
        },
      ],
    },
  }

  // Structured data for main page
  const pageStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": "https://reelhaus.com/",
    name: "ReelHaus | Premium Club Events Portal",
    description:
      "Discover and register for exclusive club events. Secure payments, instant email confirmations, and seamless event management.",
    url: "https://reelhaus.com/",
    mainEntity: {
      "@type": "Organization",
      name: "ReelHaus",
      url: "https://reelhaus.com",
      sameAs: [
        "https://twitter.com/reelhaus",
        "https://instagram.com/reelhaus",
      ],
    },
    hasPart: [
      {
        "@type": "WebPageElement",
        "@id": "https://reelhaus.com/#events",
        name: "Events Section",
        url: "https://reelhaus.com/#events",
      },
    ],
  }

  return (
    <>
      <main className="min-h-[100dvh] text-white">
        <SiteHeader />
        <Hero />
        <Features />
        {/* Replaced fast-scrolling marquee with event highlights carousel */}
        <DynamicEventHighlights />
        <DynamicPricing />
        <AppverseFooter />
      </main>

      {/* JSON-LD structured data */}
      <Script
        id="events-structured-data"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(eventsStructuredData),
        }}
      />

      <Script
        id="page-structured-data"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(pageStructuredData),
        }}
      />
    </>
  )
}

// Defer heavy, animation-rich sections to lower hydration/CPU on initial load
const DynamicEventHighlights = NextDynamic(() => import("@/components/event-highlights").then(m => m.EventHighlights), {
  ssr: false,
  loading: () => null,
})

const DynamicPricing = NextDynamic(() => import("@/components/pricing").then(m => m.Pricing), {
  ssr: false,
  loading: () => null,
})