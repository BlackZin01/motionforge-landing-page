"use client"

import { useState } from "react"
import { Logo } from "@/components/ui/logo"
import { Check, Zap, Building2, Star, ArrowRight } from "lucide-react"

// ─── Planos ───────────────────────────────────────────────────────────────────

const PLANS = [
  {
    id: "starter" as const,
    name: "Starter",
    price: "R$97",
    period: "/mês",
    tagline: "Para quem está começando",
    color: "rgba(245,245,245,0.4)",
    colorSolid: "rgba(245,245,245,0.7)",
    icon: Star,
    features: [
      "30 gerações de copy/mês",
      "1 avatar salvo",
      "Biblioteca top 50 da semana",
      "Prompts básicos",
      "Suporte WhatsApp",
    ],
  },
  {
    id: "pro" as const,
    name: "Pro",
    price: "R$197",
    period: "/mês",
    tagline: "Para afiliados ativos",
    color: "#FF4D00",
    colorSolid: "#FF4D00",
    icon: Zap,
    featured: true,
    badge: "MAIS POPULAR",
    features: [
      "Gerações ilimitadas",
      "Avatares ilimitados",
      "Alertas de viral em tempo real",
      "Todos os prompts desbloqueados",
      "Biblioteca top 200 + atualização diária",
      "Suporte prioritário",
    ],
  },
  {
    id: "agency" as const,
    name: "Agency",
    price: "R$397",
    period: "/mês",
    tagline: "Para múltiplas lojas",
    color: "#4ADE80",
    colorSolid: "#4ADE80",
    icon: Building2,
    features: [
      "Tudo do Pro",
      "Até 5 perfis/lojas",
      "Tendências por nicho",
      "Acesso antecipado a produtos",
      "Gerente de conta no WhatsApp",
    ],
  },
]

function getToken() {
  if (typeof window === "undefined") return ""
  return localStorage.getItem("mf_token") ?? ""
}

// ─── Componente ───────────────────────────────────────────────────────────────

