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
  visible: { transition: { staggerChildren: 0.08 } },
}

/* ── Dados ──────────────────────────────────────────────────── */
interface Plan {
  id: "Starter" | "Pro" | "Agency"
  price: number
  credits: string
  estimate: string
  desc: string
  pills: string[]
  extras?: { label: string; color: "orange" | "cyan" }[]
  featured?: boolean
  ctaLabel: string
  variant: "primary" | "secondary"
}

const PLANS: Plan[] = [
  {
    id: "Starter",
    price: 197,
    credits: "1.000 créditos/mês · rollover até 2×",
    estimate: "~500 imagens ou ~40 vídeos de 5s por mês",
    desc: "Para criadores solo testando UGC com IA",
    pills: ["Nano Banana 2", "FLUX 2 Dev", "Ideogram v3", "Seedance 2.0 Fast", "Wan 2.7"],
    ctaLabel: "ASSINAR STARTER",
    variant: "secondary",
  },
  {
    id: "Pro",
    price: 497,
    credits: "4.000 créditos/mês · rollover até 2×",
    estimate: "~2.000 imagens ou ~110 vídeos de 5s por mês",
    desc: "Para afiliados e marcas que precisam de qualidade e volume",
    pills: [
      "Nano Banana Pro 4K",
      "FLUX 2 Pro",
      "Seedance 2.0",
      "Kling v3.0 Std",
      "Hailuo 2.3",
      "Wan 2.7",
      "e mais",
    ],
    extras: [
      { label: "First-frame / last-frame control", color: "orange" },
      { label: "Download em lote", color: "orange" },
    ],
    featured: true,
    ctaLabel: "ASSINAR PRO",
    variant: "primary",
  },
  {
    id: "Agency",
    price: 997,
    credits: "14.000 créditos/mês · rollover até 3×",
    estimate: "~7.000 imagens ou ~400 vídeos de 5s por mês",
    desc: "Para agências e operações de UGC em escala",
    pills: [
      "Todos do Pro",
      "Imagen 4 Fast",
      "Kling O1",
      "Kling v3.0 Pro",
      "Veo 3.1 Lite",
      "e mais",
    ],
    extras: [
      { label: "Batch paralelo", color: "cyan" },
      { label: "Veo 3.1 + Kling O1 desbloqueados", color: "cyan" },
      { label: "Suporte prioritário", color: "cyan" },
    ],
    ctaLabel: "ASSINAR AGENCY",
    variant: "secondary",
  },
]

interface TopUp {
  price: number
  credits: string
  badge?: { label: string; color: "orange" | "cyan" }
}

const TOPUPS: TopUp[] = [
  { price: 19, credits: "200 créditos" },
  { price: 47, credits: "600 créditos" },
  { price: 97, credits: "1.400 créditos" },
  { price: 197, credits: "3.200 créditos", badge: { label: "★ Popular", color: "orange" } },
  { price: 397, credits: "7.500 créditos", badge: { label: "Melhor valor", color: "cyan" } },
]

