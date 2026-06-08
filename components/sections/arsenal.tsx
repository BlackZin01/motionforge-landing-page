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

/* ── Todos os modelos para o marquee ────────────────────────── */
const ALL_MODELS = [
  "Veo 3.1 Lite", "Seedance 2.0", "Kling v3.0 Pro", "Kling O1", "Hailuo 2.3", "Wan 2.7",
  "Nano Banana Pro 4K", "Nano Banana 2", "FLUX 2 Pro", "Ideogram v3", "Imagen 4 Fast",
  "GPT Image 2", "Omni",
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
            Um único lugar. Você no controle.
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
            paddingBlock: 18,
            maskImage: "linear-gradient(90deg, transparent 0%, black 8%, black 92%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(90deg, transparent 0%, black 8%, black 92%, transparent 100%)",
          }}
        >
          {/* Track duplicado para loop perfeito */}
          <div
            style={{
              display: "flex",
              gap: 32,
              width: "max-content",
              animation: "marquee 28s linear infinite",
            }}
          >
            {/* Duas cópias para loop contínuo */}
            {[...ALL_MODELS, ...ALL_MODELS].map((name, i) => (
              <span
                key={i}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 32,
                  fontFamily: "var(--font-mono)",
                  fontSize: 13,
                  fontWeight: 500,
                  color: "var(--color-forge-muted)",
                  whiteSpace: "nowrap",
                }}
              >
                {name}
                <span
                  aria-hidden="true"
                  style={{ color: "var(--color-forge-orange)", fontSize: 6 }}
                >
                  ●
                </span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
