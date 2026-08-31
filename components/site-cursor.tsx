"use client"

import { useEffect, useRef } from "react"
import gsap from "gsap"
import { useReducedMotion } from "@/lib/use-reduced-motion"

const HIT = "a[href], button:not(:disabled), [role='button'], [data-cursor]"

function modeFrom(target: EventTarget | null) {
  if (!(target instanceof Element)) return "default"
  const hit = target.closest(HIT)
  if (!hit) return "default"
  if (hit.closest("[data-cursor='view']") || hit.getAttribute("data-cursor") === "view") {
    return "view"
  }
  return "hover"
}

export function SiteCursor() {
  const rootRef = useRef<HTMLDivElement>(null)
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    const root = rootRef.current
    const dot = dotRef.current
    const ring = ringRef.current
    if (!root || !dot || !ring || reduced) return
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return

    document.documentElement.classList.add("has-custom-cursor")

    gsap.set([dot, ring], { xPercent: -50, yPercent: -50 })
    const dotX = gsap.quickTo(dot, "x", { duration: 0.14, ease: "power3.out" })
    const dotY = gsap.quickTo(dot, "y", { duration: 0.14, ease: "power3.out" })
    const ringX = gsap.quickTo(ring, "x", { duration: 0.52, ease: "power3.out" })
    const ringY = gsap.quickTo(ring, "y", { duration: 0.52, ease: "power3.out" })

    let shown = false
    const hide = () => {
      shown = false
      gsap.to(root, { autoAlpha: 0, duration: 0.25 })
    }
    const show = () => {
      if (shown) return
      shown = true
      gsap.to(root, { autoAlpha: 1, duration: 0.25 })
    }

    const onMove = (e: PointerEvent) => {
      show()
      dotX(e.clientX)
      dotY(e.clientY)
      ringX(e.clientX)
      ringY(e.clientY)
      root.dataset.mode = modeFrom(e.target)
    }

    const onOver = (e: PointerEvent) => {
      root.dataset.mode = modeFrom(e.target)
    }

    const onOut = (e: PointerEvent) => {
      root.dataset.mode = modeFrom(e.relatedTarget)
    }

    window.addEventListener("pointermove", onMove)
    document.addEventListener("pointerover", onOver)
    document.addEventListener("pointerout", onOut)
    document.documentElement.addEventListener("mouseleave", hide)
    document.documentElement.addEventListener("mouseenter", show)

    return () => {
      document.documentElement.classList.remove("has-custom-cursor")
      window.removeEventListener("pointermove", onMove)
      document.removeEventListener("pointerover", onOver)
      document.removeEventListener("pointerout", onOut)
      document.documentElement.removeEventListener("mouseleave", hide)
      document.documentElement.removeEventListener("mouseenter", show)
    }
  }, [reduced])

  if (reduced) return null

  return (
    <div
      ref={rootRef}
      className="site-cursor"
      data-mode="default"
      aria-hidden
      style={{ opacity: 0 }}
    >
      <div ref={ringRef} className="site-cursor__ring">
        <span className="site-cursor__label">Ver obra</span>
      </div>
      <div ref={dotRef} className="site-cursor__dot">
        <i />
      </div>
    </div>
  )
}
