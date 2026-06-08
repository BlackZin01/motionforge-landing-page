"use client"

import type { Variants } from "framer-motion"
import { motion } from "framer-motion"
import { NumberTicker } from "@/components/ui/number-ticker"

/* ── Variantes ──────────────────────────────────────────────── */
const EASE = [0.22, 1, 0.36, 1] as const

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [...EASE] } },
}

const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09 } },
}

/* ── Dados ──────────────────────────────────────────────────── */
const METRICS = [
  { value: 4800, label: "vídeos gerados essa semana" },
  { value: 1240, label: "lojas ativas" },
  { value: 87,   label: "agências escalando" },
  { value: 47,   label: "variações por SKU por sessão (média)" },
] as const

const TESTIMONIALS = [
  {
    quote:
      "Primeiro mês com a MotionForge: saímos de 8 para 61 vídeos por semana. Mesmo time, mesmo orçamento.",
    author: "Carla Mendes",
    role: "Head de Conteúdo · Agência Konversa · Moda feminina",
  },
  {
    quote:
      "Montei o workflow em 20 minutos. Agora rodo 50 variações por produto sem abrir outra ferramenta.",
    author: "Bruno Tavares",
    role: "Dono de loja · NutriFit Shop · Suplementos · TikTok Shop BR",
  },
] as const

/* ── Componente ─────────────────────────────────────────────── */
export function ProvaSocial() {
  return (
    <section
      id="prova-social"
      style={{
        background: "var(--color-forge-black)",
        /* Grid de pontos de fundo */
        backgroundImage:
          "radial-gradient(circle, rgba(255,255,255,0.035) 1px, transparent 1px)",
        backgroundSize: "24px 24px",
      }}
    >
      <div className="mx-auto max-w-7xl px-6 py-24 lg:py-32">

        {/* ── Métricas 2×2 ──────────────────────────────────── */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={stagger}
          className="grid grid-cols-2 lg:grid-cols-4 gap-px mb-20"
          style={{ background: "var(--color-forge-border)" }}
        >
          {METRICS.map(({ value, label }) => (
            <motion.div
              key={label}
              variants={fadeUp}
              style={{
                background: "var(--color-forge-black)",
                padding: "32px 28px",
                display: "flex",
                flexDirection: "column",
                gap: 10,
              }}
            >
              <NumberTicker
                value={value}
                duration={1.6}
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "clamp(36px, 4vw, 52px)",
                  fontWeight: 700,
                  color: "var(--color-forge-cyan)",
                  lineHeight: 1,
                  display: "block",
                  textShadow: "0 0 22px rgba(0,229,255,0.5)",
                }}
              />
              <span
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: 13,
                  lineHeight: 1.45,
                  color: "var(--color-forge-muted)",
                }}
              >
                {label}
              </span>
            </motion.div>
          ))}
        </motion.div>

        {/* ── Depoimentos ───────────────────────────────────── */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={stagger}
          className="grid grid-cols-1 lg:grid-cols-2 gap-4"
        >
          {TESTIMONIALS.map(({ quote, author, role }) => (
            <motion.blockquote
              key={author}
              variants={fadeUp}
              style={{
                margin: 0,
                padding: "32px 28px",
                background: "var(--color-forge-graphite)",
                borderLeft: "3px solid var(--color-forge-orange)",
                display: "flex",
                flexDirection: "column",
                gap: 20,
              }}
            >
              {/* Citação */}
              <p
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: 17,
                  lineHeight: 1.65,
                  color: "var(--color-forge-white)",
                  margin: 0,
                  fontStyle: "normal",
                }}
              >
                &ldquo;{quote}&rdquo;
              </p>

              {/* Autor */}
              <footer
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                  borderTop: "1px solid var(--color-forge-border)",
                  paddingTop: 16,
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: 13,
                    fontWeight: 700,
                    color: "var(--color-forge-white)",
                  }}
                >
                  {author}
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: 12,
                    color: "var(--color-forge-muted)",
                  }}
                >
                  {role}
                </span>
              </footer>
            </motion.blockquote>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
