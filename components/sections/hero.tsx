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
  { value: 1200, label: "prompts prontos para usar" },
  { value: 980,  label: "lojas ativas" },
  { value: 340,  label: "produtos validados no TikTok Shop" },
] as const

/* ── Mockup animado — Prompts + Biblioteca ───────────────────── */
const PROMPTS = [
  {
    titulo: "Hook de abertura — Produto físico",
    modelo: "ChatGPT",
    preview: "Você não vai acreditar que isso existe. Eu comprei sem esperar nada e...",
  },
  {
    titulo: "CTA para TikTok Shop",
    modelo: "Gemini",
    preview: "Clica no link da bio AGORA antes que esgote. Essa semana com frete grátis.",
  },
  {
    titulo: "Descrição de produto viral",
    modelo: "ChatGPT",
    preview: "O produto que todo mundo está comprando esse mês no TikTok Shop BR...",
  },
]

const PRODUTO = { nome: "Massageador Facial LED", nicho: "Beleza", score: 94, status: "Viral" }

function ForgeMockup() {
  const [promptIdx, setPromptIdx] = useState(0)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => {
      setCopied(false)
      setPromptIdx((i) => (i + 1) % PROMPTS.length)
    }, copied ? 1200 : 3200)
    return () => clearTimeout(t)
  }, [promptIdx, copied])

  const current = PROMPTS[promptIdx]

  return (
    <div
      style={{
        background: "var(--color-forge-graphite)",
        border: "1px solid var(--color-forge-border)",
        padding: "20px",
        fontFamily: "var(--font-sans)",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        gap: 12,
      }}
    >
      {/* Cabeçalho */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.18em", color: "var(--color-forge-orange)", textTransform: "uppercase" }}>
          Biblioteca de Prompts
        </span>
        <span style={{ fontSize: 10, color: "var(--color-forge-cyan)", display: "flex", alignItems: "center", gap: 5 }}>
          <motion.span
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.4, repeat: Infinity }}
            style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--color-forge-cyan)", display: "inline-block", boxShadow: "0 0 8px rgba(0,229,255,0.8)" }}
          />
          LIVE
        </span>
      </div>

      {/* Card do prompt */}
      <AnimatePresence mode="wait">
        <motion.div
          key={promptIdx}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3 }}
          style={{
            background: "#0D0D0D",
            border: "1px solid var(--color-forge-border)",
            borderRadius: 8,
            padding: "14px",
          }}
        >
          {/* Título + modelo */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10, gap: 8 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: "var(--color-forge-white)", lineHeight: 1.3 }}>
              {current.titulo}
            </span>
            <span style={{
              fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px",
              background: "rgba(0,229,255,0.10)", color: "var(--color-forge-cyan)",
              border: "1px solid rgba(0,229,255,0.25)", borderRadius: 4,
              padding: "2px 8px", flexShrink: 0,
            }}>
              {current.modelo}
            </span>
          </div>

          {/* Preview do conteúdo */}
          <p style={{ fontSize: 11, color: "var(--color-forge-muted)", lineHeight: 1.6, margin: 0, marginBottom: 12 }}>
            {current.preview}
          </p>

          {/* Botão copiar */}
          <button
            onClick={() => setCopied(true)}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              background: copied ? "rgba(0,229,255,0.12)" : "rgba(255,77,0,0.10)",
              border: `1px solid ${copied ? "rgba(0,229,255,0.3)" : "rgba(255,77,0,0.3)"}`,
              color: copied ? "var(--color-forge-cyan)" : "var(--color-forge-orange)",
              borderRadius: 6, padding: "6px 12px",
              fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px",
              cursor: "pointer", transition: "all 200ms ease", width: "100%", justifyContent: "center",
            }}
          >
            {copied ? "✓ Copiado!" : "Copiar prompt"}
          </button>
        </motion.div>
      </AnimatePresence>

      {/* Divisor */}
      <div style={{ height: 1, background: "var(--color-forge-border)" }} />

      {/* Card de produto em alta */}
      <div>
        <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.18em", color: "rgba(245,245,245,0.25)", textTransform: "uppercase", display: "block", marginBottom: 8 }}>
          Produto em Alta · TikTok Shop
        </span>
        <div style={{
          background: "#0D0D0D",
          border: "1px solid var(--color-forge-border)",
          borderRadius: 8, padding: "12px",
          display: "flex", alignItems: "center", gap: 12,
        }}>
          <div style={{
            width: 40, height: 40, borderRadius: 6, flexShrink: 0,
            background: "linear-gradient(135deg, rgba(255,77,0,0.15) 0%, rgba(0,229,255,0.08) 100%)",
            border: "1px solid var(--color-forge-border)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <span style={{ fontSize: 18 }}>🛍️</span>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "var(--color-forge-white)", marginBottom: 3 }}>
              {PRODUTO.nome}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ fontSize: 9, color: "rgba(245,245,245,0.3)", textTransform: "uppercase", letterSpacing: "1px" }}>
                {PRODUTO.nicho}
              </span>
              <span style={{
                fontSize: 9, fontWeight: 700, textTransform: "uppercase",
                background: "rgba(255,77,0,0.12)", color: "var(--color-forge-orange)",
                border: "1px solid rgba(255,77,0,0.3)", borderRadius: 9999,
                padding: "1px 7px",
              }}>
                {PRODUTO.status}
              </span>
            </div>
          </div>
          <div style={{ textAlign: "right", flexShrink: 0 }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 18, fontWeight: 700, color: "var(--color-forge-cyan)", lineHeight: 1 }}>
              {PRODUTO.score}
            </div>
            <div style={{ fontSize: 8, color: "rgba(245,245,245,0.3)", textTransform: "uppercase", letterSpacing: "1px" }}>score</div>
          </div>
        </div>
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
              Para Lojas TikTok Shop e Criadores de Conteúdo
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
              Prompts Prontos.<br />Produtos Validados.<br />Anúncios que Vendem.
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
              Acesse prompts de copy curados para ChatGPT e Gemini — e descubra os produtos
              em alta no TikTok Shopping antes da concorrência.
            </motion.p>

            {/* Ferramentas suportadas */}
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
              Compatível com ChatGPT, Gemini, Claude e qualquer IA de texto. Produtos curados semanalmente.
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
                href="#para-quem"
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
              Usado por 980 lojas e criadores que faturam no TikTok Shop todo mês.
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
