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
  { value: 1200, label: "prompts prontos na biblioteca" },
  { value: 980,  label: "lojas ativas essa semana" },
  { value: 340,  label: "produtos validados no catálogo" },
  { value: 12,   label: "nichos cobertos na biblioteca" },
  { value: 847,  label: "pedidos em 48h (maior resultado individual)", prefix: "+" },
  { value: 23,   label: "faturamento orgânico no mês 1 (produto de R$49)", prefix: "R$ ", suffix: "k" },
]

const PLATFORMS = [
  "TikTok Shop BR",
  "ChatGPT",
  "Gemini",
  "Claude",
  "Meta Ads",
  "Instagram Shopping",
  "Shopee",
]

const TESTIMONIALS = [
  {
    quote:
      "Antes eu ficava 1 hora tentando criar uma copy decente no ChatGPT. Agora abro a biblioteca, copio o prompt certo e estou postando em 5 minutos.",
    author: "Carla Mendes",
    role: "Criadora de conteúdo · Moda feminina · TikTok Shop BR",
    result: "",
  },
  {
    quote:
      "Descobri um produto na biblioteca da MotionForge com score 91. Anunciei antes de todo mundo no meu nicho. Esgotou em 3 dias.",
    author: "Bruno Tavares",
    role: "Dono de loja · NutriFit Shop · Suplementos · TikTok Shop BR",
    result: "esgotado em 3 dias",
  },
  {
    quote:
      "Peguei o prompt de hook da biblioteca, adaptei pro produto e postei. Dois vídeos viralizaram no mesmo dia. 847 pedidos em 48h.",
    author: "Felipe Andrade",
    role: "Loja Bella Skin · Skincare · TikTok Shop BR",
    result: "847 pedidos em 48h",
  },
  {
    quote:
      "A curadoria semanal de produtos me economiza 6 horas por semana de pesquisa. Só anuncio produto com score acima de 80 agora.",
    author: "Juliana Costa",
    role: "@julianafit.shop · Moda fitness · TikTok Shop BR",
    result: "6h economizadas por semana",
  },
  {
    quote:
      "Gerencio 8 clientes com 2 pessoas na equipe. A biblioteca de prompts é o que nos deixa rápidos — copy pronta por nicho, sem reinventar.",
    author: "Rafael Souza",
    role: "Sócio · Agência Viral Content · São Paulo",
    result: "equipe de 2, resultado de 12",
  },
  {
    quote:
      "R$ 23.000 em vendas no primeiro mês. Produto validado pela MotionForge, copy dos prompts da plataforma. Sem tráfego pago.",
    author: "Mariana Lima",
    role: "Loja Casa & Estilo · Decoração · TikTok Shop BR",
    result: "R$ 23k orgânico no mês 1",
  },
]

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

        {/* ── Métricas 3×2 ──────────────────────────────────── */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={stagger}
          className="grid grid-cols-2 lg:grid-cols-3 gap-px mb-20"
          style={{ background: "var(--color-forge-border)" }}
        >
          {METRICS.map(({ value, label, prefix, suffix }) => (
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
                duration={2}
                prefix={prefix ?? ""}
                suffix={suffix ?? ""}
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "clamp(32px, 3.5vw, 48px)",
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

        {/* ── Barra de plataformas ───────────────────────────── */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          style={{
            textAlign: "center",
            fontFamily: "var(--font-sans)",
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "var(--color-forge-muted)",
            opacity: 0.35,
            marginBottom: 40,
          }}
        >
          {PLATFORMS.join("  ·  ")}
        </motion.p>

        {/* ── Depoimentos ───────────────────────────────────── */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={stagger}
          className="grid grid-cols-1 lg:grid-cols-2 gap-4"
        >
          {TESTIMONIALS.map(({ quote, author, role, result }) => (
            <motion.blockquote
              key={author}
              variants={fadeUp}
              style={{
                margin: 0,
                padding: "28px 24px",
                background: "var(--color-forge-graphite)",
                borderLeft: "3px solid var(--color-forge-orange)",
                display: "flex",
                flexDirection: "column",
                gap: 16,
              }}
            >
              {/* Citação */}
              <p
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: 16,
                  lineHeight: 1.65,
                  color: "var(--color-forge-white)",
                  margin: 0,
                  fontStyle: "normal",
                  flex: 1,
                }}
              >
                &ldquo;{quote}&rdquo;
              </p>

              {/* Resultado em destaque */}
              {result && (
                <p
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 13,
                    fontWeight: 700,
                    color: "var(--color-forge-cyan)",
                    margin: 0,
                    textShadow: "0 0 12px rgba(0,229,255,0.4)",
                  }}
                >
                  {result}
                </p>
              )}

              {/* Autor */}
              <footer
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                  borderTop: "1px solid var(--color-forge-border)",
                  paddingTop: 14,
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
