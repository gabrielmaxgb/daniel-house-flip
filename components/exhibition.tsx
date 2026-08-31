"use client"

import Image from "next/image"
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react"
import { createPortal } from "react-dom"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useLenis } from "lenis/react"
import { XIcon } from "lucide-react"
import { projects, type Project } from "@/lib/projects"
import { setCursorOverride } from "@/lib/cursor"
import { useReducedMotion } from "@/lib/use-reduced-motion"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

type OpenState = {
  project: Project
  origin: DOMRect
  thumb: HTMLElement
}

export function Exhibition() {
  const sectionRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const activeRef = useRef(0)
  const [active, setActive] = useState(0)
  const [open, setOpen] = useState<OpenState | null>(null)
  const [mounted, setMounted] = useState(false)
  const reduced = useReducedMotion()
  const lenis = useLenis()

  useEffect(() => setMounted(true), [])

  useEffect(() => {
    const section = sectionRef.current
    const track = trackRef.current
    if (!section || !track || reduced) return

    const ctx = gsap.context(() => {
      const getDistance = () =>
        Math.max(0, track.scrollWidth - window.innerWidth)

      const scrollTween = gsap.to(track, {
        x: () => -getDistance(),
        ease: "none",
        scrollTrigger: {
          trigger: section,
          pin: true,
          scrub: 0.7,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          end: () => `+=${getDistance()}`,
          onUpdate: () => {
            const frames = track.querySelectorAll<HTMLElement>("[data-project-frame]")
            const center = window.innerWidth / 2
            let closest = 0
            let min = Infinity
            frames.forEach((frame, i) => {
              const rect = frame.getBoundingClientRect()
              const d = Math.abs(rect.left + rect.width / 2 - center)
              if (d < min) {
                min = d
                closest = i
              }
            })
            if (closest !== activeRef.current) {
              activeRef.current = closest
              setActive(closest)
            }
          },
        },
      })

      track.querySelectorAll<HTMLElement>(".frame-shift").forEach((shift) => {
        const frame = shift.closest("[data-project-frame]")
        if (!frame) return
        gsap.fromTo(
          shift,
          { xPercent: -8 },
          {
            xPercent: 8,
            ease: "none",
            scrollTrigger: {
              trigger: frame,
              containerAnimation: scrollTween,
              start: "left right",
              end: "right left",
              scrub: true,
            },
          }
        )
      })
    }, section)

    const onResize = () => ScrollTrigger.refresh()
    window.addEventListener("resize", onResize)

    return () => {
      window.removeEventListener("resize", onResize)
      ctx.revert()
    }
  }, [reduced])

  const openProject = useCallback(
    (project: Project, thumb: HTMLElement) => {
      if (open) return
      const origin = thumb.getBoundingClientRect()
      thumb.style.opacity = "0"
      setOpen({ project, origin, thumb })
      lenis?.stop()
    },
    [lenis, open]
  )

  const closeProject = useCallback(() => {
    setOpen(null)
  }, [])

  const current = projects[active] ?? projects[0]

  return (
    <section
      id="exposicao"
      ref={sectionRef}
      className="relative h-dvh overflow-hidden bg-ink"
    >
      <div
        ref={trackRef}
        className={
          reduced
            ? "flex h-full items-center gap-[12vw] overflow-x-auto px-[8vw]"
            : "flex h-full w-max items-center will-change-transform"
        }
      >
        <div className="flex h-full w-[88vw] shrink-0 flex-col justify-center px-5 md:w-[56vw] md:px-16">
          <p className="font-sans text-[11px] tracking-[0.32em] text-burgundy uppercase">
            Exposição
          </p>
          <h2 className="mt-6 font-serif text-6xl leading-[0.9] font-light text-cream italic md:text-8xl">
            Obras em Brasília.
          </h2>
          <p className="mt-8 max-w-sm font-sans text-sm leading-relaxed text-cream/55">
            Seis imóveis reformados e revendidos entre 2023 e 2025.
          </p>
        </div>

        {projects.map((project, i) => {
          const portrait = i % 2 === 0
          return (
            <article
              key={project.id}
              data-project-frame
              className="flex h-full shrink-0 items-center px-4 md:px-10"
              style={{ width: portrait ? "min(72vw, 560px)" : "min(84vw, 860px)" }}
            >
              <button
                type="button"
                aria-haspopup="dialog"
                data-cursor="view"
                className="group w-full cursor-pointer text-left"
                onClick={(e) => {
                  const thumb = e.currentTarget.querySelector("[data-thumb]")
                  if (thumb instanceof HTMLElement) openProject(project, thumb)
                }}
                onPointerEnter={() => setCursorOverride("view")}
                onPointerLeave={() => setCursorOverride(null)}
              >
                <figure>
                  <div
                    data-thumb
                    className={`relative overflow-hidden ${portrait ? "aspect-4/5" : "aspect-16/10"} max-h-[72vh] w-full`}
                  >
                    <div className="frame-shift absolute inset-y-0 -left-[12%] h-full w-[124%]">
                      <Image
                        src={project.image}
                        alt={`${project.title}, ${project.neighborhood}`}
                        fill
                        sizes="80vw"
                        className="object-cover saturate-[0.82] transition-[filter] duration-700 group-hover:saturate-100"
                      />
                    </div>
                  </div>
                  <figcaption className="mt-5">
                    <p className="font-mono text-[10px] tracking-[0.28em] text-burgundy">
                      {project.index}
                    </p>
                    <p className="mt-2 font-serif text-3xl font-light text-cream italic md:text-4xl">
                      {project.title}
                    </p>
                    <p className="mt-1 font-sans text-[11px] tracking-[0.22em] text-cream/50 uppercase">
                      {project.neighborhood} · {project.year}
                    </p>
                  </figcaption>
                </figure>
              </button>
            </article>
          )
        })}

        <div className="w-[18vw] shrink-0" aria-hidden />
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex items-end justify-between px-5 py-6 md:px-10">
        <p className="font-mono text-[11px] tracking-[0.28em] text-cream/70">
          {current.index} / {String(projects.length).padStart(2, "0")}
        </p>
        <p className="max-w-[50%] text-right font-sans text-[11px] tracking-[0.2em] text-cream/45 uppercase">
          {current.neighborhood}
        </p>
      </div>

      {mounted && open
        ? createPortal(
            <ProjectOverlay
              state={open}
              reduced={reduced}
              onClosed={() => {
                open.thumb.style.opacity = ""
                lenis?.start()
                closeProject()
              }}
            />,
            document.body
          )
        : null}
    </section>
  )
}