/* ── Sub-componentes ─────────────────────────────────────────── */
function Pill({ label }: { label: string }) {
  return (
    <span
      style={{
        display: "inline-block",
        padding: "3px 10px",
        border: "1px solid rgba(255,255,255,0.1)",
        fontFamily: "var(--font-sans)",
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: "0.05em",
        color: "var(--color-forge-muted)",
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </span>
  )
}

function CheckItem({
  label,
  color,
}: {
  label: string
  color: "orange" | "cyan"
}) {
  return (
    <li style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
      <span
        aria-hidden="true"
        style={{
          flexShrink: 0,
          fontSize: 13,
          fontWeight: 700,
          lineHeight: 1.5,
          color:
            color === "orange"
              ? "var(--color-forge-orange)"
              : "var(--color-forge-cyan)",
        }}
      >
        ✓
      </span>
      <span
        style={{
          fontFamily: "var(--font-sans)",
          fontSize: 13,
          lineHeight: 1.5,
          color: "var(--color-forge-white)",
        }}
      >
        {label}
      </span>
    </li>
  )
}

function PlanCard({ plan }: { plan: Plan }) {
  const { id, price, credits, estimate, desc, pills, extras, featured, ctaLabel, variant } = plan

  function handleCTA() {
    trackEvent("InitiateCheckout", {
      value: price,
      currency: "BRL",
      content_name: id,
    })
  }

  return (
    <motion.div
      variants={fadeUp}
      style={{
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        background: featured ? "var(--color-forge-graphite)" : "rgba(255,255,255,0.02)",
        border: featured
          ? "2px solid var(--color-forge-orange)"
          : "1px solid var(--color-forge-border)",
      }}
    >
      {/* Spotlight no featured */}
      {featured && (
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse 80% 45% at 50% 0%, rgba(255,77,0,0.12) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />
      )}

      {/* Badge "★ Mais popular" */}
      {featured && (
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            background: "var(--color-forge-orange)",
            padding: "5px 14px",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: 9,
              fontWeight: 700,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "var(--color-forge-white)",
            }}
          >
            ★ Mais popular
          </span>
        </div>
      )}

      {/* Header */}
      <div
        style={{
          padding: "32px 28px 24px",
          borderBottom: "1px solid var(--color-forge-border)",
          position: "relative",
        }}
      >
        {/* Título */}
        <h3
          style={{
            fontFamily: "var(--font-bebas)",
            fontSize: 28,
            lineHeight: 1,
            letterSpacing: "2px",
            color: featured ? "var(--color-forge-orange)" : "var(--color-forge-white)",
            marginBottom: 16,
          }}
        >
          {id}
        </h3>

        {/* Preço */}
        <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 12 }}>
          <span
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: 14,
              color: "var(--color-forge-muted)",
              alignSelf: "flex-start",
              marginTop: 6,
            }}
          >
            R$
          </span>
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 48,
              fontWeight: 700,
              lineHeight: 1,
              color: "var(--color-forge-white)",
            }}
          >
            {price.toLocaleString("pt-BR")}
          </span>
          <span
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: 16,
              color: "var(--color-forge-muted)",
              alignSelf: "flex-end",
              marginBottom: 4,
            }}
          >
            /mês
          </span>
        </div>

        {/* Créditos destaque */}
        <p
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 13,
            fontWeight: 500,
            color: featured ? "var(--color-forge-orange)" : "var(--color-forge-white)",
            marginBottom: 4,
          }}
        >
          {credits}
        </p>

        {/* Estimativa */}
        <p
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: 12,
            color: "var(--color-forge-muted)",
            marginBottom: 14,
          }}
        >
          {estimate}
        </p>

        {/* Descrição */}
        <p
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: 14,
            lineHeight: 1.55,
            color: "var(--color-forge-muted)",
            margin: 0,
          }}
        >
          {desc}
        </p>
      </div>

      {/* Corpo */}
      <div style={{ padding: "24px 28px", flex: 1, position: "relative" }}>
        {/* Pills de modelos */}
        <p
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "var(--color-forge-muted)",
            marginBottom: 10,
          }}
        >
          Modelos incluídos
        </p>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 6,
            marginBottom: extras && extras.length > 0 ? 20 : 0,
          }}
        >
          {pills.map((p) => (
            <Pill key={p} label={p} />
          ))}
        </div>

        {/* Extras (checks) */}
        {extras && extras.length > 0 && (
          <ul
            style={{
              listStyle: "none",
              padding: 0,
              margin: 0,
              display: "flex",
              flexDirection: "column",
              gap: 8,
            }}
          >
            {extras.map((ex) => (
              <CheckItem key={ex.label} label={ex.label} color={ex.color} />
            ))}
          </ul>
        )}
      </div>

      {/* CTA */}
      <div style={{ padding: "0 28px 32px", position: "relative" }}>
        <button
          onClick={handleCTA}
          style={{
            width: "100%",
            padding: "14px 0",
            fontFamily: "var(--font-sans)",
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            cursor: "pointer",
            border: variant === "primary" ? "none" : "1px solid rgba(255,255,255,0.22)",
            background: variant === "primary" ? "var(--color-forge-orange)" : "transparent",
            color: "var(--color-forge-white)",
            boxShadow: variant === "primary" ? "0 0 24px rgba(255,77,0,0.35)" : "none",
            transition: "box-shadow 220ms ease, border-color 220ms ease, transform 220ms ease",
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget as HTMLButtonElement
            if (variant === "primary") {
              el.style.boxShadow = "0 0 44px rgba(255,77,0,0.6)"
              el.style.transform = "scale(1.02)"
            } else {
              el.style.borderColor = "rgba(255,255,255,0.5)"
              el.style.transform = "scale(1.01)"
            }
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget as HTMLButtonElement
            if (variant === "primary") {
              el.style.boxShadow = "0 0 24px rgba(255,77,0,0.35)"
              el.style.transform = "scale(1)"
            } else {
              el.style.borderColor = "rgba(255,255,255,0.22)"
              el.style.transform = "scale(1)"
            }
          }}
        >
          {ctaLabel}
        </button>
      </div>
    </motion.div>
  )
}

