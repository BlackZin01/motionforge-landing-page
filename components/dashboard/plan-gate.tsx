"use client"

import { useState } from "react"
import { Logo } from "@/components/ui/logo"
import { Check, Zap, Building2, Star, ArrowRight, CreditCard, QrCode, X } from "lucide-react"
import { CheckoutPixModal } from "@/components/checkout-pix-modal"
import { useAuth } from "@/lib/auth-context"

// ─── Planos ───────────────────────────────────────────────────────────────────

const PLANS = [
  {
    id: "starter" as const,
    name: "Starter",
    price: "R$97",
    period: "/mês",
    tagline: "Para quem está começando",
    color: "#F5F5F5",
    colorSolid: "#F5F5F5",
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

// ─── Componente ───────────────────────────────────────────────────────────────

type PlanId = "starter" | "pro" | "agency"

export function PlanGate() {
  const { refreshUser } = useAuth()
  const [selectedPlan, setSelectedPlan] = useState<PlanId | null>(null)
  const [pixPlan, setPixPlan]           = useState<PlanId | null>(null)
  const [loadingCard, setLoadingCard]   = useState(false)
  const [cardError, setCardError]       = useState<string | null>(null)

  async function handlePixSuccess() {
    setPixPlan(null)
    await refreshUser()
  }

  async function handleCard(planId: PlanId) {
    setLoadingCard(true)
    setCardError(null)
    try {
      // Cookie httpOnly é enviado automaticamente pelo browser
      const res = await fetch("/api/payment/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: planId }),
      })
      const data = await res.json()
      if (!res.ok) { setCardError(data.error ?? "Erro ao criar checkout."); return }
      window.location.href = data.url
    } catch {
      setCardError("Erro ao conectar com o servidor.")
    } finally {
      setLoadingCard(false)
    }
  }

  const selectedPlanDef = PLANS.find(p => p.id === selectedPlan)

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
        scrollbarWidth: "none",
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
                transition: "border-color 200ms ease, transform 200ms ease",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget
                el.style.transform = "translateY(-2px)"
                if (!plan.featured) el.style.borderColor = "rgba(255,255,255,0.16)"
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget
                el.style.transform = "translateY(0)"
                if (!plan.featured) el.style.borderColor = "rgba(255,255,255,0.07)"
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
                onClick={() => setSelectedPlan(plan.id)}
                style={{
                  width: "100%", padding: "12px",
                  borderRadius: "8px",
                  background: plan.featured ? "#FF4D00" : `${plan.color}14`,
                  border: plan.featured ? "none" : `1px solid ${plan.color}35`,
                  color: plan.featured ? "#fff" : plan.colorSolid,
                  fontSize: "12px", fontWeight: 700,
                  textTransform: "uppercase", letterSpacing: "1px",
                  fontFamily: "'DM Sans', sans-serif",
                  cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
                  transition: "background 180ms ease, box-shadow 180ms ease, border-color 180ms ease, transform 180ms ease",
                  boxShadow: plan.featured ? "0 0 24px rgba(255,77,0,0.3)" : "none",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget
                  if (plan.featured) {
                    el.style.boxShadow = "0 0 44px rgba(255,77,0,0.55)"
                    el.style.transform = "scale(1.02)"
                  } else {
                    el.style.background = `${plan.color}28`
                    el.style.borderColor = `${plan.color}70`
                    el.style.transform = "scale(1.01)"
                  }
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget
                  if (plan.featured) {
                    el.style.boxShadow = "0 0 24px rgba(255,77,0,0.3)"
                    el.style.transform = "scale(1)"
                  } else {
                    el.style.background = `${plan.color}14`
                    el.style.borderColor = `${plan.color}35`
                    el.style.transform = "scale(1)"
                  }
                }}
              >
                Assinar {plan.name}
                <ArrowRight size={13} strokeWidth={2} />
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

      {/* Modal: escolha de método de pagamento */}
      {selectedPlan && selectedPlanDef && !pixPlan && (
        <div
          style={{
            position: "fixed", inset: 0, zIndex: 1100,
            display: "flex", alignItems: "center", justifyContent: "center",
            background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)",
            padding: "16px",
          }}
          onClick={() => { setSelectedPlan(null); setCardError(null) }}
        >
          <div
            style={{
              background: "#111111", border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "16px", padding: "28px 24px", width: "100%", maxWidth: "360px",
              position: "relative",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Fechar */}
            <button
              onClick={() => { setSelectedPlan(null); setCardError(null) }}
              style={{ position: "absolute", top: 14, right: 14, background: "transparent", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.35)" }}
            >
              <X size={16} />
            </button>

            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#FF4D00", marginBottom: 6 }}>
              Forma de pagamento
            </p>
            <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, letterSpacing: "1px", color: "#F5F5F5", marginBottom: 20 }}>
              {selectedPlanDef.name} — {selectedPlanDef.price}{selectedPlanDef.period}
            </h3>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {/* PIX */}
              <button
                onClick={() => { setSelectedPlan(null); setPixPlan(selectedPlan) }}
                style={{
                  display: "flex", alignItems: "center", gap: 14, padding: "14px 16px",
                  background: "rgba(0,229,255,0.05)", border: "1px solid rgba(0,229,255,0.2)",
                  borderRadius: "10px", cursor: "pointer", textAlign: "left",
                  transition: "border-color 150ms ease, background 150ms ease",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(0,229,255,0.5)"; e.currentTarget.style.background = "rgba(0,229,255,0.1)" }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(0,229,255,0.2)"; e.currentTarget.style.background = "rgba(0,229,255,0.05)" }}
              >
                <QrCode size={20} style={{ color: "#00E5FF", flexShrink: 0 }} />
                <div>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 700, color: "#F5F5F5" }}>PIX</div>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: "rgba(245,245,245,0.4)", marginTop: 2 }}>Pagamento instantâneo · Acesso imediato</div>
                </div>
              </button>

              {/* Cartão */}
              <button
                onClick={() => handleCard(selectedPlan)}
                disabled={loadingCard}
                style={{
                  display: "flex", alignItems: "center", gap: 14, padding: "14px 16px",
                  background: "rgba(255,77,0,0.05)", border: "1px solid rgba(255,77,0,0.2)",
                  borderRadius: "10px", cursor: loadingCard ? "not-allowed" : "pointer", textAlign: "left",
                  transition: "border-color 150ms ease, background 150ms ease",
                  opacity: loadingCard ? 0.6 : 1,
                }}
                onMouseEnter={(e) => { if (!loadingCard) { e.currentTarget.style.borderColor = "rgba(255,77,0,0.5)"; e.currentTarget.style.background = "rgba(255,77,0,0.1)" } }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,77,0,0.2)"; e.currentTarget.style.background = "rgba(255,77,0,0.05)" }}
              >
                <CreditCard size={20} style={{ color: "#FF4D00", flexShrink: 0 }} />
                <div>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 700, color: "#F5F5F5" }}>
                    {loadingCard ? "Aguarde..." : "Cartão de crédito"}
                  </div>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: "rgba(245,245,245,0.4)", marginTop: 2 }}>Visa, Mastercard, Elo · Recorrente mensal</div>
                </div>
              </button>
            </div>

            {cardError && (
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#ef4444", marginTop: 12, textAlign: "center" }}>{cardError}</p>
            )}
          </div>
        </div>
      )}

      {/* Modal PIX */}
      {pixPlan && (
        <CheckoutPixModal
          plan={pixPlan}
          onSuccess={handlePixSuccess}
          onClose={() => setPixPlan(null)}
        />
      )}
    </div>
  )
}
