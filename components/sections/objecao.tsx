"use client"

import type { Variants } from "framer-motion"
import { motion } from "framer-motion"

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

const slideLeft: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.55, ease: [...EASE] } },
}

const slideRight: Variants = {
  hidden: { opacity: 0, x: 20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.55, ease: [...EASE] } },
}

/* ── Dados da comparação ────────────────────────────────────── */
const COMPARISON = [
  {
    outros: "Gasta horas tentando criar um prompt que funcione.",
    motionforge: "Abre a biblioteca, copia o prompt certo, já usa.",
  },
  {
    outros: "Anuncia produto sem saber se tem demanda real.",
    motionforge: "Só anuncia produto com score validado e em alta.",
  },
  {
    outros: "Concorrência descobre o produto antes de você.",
    motionforge: "Curadoria semanal: você sabe antes do mercado.",
  },
] as const

/* ── Componente ─────────────────────────────────────────────── */
export function Objecao() {
  return (
    <section
      id="objecao"
      style={{ background: "var(--color-forge-graphite)" }}
    >
      <div className="mx-auto max-w-7xl px-6 py-24 lg:py-32">

        {/* Header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={stagger}
          className="max-w-2xl mb-16"
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
            Já ouviu isso antes. A gente sabe.
          </motion.p>

          <motion.h2
            variants={fadeUp}
            style={{
              fontFamily: "var(--font-bebas)",
              fontSize: "clamp(36px, 5.5vw, 52px)",
              lineHeight: 1,
              letterSpacing: "2px",
              color: "var(--color-forge-white)",
              marginBottom: 20,
            }}
          >
            A diferença não é a IA.
            <br />
            É o que você coloca nela.
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
            ChatGPT não entrega resultado ruim — o problema é o prompt. Produto errado
            não converte — o problema é a falta de validação. A MotionForge resolve os dois.
          </motion.p>
        </motion.div>

        {/* Comparação 2 colunas */}
        <div
          className="grid grid-cols-1 md:grid-cols-2 gap-px"
          style={{ background: "var(--color-forge-border)" }}
        >
          {/* Col 1 — Outros */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
            style={{
              background: "var(--color-forge-graphite)",
              padding: "32px 28px",
              display: "flex",
              flexDirection: "column",
              gap: 0,
            }}
          >
            {/* Cabeçalho col */}
            <motion.p
              variants={slideLeft}
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: "var(--color-forge-muted)",
                marginBottom: 24,
              }}
            >
              Outros
            </motion.p>

            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 16 }}>
              {COMPARISON.map(({ outros }) => (
                <motion.li
                  key={outros}
                  variants={slideLeft}
                  style={{ display: "flex", gap: 12, alignItems: "flex-start" }}
                >
                  {/* X icon */}
                  <span
                    aria-hidden="true"
                    style={{
                      flexShrink: 0,
                      marginTop: 2,
                      color: "rgba(245,245,245,0.2)",
                      fontSize: 14,
                      lineHeight: 1,
                    }}
                  >
                    ✕
                  </span>
                  <span
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontSize: 15,
                      lineHeight: 1.55,
                      color: "rgba(245,245,245,0.4)",
                      textDecoration: "line-through",
                      textDecorationColor: "rgba(245,245,245,0.2)",
                    }}
                  >
                    {outros}
                  </span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Col 2 — MotionForge */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
            style={{
              background: "rgba(255,77,0,0.04)",
              padding: "32px 28px",
              display: "flex",
              flexDirection: "column",
              gap: 0,
            }}
          >
            {/* Cabeçalho col */}
            <motion.p
              variants={slideRight}
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: "var(--color-forge-orange)",
                marginBottom: 24,
              }}
            >
              MotionForge
            </motion.p>

            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 16 }}>
              {COMPARISON.map(({ motionforge }) => (
                <motion.li
                  key={motionforge}
                  variants={slideRight}
                  style={{ display: "flex", gap: 12, alignItems: "flex-start" }}
                >
                  {/* Check icon */}
                  <span
                    aria-hidden="true"
                    style={{
                      flexShrink: 0,
                      marginTop: 2,
                      color: "var(--color-forge-orange)",
                      fontSize: 14,
                      lineHeight: 1,
                      fontWeight: 700,
                    }}
                  >
                    ✓
                  </span>
                  <span
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontSize: 15,
                      fontWeight: 700,
                      lineHeight: 1.55,
                      color: "var(--color-forge-orange)",
                    }}
                  >
                    {motionforge}
                  </span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
