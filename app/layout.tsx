import type { Metadata } from "next"
import { Cormorant_Garamond, Outfit, IBM_Plex_Mono } from "next/font/google"
import { SmoothScroll } from "@/components/smooth-scroll"
import { SiteCursor } from "@/components/site-cursor"
import { SiteHeader } from "@/components/site-header"
import { site } from "@/lib/site"
import "./globals.css"

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
})

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
})

const plex = IBM_Plex_Mono({
  variable: "--font-plex",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
})

export const metadata: Metadata = {
  title: `${site.name} — Reforma e revenda de imóveis em ${site.city}`,
  description: `${site.name} atua em ${site.city} com aquisição, reforma e revenda de imóveis.`,
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`dark ${outfit.variable} ${cormorant.variable} ${plex.variable} h-full antialiased`}
    >
      <body className="bg-background min-h-full text-foreground">
        <div className="film-grain" aria-hidden />
        <SiteCursor />
        <SmoothScroll>
          <SiteHeader />
          {children}
        </SmoothScroll>
      </body>
    </html>
  )
}
