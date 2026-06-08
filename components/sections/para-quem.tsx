"use client"

import type { Variants } from "framer-motion"
import { motion } from "framer-motion"

/* ── Variantes do brandbook ─────────────────────────────────── */
const EASE = [0.22, 1, 0.36, 1] as const

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [...EASE] } },
}

const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
}

/* ── Dados de conteúdo ──────────────────────────────────────── */
const lojaItems = [
  "50 variações de UGC por SKU",
  "Do produto ao vídeo em menos de 60s",
  "Sem editor. Sem briefing. Sem fila.",
] as const

const agenciaItems = [
  "Workspaces separados por cliente",
  "Workflows reutilizáveis por conta",
  "Controle de modelo por projeto",
] as const

/* ── Sub-componente de coluna ───────────────────────────────── */
interface ColProps {
  label: string
  labelColor: string
  borderColor: string
  headline: string
  body: string
  items: readonly string[]
  bulletColor: string
}

function Col({
  label,
  labelColor,
  borderColor,
  headline,
  body,
  items,
  bulletColor,
}: ColProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={stagger}
      className="py-12"
      style={{ borderLeft: `3px solid ${borderColor}`, paddingLeft: 28 }}
    >
      {/* Label */}
      <motion.p
        variants={fadeUp}
        style={{
          fontFamily: "var(--font-sans)",
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: "0.25em",
          textTransform: "uppercase" as const,
          color: labelColor,
          marginBottom: 14,
        }}
      >
        {label}
      </motion.p>

      {/* Headline */}
      <motion.h2
        variants={fadeUp}
        style={{
          fontFamily: "var(--font-bebas)",
          fontSize: "clamp(28px, 3.5vw, 40px)",
          lineHeight: 1,
          letterSpacing: "2px",
          color: "var(--color-forge-white)",
          marginBottom: 16,
        }}
      >
        {headline}
      </motion.h2>

      {/* Corpo */}
      <motion.p
        variants={fadeUp}
        style={{
          fontFamily: "var(--font-sans)",
          fontSize: 15,
          lineHeight: 1.7,
          color: "var(--color-forge-muted)",
          marginBottom: 24,
        }}
      >
        {body}
      </motion.p>

      {/* Lista com stagger */}
      <motion.ul
        variants={stagger}
        style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 12 }}
      >
        {items.map((item) => (
          <motion.li
            key={item}
            variants={fadeUp}
            style={{
              display: "flex",
              gap: 12,
              fontFamily: "var(--font-sans)",
              fontSize: 15,
              lineHeight: 1.5,
              color: "var(--color-forge-white)",
            }}
          >
            <span
              style={{ color: bulletColor, flexShrink: 0, fontWeight: 700 }}
              aria-hidden="true"
            >
              —
            </span>
            {item}
          </motion.li>
        ))}
      </motion.ul>
    </motion.div>
  )
}

/* ── Seção principal ────────────────────────────────────────── */
export function ParaQuem() {
  return (
    <section
      id="para-quem"
      style={{ background: "var(--color-forge-black)" }}
    >
      <div className="mx-auto max-w-7xl px-6">
        {/* Borda superior da seção */}
        <div style={{ borderTop: "1px solid var(--color-forge-border)" }}>
          <div
            className="grid grid-cols-1 md:grid-cols-2"
            style={{ gap: 0 }}
          >
            {/* Coluna 1 — Donos de loja */}
            <div className="md:pr-12 md:border-r" style={{ borderColor: "var(--color-forge-border)" }}>
              <Col
                label="Para Donos de Loja"
                labelColor="var(--color-forge-orange)"
                borderColor="var(--color-forge-orange)"
                headline="Você não precisa de equipe."
                body="Sobe o produto, escolhe o modelo, define o workflow uma vez. A MotionForge produz o volume que sua loja precisa."
                items={lojaItems}
                bulletColor="var(--color-forge-orange)"
              />
            </div>

            {/* Coluna 2 — Agências */}
            <div className="md:pl-12">
              <Col
                label="Para Agências"
                labelColor="var(--color-forge-cyan)"
                borderColor="var(--color-forge-cyan)"
                headline="Escale 20 clientes sem contratar."
                body="Workflows customizáveis por conta. Cada cliente, cada nicho, cada modelo."
                items={agenciaItems}
                bulletColor="var(--color-forge-cyan)"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
