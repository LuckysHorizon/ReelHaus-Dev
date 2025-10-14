import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import Script from "next/script"
import dynamic from "next/dynamic"
import { QuickNavigation } from "@/components/quick-navigation"

const inter = Inter({ subsets: ["latin"], display: "swap", variable: "--font-inter" })
const Plasma = dynamic(() => import("@/components/plasma"), { ssr: false, loading: () => null })

export const metadata: Metadata = {
  title: "ReelHaus | Premium Club Events Portal",
  description:
    "Discover and register for exclusive club events. Secure payments, instant QR codes, and seamless event management.",
  generator: "Next.js",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        {/* Removed manual font preload to avoid 404; next/font handles preload safely */}

        {/* Dynamic Favicon Script */}
        <Script id="dynamic-favicon" strategy="beforeInteractive">
          {`
            function updateFavicon() {
              const darkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
              const faviconHref = darkMode ? '/icons/reelhaus-white.svg' : '/icons/favicon-dark.svg';
              let link = document.querySelector("link[rel~='icon']");
              if (!link) { link = document.createElement('link'); link.rel = 'icon'; document.head.appendChild(link); }
              link.href = faviconHref;
            }
            updateFavicon();
            window.matchMedia('(prefers-color-scheme: dark)')?.addEventListener('change', updateFavicon);
          `}
        </Script>

        {/* Google Tag Manager (deferred) */}
        <Script id="gtm-script" strategy="lazyOnload">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','GTM-NFLHXXGK');`}
        </Script>

        {/* Google Analytics (deferred) */}
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-W6LV22900R" strategy="lazyOnload" />
        <Script id="gtag-init" strategy="lazyOnload">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', 'G-W6LV22900R');
          `}
        </Script>
      </head>
      <body>
        <div className="fixed inset-0 z-0 bg-gradient-to-br from-black via-gray-900 to-black">
          <Plasma color="#DC2626" speed={0.6} direction="forward" scale={1.4} opacity={0.25} mouseInteractive={false} />
        </div>
        <div className="relative z-10">{children}</div>
        <QuickNavigation />
        {/* Razorpay only needed on payment routes; keep lazy */}
        <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      </body>
    </html>
  )
}
