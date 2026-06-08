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
            Seu stack de IA criou um gargalo novo.
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
            Gemini pro roteiro. Veo pro vídeo. HeyGen pro avatar. Canva pra thumbnail.
            <br />
            4 abas, 4 exports, 4 logins — e no final, 3 vídeos por semana.
            <br />
            A IA deveria acelerar. Virou trabalho.
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
              TikTok Shop pede{" "}
              <strong style={{ color: "var(--color-forge-orange)" }}>
                20 variações por SKU.
              </strong>
              <br />
              Você produz{" "}
              <strong>3 por semana</strong> com o stack atual.
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
              &ldquo;E se cada produto que você sobe já saísse como vídeo pronto
              pra publicar — com o modelo que você escolheu, no workflow que você
              montou?&rdquo;
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
            Não é mais uma ferramenta no seu stack. É o fim dele.
          </motion.p>
        </motion.div>
      </div>
    </section>
  )
}
