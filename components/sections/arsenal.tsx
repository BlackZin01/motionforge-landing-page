"use client"

import type { Variants } from "framer-motion"
import { motion } from "framer-motion"
import { ModelPill } from "@/components/ui/model-pill"
import type { PillVariant } from "@/components/ui/model-pill"

/* ── Variantes Framer Motion ────────────────────────────────── */
const EASE = [0.22, 1, 0.36, 1] as const

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [...EASE] } },
}

const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
}

/* ── Dados dos cards ────────────────────────────────────────── */
interface CardData {
  category: string
  accentColor: string
  variant: PillVariant
  models: string[]
  colSpan?: string
}

const CARDS: CardData[] = [
  {
    category: "Vídeo",
    accentColor: "var(--color-forge-cyan)",
    variant: "vid",
    models: ["Veo 3.1 Lite", "Seedance 2.0", "Kling v3.0 Pro", "Kling O1", "Hailuo 2.3", "Wan 2.7"],
    colSpan: "md:col-span-2 md:row-span-2",
  },
  {
    category: "Imagem",
    accentColor: "var(--color-forge-orange)",
    variant: "img",
    models: ["Nano Banana Pro 4K", "Nano Banana 2", "FLUX 2 Pro", "Ideogram v3", "Imagen 4 Fast"],
  },
  {
    category: "Multimodal",
    accentColor: "var(--color-forge-muted)",
    variant: "default",
    models: ["GPT Image 2", "Omni"],
  },
]

/* ── Marquee com tamanho e cor por destaque ─────────────────── */
interface MarqueeItem {
  name: string
  color: string
  size: number
  weight: number
  opacity: number
}

const MARQUEE_ITEMS: MarqueeItem[] = [
  { name: "Kling O1",           color: "var(--color-forge-cyan)",   size: 24, weight: 700, opacity: 1    },
  { name: "Veo 3.1 Lite",       color: "var(--color-forge-cyan)",   size: 13, weight: 500, opacity: 0.55 },
  { name: "GPT Image 2",        color: "var(--color-forge-white)",  size: 20, weight: 700, opacity: 0.85 },
  { name: "Nano Banana Pro 4K", color: "var(--color-forge-orange)", size: 18, weight: 700, opacity: 0.9  },
  { name: "Seedance 2.0",       color: "var(--color-forge-cyan)",   size: 13, weight: 500, opacity: 0.5  },
  { name: "FLUX 2 Pro",         color: "var(--color-forge-orange)", size: 15, weight: 500, opacity: 0.65 },
  { name: "Kling v3.0 Pro",     color: "var(--color-forge-cyan)",   size: 16, weight: 600, opacity: 0.7  },
  { name: "Omni",               color: "var(--color-forge-white)",  size: 22, weight: 700, opacity: 1    },
  { name: "Hailuo 2.3",         color: "var(--color-forge-cyan)",   size: 12, weight: 500, opacity: 0.45 },
  { name: "Ideogram v3",        color: "var(--color-forge-orange)", size: 14, weight: 500, opacity: 0.6  },
  { name: "Nano Banana 2",      color: "var(--color-forge-orange)", size: 12, weight: 500, opacity: 0.45 },
  { name: "Wan 2.7",            color: "var(--color-forge-cyan)",   size: 12, weight: 500, opacity: 0.4  },
  { name: "Imagen 4 Fast",      color: "var(--color-forge-orange)", size: 15, weight: 500, opacity: 0.65 },
]

/* ── Componente de card ─────────────────────────────────────── */
function BentoCard({ category, accentColor, variant, models, colSpan = "" }: CardData) {
  return (
    <motion.div
      variants={fadeUp}
      className={colSpan}
      style={{
        background: "var(--color-forge-graphite)",
        borderTop: `2px solid ${accentColor}`,
        padding: 28,
        display: "flex",
        flexDirection: "column",
        gap: 16,
      }}
    >
      {/* Categoria */}
      <p
        style={{
          fontFamily: "var(--font-sans)",
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: "0.25em",
          textTransform: "uppercase",
          color: accentColor,
          margin: 0,
        }}
      >
        {category}
      </p>

      {/* Pills */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {models.map((m) => (
          <ModelPill key={m} name={m} variant={variant} />
        ))}
      </div>
    </motion.div>
  )
}

/* ── Seção principal ────────────────────────────────────────── */
export function Arsenal() {
  return (
    <section
      id="arsenal"
      style={{ background: "var(--color-forge-black)" }}
    >
      <div className="mx-auto max-w-7xl px-6 py-24 lg:py-32">

        {/* Header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={stagger}
          className="mb-12 max-w-2xl"
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
            Arsenal de Modelos
          </motion.p>

          <motion.h2
            variants={fadeUp}
            style={{
              fontFamily: "var(--font-bebas)",
              fontSize: "clamp(36px, 5.5vw, 56px)",
              lineHeight: 1,
              letterSpacing: "3px",
              color: "var(--color-forge-white)",
              marginBottom: 16,
            }}
          >
            Os melhores modelos do mercado.
            <br />
            Um único lugar.
            <br />
            Você no controle.
          </motion.h2>

          <motion.p
            variants={fadeUp}
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: 16,
              lineHeight: 1.65,
              color: "var(--color-forge-muted)",
            }}
          >
            Não escolhemos um modelo pra você e chamamos de &ldquo;IA&rdquo;.
            Você acessa e decide qual usar em cada etapa do workflow.
          </motion.p>
        </motion.div>

        {/* Bento grid */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={stagger}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
        >
          {CARDS.map((card) => (
            <BentoCard key={card.category} {...card} />
          ))}
        </motion.div>

        {/* Nota inferior */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [...EASE] }}
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: 13,
            color: "var(--color-forge-muted)",
            textAlign: "center",
            marginBottom: 48,
          }}
        >
          Novo modelo lançado? Disponível na plataforma. Seu workflow continua o mesmo.
        </motion.p>

        {/* ── Marquee infinito ──────────────────────────────── */}
        <div
          style={{
            overflow: "hidden",
            borderTop: "1px solid var(--color-forge-border)",
            borderBottom: "1px solid var(--color-forge-border)",
            paddingBlock: 22,
            maskImage: "linear-gradient(90deg, transparent 0%, black 8%, black 92%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(90deg, transparent 0%, black 8%, black 92%, transparent 100%)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 0,
              width: "max-content",
              animation: "marquee 38s linear infinite",
            }}
          >
            {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
              <span
                key={i}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 44,
                  paddingInline: 22,
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: item.size,
                    fontWeight: item.weight,
                    color: item.color,
                    opacity: item.opacity,
                    whiteSpace: "nowrap",
                    letterSpacing: item.size >= 18 ? "0.03em" : "0.01em",
                    lineHeight: 1,
                  }}
                >
                  {item.name}
                </span>
                <span
                  aria-hidden="true"
                  style={{
                    color: "rgba(255,255,255,0.12)",
                    fontSize: 5,
                    lineHeight: 1,
                  }}
                >
                  ◆
                </span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
