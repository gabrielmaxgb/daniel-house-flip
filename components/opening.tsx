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

export function Opening() {
  const root = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    const el = root.current
    if (!el) return

    const ctx = gsap.context(() => {
      if (reduced) {
        gsap.set([".hero-line", ".hero-title", ".hero-meta", ".hero-rule"], {
          autoAlpha: 1,
          y: 0,
        })
        return
      }

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } })
      tl.from(".hero-rule", { scaleX: 0, duration: 1.4, transformOrigin: "left center" })
        .from(
          ".hero-title",
          { yPercent: 110, duration: 1.55, ease: "power4.out" },
          0.15
        )
        .from(".hero-meta", { autoAlpha: 0, y: 18, duration: 1 }, 0.85)
        .from(".hero-line", { autoAlpha: 0, y: 12, duration: 0.9 }, 1)

      gsap.to(".hero-still", {
        scale: 1.08,
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      })
    }, el)

    return () => ctx.revert()
  }, [reduced])

  return (
    <section
      ref={root}
      className="relative flex min-h-dvh flex-col justify-end overflow-hidden px-5 pb-10 md:px-10 md:pb-14"
    >
      <div className="hero-still absolute inset-0 scale-100">
        <Image
          src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=2400&q=70"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-[0.22] saturate-[0.7]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/70 to-ink/40" />
      </div>

      <p className="hero-line relative mb-8 max-w-sm font-sans text-[11px] leading-relaxed tracking-[0.22em] text-cream/70 uppercase md:mb-12">
        {site.role} · {site.city}
      </p>

      <div className="relative overflow-hidden">
        <h1 className="hero-title font-serif text-[18vw] leading-[0.82] font-light tracking-[-0.04em] text-cream md:text-[10vw] md:whitespace-nowrap">
          Daniel Toledo
        </h1>
      </div>

      <div className="hero-meta relative mt-8 flex items-end justify-between gap-6 md:mt-10">
        <p className="max-w-lg font-serif text-xl leading-snug font-light text-cream/85 italic md:text-3xl">
          {site.tagline}
        </p>
        <span className="hidden font-mono text-[10px] tracking-[0.28em] text-cream/50 uppercase md:block">
          {site.city} — {site.state}
        </span>
      </div>

      <div className="hero-rule relative mt-10 h-px w-full origin-left bg-burgundy md:mt-14" />
    </section>
  )
}