export function PlanGate() {
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleSelect(planId: "starter" | "pro" | "agency") {
    setLoadingPlan(planId)
    setError(null)
    try {
      const res = await fetch("/api/payment/checkout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${getToken()}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ plan: planId }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? "Erro ao criar checkout. Tente novamente.")
        return
      }
      window.location.href = data.url
    } catch {
      setError("Erro ao conectar com o servidor. Tente novamente.")
    } finally {
      setLoadingPlan(null)
    }
  }

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        background: "rgba(0,0,0,0.92)",
        backdropFilter: "blur(12px)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px 16px",
        overflowY: "auto",
      }}
    >
      {/* Logo */}
      <div style={{ marginBottom: "24px" }}>
        <Logo size="nav" />
      </div>

      {/* Headline */}
      <div style={{ textAlign: "center", marginBottom: "32px", maxWidth: "520px" }}>
        <h1 style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: "clamp(28px, 5vw, 40px)",
          letterSpacing: "3px",
          color: "#F5F5F5",
          margin: "0 0 10px",
          lineHeight: 1,
        }}>
          ESCOLHA SEU PLANO
        </h1>
        <p style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: "14px",
          color: "rgba(245,245,245,0.45)",
          margin: 0,
          lineHeight: 1.6,
        }}>
          Selecione um plano para desbloquear o acesso à plataforma.
          <br />Pagamento 100% seguro via AbacatePay · Cartão ou PIX.
        </p>
      </div>

      {/* Erro */}
      {error && (
        <div style={{
          background: "rgba(239,68,68,0.1)",
          border: "1px solid rgba(239,68,68,0.3)",
          borderRadius: "8px",
          padding: "10px 16px",
          marginBottom: "20px",
          fontFamily: "'DM Sans', sans-serif",
          fontSize: "13px",
          color: "#ef4444",
        }}>
          {error}
        </div>
      )}

      {/* Cards */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
        gap: "14px",
        width: "100%",
        maxWidth: "860px",
      }}>
        {PLANS.map((plan) => {
          const Icon = plan.icon
          const isLoading = loadingPlan === plan.id

          return (
            <div
              key={plan.id}
              style={{
                background: plan.featured ? "rgba(255,77,0,0.04)" : "#111111",
                border: plan.featured
                  ? "1px solid rgba(255,77,0,0.25)"
                  : "1px solid rgba(255,255,255,0.07)",
                borderRadius: "16px",
                padding: "24px",
                display: "flex",
                flexDirection: "column",
                position: "relative",
              }}
            >
              {/* Badge */}
              {plan.badge && (
                <div style={{
                  position: "absolute",
                  top: "-11px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  background: "#FF4D00",
                  color: "#fff",
                  fontSize: "9px",
                  fontWeight: 700,
                  letterSpacing: "2px",
                  textTransform: "uppercase",
                  fontFamily: "'DM Sans', sans-serif",
                  padding: "3px 12px",
                  borderRadius: "9999px",
                  whiteSpace: "nowrap",
                }}>
                  {plan.badge}
                </div>
              )}

              {/* Ícone + nome */}
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
                <div style={{
                  width: "34px", height: "34px", borderRadius: "9px",
                  background: `${plan.color}15`,
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}>
                  <Icon size={16} strokeWidth={1.8} color={plan.colorSolid} />
                </div>
                <div>
                  <div style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "13px", fontWeight: 700,
                    color: plan.colorSolid,
                    textTransform: "uppercase", letterSpacing: "1px",
                  }}>
                    {plan.name}
                  </div>
                  <div style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "10px", color: "rgba(245,245,245,0.3)",
                    marginTop: "1px",
                  }}>
                    {plan.tagline}
                  </div>
                </div>
              </div>

              {/* Preço */}
              <div style={{ marginBottom: "16px" }}>
                <span style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: "26px", fontWeight: 700, color: "#F5F5F5",
                }}>
                  {plan.price}
                </span>
                <span style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "12px", color: "rgba(245,245,245,0.3)", marginLeft: "4px",
                }}>
                  {plan.period}
                </span>
              </div>

              {/* Features */}
              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 20px 0", flex: 1 }}>
                {plan.features.map((feat) => (
                  <li key={feat} style={{
                    display: "flex", alignItems: "flex-start", gap: "7px",
                    marginBottom: "7px",
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "12px", color: "rgba(245,245,245,0.55)",
                  }}>
                    <Check size={12} strokeWidth={2.5} color={plan.colorSolid} style={{ flexShrink: 0, marginTop: "1px" }} />
                    {feat}
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <button
                onClick={() => handleSelect(plan.id)}
                disabled={!!loadingPlan}
                style={{
                  width: "100%", padding: "12px",
                  borderRadius: "8px",
                  background: plan.featured
                    ? (isLoading ? "rgba(255,77,0,0.5)" : "#FF4D00")
                    : (isLoading ? `${plan.color}20` : `${plan.color}14`),
                  border: plan.featured
                    ? "none"
                    : `1px solid ${plan.color}35`,
                  color: plan.featured ? "#fff" : plan.colorSolid,
                  fontSize: "12px", fontWeight: 700,
                  textTransform: "uppercase", letterSpacing: "1px",
                  fontFamily: "'DM Sans', sans-serif",
                  cursor: loadingPlan ? "not-allowed" : "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
                  transition: "opacity 150ms ease",
                  opacity: (loadingPlan && !isLoading) ? 0.4 : 1,
                }}
              >
                {isLoading ? "Aguarde..." : (
                  <>
                    Assinar {plan.name}
                    <ArrowRight size={13} strokeWidth={2} />
                  </>
                )}
              </button>
            </div>
          )
        })}
      </div>

      {/* Rodapé */}
      <p style={{
        fontFamily: "'DM Sans', sans-serif",
        fontSize: "11px",
        color: "rgba(245,245,245,0.18)",
        marginTop: "24px",
        textAlign: "center",
      }}>
        Cancele quando quiser · Sem fidelidade · Cobrança recorrente mensal
      </p>
    </div>
  )
}
