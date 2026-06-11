"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Zap } from "lucide-react"

// ─── Constantes mock ──────────────────────────────────────────────────────────
// TODO: integrar API — buscar saldo e histórico de créditos do usuário

const CREDITS = 3847
const TOTAL = 5000
const USED = TOTAL - CREDITS
const RENEW_DAYS = 18

const TOPUPS = [
  { id: "500", credits: 500, price: "R$ 29", popular: false },
  { id: "1000", credits: 1000, price: "R$ 49", popular: false },
  { id: "2500", credits: 2500, price: "R$ 97", popular: true },
  { id: "5000", credits: 5000, price: "R$ 169", popular: false },
  { id: "10000", credits: 10000, price: "R$ 297", popular: false },
]

const HISTORY = Array.from({ length: 12 }, (_, i) => ({
  id: String(i + 1),
  date: `${11 - i}/06/26`,
  action: ["Geração vídeo", "Geração imagem", "Top-up créditos", "Geração vídeo"][i % 4],
  model: ["Seedance 2.0", "FLUX 2 Dev", "—", "Kling Std"][i % 4],
  credits: ["-35", "-3", "+2500", "-45"][i % 4],
}))

// ─── Componente ──────────────────────────────────────────────────────────────

export default function CreditosPage() {
  // Animação do contador de créditos
  const [animatedCredits, setAnimatedCredits] = useState(0)

  useEffect(() => {
    const duration = 1500
    const steps = 60
    const increment = CREDITS / steps
    let current = 0
    const timer = setInterval(() => {
      current += increment
      if (current >= CREDITS) {
        setAnimatedCredits(CREDITS)
        clearInterval(timer)
      } else {
        setAnimatedCredits(Math.floor(current))
      }
    }, duration / steps)
    return () => clearInterval(timer)
  }, [])

  return (
    <div
      style={{
        padding: "24px",
        maxWidth: "900px",
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        gap: "24px",
      }}
    >
      {/* ─── HERO: Saldo de créditos ─────────────────────────────────────────── */}
      <div
        style={{
          background: "#111111",
          border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: "16px",
          padding: "32px",
          textAlign: "center",
        }}
      >
        {/* Número animado */}
        <span
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: "72px",
            fontWeight: 700,
            color: "#00E5FF",
            display: "block",
            lineHeight: 1,
          }}
        >
          {animatedCredits.toLocaleString("pt-BR")}
        </span>

        <span
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "16px",
            color: "rgba(245,245,245,0.4)",
            display: "block",
            marginTop: "8px",
            marginBottom: "24px",
          }}
        >
          créditos disponíveis
        </span>

        {/* Barra de progresso */}
        <div style={{ marginBottom: "8px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "8px",
            }}
          >
            <span
              style={{ fontSize: "11px", color: "rgba(245,245,245,0.4)" }}
            >
              0
            </span>
            <span
              style={{ fontSize: "11px", color: "rgba(245,245,245,0.4)" }}
            >
              {TOTAL.toLocaleString("pt-BR")}
            </span>
          </div>

          <div
            style={{
              background: "rgba(255,255,255,0.06)",
              borderRadius: "9999px",
              overflow: "hidden",
              height: "12px",
            }}
          >
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(USED / TOTAL) * 100}%` }}
              transition={{ duration: 1.5, delay: 0.3, ease: "easeOut" }}
              style={{
                height: "100%",
                background: "linear-gradient(90deg, #FF4D00, #00E5FF)",
                borderRadius: "9999px",
              }}
            />
          </div>
        </div>

        <p
          style={{
            fontSize: "12px",
            color: "rgba(245,245,245,0.4)",
            marginTop: "12px",
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          {USED.toLocaleString("pt-BR")} usados de {TOTAL.toLocaleString("pt-BR")} · Renova em{" "}
          {RENEW_DAYS} dias
        </p>
      </div>

      {/* ─── PLANO ATUAL ─────────────────────────────────────────────────────── */}
      <div
        style={{
          background: "#111111",
          border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: "12px",
          padding: "20px",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr auto",
            gap: "16px",
            alignItems: "center",
          }}
        >
          {/* Info do plano */}
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span
                style={{
                  background: "rgba(0,229,255,0.08)",
                  border: "1px solid rgba(0,229,255,0.2)",
                  color: "#00E5FF",
                  fontSize: "10px",
                  fontWeight: 700,
                  padding: "2px 8px",
                  borderRadius: "9999px",
                  fontFamily: "'DM Sans', sans-serif",
                  letterSpacing: "1px",
                  textTransform: "uppercase",
                }}
              >
                Pro
              </span>
            </div>
            <span
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "18px",
                fontWeight: 700,
                color: "#F5F5F5",
              }}
            >
              R$ 497/mês
            </span>
            <span
              style={{
                fontSize: "12px",
                color: "rgba(245,245,245,0.4)",
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              Renova 11/07/26
            </span>
          </div>

          {/* Ações */}
          <div style={{ display: "flex", gap: "8px" }}>
            {/* TODO: integrar API de gerenciamento de assinatura */}
            <button
              style={{
                background: "transparent",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "6px",
                padding: "7px 14px",
                color: "rgba(245,245,245,0.6)",
                fontSize: "12px",
                fontWeight: 700,
                cursor: "pointer",
                fontFamily: "'DM Sans', sans-serif",
                transition: "border-color 0.15s ease, color 0.15s ease",
              }}
              onMouseEnter={(e) => {
                const btn = e.currentTarget as HTMLButtonElement
                btn.style.borderColor = "rgba(255,255,255,0.3)"
                btn.style.color = "#F5F5F5"
              }}
              onMouseLeave={(e) => {
                const btn = e.currentTarget as HTMLButtonElement
                btn.style.borderColor = "rgba(255,255,255,0.1)"
                btn.style.color = "rgba(245,245,245,0.6)"
              }}
            >
              Gerenciar
            </button>

            {/* TODO: link para página de upgrade */}
            <button
              style={{
                background: "#FF4D00",
                border: "none",
                borderRadius: "6px",
                padding: "7px 14px",
                color: "white",
                fontSize: "12px",
                fontWeight: 700,
                cursor: "pointer",
                fontFamily: "'DM Sans', sans-serif",
                transition: "opacity 0.15s ease",
              }}
              onMouseEnter={(e) => {
                ;(e.currentTarget as HTMLButtonElement).style.opacity = "0.88"
              }}
              onMouseLeave={(e) => {
                ;(e.currentTarget as HTMLButtonElement).style.opacity = "1"
              }}
            >
              Upgrade
            </button>
          </div>
        </div>
      </div>

      {/* ─── TOP-UP ───────────────────────────────────────────────────────────── */}
      <div id="upgrade">
        <p
          style={{
            fontSize: "10px",
            textTransform: "uppercase",
            letterSpacing: "2px",
            color: "#FF4D00",
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 700,
            marginBottom: "12px",
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          <Zap size={12} />
          TOP-UP DE CRÉDITOS
        </p>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "8px",
          }}
        >
          {TOPUPS.map((option) => (
            <motion.div
              key={option.id}
              whileHover={{ scale: 1.02 }}
              style={{ position: "relative" }}
            >
              <button
                onClick={() => {
                  // TODO: integrar Stripe/Kiwify checkout
                }}
                style={{
                  background: "#111111",
                  border: `1px solid ${option.popular ? "#FF4D00" : "rgba(255,255,255,0.06)"}`,
                  borderRadius: "12px",
                  padding: "16px",
                  textAlign: "center",
                  cursor: "pointer",
                  width: "130px",
                  transition: "border-color 0.15s ease, background 0.15s ease",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
                onMouseEnter={(e) => {
                  const btn = e.currentTarget as HTMLButtonElement
                  btn.style.borderColor = "rgba(255,77,0,0.4)"
                  btn.style.background = "rgba(255,77,0,0.04)"
                }}
                onMouseLeave={(e) => {
                  const btn = e.currentTarget as HTMLButtonElement
                  btn.style.borderColor = option.popular
                    ? "#FF4D00"
                    : "rgba(255,255,255,0.06)"
                  btn.style.background = "#111111"
                }}
              >
                {/* Badge popular */}
                {option.popular && (
                  <span
                    style={{
                      position: "absolute",
                      top: "-10px",
                      left: "50%",
                      transform: "translateX(-50%)",
                      background: "#FF4D00",
                      color: "white",
                      fontSize: "9px",
                      fontWeight: 700,
                      padding: "2px 8px",
                      borderRadius: "4px",
                      letterSpacing: "1px",
                      whiteSpace: "nowrap",
                      fontFamily: "'DM Sans', sans-serif",
                    }}
                  >
                    POPULAR
                  </span>
                )}

                <span
                  style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: "24px",
                    fontWeight: 700,
                    color: "#F5F5F5",
                    display: "block",
                  }}
                >
                  {option.credits.toLocaleString("pt-BR")}
                </span>
                <span
                  style={{
                    fontSize: "11px",
                    color: "rgba(245,245,245,0.4)",
                    fontFamily: "'DM Sans', sans-serif",
                    display: "block",
                  }}
                >
                  créditos
                </span>
                <span
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "16px",
                    fontWeight: 700,
                    color: "#FF4D00",
                    marginTop: "4px",
                    display: "block",
                  }}
                >
                  {option.price}
                </span>
              </button>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ─── HISTÓRICO DE CONSUMO ─────────────────────────────────────────────── */}
      <div>
        <p
          style={{
            fontSize: "10px",
            textTransform: "uppercase",
            letterSpacing: "2px",
            color: "#FF4D00",
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 700,
            marginBottom: "12px",
          }}
        >
          HISTÓRICO DE CONSUMO
        </p>

        <div
          style={{
            background: "#111111",
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: "12px",
            overflow: "hidden",
          }}
        >
          {/* Header da tabela */}
          <div
            style={{
              display: "flex",
              background: "rgba(255,255,255,0.02)",
              padding: "8px 16px",
            }}
          >
            {["Data", "Ação", "Modelo", "Créditos"].map((col) => (
              <span
                key={col}
                style={{
                  flex: col === "Ação" ? 2 : 1,
                  fontSize: "11px",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                  color: "rgba(245,245,245,0.4)",
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 700,
                }}
              >
                {col}
              </span>
            ))}
          </div>

          {/* Linhas */}
          {HISTORY.map((row, i) => (
            <div
              key={row.id}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "10px 16px",
                borderBottom:
                  i < HISTORY.length - 1
                    ? "1px solid rgba(255,255,255,0.04)"
                    : "none",
              }}
            >
              <span
                style={{
                  flex: 1,
                  fontSize: "12px",
                  color: "rgba(245,245,245,0.4)",
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                {row.date}
              </span>
              <span
                style={{
                  flex: 2,
                  fontSize: "12px",
                  color: "#F5F5F5",
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                {row.action}
              </span>
              <span
                style={{
                  flex: 1,
                  fontSize: "12px",
                  color: "rgba(245,245,245,0.4)",
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                {row.model}
              </span>
              <span
                style={{
                  flex: 1,
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: "12px",
                  fontWeight: 600,
                  color: row.credits.startsWith("+") ? "#4ADE80" : "#FF4D00",
                }}
              >
                {row.credits}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
