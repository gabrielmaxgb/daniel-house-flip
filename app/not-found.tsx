import Link from "next/link"
import { site } from "@/lib/site"

export default function NotFound() {
  return (
    <main className="flex min-h-dvh flex-col justify-between px-5 py-28 md:px-10 md:py-32">
      <div>
        <p className="font-sans text-[11px] tracking-[0.32em] text-burgundy uppercase">
          404
        </p>
        <h1 className="mt-8 font-serif text-6xl leading-[0.9] font-light tracking-tight text-cream italic md:text-8xl">
          Página não encontrada.
        </h1>
        <p className="mt-8 max-w-md font-sans text-base leading-relaxed text-cream/65">
          O endereço não existe ou foi movido. Volte ao início ou veja as obras
          em {site.city}.
        </p>
      </div>

      <nav className="mt-24 flex flex-col gap-6 border-t border-cream/15 pt-8 sm:flex-row sm:gap-12">
        <Link
          href="/"
          className="cursor-pointer font-sans text-[11px] tracking-[0.28em] text-cream uppercase transition-colors hover:text-burgundy"
        >
          Início
        </Link>
        <Link
          href="/#exposicao"
          className="cursor-pointer font-sans text-[11px] tracking-[0.28em] text-cream uppercase transition-colors hover:text-burgundy"
        >
          Exposição
        </Link>
        <Link
          href="/sobre"
          className="cursor-pointer font-sans text-[11px] tracking-[0.28em] text-cream uppercase transition-colors hover:text-burgundy"
        >
          Sobre
        </Link>
      </nav>
    </main>
  )
}
