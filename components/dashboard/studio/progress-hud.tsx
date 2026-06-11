"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

// ─── Constantes ───────────────────────────────────────────────────────────────

const TOTAL_SECONDS = 18

// ─── Tipos ───────────────────────────────────────────────────────────────────

interface ProgressHUDProps {
  model: string
  onComplete: () => void
}

// ─── Componente ──────────────────────────────────────────────────────────────

export function ProgressHUD({ model, onComplete }: ProgressHUDProps) {
  const [progress, setProgress] = useState(0)
  const [seconds, setSeconds] = useState(TOTAL_SECONDS)

  useEffect(() => {
    const increment = (100 / TOTAL_SECONDS) * 0.3
    let currentProgress = 0
    let currentSeconds = TOTAL_SECONDS

    const interval = setInterval(() => {
      currentProgress += increment
      const newSeconds = Math.max(0, Math.round(TOTAL_SECONDS - (currentProgress / 100) * TOTAL_SECONDS))

      if (currentProgress >= 100) {
        setProgress(100)
        setSeconds(0)
        clearInterval(interval)
        onComplete()
        return
      }

      setProgress(currentProgress)
      setSeconds(newSeconds !== currentSeconds ? newSeconds : currentSeconds)
      currentSeconds = newSeconds
    }, 300)

    return () => clearInterval(interval)
  }, [onComplete])

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "32px",
        textAlign: "center",
        width: "100%",
      }}
    >
      <div
        style={{
          background: "#111111",
          border: "1px solid rgba(255,77,0,0.3)",
          borderRadius: "12px",
          padding: "32px 24px",
          width: "100%",
          maxWidth: "400px",
          margin: "0 auto",
        }}
      >
        {/* Label */}
        <p
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "14px",
            fontWeight: 700,
            color: "#F5F5F5",
            marginBottom: "24px",
          }}
        >
          Gerando com {model}...
        </p>

        {/* Percentagem */}
        <motion.div
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: "56px",
            fontWeight: 700,
            color: "#00E5FF",
            lineHeight: 1,
          }}
        >
          {Math.round(progress)}%
        </motion.div>

        {/* Barra de progresso */}
        <div
          style={{
            width: "100%",
            height: "8px",
            background: "rgba(255,255,255,0.06)",
            borderRadius: "9999px",
            margin: "16px 0",
            overflow: "hidden",
          }}
        >
          <motion.div
            style={{
              height: "8px",
              background: "linear-gradient(90deg, #FF4D00, #00E5FF)",
              borderRadius: "9999px",
              width: `${progress}%`,
              transition: "width 0.3s linear",
            }}
          />
        </div>

        {/* Tempo restante */}
        <p
          style={{
            fontSize: "12px",
            color: "rgba(245,245,245,0.4)",
          }}
        >
          ~{seconds}s restantes
        </p>
      </div>
    </div>
  )
}
