"use client"

import { useEffect, useRef } from "react"
import type { Variants } from "framer-motion"
import { motion } from "framer-motion"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

/* ── Variantes Framer Motion (header da seção) ──────────────── */
const EASE = [0.22, 1, 0.36, 1] as const

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [...EASE] } },
}

const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
}

/* ── Dados dos steps ────────────────────────────────────────── */
const STEPS = [
  {
    num: "01",
    title: "Sobe o produto",
    desc: "Imagem, URL ou ficha — sem briefing.",
  },
  {
    num: "02",
    title: "Escolhe o modelo",
    desc: "Veo pra cinemático. Nano Banana pra imagem. Kling pra motion.",
  },
  {
    num: "03",
    title: "Monta o workflow",
    desc: "Uma vez. Reutilizável — por cliente, por SKU, por formato.",
  },
  {
    num: "04",
    title: "Conteúdo pronto",
    desc: "UGC, imagem e vídeo. 60 segundos. Pronto pra publicar.",
  },
] as const

/* ── Componente ─────────────────────────────────────────────── */
export function Mecanismo() {
  const sectionRef = useRef<HTMLElement>(null)
  const connectorTrackRef = useRef<HTMLDivElement>(null)
  const connectorFillRef = useRef<HTMLDivElement>(null)
  const stepRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches

    /* Sem animação — exibe tudo ativo imediatamente */
    if (prefersReduced) {
      if (connectorFillRef.current) {
        connectorFillRef.current.style.height = "100%"
      }
      stepRefs.current.forEach((el) => {
        if (!el) return
        el.style.opacity = "1"
        el.style.borderLeftColor = "var(--color-forge-orange)"
      })
      return
    }

    gsap.registerPlugin(ScrollTrigger)

    const ctx = gsap.context(() => {
      /* ── Linha conectora: height 0 → 100% com scrub ───────── */
      gsap.to(connectorFillRef.current, {
        height: "100%",
        ease: "none",
        scrollTrigger: {
          trigger: connectorTrackRef.current,
          start: "top 60%",
          end: "bottom 55%",
          scrub: 0.8,
        },
      })

      /* ── Steps: opacity 0.2→1, border inativa→orange ─────── */
      stepRefs.current.forEach((el) => {
        if (!el) return

        gsap.to(el, {
          opacity: 1,
          borderLeftColor: "#FF4D00",
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top 72%",
            end: "top 38%",
            scrub: 0.5,
          },
        })
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      id="mecanismo"
      ref={sectionRef}
      style={{ background: "var(--color-forge-black)" }}
    >
      <div className="mx-auto max-w-7xl px-6 py-24 lg:py-32">

        {/* Header — Framer Motion */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={stagger}
          className="mb-16 max-w-2xl"
        >
          <motion.p
            variants={fadeUp}
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "var(--color-forge-orange)",
              marginBottom: 16,
            }}
          >
            O Mecanismo
          </motion.p>

          <motion.h2
            variants={fadeUp}
            style={{
              fontFamily: "var(--font-bebas)",
              fontSize: "clamp(36px, 5.5vw, 56px)",
              lineHeight: 1,
              letterSpacing: "3px",
              color: "var(--color-forge-white)",
              marginBottom: 20,
            }}
          >
            O Forge Engine.
          </motion.h2>

          <motion.p
            variants={fadeUp}
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: 16,
              lineHeight: 1.7,
              color: "var(--color-forge-muted)",
            }}
          >
            A MotionForge não usa um modelo de IA. Usa um time deles. O Forge
            Engine conecta Nano Banana Pro, Veo 3.1, Seedance, Kling, GPT Image
            2 e Omni em workflows que você monta uma vez e executa em escala.
          </motion.p>
        </motion.div>

        {/* Steps + linha conectora — GSAP ScrollTrigger */}
        <div className="flex gap-8 max-w-2xl" ref={connectorTrackRef}>

          {/* Trilho da linha conectora */}
          <div
            className="relative flex-shrink-0"
            style={{
              width: 2,
              background: "rgba(255,255,255,0.08)",
              /* alinhado à altura dos steps */
              marginTop: 6,
              marginBottom: 6,
            }}
          >
            {/* Fill laranja que cresce de cima pra baixo */}
            <div
              ref={connectorFillRef}
              className="absolute top-0 left-0 w-full"
              style={{
                height: "0%",
                background: "var(--color-forge-orange)",
              }}
            />
          </div>

          {/* Lista de steps */}
          <div className="flex flex-col gap-10 flex-1">
            {STEPS.map((step, i) => (
              <div
                key={step.num}
                ref={(el) => {
                  stepRefs.current[i] = el
                }}
                style={{
                  opacity: 0.2,
                  borderLeftWidth: 3,
                  borderLeftStyle: "solid",
                  borderLeftColor: "rgba(255,255,255,0.06)",
                  paddingLeft: 20,
                }}
              >
                {/* Número */}
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: "0.15em",
                    color: "var(--color-forge-orange)",
                    display: "block",
                    marginBottom: 6,
                  }}
                >
                  {step.num}
                </span>

                {/* Título */}
                <h3
                  style={{
                    fontFamily: "var(--font-bebas)",
                    fontSize: "clamp(22px, 2.5vw, 28px)",
                    lineHeight: 1,
                    letterSpacing: "2px",
                    color: "var(--color-forge-white)",
                    marginBottom: 6,
                  }}
                >
                  {step.title}
                </h3>

                {/* Descrição */}
                <p
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: 15,
                    lineHeight: 1.55,
                    color: "var(--color-forge-muted)",
                    margin: 0,
                  }}
                >
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
