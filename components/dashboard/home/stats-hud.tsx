"use client"

import { motion, useInView } from "framer-motion"
import { useRef, useEffect, useState } from "react"
import { BookOpen, ShoppingBag } from "lucide-react"

// ─── Tipos ───────────────────────────────────────────────────────────────────

interface StatsHUDProps {
  prompts: number
  produtos: number
}

// ─── Hook: animação de número ─────────────────────────────────────────────────

function useAnimatedNumber(target: number, inView: boolean, duration = 1500): number {
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (!inView) return

    const start = performance.now()

    function step(now: number) {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      // easing ease-out
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(Math.round(eased * target))

      if (progress < 1) {
        requestAnimationFrame(step)
      }
    }

    requestAnimationFrame(step)
  }, [inView, target, duration])

  return value
}

// ─── Card base ────────────────────────────────────────────────────────────────

function StatCard({
  value,
  label,
  icon: Icon,
  color,
  inView,
  extra,
}: {
  value: number
  label: string
  icon: React.ComponentType<{ size?: number; style?: React.CSSProperties }>
  color: string
  inView: boolean
  extra?: React.ReactNode
}) {
  const animated = useAnimatedNumber(value, inView)

  return (
    <div
      style={{
        background: "#111111",
        border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: "12px",
        padding: "16px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Ícone decorativo */}
      <Icon
        size={16}
        style={{
          position: "absolute",
          top: "12px",
          right: "12px",
          color: "rgba(245,245,245,0.2)",
        }}
      />

      {/* Número animado */}
      <div
        style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: "36px",
          fontWeight: 700,
          color,
          lineHeight: 1,
        }}
      >
        {animated.toLocaleString("pt-BR")}
      </div>

      {/* Label */}
      <div
        style={{
          fontSize: "11px",
          textTransform: "uppercase",
          letterSpacing: "2px",
          color: "rgba(245,245,245,0.35)",
          marginTop: "4px",
        }}
      >
        {label}
      </div>

      {/* Conteúdo extra (ex: barra de progresso) */}
      {extra}
    </div>
  )
}

// ─── Componente principal ─────────────────────────────────────────────────────

export function StatsHUD({ prompts, produtos }: StatsHUDProps) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-40px" })

  return (
    <div
      ref={ref}
      style={{ gap: "8px" }}
      className="grid grid-cols-1 sm:grid-cols-2"
    >
      {/* Card 1 — Prompts */}
      <StatCard
        value={prompts}
        label="prompts disponíveis"
        icon={BookOpen}
        color="#FF4D00"
        inView={inView}
      />

      {/* Card 2 — Produtos */}
      <StatCard
        value={produtos}
        label="produtos na biblioteca"
        icon={ShoppingBag}
        color="#00E5FF"
        inView={inView}
      />
    </div>
  )
}
