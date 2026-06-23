"use client"

import { useRef, useEffect, useState } from "react"
import type { Variants } from "framer-motion"
import { motion } from "framer-motion"
import gsap from "gsap"
import { trackEvent } from "@/lib/pixels"
import { Check, MessageCircle } from "lucide-react"

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
interface Feature {
  label: string
  highlight?: boolean
}

interface Plan {
  id: "Starter" | "Pro" | "Agency"
  price: number
  desc: string
  tagline: string
  features: Feature[]
  featured?: boolean
  ctaLabel: string
  variant: "primary" | "secondary"
  accentColor: string
}

const PLANS: Plan[] = [
  {
    id: "Starter",
    price: 97,
    tagline: "Para quem está começando",
    desc: "Acesse prompts prontos, descubra produtos em alta e crie seu avatar de criador.",
    features: [
      { label: "Biblioteca completa de prompts (ChatGPT + Gemini)" },
      { label: "30 gerações de copy/mês com o Gerador" },
      { label: "Biblioteca de produtos — top 50 da semana" },
      { label: "Atualização semanal da biblioteca" },
      { label: "Avatar IA — 1 avatar salvo" },
      { label: "Histórico dos últimos 30 dias" },
      { label: "Suporte WhatsApp" },
    ],
    ctaLabel: "COMEÇAR AGORA",
    variant: "secondary",
    accentColor: "rgba(245,245,245,0.5)",
  },
  {
    id: "Pro",
    price: 197,
    tagline: "Para afiliados ativos",
    desc: "Publique todo dia com copy certa, produtos validados e alertas de viral antes da concorrência.",
    features: [
      { label: "Tudo do Starter" },
      { label: "Gerador de copy ilimitado", highlight: true },
      { label: "Biblioteca — top 200 + acesso completo", highlight: true },
      { label: "Atualização diária da biblioteca", highlight: true },
      { label: "Alertas de produto viral em tempo real", highlight: true },
      { label: "Avatares IA ilimitados", highlight: true },
      { label: "Prompts exclusivos PRO (roteiros, VSL, scripts longos)" },
      { label: "Histórico completo" },
      { label: "Suporte WhatsApp prioritário" },
    ],
    featured: true,
    ctaLabel: "ASSINAR PRO",
    variant: "primary",
    accentColor: "#FF4D00",
  },
  {
    id: "Agency",
    price: 397,
    tagline: "Para agências e múltiplas lojas",
    desc: "Gerencie várias operações, acesse dados antecipados e tenha um gerente de conta dedicado.",
    features: [
      { label: "Tudo do Pro" },
      { label: "Até 5 perfis/lojas na mesma conta", highlight: true },
      { label: "Relatório semanal de tendências por nicho", highlight: true },
      { label: "Acesso antecipado a produtos novos", highlight: true },
      { label: "Onboarding 1:1 personalizado" },
      { label: "Gerente de conta no WhatsApp", highlight: true },
    ],
    ctaLabel: "ASSINAR AGENCY",
    variant: "secondary",
    accentColor: "#4ADE80",
  },
]

