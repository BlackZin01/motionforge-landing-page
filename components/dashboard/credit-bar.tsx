"use client"

import { useState } from "react"
import { motion } from "framer-motion"

// ─── Props ────────────────────────────────────────────────────────────────────

interface CreditBarProps {
  credits: number
  total: number
  renewDays: number
  isAdmin?: boolean
}

// ─── Componente ───────────────────────────────────────────────────────────────

export function CreditBar({ credits, total, renewDays, isAdmin }: CreditBarProps) {
  const [isHovered, setIsHovered] = useState(false)

  const pct = isAdmin ? 100 : total > 0 ? (credits / total) * 100 : 0
  const percentStr = `${Math.min(100, Math.max(0, pct)).toFixed(1)}%`

  // Cor da barra conforme nível de créditos
  const barColor =
    isAdmin ? "#00E5FF" : pct > 50 ? "#00E5FF" : pct > 10 ? "#FF4D00" : "#EF4444"

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        position: "relative",
        background: "rgba(0,229,255,0.06)",
        border: "1px solid rgba(0,229,255,0.15)",
        borderRadius: "9999px",
        padding: "4px 12px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "0px",
        cursor: "default",
      }}
    >
      {/* Linha principal: ícone + número */}
      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
        <span
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: "13px",
            fontWeight: 700,
            color: "#00E5FF",
          }}
        >
          ⚡ {isAdmin ? "∞" : credits.toLocaleString("pt-BR")}
        </span>
      </div>

      {/* Barra fina de progresso */}
      <div
        style={{
          background: "rgba(255,255,255,0.1)",
          width: "80px",
          height: "2px",
          borderRadius: "9999px",
          marginTop: "2px",
          overflow: "hidden",
        }}
      >
        <motion.div
          initial={{ width: "0%" }}
          animate={{ width: percentStr }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          style={{
            height: "100%",
            background: barColor,
            borderRadius: "9999px",
          }}
        />
      </div>

      {/* Tooltip ao hover */}
      {isHovered && (
        <div
          style={{
            position: "absolute",
            bottom: "100%",
            left: "50%",
            transform: "translateX(-50%)",
            marginBottom: "8px",
            background: "#1A1A1A",
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: "8px",
            padding: "8px",
            fontSize: "12px",
            color: "rgba(245,245,245,0.4)",
            whiteSpace: "nowrap",
            zIndex: 10,
            fontFamily: "'DM Sans', sans-serif",
            pointerEvents: "none",
          }}
        >
          {isAdmin ? "Créditos ilimitados · Admin" : `${credits.toLocaleString("pt-BR")} de ${total.toLocaleString("pt-BR")} · Renova em ${renewDays} dias`}
        </div>
      )}
    </div>
  )
}
