"use client"

import type { Variants } from "framer-motion"
import { motion } from "framer-motion"
import { Logo } from "@/components/ui/logo"
import { NumberTicker } from "@/components/ui/number-ticker"
import { trackEvent } from "@/lib/pixels"

/* ── Easing & variantes do brandbook ────────────────────────── */
const EASE = [0.22, 1, 0.36, 1] as const

const forgeIn: Variants = {
  hidden: { opacity: 0, scale: 1.08 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: [...EASE] } },
}

/* fadeUp com delay configurável via `custom` */
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [...EASE], delay },
  }),
}

const metrics = [
  { value: 4800, label: "vídeos gerados essa semana" },
  { value: 1240, label: "lojas ativas" },
  { value: 87, label: "agências escalando" },
] as const

/* ── Componente ─────────────────────────────────────────────── */
export function Hero() {
  return (
    <section
      id="hero"
      className="relative overflow-hidden"
      style={{ minHeight: "100svh", display: "flex", flexDirection: "column", justifyContent: "center" }}
    >
      {/* Fundo: grid de linhas finas */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
          `,
          backgroundSize: "64px 64px",
        }}
      />

      {/* Fundo: spotlight laranja difuso — canto superior direito */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 55% at 92% -8%, rgba(255,77,0,0.18) 0%, transparent 65%)",
        }}
      />

      {/* Conteúdo */}
      <div className="relative mx-auto w-full max-w-7xl px-6 py-24 lg:py-32">

        {/* Label */}
        <motion.p
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={0}
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "var(--color-forge-orange)",
            marginBottom: 20,
          }}
        >
          Para TikTok Shop e Agências de Conteúdo
        </motion.p>

        {/* Logo hero — forgeIn */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={forgeIn}
          style={{ marginBottom: 20 }}
        >
          <Logo size="hero" />
        </motion.div>

        {/* Headline — forgeIn delay 0.1s */}
        <motion.h1
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={0.1}
          style={{
            fontFamily: "var(--font-bebas)",
            fontSize: "clamp(48px, 8vw, 96px)",
            lineHeight: 1,
            letterSpacing: "3px",
            color: "var(--color-forge-white)",
            marginBottom: 24,
          }}
        >
          Seu produto. Vídeo pronto. 60 segundos.
        </motion.h1>

        {/* Subtítulo — fadeUp delay 0.2s */}
        <motion.p
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={0.2}
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: 18,
            lineHeight: 1.65,
            color: "var(--color-forge-muted)",
            maxWidth: 560,
            marginBottom: 12,
          }}
        >
          Da imagem ao UGC publicável — sem briefing, sem stack, sem espera.{" "}
          Você escolhe o modelo. A MotionForge monta o workflow.
        </motion.p>

        {/* Modelos disponíveis — fadeUp delay 0.3s */}
        <motion.p
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={0.3}
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: 14,
            color: "var(--color-forge-muted)",
            marginBottom: 36,
          }}
        >
          Nano Banana Pro. Veo 3.1. Seedance. Kling. GPT Image 2. Tudo no mesmo lugar.
        </motion.p>

        {/* CTAs — fadeUp delay 0.4s */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={0.4}
          className="flex flex-col gap-3 sm:flex-row"
          style={{ marginBottom: 28 }}
        >
          <a
            href="#planos"
            className="inline-flex items-center justify-center font-bold text-sm uppercase tracking-wide px-8 py-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 sm:w-auto w-full"
            style={{
              background: "var(--color-forge-orange)",
              color: "#FFFFFF",
              boxShadow: "0 0 28px rgba(255,77,0,0.38)",
              transition: "box-shadow 220ms ease, transform 220ms ease",
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLAnchorElement
              el.style.boxShadow = "0 0 48px rgba(255,77,0,0.62)"
              el.style.transform = "scale(1.025)"
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLAnchorElement
              el.style.boxShadow = "0 0 28px rgba(255,77,0,0.38)"
              el.style.transform = "scale(1)"
            }}
            onClick={() => trackEvent("InitiateCheckout", { content_name: "CTA Hero" })}
          >
            Ver planos
          </a>
          <a
            href="#mecanismo"
            className="inline-flex items-center justify-center font-bold text-sm uppercase tracking-wide px-8 py-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 sm:w-auto w-full"
            style={{
              background: "transparent",
              color: "var(--color-forge-white)",
              border: "1px solid rgba(255,255,255,0.22)",
              transition: "border-color 220ms ease, transform 220ms ease",
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLAnchorElement
              el.style.borderColor = "rgba(255,255,255,0.55)"
              el.style.transform = "scale(1.015)"
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLAnchorElement
              el.style.borderColor = "rgba(255,255,255,0.22)"
              el.style.transform = "scale(1)"
            }}
            onClick={() => trackEvent("ViewContent", { content_name: "Como funciona" })}
          >
            Ver como funciona
          </a>
        </motion.div>

        {/* Social proof — fadeUp delay 0.5s */}
        <motion.p
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={0.5}
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: 13,
            color: "var(--color-forge-muted)",
            marginBottom: 48,
          }}
        >
          Amado por 1.240 lojas e 87 agências de TikTok Shop.
        </motion.p>

        {/* Barra de métricas — fadeIn delay 0.6s */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, ease: [...EASE], delay: 0.6 }}
          className="grid grid-cols-2 lg:grid-cols-3 gap-8 pt-8"
          style={{ borderTop: "1px solid var(--color-forge-border)" }}
        >
          {metrics.map(({ value, label }) => (
            <div key={label} className="flex flex-col gap-1.5">
              <NumberTicker
                value={value}
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "clamp(28px, 4vw, 44px)",
                  fontWeight: 700,
                  color: "var(--color-forge-cyan)",
                  lineHeight: 1,
                  display: "block",
                  textShadow: "0 0 20px rgba(0,229,255,0.45)",
                }}
              />
              <span
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: 13,
                  color: "var(--color-forge-muted)",
                  lineHeight: 1.4,
                }}
              >
                {label}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
