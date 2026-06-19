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
  visible: { transition: { staggerChildren: 0.08 } },
}

/* ── Componente ─────────────────────────────────────────────── */
export function Problema() {
  return (
    <section
      id="problema"
      style={{ background: "var(--color-forge-graphite)" }}
    >
      <div className="mx-auto max-w-7xl px-6 py-24 lg:py-32">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={stagger}
          className="max-w-3xl"
        >
          {/* Label */}
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
            O Problema
          </motion.p>

          {/* Headline */}
          <motion.h2
            variants={fadeUp}
            style={{
              fontFamily: "var(--font-bebas)",
              fontSize: "clamp(36px, 5.5vw, 52px)",
              lineHeight: 1,
              letterSpacing: "2px",
              color: "var(--color-forge-white)",
              marginBottom: 24,
            }}
          >
            Você está perdendo tempo (e dinheiro) do jeito errado.
          </motion.h2>

          {/* Corpo */}
          <motion.p
            variants={fadeUp}
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: 17,
              lineHeight: 1.7,
              color: "var(--color-forge-muted)",
              marginBottom: 32,
            }}
          >
            Você abre o ChatGPT sem saber o que pedir. Digita um prompt genérico.
            <br />
            A copy sai ruim. Você tenta de novo. Perde 40 minutos por produto.
            <br />
            Enquanto isso, não sabe se o produto que está anunciando sequer tem demanda.
          </motion.p>

          {/* Card destaque */}
          <motion.div
            variants={fadeUp}
            style={{
              borderLeft: "4px solid var(--color-forge-orange)",
              background: "rgba(255,77,0,0.05)",
              padding: "20px 24px",
              marginBottom: 40,
            }}
          >
            <p
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: 16,
                lineHeight: 1.65,
                color: "var(--color-forge-white)",
                margin: 0,
              }}
            >
              O TikTok Shop recompensa quem publica{" "}
              <strong style={{ color: "var(--color-forge-orange)" }}>
                rápido, com copy certa e produto validado.
              </strong>
              <br />
              Você não pode improvisar e esperar resultado.
            </p>
          </motion.div>

          {/* Blockquote */}
          <motion.blockquote
            variants={fadeUp}
            style={{
              margin: "0 0 24px",
              padding: 0,
              border: "none",
            }}
          >
            <p
              style={{
                fontFamily: "var(--font-bebas)",
                fontSize: "clamp(22px, 3vw, 28px)",
                lineHeight: 1.2,
                letterSpacing: "1px",
                color: "var(--color-forge-white)",
                textAlign: "center",
                margin: 0,
              }}
            >
              &ldquo;E se você já soubesse exatamente qual produto anunciar
              — e qual prompt usar pra fazer a copy que converte?&rdquo;
            </p>
          </motion.blockquote>

          {/* Linha final */}
          <motion.p
            variants={fadeUp}
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: 15,
              color: "var(--color-forge-muted)",
              textAlign: "center",
              margin: 0,
            }}
          >
            É exatamente isso que a MotionForge entrega.
          </motion.p>
        </motion.div>
      </div>
    </section>
  )
}
