"use client"

import { useEffect, useState } from "react"
import type { Variants } from "framer-motion"
import { motion, AnimatePresence } from "framer-motion"
import { Logo } from "@/components/ui/logo"
import { NumberTicker } from "@/components/ui/number-ticker"
import { trackEvent } from "@/lib/pixels"

/* ── Easing & variantes do brandbook ────────────────────────── */
const EASE = [0.22, 1, 0.36, 1] as const

const forgeIn: Variants = {
  hidden: { opacity: 0, scale: 1.08 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: [...EASE] } },
}

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
  { value: 87,   label: "agências escalando" },
] as const

/* ── Mockup animado do Forge Engine ─────────────────────────── */
const STAGES = [
  { label: "Analisando produto...",        pct: 18,  done: false },
  { label: "Gerando roteiro · GPT-4o",     pct: 44,  done: false },
  { label: "Renderizando · Veo 3.1 Lite",  pct: 74,  done: false },
  { label: "Aplicando áudio + legendas",   pct: 89,  done: false },
  { label: "✓  Vídeo pronto — 52s",        pct: 100, done: true  },
]
const STAGE_DELAYS = [1100, 1500, 1900, 1300]

function ForgeMockup() {
  const [stage, setStage] = useState(0)

  useEffect(() => {
    const isDone = STAGES[stage].done
    if (isDone) {
      const t = setTimeout(() => setStage(0), 4000)
      return () => clearTimeout(t)
    }
    const t = setTimeout(() => setStage((s) => s + 1), STAGE_DELAYS[stage] ?? 1500)
    return () => clearTimeout(t)
  }, [stage])

  const current = STAGES[stage]
  const isDone  = current.done

  return (
    <div
      style={{
        background: "var(--color-forge-graphite)",
        border: "1px solid var(--color-forge-border)",
        padding: "22px 20px",
        fontFamily: "var(--font-mono)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Scanline quando processando */}
      {!isDone && (
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(transparent 0%, rgba(0,229,255,0.025) 50%, transparent 100%)",
            animation: "scanline 2.2s linear infinite",
            pointerEvents: "none",
          }}
        />
      )}

      {/* Cabeçalho */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 14,
        }}
      >
        <span
          style={{
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: "0.18em",
            color: "var(--color-forge-orange)",
            textTransform: "uppercase",
          }}
        >
          Forge Engine
        </span>
        <span
          style={{
            fontSize: 10,
            color: isDone ? "var(--color-forge-cyan)" : "rgba(255,255,255,0.4)",
            display: "flex",
            alignItems: "center",
            gap: 5,
          }}
        >
          <motion.span
            animate={isDone ? { opacity: 1 } : { opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.2, repeat: isDone ? 0 : Infinity }}
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: isDone
                ? "var(--color-forge-cyan)"
                : "var(--color-forge-orange)",
              display: "inline-block",
              boxShadow: isDone
                ? "0 0 8px rgba(0,229,255,0.8)"
                : "0 0 8px rgba(255,77,0,0.7)",
            }}
          />
          {isDone ? "PRONTO" : "LIVE"}
        </span>
      </div>

      {/* Placeholder do produto */}
      <div
        style={{
          height: 96,
          background:
            "linear-gradient(135deg, rgba(255,77,0,0.10) 0%, rgba(0,229,255,0.06) 100%)",
          border: "1px solid var(--color-forge-border)",
          marginBottom: 14,
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        {/* grid interior */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
            backgroundSize: "18px 18px",
          }}
        />
        <span style={{ fontSize: 10, color: "rgba(255,255,255,0.18)", letterSpacing: "0.12em" }}>
          PRODUTO · SKU #2847
        </span>
        <div
          style={{
            position: "absolute",
            bottom: 6,
            left: 8,
            right: 8,
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <span style={{ fontSize: 9, color: "var(--color-forge-orange)", opacity: 0.65 }}>
            TikTok Shop BR
          </span>
          <span style={{ fontSize: 9, color: "rgba(255,255,255,0.2)" }}>.png · 1080px</span>
        </div>
      </div>

      {/* Lista de estágios */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 7,
          marginBottom: 14,
          minHeight: 92,
        }}
      >
        <AnimatePresence initial={false}>
          {STAGES.slice(0, stage + 1).map((s, i) => {
            const isActive  = i === stage
            const isCompleted = i < stage || s.done
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1,  x: 0 }}
                transition={{ duration: 0.28 }}
                style={{ display: "flex", alignItems: "center", gap: 7 }}
              >
                <span
                  style={{
                    fontSize: 9,
                    color: s.done
                      ? "var(--color-forge-cyan)"
                      : isCompleted
                      ? "rgba(255,255,255,0.3)"
                      : "var(--color-forge-orange)",
                    lineHeight: 1,
                  }}
                >
                  {s.done || isCompleted ? "✓" : "›"}
                </span>
                <span
                  style={{
                    fontSize: 11,
                    color: s.done
                      ? "var(--color-forge-cyan)"
                      : isActive
                      ? "var(--color-forge-white)"
                      : "rgba(255,255,255,0.28)",
                    fontWeight: isActive ? 600 : 400,
                  }}
                >
                  {s.label}
                </span>
                {isActive && !s.done && (
                  <motion.span
                    animate={{ opacity: [1, 0, 1] }}
                    transition={{ duration: 0.75, repeat: Infinity }}
                    style={{ fontSize: 11, color: "var(--color-forge-orange)", lineHeight: 1 }}
                  >
                    ▋
                  </motion.span>
                )}
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>

      {/* Barra de progresso */}
      <div style={{ height: 2, background: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
        <div
          style={{
            height: "100%",
            width: `${current.pct}%`,
            background: isDone
              ? "var(--color-forge-cyan)"
              : "var(--color-forge-orange)",
            transition: "width 0.85s cubic-bezier(0.22,1,0.36,1)",
            boxShadow: isDone
              ? "0 0 10px rgba(0,229,255,0.55)"
              : "0 0 10px rgba(255,77,0,0.45)",
          }}
        />
      </div>

      {/* Percentual */}
      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 5 }}>
        <span
          style={{
            fontSize: 10,
            color: isDone ? "var(--color-forge-cyan)" : "var(--color-forge-muted)",
          }}
        >
          {current.pct}%
        </span>
      </div>
    </div>
  )
}

/* ── Componente Hero ─────────────────────────────────────────── */
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

      {/* Spotlight laranja difuso */}
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

        {/* Layout 2 colunas no desktop */}
        <div className="grid lg:grid-cols-[1fr_380px] xl:grid-cols-[1fr_420px] gap-12 xl:gap-20 items-center mb-16 lg:mb-20">

          {/* Coluna esquerda — texto */}
          <div>
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

            {/* Logo hero */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={forgeIn}
              style={{ marginBottom: 20 }}
            >
              <Logo size="hero" />
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              custom={0.1}
              style={{
                fontFamily: "var(--font-bebas)",
                fontSize: "clamp(48px, 7vw, 88px)",
                lineHeight: 1,
                letterSpacing: "3px",
                color: "var(--color-forge-white)",
                marginBottom: 24,
              }}
            >
              Seu Produto.<br />Vídeo Pronto.<br />Em 60 Segundos.
            </motion.h1>

            {/* Subtítulo */}
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
                maxWidth: 520,
                marginBottom: 12,
              }}
            >
              Da imagem ao UGC publicável — sem briefing, sem stack, sem espera.{" "}
              Você escolhe o modelo. A MotionForge monta o workflow.
            </motion.p>

            {/* Modelos disponíveis */}
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

            {/* CTAs */}
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

            {/* Social proof text */}
            <motion.p
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              custom={0.5}
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: 13,
                color: "var(--color-forge-muted)",
              }}
            >
              Amado por 1.240 lojas e 87 agências de TikTok Shop.
            </motion.p>
          </div>

          {/* Coluna direita — mockup (apenas desktop) */}
          <motion.div
            className="hidden lg:block"
            initial={{ opacity: 0, x: 36, scale: 0.97 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.9, ease: [...EASE], delay: 0.55 }}
          >
            <ForgeMockup />
          </motion.div>
        </div>

        {/* Barra de métricas — largura total */}
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
