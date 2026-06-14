"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Zap } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { useToast } from "@/components/dashboard/shared/toast"

const TOPUPS = [
  { id: "500", credits: 500, price: "R$ 29", popular: false },
  { id: "1000", credits: 1000, price: "R$ 49", popular: false },
  { id: "2500", credits: 2500, price: "R$ 97", popular: true },
  { id: "5000", credits: 5000, price: "R$ 169", popular: false },
  { id: "10000", credits: 10000, price: "R$ 297", popular: false },
]

interface HistoryRow { id: string; date: string; action: string; model: string; credits: string }

// ─── Badge de plano ───────────────────────────────────────────────────────────

const PLAN_COLORS: Record<string, { bg: string; border: string; color: string }> = {
  Starter: { bg: "rgba(245,245,245,.06)", border: "rgba(245,245,245,.1)", color: "rgba(245,245,245,.6)" },
  Pro:     { bg: "rgba(0,229,255,.08)",   border: "rgba(0,229,255,.2)",   color: "#00E5FF" },
  Agency:  { bg: "rgba(74,222,128,.08)",  border: "rgba(74,222,128,.2)",  color: "#4ADE80" },
}

// ─── Componente ──────────────────────────────────────────────────────────────

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })
}

export default function CreditosPage() {
  const { user } = useAuth()
  const { toast } = useToast()

  const credits    = user?.credits     ?? 0
  const total      = user?.totalCredits ?? 5000
  const renewDays  = user?.renewDays   ?? 30
  const plan       = user?.plan        ?? "Starter"
  const used       = total - credits

  const [history, setHistory] = useState<HistoryRow[]>([])
  const [loadingHistory, setLoadingHistory] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("mf_token") ?? ""
    fetch("/api/generations?limit=20&offset=0", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.ok ? r.json() : { items: [] })
      .then(data => {
        const rows: HistoryRow[] = (data.items ?? []).map((g: { id: string; created_at: string; type: string; model_id: string; credits_used: number }) => ({
          id: g.id,
          date: formatDate(g.created_at),
          action: g.type === "image" ? "Geração de imagem" : "Geração de vídeo",
          model: g.model_id,
          credits: `-${g.credits_used}`,
        }))
        setHistory(rows)
      })
      .catch(() => {})
      .finally(() => setLoadingHistory(false))
  }, [])

  // Animação do contador de créditos
  const [animatedCredits, setAnimatedCredits] = useState(0)

  useEffect(() => {
    if (!credits) return
    const duration = 1500
    const steps = 60
    const increment = credits / steps
    let current = 0
    const timer = setInterval(() => {
      current += increment
      if (current >= credits) {
        setAnimatedCredits(credits)
        clearInterval(timer)
      } else {
        setAnimatedCredits(Math.floor(current))
      }
    }, duration / steps)
    return () => clearInterval(timer)
  }, [credits])

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
              {total.toLocaleString("pt-BR")}
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
              animate={{ width: `${total > 0 ? (used / total) * 100 : 0}%` }}
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
          {used.toLocaleString("pt-BR")} usados de {total.toLocaleString("pt-BR")} · Renova em{" "}
          {renewDays} dias
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
                  background: PLAN_COLORS[plan]?.bg ?? PLAN_COLORS.Starter.bg,
                  border: `1px solid ${PLAN_COLORS[plan]?.border ?? PLAN_COLORS.Starter.border}`,
                  color: PLAN_COLORS[plan]?.color ?? PLAN_COLORS.Starter.color,
                  fontSize: "10px",
                  fontWeight: 700,
                  padding: "2px 8px",
                  borderRadius: "9999px",
                  fontFamily: "'DM Sans', sans-serif",
                  letterSpacing: "1px",
                  textTransform: "uppercase",
                }}
              >
                {plan}
              </span>
            </div>
            <span
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "14px",
                fontWeight: 700,
                color: "#F5F5F5",
              }}
            >
              Plano ativo
            </span>
            <span
              style={{
                fontSize: "12px",
                color: "rgba(245,245,245,0.4)",
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              {renewDays > 0 ? `Renova em ${renewDays} dias` : "Sem renovação programada"}
            </span>
          </div>

          {/* Ações */}
          <div style={{ display: "flex", gap: "8px" }}>
            <button
              onClick={() =>
                toast({
                  message: "Para gerenciar sua assinatura, entre em contato: suporte@motionforge.com.br",
                  type: "info",
                })
              }
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

            <Link
              href="/#planos"
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
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                transition: "opacity 0.15s ease",
              }}
              onMouseEnter={(e) => {
                ;(e.currentTarget as HTMLAnchorElement).style.opacity = "0.88"
              }}
              onMouseLeave={(e) => {
                ;(e.currentTarget as HTMLAnchorElement).style.opacity = "1"
              }}
            >
              Upgrade
            </Link>
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
          {loadingHistory ? (
            <div style={{ padding: "32px", textAlign: "center" }}>
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "13px", color: "rgba(245,245,245,.35)", margin: 0 }}>
                Carregando histórico...
              </p>
            </div>
          ) : history.length === 0 ? (
            <div
              style={{
                padding: "40px 24px",
                textAlign: "center",
              }}
            >
              <p
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "13px",
                  color: "rgba(245,245,245,0.35)",
                  margin: 0,
                }}
              >
                Nenhuma movimentação ainda. Suas gerações e recargas aparecerão aqui.
              </p>
            </div>
          ) : (
            <>
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
              {history.map((row, i) => (
                <div
                  key={row.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "10px 16px",
                    borderBottom:
                      i < history.length - 1
                        ? "1px solid rgba(255,255,255,0.04)"
                        : "none",
                  }}
                >
                  <span style={{ flex: 1, fontSize: "12px", color: "rgba(245,245,245,0.4)", fontFamily: "'DM Sans', sans-serif" }}>
                    {row.date}
                  </span>
                  <span style={{ flex: 2, fontSize: "12px", color: "#F5F5F5", fontFamily: "'DM Sans', sans-serif" }}>
                    {row.action}
                  </span>
                  <span style={{ flex: 1, fontSize: "12px", color: "rgba(245,245,245,0.4)", fontFamily: "'DM Sans', sans-serif" }}>
                    {row.model}
                  </span>
                  <span style={{ flex: 1, fontFamily: "'Space Grotesk', sans-serif", fontSize: "12px", fontWeight: 600, color: row.credits.startsWith("+") ? "#4ADE80" : "#FF4D00" }}>
                    {row.credits}
                  </span>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
