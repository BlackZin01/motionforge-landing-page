"use client"

import { useEffect, useState, useCallback } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Check, Zap, Building2, Star, AlertTriangle, X } from "lucide-react"

// ─── Tipos ────────────────────────────────────────────────────────────────────

type Plan = "starter" | "pro" | "agency"

interface PlanDef {
  id: Plan
  name: string
  price: string
  period: string
  description: string
  color: string
  icon: React.ComponentType<{ size?: number; strokeWidth?: number; color?: string }>
  features: string[]
  highlight?: boolean
}

// ─── Dados dos planos ─────────────────────────────────────────────────────────

const PLANS: PlanDef[] = [
  {
    id: "starter",
    name: "Starter",
    price: "Grátis",
    period: "",
    description: "Para começar a testar o poder do TikTok Shop.",
    color: "rgba(245,245,245,0.35)",
    icon: Star,
    features: [
      "30 gerações de copy por mês",
      "1 avatar salvo",
      "Biblioteca básica de produtos",
      "Prompts de copywriting (básicos)",
      "Gerador de hooks e CTAs",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    price: "R$297",
    period: "/mês",
    description: "Para criadores sérios que querem escalar suas vendas.",
    color: "#FF4D00",
    icon: Zap,
    highlight: true,
    features: [
      "Gerações de copy ilimitadas",
      "Avatares ilimitados",
      "Viral Alerts — produtos em alta",
      "Todos os prompts desbloqueados",
      "Biblioteca completa",
      "Histórico completo",
    ],
  },
  {
    id: "agency",
    name: "Agency",
    price: "R$797",
    period: "/mês",
    description: "Para agências e profissionais que gerenciam múltiplas lojas.",
    color: "#4ADE80",
    icon: Building2,
    features: [
      "Tudo do Pro",
      "Tendências por nicho",
      "Multi-perfis (até 5 lojas)",
      "Acesso antecipado a produtos",
      "Suporte prioritário",
    ],
  },
]

const PLAN_ORDER: Record<Plan, number> = { starter: 0, pro: 1, agency: 2 }

// ─── Modal de confirmação de cancelamento ─────────────────────────────────────

function CancelModal({
  onConfirm,
  onClose,
  loading,
}: {
  onConfirm: () => void
  onClose: () => void
  loading: boolean
}) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.7)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 100,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#141414",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "16px",
          padding: "28px",
          maxWidth: "420px",
          width: "90%",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
          <div
            style={{
              width: "40px", height: "40px", borderRadius: "10px",
              background: "rgba(239,68,68,0.12)",
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            }}
          >
            <AlertTriangle size={18} color="#ef4444" strokeWidth={1.8} />
          </div>
          <div>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "15px", fontWeight: 700, color: "#F5F5F5" }}>
              Cancelar assinatura
            </div>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "12px", color: "rgba(245,245,245,0.4)", marginTop: "2px" }}>
              Esta ação não pode ser desfeita
            </div>
          </div>
        </div>

        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", color: "rgba(245,245,245,0.6)", lineHeight: 1.6, marginBottom: "24px" }}>
          Ao cancelar, seu plano será revertido para <strong style={{ color: "#F5F5F5" }}>Starter</strong> imediatamente.
          Você perderá acesso às funcionalidades exclusivas do seu plano atual.
        </p>

        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={onClose}
            style={{
              flex: 1, padding: "10px", borderRadius: "8px",
              background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)",
              color: "rgba(245,245,245,0.6)", fontSize: "13px", fontWeight: 600,
              fontFamily: "'DM Sans', sans-serif", cursor: "pointer",
            }}
          >
            Voltar
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            style={{
              flex: 1, padding: "10px", borderRadius: "8px",
              background: loading ? "rgba(239,68,68,0.3)" : "rgba(239,68,68,0.15)",
              border: "1px solid rgba(239,68,68,0.3)",
              color: "#ef4444", fontSize: "13px", fontWeight: 700,
              fontFamily: "'DM Sans', sans-serif", cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Cancelando..." : "Confirmar cancelamento"}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Componente principal ─────────────────────────────────────────────────────

export default function PlanosPage() {
  const { user, refreshUser } = useAuth()
  const searchParams = useSearchParams()
  const router = useRouter()

  const [loadingPlan, setLoadingPlan] = useState<Plan | null>(null)
  const [cancelLoading, setCancelLoading] = useState(false)
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(null)

  const currentPlan = (user?.plan?.toLowerCase() ?? "starter") as Plan
  const isAdmin = Boolean(user?.isAdmin)

  // Mostra toast temporário
  const showToast = useCallback((type: "success" | "error", msg: string) => {
    setToast({ type, msg })
    setTimeout(() => setToast(null), 5000)
  }, [])

  // Ao retornar do checkout com status=success, atualiza o plano
  useEffect(() => {
    const status = searchParams.get("status")
    const plan = searchParams.get("plan")
    if (status === "success" && plan) {
      refreshUser()
      showToast("success", `Plano ${plan.charAt(0).toUpperCase() + plan.slice(1)} ativado com sucesso!`)
      router.replace("/dashboard/planos")
    }
  }, [searchParams, refreshUser, router, showToast])

  function getToken() {
    if (typeof window === "undefined") return ""
    return localStorage.getItem("mf_token") ?? ""
  }

  async function handleSubscribe(plan: Plan) {
    setLoadingPlan(plan)
    try {
      const res = await fetch("/api/payment/checkout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${getToken()}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ plan }),
      })
      const data = await res.json()
      if (!res.ok) {
        showToast("error", data.error ?? "Erro ao criar checkout")
        return
      }
      window.location.href = data.url
    } catch {
      showToast("error", "Erro ao conectar com o servidor")
    } finally {
      setLoadingPlan(null)
    }
  }

  async function handleCancel() {
    setCancelLoading(true)
    try {
      const res = await fetch("/api/payment/cancel", {
        method: "POST",
        headers: { Authorization: `Bearer ${getToken()}` },
      })
      const data = await res.json()
      if (!res.ok) {
        showToast("error", data.error ?? "Erro ao cancelar")
        return
      }
      await refreshUser()
      showToast("success", "Assinatura cancelada. Plano alterado para Starter.")
      setShowCancelModal(false)
    } catch {
      showToast("error", "Erro ao conectar com o servidor")
    } finally {
      setCancelLoading(false)
    }
  }

  return (
    <div style={{ padding: "32px", maxWidth: "960px", margin: "0 auto" }}>

      {/* Header */}
      <div style={{ marginBottom: "32px" }}>
        <h1 style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: "32px",
          letterSpacing: "3px",
          color: "#F5F5F5",
          margin: 0,
          lineHeight: 1,
        }}>
          PLANOS
        </h1>
        <p style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: "13px",
          color: "rgba(245,245,245,0.4)",
          marginTop: "6px",
        }}>
          Gerencie sua assinatura e veja o que cada plano oferece.
        </p>
      </div>

      {/* Status atual */}
      <div style={{
        background: "#141414",
        border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: "12px",
        padding: "16px 20px",
        display: "flex",
        alignItems: "center",
        gap: "12px",
        marginBottom: "28px",
      }}>
        <div style={{
          width: "8px", height: "8px", borderRadius: "50%",
          background: currentPlan === "agency" ? "#4ADE80" : currentPlan === "pro" ? "#FF4D00" : "rgba(245,245,245,0.3)",
          flexShrink: 0,
          boxShadow: currentPlan !== "starter" ? `0 0 8px ${currentPlan === "agency" ? "#4ADE80" : "#FF4D00"}` : "none",
        }} />
        <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", color: "rgba(245,245,245,0.5)" }}>
          Plano atual:
        </span>
        <span style={{
          fontFamily: "'DM Sans', sans-serif", fontSize: "13px", fontWeight: 700,
          color: isAdmin ? "#FF4D00" : currentPlan === "agency" ? "#4ADE80" : currentPlan === "pro" ? "#FF4D00" : "rgba(245,245,245,0.7)",
          textTransform: "uppercase", letterSpacing: "1px",
        }}>
          {isAdmin ? "Admin" : currentPlan}
        </span>
        {isAdmin && (
          <span style={{
            fontSize: "11px", fontFamily: "'DM Sans', sans-serif",
            color: "rgba(245,245,245,0.3)", marginLeft: "auto",
          }}>
            Administradores têm acesso total a todas as funcionalidades.
          </span>
        )}
      </div>

      {/* Cards de planos */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
        gap: "16px",
        marginBottom: "28px",
      }}>
        {PLANS.map((plan) => {
          const isCurrent = currentPlan === plan.id
          const canUpgrade = !isAdmin && PLAN_ORDER[plan.id] > PLAN_ORDER[currentPlan]
          const canDowngrade = !isAdmin && plan.id === "starter" && currentPlan !== "starter"
          const isLoading = loadingPlan === plan.id

          return (
            <div
              key={plan.id}
              style={{
                background: isCurrent ? "rgba(255,77,0,0.04)" : "#111111",
                border: isCurrent
                  ? `1px solid ${plan.color}30`
                  : plan.highlight
                  ? "1px solid rgba(255,77,0,0.15)"
                  : "1px solid rgba(255,255,255,0.06)",
                borderRadius: "16px",
                padding: "24px",
                display: "flex",
                flexDirection: "column",
                position: "relative",
                transition: "border-color 200ms ease",
              }}
            >
              {/* Badge atual */}
              {isCurrent && (
                <div style={{
                  position: "absolute", top: "16px", right: "16px",
                  background: `${plan.color}18`,
                  border: `1px solid ${plan.color}30`,
                  color: plan.color,
                  fontSize: "9px", fontWeight: 700, letterSpacing: "1.5px",
                  textTransform: "uppercase", fontFamily: "'DM Sans', sans-serif",
                  padding: "2px 8px", borderRadius: "9999px",
                }}>
                  Atual
                </div>
              )}

              {/* Ícone + nome */}
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
                <div style={{
                  width: "36px", height: "36px", borderRadius: "10px",
                  background: `${plan.color}12`,
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}>
                  <plan.icon size={17} strokeWidth={1.8} color={plan.color} />
                </div>
                <div>
                  <div style={{
                    fontFamily: "'DM Sans', sans-serif", fontSize: "14px",
                    fontWeight: 700, color: plan.color, textTransform: "uppercase",
                    letterSpacing: "1px",
                  }}>
                    {plan.name}
                  </div>
                </div>
              </div>

              {/* Preço */}
              <div style={{ marginBottom: "8px" }}>
                <span style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: plan.price === "Grátis" ? "22px" : "28px",
                  fontWeight: 700,
                  color: plan.price === "Grátis" ? "rgba(245,245,245,0.5)" : "#F5F5F5",
                }}>
                  {plan.price}
                </span>
                {plan.period && (
                  <span style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "12px",
                    color: "rgba(245,245,245,0.3)",
                    marginLeft: "4px",
                  }}>
                    {plan.period}
                  </span>
                )}
              </div>

              {/* Descrição */}
              <p style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "12px",
                color: "rgba(245,245,245,0.4)",
                lineHeight: 1.5,
                marginBottom: "20px",
                flex: 0,
              }}>
                {plan.description}
              </p>

              {/* Features */}
              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 24px 0", flex: 1 }}>
                {plan.features.map((feat) => (
                  <li key={feat} style={{
                    display: "flex", alignItems: "flex-start", gap: "8px",
                    marginBottom: "8px",
                    fontFamily: "'DM Sans', sans-serif", fontSize: "12px",
                    color: "rgba(245,245,245,0.6)",
                  }}>
                    <Check size={13} strokeWidth={2.5} color={plan.color} style={{ flexShrink: 0, marginTop: "1px" }} />
                    {feat}
                  </li>
                ))}
              </ul>

              {/* CTA */}
              {!isAdmin && (
                <>
                  {canUpgrade && (
                    <button
                      onClick={() => handleSubscribe(plan.id)}
                      disabled={isLoading}
                      style={{
                        width: "100%", padding: "11px",
                        borderRadius: "8px",
                        background: isLoading ? `${plan.color}30` : `${plan.color}18`,
                        border: `1px solid ${plan.color}40`,
                        color: plan.color,
                        fontSize: "12px", fontWeight: 700,
                        textTransform: "uppercase", letterSpacing: "1px",
                        fontFamily: "'DM Sans', sans-serif",
                        cursor: isLoading ? "not-allowed" : "pointer",
                        transition: "background 150ms ease",
                      }}
                      onMouseEnter={(e) => {
                        if (!isLoading) e.currentTarget.style.background = `${plan.color}28`
                      }}
                      onMouseLeave={(e) => {
                        if (!isLoading) e.currentTarget.style.background = `${plan.color}18`
                      }}
                    >
                      {isLoading ? "Aguarde..." : `Assinar ${plan.name}`}
                    </button>
                  )}

                  {isCurrent && plan.id !== "starter" && (
                    <button
                      onClick={() => setShowCancelModal(true)}
                      style={{
                        width: "100%", padding: "11px",
                        borderRadius: "8px",
                        background: "transparent",
                        border: "1px solid rgba(239,68,68,0.2)",
                        color: "rgba(239,68,68,0.6)",
                        fontSize: "11px", fontWeight: 600,
                        fontFamily: "'DM Sans', sans-serif",
                        cursor: "pointer",
                        transition: "all 150ms ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = "rgba(239,68,68,0.4)"
                        e.currentTarget.style.color = "#ef4444"
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = "rgba(239,68,68,0.2)"
                        e.currentTarget.style.color = "rgba(239,68,68,0.6)"
                      }}
                    >
                      Cancelar assinatura
                    </button>
                  )}

                  {isCurrent && plan.id === "starter" && (
                    <div style={{
                      width: "100%", padding: "11px",
                      borderRadius: "8px",
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid rgba(255,255,255,0.06)",
                      color: "rgba(245,245,245,0.25)",
                      fontSize: "11px", fontWeight: 600,
                      fontFamily: "'DM Sans', sans-serif",
                      textAlign: "center",
                    }}>
                      Plano gratuito
                    </div>
                  )}
                </>
              )}

              {isAdmin && (
                <div style={{
                  width: "100%", padding: "11px",
                  borderRadius: "8px",
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.05)",
                  color: "rgba(245,245,245,0.2)",
                  fontSize: "11px", fontFamily: "'DM Sans', sans-serif",
                  textAlign: "center",
                }}>
                  Acesso total como admin
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Nota PIX/cartão */}
      <p style={{
        fontFamily: "'DM Sans', sans-serif", fontSize: "11px",
        color: "rgba(245,245,245,0.2)", textAlign: "center",
      }}>
        Pagamento processado com segurança via AbacatePay · Cartão de crédito e PIX
      </p>

      {/* Modal cancelamento */}
      {showCancelModal && (
        <CancelModal
          onConfirm={handleCancel}
          onClose={() => setShowCancelModal(false)}
          loading={cancelLoading}
        />
      )}

      {/* Toast */}
      {toast && (
        <div style={{
          position: "fixed", bottom: "24px", right: "24px",
          background: toast.type === "success" ? "rgba(74,222,128,0.12)" : "rgba(239,68,68,0.12)",
          border: `1px solid ${toast.type === "success" ? "rgba(74,222,128,0.3)" : "rgba(239,68,68,0.3)"}`,
          borderRadius: "10px", padding: "12px 16px",
          display: "flex", alignItems: "center", gap: "10px",
          maxWidth: "340px",
          zIndex: 200,
        }}>
          <div style={{
            width: "6px", height: "6px", borderRadius: "50%", flexShrink: 0,
            background: toast.type === "success" ? "#4ADE80" : "#ef4444",
          }} />
          <span style={{
            fontFamily: "'DM Sans', sans-serif", fontSize: "12px",
            color: toast.type === "success" ? "#4ADE80" : "#ef4444",
          }}>
            {toast.msg}
          </span>
          <button
            onClick={() => setToast(null)}
            style={{ background: "transparent", border: "none", cursor: "pointer", padding: "2px", marginLeft: "auto", flexShrink: 0 }}
          >
            <X size={13} color="rgba(245,245,245,0.3)" />
          </button>
        </div>
      )}
    </div>
  )
}
