import type { Metadata } from "next"
import { site } from "@/lib/site"
import { DanielPage } from "@/components/daniel-page"

export const metadata: Metadata = {
  title: `${site.fullName} — House flipping em ${site.city}`,
  description: `${site.fullName} trabalha com house flipping em ${site.city}: compra, reforma e revenda de imóveis.`,
}

export default function SobrePage() {
  return (
    <main>
      <DanielPage />
    </main>
  )
}
