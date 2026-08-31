"use client"

import { useEffect } from "react"
import { useLenis } from "lenis/react"

export function HashScroll() {
  const lenis = useLenis()

  useEffect(() => {
    if (!lenis) return
    const hash = window.location.hash
    if (!hash) return
    const id = window.setTimeout(() => {
      lenis.scrollTo(hash, { duration: 1.2 })
    }, 120)
    return () => window.clearTimeout(id)
  }, [lenis])

  return null
}