/* ── Tabela Top-Up ──────────────────────────────────────────── */
function TopUpTable() {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={fadeUp}
      style={{
        background: "var(--color-forge-graphite)",
        border: "1px solid var(--color-forge-border)",
        borderRadius: 12,
        padding: "32px 28px",
        marginTop: 40,
      }}
    >
      {/* Header */}
      <p
        style={{
          fontFamily: "var(--font-sans)",
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          color: "var(--color-forge-orange)",
          marginBottom: 6,
        }}
      >
        Top-up de créditos
      </p>
      <p
        style={{
          fontFamily: "var(--font-sans)",
          fontSize: 13,
          color: "var(--color-forge-muted)",
          marginBottom: 24,
        }}
      >
        Compra avulsa · disponível em todos os planos · top-up nunca expira
      </p>

      {/* Linhas */}
      <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
        {TOPUPS.map((row, i) => (
          <div
            key={row.price}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
              padding: "14px 0",
              borderTop: i === 0 ? "none" : "1px solid var(--color-forge-border)",
              flexWrap: "wrap",
            }}
          >
            {/* Preço */}
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 18,
                fontWeight: 700,
                color: "var(--color-forge-white)",
                minWidth: 72,
              }}
            >
              R$ {row.price}
            </span>

            {/* Créditos + badge */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1 }}>
              <span
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: 14,
                  color: "var(--color-forge-white)",
                }}
              >
                {row.credits}
              </span>
              {row.badge && (
                <span
                  style={{
                    padding: "2px 8px",
                    fontFamily: "var(--font-sans)",
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                    color:
                      row.badge.color === "orange"
                        ? "var(--color-forge-orange)"
                        : "var(--color-forge-cyan)",
                    border: `1px solid ${row.badge.color === "orange" ? "rgba(255,77,0,0.35)" : "rgba(0,229,255,0.35)"}`,
                  }}
                >
                  {row.badge.label}
                </span>
              )}
            </div>

          </div>
        ))}
      </div>

      {/* Nota final */}
      <p
        style={{
          fontFamily: "var(--font-sans)",
          fontSize: 12,
          color: "var(--color-forge-muted)",
          marginTop: 20,
          marginBottom: 0,
          borderTop: "1px solid var(--color-forge-border)",
          paddingTop: 16,
        }}
      >
        Acabou no meio da campanha? Compra avulsa e continua gerando. Sem esperar virar o mês.
      </p>
    </motion.div>
  )
}

/* ── Seção principal ────────────────────────────────────────── */
export function Planos() {
  return (
    <section
      id="planos"
      style={{ background: "var(--color-forge-black)" }}
    >
      <div className="mx-auto max-w-7xl px-6 py-24 lg:py-32">

        {/* Header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={stagger}
          className="mb-14 max-w-2xl"
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
            Planos
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
            Escale no ritmo
            <br />
            do seu negócio.
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
            Sem contrato anual obrigatório. Cancele quando quiser.
            Todos os planos incluem acesso imediato à plataforma.
          </motion.p>
        </motion.div>

        {/* Cards */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={stagger}
          className="grid grid-cols-1 lg:grid-cols-3 gap-4"
        >
          {PLANS.map((plan) => (
            <PlanCard key={plan.id} plan={plan} />
          ))}
        </motion.div>

        {/* Nota abaixo dos cards */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [...EASE], delay: 0.2 }}
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: 13,
            lineHeight: 1.7,
            color: "var(--color-forge-muted)",
            textAlign: "center",
            maxWidth: 600,
            margin: "32px auto 0",
          }}
        >
          Sem trial. Sem promessa vaga. Você entra, escolhe o modelo, monta o workflow e começa a
          produzir no mesmo dia. Créditos não expiram enquanto a assinatura estiver ativa.
          O que não usar esse mês, acumula pro próximo.
        </motion.p>

        {/* Top-up */}
        <TopUpTable />
      </div>
    </section>
  )
}
