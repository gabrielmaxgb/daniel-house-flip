"use client"

import { useEffect, useRef } from "react"
import Image from "next/image"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { site } from "@/lib/site"
import { useReducedMotion } from "@/lib/use-reduced-motion"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

const places = [
  "Asa Norte",
  "Asa Sul",
  "Lago Sul",
  "Sudoeste",
  "Noroeste",
  "Park Way",
]

export function About() {
  const root = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    const el = root.current
    if (!el || reduced) return

    const ctx = gsap.context(() => {
      gsap.from(".about-reveal", {
        y: 48,
        autoAlpha: 0,
        duration: 1.2,
        ease: "power3.out",
        stagger: 0.12,
        scrollTrigger: {
          trigger: el,
          start: "top 72%",
        },
      })
    }, el)

    return () => ctx.revert()
  }, [reduced])

  return (
    <section
      id="sobre"
      ref={root}
      className="relative border-t border-cream/10 px-5 py-28 md:px-10 md:py-40"
    >
      <div className="grid items-start gap-16 lg:grid-cols-12 lg:gap-10">
        <h2 className="about-reveal font-sans text-[11px] tracking-[0.32em] text-burgundy uppercase lg:col-span-2">
          House Flipping
        </h2>

        <div className="about-reveal lg:col-span-6">
          <div className="max-w-xl space-y-5 font-sans text-base leading-relaxed text-cream/75 md:text-lg">
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
        </div>

        <figure className="about-reveal relative aspect-3/4 w-full overflow-hidden lg:col-span-4">
          <Image
            src="https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&w=1400&q=80"
            alt={`Arquitetura em ${site.city}`}
            fill
            sizes="(min-width: 1024px) 30vw, 100vw"
            className="object-cover saturate-[0.75]"
          />
          <figcaption className="absolute right-4 bottom-4 font-mono text-[10px] tracking-[0.22em] text-cream uppercase">
            {site.city}
          </figcaption>
        </figure>
      </div>

      <ul className="about-reveal mt-24 flex flex-wrap gap-x-8 gap-y-3 border-t border-cream/10 pt-8">
        {places.map((place) => (
          <li
            key={place}
            className="font-sans text-[11px] tracking-[0.24em] text-cream/55 uppercase"
          >
            {place}
          </li>
        ))}
      </ul>
    </section>
  )
}
