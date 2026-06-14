"use client"

import { useState } from "react"
import { X, AlertTriangle, Zap, ArrowRight, Sparkles } from "lucide-react"
import Link from "next/link"

// ─── Tipos ───────────────────────────────────────────────────────────────────

interface UpgradeBannerProps {
  credits: number
  plan: string
}

// ─── Variantes do banner ──────────────────────────────────────────────────────

type BannerVariant = "no-credits" | "low-credits" | "upgrade"

function getBannerVariant(credits: number, plan: string): BannerVariant | null {
  if (credits === 0)        return "no-credits"
  if (credits < 50)         return "low-credits"
  if (plan === "Starter")   return "upgrade"
  return null
}

// ─── Config visual por variante ───────────────────────────────────────────────

const VARIANT_CONFIG = {
  "no-credits": {
    bg:     "linear-gradient(90deg, rgba(239,68,68,.1) 0%, rgba(239,68,68,.04) 100%)",
    border: "rgba(239,68,68,.22)",
    icon:   <AlertTriangle size={14} style={{ color: "#ef4444", flexShrink: 0 }} />,
    pill:   { bg: "rgba(239,68,68,.12)", color: "#ef4444", label: "SEM CRÉDITOS" },
    text:   "Seus créditos acabaram. Recarregue agora para continuar gerando.",
    cta:    { label: "Recarregar agora",   href: "/dashboard/creditos", color: "#ef4444" },
  },
  "low-credits": {
    bg:     "linear-gradient(90deg, rgba(255,77,0,.09) 0%, rgba(255,77,0,.03) 100%)",
    border: "rgba(255,77,0,.2)",
    icon:   <Zap size={14} style={{ color: "#FF4D00", flexShrink: 0 }} />,
    pill:   { bg: "rgba(255,77,0,.1)", color: "#FF4D00", label: "CRÉDITOS BAIXOS" },
    text:   "Você está ficando sem créditos. Recarregue antes de ficar bloqueado.",
    cta:    { label: "Ver créditos",        href: "/dashboard/creditos", color: "#FF4D00" },
  },
  "upgrade": {
    bg:     "linear-gradient(90deg, rgba(0,229,255,.06) 0%, rgba(168,85,247,.04) 100%)",
    border: "rgba(0,229,255,.12)",
    icon:   <Sparkles size={14} style={{ color: "#00E5FF", flexShrink: 0 }} />,
    pill:   { bg: "rgba(0,229,255,.08)", color: "#00E5FF", label: "PLANO STARTER" },
    text:   "Desbloqueie modelos Pro, Kling e Veo 3.1 com o plano Pro ou Agency.",
    cta:    { label: "Ver planos",          href: "/dashboard/creditos", color: "#00E5FF" },
  },
} as const

// ─── Componente ──────────────────────────────────────────────────────────────

export function UpgradeBanner({ credits, plan }: UpgradeBannerProps) {
  const [dismissed, setDismissed] = useState(false)

  const variant = getBannerVariant(credits, plan)
  if (!variant || dismissed) return null

  const cfg = VARIANT_CONFIG[variant]

  return (
    <div
      style={{
        background: cfg.bg,
        borderBottom: `1px solid ${cfg.border}`,
        padding: "9px 16px",
        display: "flex",
        alignItems: "center",
        gap: "10px",
        flexShrink: 0,
      }}
    >
      {/* Ícone */}
      {cfg.icon}

      {/* Pill de status */}
      <span
        style={{
          fontSize: "9px",
          fontWeight: 700,
          letterSpacing: "1.5px",
          padding: "2px 7px",
          borderRadius: "4px",
          background: cfg.pill.bg,
          color: cfg.pill.color,
          fontFamily: "'DM Sans',sans-serif",
          flexShrink: 0,
          display: "none",
          // visível apenas em desktop (via className abaixo)
        }}
        className="hidden sm:inline"
      >
        {cfg.pill.label}
      </span>

      {/* Texto */}
      <p
        style={{
          flex: 1,
          fontSize: "13px",
          color: "rgba(245,245,245,.8)",
          fontFamily: "'DM Sans',sans-serif",
          margin: 0,
          lineHeight: "1.4",
        }}
      >
        {cfg.text}
      </p>

      {/* CTA */}
      <Link
        href={cfg.cta.href}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "5px",
          fontSize: "12px",
          fontWeight: 700,
          color: cfg.cta.color,
          textDecoration: "none",
          fontFamily: "'DM Sans',sans-serif",
          whiteSpace: "nowrap",
          flexShrink: 0,
          padding: "5px 10px",
          borderRadius: "6px",
          border: `1px solid ${cfg.cta.color}22`,
          background: `${cfg.cta.color}0D`,
          transition: "background .15s",
        }}
        onMouseEnter={(e) => {
          ;(e.currentTarget as HTMLAnchorElement).style.background = `${cfg.cta.color}1A`
        }}
        onMouseLeave={(e) => {
          ;(e.currentTarget as HTMLAnchorElement).style.background = `${cfg.cta.color}0D`
        }}
      >
        {cfg.cta.label}
        <ArrowRight size={11} />
      </Link>

      {/* Fechar */}
      <button
        onClick={() => setDismissed(true)}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          color: "rgba(245,245,245,.35)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "4px",
          borderRadius: "4px",
          flexShrink: 0,
          transition: "color .15s",
        }}
        onMouseEnter={(e) => {
          ;(e.currentTarget as HTMLButtonElement).style.color = "rgba(245,245,245,.7)"
        }}
        onMouseLeave={(e) => {
          ;(e.currentTarget as HTMLButtonElement).style.color = "rgba(245,245,245,.35)"
        }}
        aria-label="Fechar aviso"
      >
        <X size={13} />
      </button>
    </div>
  )
}
