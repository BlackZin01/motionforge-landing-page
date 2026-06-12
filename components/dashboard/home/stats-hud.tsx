"use client"

import { motion, useInView } from "framer-motion"
import { useRef, useEffect, useState } from "react"
import { Zap, Video, Image, GitBranch } from "lucide-react"

// ─── Tipos ───────────────────────────────────────────────────────────────────

interface StatsHUDProps {
  credits: number
  totalCredits?: number
  videos: number
  images: number
  workflows: number
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

export function StatsHUD({ credits, totalCredits = 5000, videos, images, workflows }: StatsHUDProps) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-40px" })

  // Dados de créditos
  const TOTAL_CREDITS = totalCredits
  const USED = Math.max(0, TOTAL_CREDITS - credits)
  const usedPercent = TOTAL_CREDITS > 0 ? (USED / TOTAL_CREDITS) * 100 : 0

  return (
    <div
      ref={ref}
      style={{ gap: "8px" }}
      className="grid grid-cols-2 lg:grid-cols-4"
    >
      {/* Card 1 — Créditos */}
      <StatCard
        value={credits}
        label="créditos disponíveis"
        icon={Zap}
        color="#00E5FF"
        inView={inView}
        extra={
          <div style={{ marginTop: "12px" }}>
            <div
              style={{
                fontSize: "10px",
                color: "rgba(245,245,245,0.4)",
                marginBottom: "6px",
              }}
            >
              {USED.toLocaleString("pt-BR")} usados · {credits.toLocaleString("pt-BR")} restantes
            </div>
            <div
              style={{
                height: "3px",
                background: "rgba(255,255,255,0.06)",
                borderRadius: "9999px",
                overflow: "hidden",
              }}
            >
              <motion.div
                initial={{ width: 0 }}
                animate={inView ? { width: `${usedPercent}%` } : { width: 0 }}
                transition={{ duration: 1.5, delay: 0.3, ease: "easeOut" }}
                style={{
                  height: "100%",
                  background: "#FF4D00",
                  borderRadius: "9999px",
                }}
              />
            </div>
          </div>
        }
      />

      {/* Card 2 — Vídeos */}
      <StatCard
        value={videos}
        label="vídeos gerados"
        icon={Video}
        color="#F5F5F5"
        inView={inView}
      />

      {/* Card 3 — Imagens */}
      <StatCard
        value={images}
        label="imagens geradas"
        icon={Image}
        color="#F5F5F5"
        inView={inView}
      />

      {/* Card 4 — Workflows */}
      <StatCard
        value={workflows}
        label="workflows ativos"
        icon={GitBranch}
        color="#F5F5F5"
        inView={inView}
      />
    </div>
  )
}
