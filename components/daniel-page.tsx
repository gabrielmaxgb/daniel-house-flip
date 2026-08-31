"use client"

import { useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { site } from "@/lib/site"
import { useReducedMotion } from "@/lib/use-reduced-motion"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

export function DanielPage() {
  const root = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    const el = root.current
    if (!el) return

    const ctx = gsap.context(() => {
      if (reduced) {
        gsap.set([".daniel-reveal", ".daniel-still"], { autoAlpha: 1, y: 0, scale: 1 })
        return
      }

      gsap.from(".daniel-still", {
        scale: 1.08,
        duration: 2.4,
        ease: "power3.out",
      })

      gsap.from(".daniel-reveal", {
        y: 40,
        autoAlpha: 0,
        duration: 1.25,
        ease: "power3.out",
        stagger: 0.1,
        delay: 0.25,
      })
    }, el)

    return () => ctx.revert()
  }, [reduced])

  return (
    <article ref={root} className="overflow-hidden bg-ink">
      <div className="relative lg:min-h-dvh">
        <div className="daniel-reveal relative order-1 lg:absolute lg:inset-y-0 lg:right-0 lg:w-[58%] xl:w-[60%]">
          <figure className="daniel-portrait relative mx-auto h-[74vh] min-h-[460px] w-full overflow-hidden sm:h-[78vh] lg:mx-0 lg:h-full lg:min-h-dvh lg:max-w-none">
            <Image
              src="/daniel-toledo.png"
              alt={`${site.fullName}, house flipper em ${site.city}`}
              fill
              priority
              sizes="(min-width: 1280px) 60vw, (min-width: 1024px) 58vw, 100vw"
              className="daniel-still object-cover object-[center_14%] saturate-[0.96] contrast-[1.04]"
            />
            <div
              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink via-ink/25 to-transparent lg:bg-gradient-to-r lg:from-ink lg:via-ink/55 lg:to-transparent"
              aria-hidden
            />
          </figure>
        </div>

        <div className="relative z-10 order-2 flex flex-col justify-end px-5 pb-20 pt-6 lg:min-h-dvh lg:w-[46%] lg:max-w-xl lg:flex-col lg:justify-center lg:px-10 lg:py-32 xl:px-14">
          <p className="daniel-reveal font-sans text-[11px] tracking-[0.32em] text-burgundy uppercase">
            Sobre
          </p>
          <h1 className="daniel-reveal mt-6 font-serif text-5xl leading-[0.92] font-light tracking-tight text-cream italic md:text-7xl">
            {site.fullName}
          </h1>
          <p className="daniel-reveal mt-6 font-sans text-[11px] tracking-[0.22em] text-cream/50 uppercase">
            House flipping · {site.city}
          </p>

          <div className="daniel-reveal mt-12 max-w-md space-y-5 font-sans text-base leading-relaxed text-cream/75 md:text-lg">
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris.
            </p>
            <p>
              Duis aute irure dolor in reprehenderit in voluptate velit esse
              cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
              cupidatat non proident, sunt in culpa qui officia deserunt
              mollit anim id est laborum.
            </p>
          </div>

          <ul className="daniel-reveal mt-14 flex flex-wrap gap-x-6 gap-y-2">
            {site.neighborhoods.map((place) => (
              <li
                key={place}
                className="font-sans text-[11px] tracking-[0.22em] text-cream/45 uppercase"
              >
                {place}
              </li>
            ))}
          </ul>

          <div className="daniel-reveal mt-16 grid gap-10 sm:grid-cols-2">
            <a
              href={site.instagramHref}
              target="_blank"
              rel="noopener noreferrer"
              className="group cursor-pointer border-t border-cream/15 pt-5 sm:col-span-2"
            >
              <span className="flex items-center gap-2 font-sans text-[11px] tracking-[0.28em] text-cream/50 uppercase">
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden
                  className="size-3.5 shrink-0 fill-current"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
                Instagram
              </span>
              <span className="mt-3 block font-serif text-2xl font-light text-cream transition-colors group-hover:text-burgundy md:text-3xl">
                {site.instagramHandle}
              </span>
            </a>
            <a
              href={site.whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="group cursor-pointer border-t border-cream/15 pt-5"
            >
              <span className="font-sans text-[11px] tracking-[0.28em] text-cream/50 uppercase">
                WhatsApp
              </span>
              <span className="mt-3 block font-serif text-xl font-light text-cream transition-colors group-hover:text-burgundy">
                {site.whatsappLabel}
              </span>
            </a>
            <a
              href={`mailto:${site.email}`}
              className="group cursor-pointer border-t border-cream/15 pt-5"
            >
              <span className="font-sans text-[11px] tracking-[0.28em] text-cream/50 uppercase">
                E-mail
              </span>
              <span className="mt-3 block font-serif text-xl font-light text-cream transition-colors group-hover:text-burgundy">
                {site.email}
              </span>
            </a>
          </div>

          <Link
            href="/#exposicao"
            className="daniel-reveal mt-10 inline-block cursor-pointer font-sans text-[11px] tracking-[0.28em] text-cream/50 uppercase transition-colors hover:text-cream"
          >
            Ver obras
          </Link>
        </div>
      </div>
    </article>
  )
}
