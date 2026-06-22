"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Check, AlertTriangle } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { CheckoutPixModal } from "@/components/checkout-pix-modal"
import { useToast } from "@/components/dashboard/shared/toast"

type PlanId = "starter" | "pro" | "agency"

const PLANS = [
  {
    id: "starter" as PlanId,
    name: "Starter",
    price: 97,
    tagline: "Para quem está começando",
    features: [
      "Biblioteca completa de prompts",
      "50 buscas por mês",
      "Gerador de copy — 30 gerações/mês",
      "Top 50 produtos da semana",
      "1 avatar IA salvo",
      "Suporte WhatsApp",
    ],
    featured: false,
    accentColor: "rgba(245,245,245,0.6)",
  },
  {
    id: "pro" as PlanId,
    name: "Pro",
    price: 197,
    tagline: "Para afiliados ativos",
    features: [
      "Tudo do Starter",
      "200 buscas por mês",
      "Gerador de copy ilimitado",
      "Top 200 + acesso completo à biblioteca",
      "Atualização diária da biblioteca",
      "Alertas de produto viral em tempo real",
      "Avatares IA ilimitados",
      "Prompts exclusivos PRO",
      "Suporte prioritário",
    ],
    featured: true,
    accentColor: "#FF4D00",
  },
  {
    id: "agency" as PlanId,
    name: "Agency",
    price: 397,
    tagline: "Para agências e múltiplas lojas",
    features: [
      "Tudo do Pro",
      "Uso ilimitado",
      "Até 5 perfis na mesma conta",
      "Relatório semanal de tendências por nicho",
      "Acesso antecipado a produtos novos",
      "Onboarding 1:1 personalizado",
      "Gerente de conta no WhatsApp",
    ],
    featured: false,
    accentColor: "#4ADE80",
  },
]

export default function UpgradePage() {
  const { user, refreshUser } = useAuth()
  const router  = useRouter()
  const { toast } = useToast()

  const [checkoutPlan, setCheckoutPlan] = useState<PlanId | null>(null)

  const currentPlan  = (user?.plan ?? "free").toLowerCase()
  const planStatus   = (user as { plan_status?: string })?.plan_status ?? "active"
  const isSuspended  = planStatus === "suspended"

  async function handleSuccess() {
    setCheckoutPlan(null)
    await refreshUser()
    toast({ message: "Plano ativado com sucesso!", type: "success" })
    router.push("/dashboard")
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--color-forge-black)", padding: "32px 16px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>

        {/* Banner suspenso */}
        {isSuspended && (
          <div style={{
            display: "flex", alignItems: "center", gap: 12,
            background: "rgba(255,77,0,0.08)", border: "1px solid rgba(255,77,0,0.3)",
            borderRadius: 8, padding: "14px 20px", marginBottom: 32,
          }}>
            <AlertTriangle size={18} style={{ color: "#FF4D00", flexShrink: 0 }} />
            <p style={{ fontFamily: "var(--font-sans)", fontSize: 14, color: "#F5F5F5", margin: 0 }}>
              Seu acesso está suspenso. Renove seu plano para continuar usando o MotionForge.
            </p>
          </div>
        )}

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <p style={{ fontFamily: "var(--font-sans)", fontSize: 10, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: "#FF4D00", marginBottom: 12 }}>
            Planos
          </p>
          <h1 style={{ fontFamily: "var(--font-bebas)", fontSize: "clamp(36px, 5vw, 56px)", letterSpacing: "3px", color: "#F5F5F5", marginBottom: 12 }}>
            Escolha seu plano
          </h1>
          <p style={{ fontFamily: "var(--font-sans)", fontSize: 16, color: "rgba(245,245,245,0.5)", maxWidth: 480, margin: "0 auto" }}>
            Sem contrato anual. Cancele quando quiser. Acesso imediato após o pagamento.
          </p>
        </div>

        {/* Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
          {PLANS.map((plan) => {
            const isCurrent = currentPlan === plan.id && planStatus === "active"
            return (
              <div
                key={plan.id}
                style={{
                  background: plan.featured ? "var(--color-forge-graphite)" : "rgba(255,255,255,0.02)",
                  border: plan.featured ? "2px solid #FF4D00" : "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 12,
                  padding: "28px 24px",
                  display: "flex",
                  flexDirection: "column",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {plan.featured && (
                  <div style={{
                    position: "absolute", top: 0, right: 0,
                    background: "#FF4D00", padding: "4px 14px",
                  }}>
                    <span style={{ fontFamily: "var(--font-sans)", fontSize: 9, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#fff" }}>
                      ★ Mais popular
                    </span>
                  </div>
                )}

                {/* Nome */}
                <h2 style={{ fontFamily: "var(--font-bebas)", fontSize: 26, letterSpacing: "2px", color: plan.accentColor, marginBottom: 4 }}>
                  {plan.name}
                </h2>
                <p style={{ fontFamily: "var(--font-sans)", fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(245,245,245,0.3)", marginBottom: 20 }}>
                  {plan.tagline}
                </p>

                {/* Preço */}
                <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 20 }}>
                  <span style={{ fontFamily: "var(--font-sans)", fontSize: 14, color: "rgba(245,245,245,0.5)", alignSelf: "flex-start", marginTop: 4 }}>R$</span>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 48, fontWeight: 700, lineHeight: 1, color: "#F5F5F5" }}>
                    {plan.price}
                    <span style={{ fontSize: 18, fontWeight: 400, color: "rgba(245,245,245,0.4)" }}>,00</span>
                  </span>
                  <span style={{ fontFamily: "var(--font-sans)", fontSize: 14, color: "rgba(245,245,245,0.4)", alignSelf: "flex-end", marginBottom: 2 }}>/mês</span>
                </div>

                {/* Features */}
                <ul style={{ listStyle: "none", padding: 0, margin: "0 0 28px", flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
                  {plan.features.map((f) => (
                    <li key={f} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                      <Check size={13} strokeWidth={2.5} style={{ color: plan.accentColor, flexShrink: 0, marginTop: 2 }} />
                      <span style={{ fontFamily: "var(--font-sans)", fontSize: 13, color: "rgba(245,245,245,0.65)", lineHeight: 1.5 }}>{f}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <button
                  disabled={isCurrent}
                  onClick={() => setCheckoutPlan(plan.id)}
                  style={{
                    width: "100%", padding: "13px 0",
                    fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 700,
                    letterSpacing: "0.18em", textTransform: "uppercase",
                    cursor: isCurrent ? "default" : "pointer",
                    border: plan.featured ? "none" : "1px solid rgba(255,255,255,0.2)",
                    background: isCurrent
                      ? "rgba(255,255,255,0.04)"
                      : plan.featured
                      ? "#FF4D00"
                      : "transparent",
                    color: isCurrent ? "rgba(255,255,255,0.3)" : "#F5F5F5",
                    borderRadius: 6,
                    boxShadow: plan.featured && !isCurrent ? "0 0 24px rgba(255,77,0,0.3)" : "none",
                    transition: "opacity 200ms ease",
                    opacity: isCurrent ? 0.6 : 1,
                  }}
                >
                  {isCurrent ? "Plano atual" : `Assinar ${plan.name}`}
                </button>
              </div>
            )
          })}
        </div>
      </div>

      {/* Modal PIX */}
      {checkoutPlan && (
        <CheckoutPixModal
          plan={checkoutPlan}
          onSuccess={handleSuccess}
          onClose={() => setCheckoutPlan(null)}
        />
      )}
    </div>
  )
}