function ProjectOverlay({
  state,
  reduced,
  onClosed,
}: {
  state: OpenState
  reduced: boolean
  onClosed: () => void
}) {
  const { project, origin } = state
  const rootRef = useRef<HTMLDivElement>(null)
  const heroRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const closing = useRef(false)

  const close = useCallback(() => {
    if (closing.current) return
    closing.current = true
    const hero = heroRef.current
    const panel = panelRef.current
    const root = rootRef.current
    if (!hero || !panel || !root || reduced) {
      onClosed()
      return
    }

    const tl = gsap.timeline({
      onComplete: onClosed,
    })
    tl.to(panel, { autoAlpha: 0, x: 24, duration: 0.35, ease: "power2.in" }, 0)
    tl.to(
      hero,
      {
        top: origin.top,
        left: origin.left,
        width: origin.width,
        height: origin.height,
        duration: 0.85,
        ease: "power3.inOut",
      },
      0.12
    )
    tl.to(root, { backgroundColor: "rgba(12,11,10,0)", duration: 0.4 }, 0.2)
  }, [onClosed, origin, reduced])

  useLayoutEffect(() => {
    const hero = heroRef.current
    const panel = panelRef.current
    const root = rootRef.current
    if (!hero || !panel || !root) return

    if (reduced) {
      gsap.set(hero, { clearProps: "all" })
      gsap.set(panel, { autoAlpha: 1 })
      return
    }

    gsap.set(hero, {
      position: "fixed",
      top: origin.top,
      left: origin.left,
      width: origin.width,
      height: origin.height,
      zIndex: 2,
    })
    gsap.set(panel, { autoAlpha: 0, x: 32 })
    gsap.set(root, { backgroundColor: "rgba(12,11,10,0)" })

    const mm = gsap.matchMedia()
    mm.add("(min-width: 768px)", () => {
      const tl = gsap.timeline()
      tl.to(root, { backgroundColor: "rgba(12,11,10,1)", duration: 0.5 }, 0)
      tl.to(
        hero,
        {
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          duration: 1.05,
          ease: "power3.inOut",
        },
        0
      )
      tl.to(
        hero,
        {
          width: "56vw",
          duration: 0.9,
          ease: "power2.inOut",
        },
        "+=0.1"
      )
      tl.to(
        panel,
        { autoAlpha: 1, x: 0, duration: 0.75, ease: "power3.out" },
        "-=0.5"
      )
    })
    mm.add("(max-width: 767px)", () => {
      const tl = gsap.timeline()
      tl.to(root, { backgroundColor: "rgba(12,11,10,1)", duration: 0.4 }, 0)
      tl.to(
        hero,
        {
          top: 0,
          left: 0,
          width: "100vw",
          height: "42vh",
          duration: 0.9,
          ease: "power3.inOut",
        },
        0
      )
      tl.to(panel, { autoAlpha: 1, x: 0, duration: 0.55 }, "-=0.25")
    })

    return () => mm.revert()
  }, [origin, reduced])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [close])

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[60] bg-ink"
      role="dialog"
      aria-modal="true"
      aria-labelledby="project-title"
    >
      <button
        type="button"
        onClick={close}
        className="fixed top-5 right-5 z-30 flex cursor-pointer items-center gap-2.5 text-cream md:top-8 md:right-10"
        aria-label="Fechar visualização"
      >
        <span className="font-sans text-[11px] tracking-[0.28em] uppercase">
          Fechar
        </span>
        <XIcon className="size-4" strokeWidth={1.5} />
      </button>

      <div
        ref={heroRef}
        className="overflow-hidden"
        style={{
          position: "fixed",
          top: origin.top,
          left: origin.left,
          width: origin.width,
          height: origin.height,
          zIndex: 2,
        }}
      >
        <Image
          src={project.image}
          alt={project.title}
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
      </div>

      <div
        ref={panelRef}
        className="absolute inset-x-0 bottom-0 z-10 flex max-h-[58vh] flex-col overflow-y-auto border-t border-cream/10 bg-ink px-5 py-8 pt-16 md:inset-y-0 md:left-[56vw] md:max-h-none md:border-t-0 md:border-l md:px-12 md:pt-24 md:pb-16"
        data-lenis-prevent
      >
        <p className="font-mono text-[10px] tracking-[0.28em] text-burgundy">
          {project.index} / {String(projects.length).padStart(2, "0")}
        </p>
        <h3
          id="project-title"
          className="mt-5 font-serif text-4xl font-light text-cream italic md:text-6xl"
        >
          {project.title}
        </h3>
        <p className="mt-2 font-sans text-[11px] tracking-[0.22em] text-cream/50 uppercase">
          {project.neighborhood} · {project.year}
        </p>
        <p className="mt-8 max-w-md font-sans text-base leading-relaxed text-cream/75">
          {project.what}
        </p>

        <dl className="mt-10 grid grid-cols-2 gap-8">
          <div>
            <dt className="font-sans text-[10px] tracking-[0.24em] text-cream/40 uppercase">
              Prazo
            </dt>
            <dd className="mt-2 font-serif text-2xl text-cream italic">
              {project.duration}
            </dd>
          </div>
          <div>
            <dt className="font-sans text-[10px] tracking-[0.24em] text-cream/40 uppercase">
              Área
            </dt>
            <dd className="mt-2 font-serif text-2xl text-cream italic">
              {project.area}
            </dd>
          </div>
        </dl>

        <div className="mt-12 grid grid-cols-2 gap-3">
          <figure className="relative aspect-4/5 overflow-hidden">
            <Image
              src={project.before}
              alt={`Antes, ${project.title}`}
              fill
              sizes="30vw"
              className="object-cover saturate-50"
            />
            <figcaption className="absolute bottom-3 left-3 font-mono text-[10px] tracking-[0.2em] text-cream uppercase">
              Antes
            </figcaption>
          </figure>
          <figure className="relative aspect-4/5 overflow-hidden">
            <Image
              src={project.after}
              alt={`Depois, ${project.title}`}
              fill
              sizes="30vw"
              className="object-cover"
            />
            <figcaption className="absolute bottom-3 left-3 font-mono text-[10px] tracking-[0.2em] text-cream uppercase">
              Depois
            </figcaption>
          </figure>
        </div>
      </div>
    </div>
  )
}