/* ── Card ───────────────────────────────────────────────────── */
function PlanCard({ plan }: { plan: Plan }) {
  const { id, price, tagline, desc, features, featured, ctaLabel, variant, accentColor } = plan
  const cardRef  = useRef<HTMLDivElement>(null)
  const glareRef = useRef<HTMLDivElement>(null)
  const [loading, setLoading] = useState(false)

  async function handleCTA() {
    trackEvent("InitiateCheckout", { value: price, currency: "BRL", content_name: id })
    const planId = id.toLowerCase()
    // Detecta se usuário está logado pelo cache local (token fica em cookie httpOnly)
    const isLoggedIn = typeof window !== "undefined" && !!localStorage.getItem("mf_user")

    if (!isLoggedIn) {
      // Sem conta — vai para cadastro com plano pré-selecionado
      window.location.href = `/cadastro?plan=${planId}`
      return
    }

    // Usuário logado — cria checkout direto (cookie enviado automaticamente)
    setLoading(true)
    try {
      const res  = await fetch("/api/payment/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: planId }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
        return
      }
      // API retornou erro — manda para a página de planos no dashboard
      window.location.href = "/dashboard/planos"
    } catch {
      // Erro de rede — manda para o dashboard
      window.location.href = "/dashboard/planos"
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const card = cardRef.current
    const glare = glareRef.current
    if (!card || !glare) return

    gsap.set(card, { transformPerspective: 900 })

    const applyTilt = (x: number, y: number) => {
      gsap.to(card, { rotateX: (y - 0.5) * -10, rotateY: (x - 0.5) * 10, duration: 0.3, ease: "power2.out", overwrite: "auto" })
      glare.style.background = `radial-gradient(circle at ${x * 100}% ${y * 100}%, rgba(255,255,255,0.08) 0%, transparent 55%)`
    }

    const resetTilt = () => {
      gsap.to(card, { rotateX: 0, rotateY: 0, scale: 1, duration: 0.7, ease: "elastic.out(1, 0.5)", overwrite: "auto" })
      gsap.to(glare, { opacity: 0, duration: 0.4 })
    }

    const onEnter = () => { gsap.to(card, { scale: 1.025, duration: 0.3, ease: "power2.out", overwrite: "auto" }); gsap.to(glare, { opacity: 1, duration: 0.25 }) }
    const onMove  = (e: MouseEvent) => { const r = card.getBoundingClientRect(); applyTilt((e.clientX - r.left) / r.width, (e.clientY - r.top) / r.height) }
    const onTouchStart = () => { gsap.to(card, { scale: 1.025, duration: 0.25, ease: "power2.out", overwrite: "auto" }); gsap.to(glare, { opacity: 1, duration: 0.2 }) }
    const onTouchMove  = (e: TouchEvent) => { const t = e.touches[0]; const r = card.getBoundingClientRect(); applyTilt((t.clientX - r.left) / r.width, (t.clientY - r.top) / r.height) }

    card.addEventListener("mouseenter", onEnter)
    card.addEventListener("mousemove", onMove)
    card.addEventListener("mouseleave", resetTilt)
    card.addEventListener("touchstart", onTouchStart, { passive: true })
    card.addEventListener("touchmove", onTouchMove, { passive: true })
    card.addEventListener("touchend", resetTilt)

    return () => {
      card.removeEventListener("mouseenter", onEnter)
      card.removeEventListener("mousemove", onMove)
      card.removeEventListener("mouseleave", resetTilt)
      card.removeEventListener("touchstart", onTouchStart)
      card.removeEventListener("touchmove", onTouchMove)
      card.removeEventListener("touchend", resetTilt)
    }
  }, [])

  return (
    <motion.div
      ref={cardRef}
      variants={fadeUp}
      style={{
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        background: featured ? "var(--color-forge-graphite)" : "rgba(255,255,255,0.02)",
        border: featured ? "2px solid var(--color-forge-orange)" : "1px solid var(--color-forge-border)",
      }}
    >
      {/* Glare */}
      <div ref={glareRef} aria-hidden style={{ position: "absolute", inset: 0, opacity: 0, pointerEvents: "none", zIndex: 15 }} />

      {/* Spotlight */}
      {featured && (
        <div aria-hidden style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          background: "radial-gradient(ellipse 80% 45% at 50% 0%, rgba(255,77,0,0.12) 0%, transparent 70%)",
        }} />
      )}

      {/* Badge mais popular */}
      {featured && (
        <div style={{ position: "absolute", top: 0, right: 0, background: "var(--color-forge-orange)", padding: "5px 14px" }}>
          <span style={{ fontFamily: "var(--font-sans)", fontSize: 9, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "white" }}>
            ★ Mais popular
          </span>
        </div>
      )}

      {/* Header */}
      <div style={{ padding: "32px 28px 24px", borderBottom: "1px solid var(--color-forge-border)", position: "relative" }}>
        {/* Nome + tagline */}
        <h3 style={{ fontFamily: "var(--font-bebas)", fontSize: 28, lineHeight: 1, letterSpacing: "2px", color: accentColor, marginBottom: 6 }}>
          {id}
        </h3>
        <p style={{ fontFamily: "var(--font-sans)", fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(245,245,245,0.35)", marginBottom: 20 }}>
          {tagline}
        </p>

        {/* Preço */}
        <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 16 }}>
          <span style={{ fontFamily: "var(--font-sans)", fontSize: 14, color: "var(--color-forge-muted)", alignSelf: "flex-start", marginTop: 6 }}>R$</span>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 52, fontWeight: 700, lineHeight: 1, color: "var(--color-forge-white)" }}>
            {price}
            <span style={{ fontSize: 20, fontWeight: 500, color: "var(--color-forge-muted)" }}>,00</span>
          </span>
          <span style={{ fontFamily: "var(--font-sans)", fontSize: 16, color: "var(--color-forge-muted)", alignSelf: "flex-end", marginBottom: 4 }}>/mês</span>
        </div>

        <p style={{ fontFamily: "var(--font-sans)", fontSize: 13, lineHeight: 1.55, color: "var(--color-forge-muted)", margin: 0 }}>
          {desc}
        </p>
      </div>

      {/* Features */}
      <div style={{ padding: "24px 28px", flex: 1, position: "relative" }}>
        <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
          {features.map((f) => (
            <li key={f.label} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
              <Check
                size={14}
                strokeWidth={2.5}
                style={{
                  flexShrink: 0,
                  marginTop: 1,
                  color: f.highlight ? accentColor : "rgba(245,245,245,0.3)",
                }}
              />
              <span style={{
                fontFamily: "var(--font-sans)",
                fontSize: 13,
                lineHeight: 1.5,
                color: f.highlight ? "var(--color-forge-white)" : "rgba(245,245,245,0.55)",
                fontWeight: f.highlight ? 700 : 400,
              }}>
                {f.label}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* CTA */}
      <div style={{ padding: "0 28px 32px", position: "relative" }}>
        <button
          onClick={handleCTA}
          disabled={loading}
          style={{
            width: "100%", padding: "14px 0",
            fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 700,
            letterSpacing: "0.2em", textTransform: "uppercase",
            cursor: loading ? "not-allowed" : "pointer",
            border: variant === "primary" ? "none" : "1px solid rgba(255,255,255,0.22)",
            background: variant === "primary" ? "var(--color-forge-orange)" : "transparent",
            color: "var(--color-forge-white)",
            opacity: loading ? 0.7 : 1,
            boxShadow: variant === "primary" ? "0 0 24px rgba(255,77,0,0.35)" : "none",
            transition: "box-shadow 220ms ease, border-color 220ms ease, transform 220ms ease, opacity 150ms ease",
          }}
          onMouseEnter={(e) => {
            if (loading) return
            const el = e.currentTarget as HTMLButtonElement
            if (variant === "primary") { el.style.boxShadow = "0 0 44px rgba(255,77,0,0.6)"; el.style.transform = "scale(1.02)" }
            else { el.style.borderColor = "rgba(255,255,255,0.5)"; el.style.transform = "scale(1.01)" }
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget as HTMLButtonElement
            if (variant === "primary") { el.style.boxShadow = "0 0 24px rgba(255,77,0,0.35)"; el.style.transform = "scale(1)" }
            else { el.style.borderColor = "rgba(255,255,255,0.22)"; el.style.transform = "scale(1)" }
          }}
        >
          {loading ? "Aguarde..." : ctaLabel}
        </button>
      </div>
    </motion.div>
  )
}

