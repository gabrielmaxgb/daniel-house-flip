"use client"

import { usePathname, useRouter } from "next/navigation"
import { useLenis } from "lenis/react"
import { site } from "@/lib/site"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { useState } from "react"

const links = [
  { href: "/sobre", label: "Sobre" },
  { href: "/#exposicao", label: "Exposição" },
  { href: "/#contato", label: "Contato" },
] as const

export function SiteHeader() {
  const lenis = useLenis()
  const router = useRouter()
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const onHome = pathname === "/"

  const go = (href: string) => {
    setOpen(false)

    if (href.startsWith("/#")) {
      const hash = `#${href.split("#")[1]}`
      if (onHome) {
        lenis?.scrollTo(hash, { offset: 0, duration: 1.45 })
        return
      }
      router.push(href)
      return
    }

    if (href === pathname) return
    router.push(href)
  }

  const goHome = () => {
    if (onHome) {
      lenis?.scrollTo(0, { duration: 1.3 })
      return
    }
    router.push("/")
  }

  return (
    <header
      className={`pointer-events-none fixed inset-x-0 top-0 z-40 ${onHome ? "mix-blend-difference" : ""}`}
    >
      <div className="pointer-events-auto flex items-center justify-between px-5 py-6 md:px-10">
        <button
          type="button"
          onClick={goHome}
          className="cursor-pointer font-sans text-[11px] tracking-[0.32em] text-cream uppercase"
        >
          {site.name}
        </button>

        <nav className="hidden items-center gap-10 md:flex">
          {links.map((link) => (
            <button
              key={link.href}
              type="button"
              onClick={() => go(link.href)}
              className="cursor-pointer font-sans text-[11px] tracking-[0.28em] text-cream uppercase transition-opacity hover:opacity-60"
            >
              {link.label}
            </button>
          ))}
        </nav>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="rounded-none px-0 text-[11px] tracking-[0.28em] text-cream uppercase hover:bg-transparent hover:text-cream md:hidden"
            >
              Menu
            </Button>
          </SheetTrigger>
          <SheetContent
            side="right"
            className="border-l-cream/10 bg-ink w-full max-w-none gap-0 p-0 sm:max-w-none"
          >
            <SheetHeader className="p-6">
              <SheetTitle className="font-sans text-[11px] tracking-[0.32em] text-cream uppercase">
                {site.name}
              </SheetTitle>
            </SheetHeader>
            <nav className="flex flex-col gap-2 px-6 pt-8">
              {links.map((link) => (
                <button
                  key={link.href}
                  type="button"
                  onClick={() => go(link.href)}
                  className="cursor-pointer font-serif text-left text-5xl font-light tracking-tight text-cream italic"
                >
                  {link.label}
                </button>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
