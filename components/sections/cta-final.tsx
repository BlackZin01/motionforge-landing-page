"use client"

import type { Variants } from "framer-motion"
import { motion } from "framer-motion"
import { trackEvent } from "@/lib/pixels"

/* ── Variantes ──────────────────────────────────────────────── */
const EASE = [0.22, 1, 0.36, 1] as const

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [...EASE] } },
}

const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}

/* ── Componente ─────────────────────────────────────────────── */
export function CTAFinal() {
  function handleCTA() {
    trackEvent("Lead", { content_name: "CTA Final" })
  }

  return (
    <section
      id="cta-final"
      style={{
        background: "var(--color-forge-graphite)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* ── Beam de luz vindo de cima — pulso suave ── */}
      <motion.div
        aria-hidden="true"
        animate={{ opacity: [0.55, 1, 0.55] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: "absolute",
          top: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: "60%",
          height: "75%",
          background:
            "radial-gradient(ellipse 55% 100% at 50% 0%, rgba(255,77,0,0.42) 0%, rgba(255,77,0,0.12) 45%, transparent 75%)",
          pointerEvents: "none",
        }}
      />

      {/* Faixa de borda superior — linha laranja centrada */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 2,
          background:
            "linear-gradient(90deg, transparent 0%, var(--color-forge-orange) 35%, var(--color-forge-orange) 65%, transparent 100%)",
          pointerEvents: "none",
        }}
      />

      {/* Glow difuso no centro-baixo para profundidade */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 80% 40% at 50% 100%, rgba(255,77,0,0.06) 0%, transparent 60%)",
          pointerEvents: "none",
        }}
      />

      {/* Conteúdo */}
      <div
        className="mx-auto max-w-4xl px-6 py-28 lg:py-40"
        style={{ textAlign: "center", position: "relative" }}
      >
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={stagger}
        >
          <motion.h2
            variants={fadeUp}
            style={{
              fontFamily: "var(--font-bebas)",
              fontSize: "clamp(52px, 9vw, 96px)",
              lineHeight: 1,
              letterSpacing: "3px",
              color: "var(--color-forge-white)",
              marginBottom: 24,
            }}
          >
            Forge Your Content
          </motion.h2>

          <motion.p
            variants={fadeUp}
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: 18,
              lineHeight: 1.65,
              color: "var(--color-forge-muted)",
              maxWidth: 520,
              margin: "0 auto 40px",
            }}
          >
            Prompts prontos para copiar. Produtos validados para anunciar.{" "}
            Assinou, já tem acesso.
          </motion.p>

          <motion.div
            variants={fadeUp}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 16,
            }}
          >
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 12 }}>
              <a
                href="#planos"
                onClick={handleCTA}
                style={{
                  padding: "16px 44px",
                  background: "var(--color-forge-orange)",
                  color: "var(--color-forge-white)",
                  fontFamily: "var(--font-sans)",
                  fontSize: 14,
                  fontWeight: 700,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 0 32px rgba(255,77,0,0.45)",
                  transition: "box-shadow 220ms ease, transform 220ms ease",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLAnchorElement
                  el.style.boxShadow = "0 0 56px rgba(255,77,0,0.7)"
                  el.style.transform = "scale(1.03)"
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLAnchorElement
                  el.style.boxShadow = "0 0 32px rgba(255,77,0,0.45)"
                  el.style.transform = "scale(1)"
                }}
              >
                Ver Planos
              </a>
              <a
                href="#para-quem"
                style={{
                  padding: "16px 44px",
                  background: "transparent",
                  color: "var(--color-forge-white)",
                  fontFamily: "var(--font-sans)",
                  fontSize: 14,
                  fontWeight: 700,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
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
              >
                O que está incluso
              </a>
            </div>

            <p
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: 12,
                color: "var(--color-forge-muted)",
                margin: "8px 0 0",
                maxWidth: 480,
                lineHeight: 1.6,
              }}
            >
              Para donos de loja: acessa os prompts, copia o que precisa,
              anuncia o produto certo hoje mesmo.
            </p>
            <p
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: 12,
                color: "var(--color-forge-muted)",
                margin: 0,
                maxWidth: 480,
                lineHeight: 1.6,
              }}
            >
              Para criadores: biblioteca completa de copy para TikTok Shop
              atualizada toda semana.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