/* ── Seção ──────────────────────────────────────────────────── */
export function Planos() {
  return (
    <section id="planos" style={{ background: "var(--color-forge-black)" }}>
      <div className="mx-auto max-w-7xl px-6 py-24 lg:py-32">

        {/* Header */}
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={stagger} className="mb-14 max-w-2xl">
          <motion.p variants={fadeUp} style={{ fontFamily: "var(--font-sans)", fontSize: 10, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--color-forge-orange)", marginBottom: 16 }}>
            Planos
          </motion.p>
          <motion.h2 variants={fadeUp} style={{ fontFamily: "var(--font-bebas)", fontSize: "clamp(36px, 5.5vw, 56px)", lineHeight: 1, letterSpacing: "3px", color: "var(--color-forge-white)", marginBottom: 16 }}>
            Escale no ritmo<br />do seu negócio.
          </motion.h2>
          <motion.p variants={fadeUp} style={{ fontFamily: "var(--font-sans)", fontSize: 16, lineHeight: 1.65, color: "var(--color-forge-muted)" }}>
            Sem contrato anual. Cancele quando quiser. Todos os planos incluem acesso imediato à plataforma.
          </motion.p>
        </motion.div>

        {/* Cards */}
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={stagger} className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {PLANS.map((plan) => <PlanCard key={plan.id} plan={plan} />)}
        </motion.div>

        {/* Nota WhatsApp */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [...EASE], delay: 0.2 }}
          style={{
            marginTop: 40,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            padding: "16px 24px",
            background: "rgba(37,211,102,0.06)",
            border: "1px solid rgba(37,211,102,0.2)",
            borderRadius: 12,
            maxWidth: 520,
            margin: "64px auto 0",
          }}
        >
          <MessageCircle size={16} style={{ color: "#25D366", flexShrink: 0 }} />
          <p style={{ fontFamily: "var(--font-sans)", fontSize: 13, color: "rgba(245,245,245,0.7)", margin: 0, lineHeight: 1.5 }}>
            <strong style={{ color: "#F5F5F5" }}>Todos os planos incluem suporte pelo WhatsApp.</strong>{" "}
            Pro e Agency têm atendimento prioritário.
          </p>
        </motion.div>

      </div>
    </section>
  )
}
