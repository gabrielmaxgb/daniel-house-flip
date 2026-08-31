"use client"

import { useEffect } from "react"
import { ReactLenis, useLenis } from "lenis/react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

function GsapLenisBridge() {
  const lenis = useLenis()

  useEffect(() => {
    if (!lenis) return

    const onScroll = () => ScrollTrigger.update()
    lenis.on("scroll", onScroll)

    const onTick = (time: number) => {
      lenis.raf(time * 1000)
    }
    gsap.ticker.add(onTick)
    gsap.ticker.lagSmoothing(0)

    return () => {
      lenis.off("scroll", onScroll)
      gsap.ticker.remove(onTick)
    }
  }, [lenis])

  return null
}

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  return (
    <ReactLenis
      root
      options={{
        autoRaf: false,
        lerp: 0.075,
        duration: 1.15,
        smoothWheel: true,
      }}
    >
      <GsapLenisBridge />
      {children}
    </ReactLenis>
  )
}
