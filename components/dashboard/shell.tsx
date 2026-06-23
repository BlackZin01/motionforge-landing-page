"use client"

import type { ReactNode } from "react"
import { useAuth } from "@/lib/auth-context"
import Sidebar from "@/components/dashboard/sidebar"
import Topbar from "@/components/dashboard/topbar"
import { MobileNav } from "@/components/dashboard/mobile-nav"
import { PlanGate } from "@/components/dashboard/plan-gate"
import { usePathname } from "next/navigation"

// ─── Mapeamento pathname → título da página ───────────────────────────────────

const ROUTE_TITLES: Record<string, string> = {
  "/dashboard":                      "Visão Geral",
  "/dashboard/prompts":              "Biblioteca de Prompts",
  "/dashboard/gerador":              "Gerador de Copy",
  "/dashboard/avatar":               "Criador de Avatar IA",
  "/dashboard/biblioteca":           "Biblioteca de Anúncios",
  "/dashboard/historico":            "Histórico",
  "/dashboard/creditos":             "Créditos",
  "/dashboard/configuracoes":        "Configurações",
  "/dashboard/admin/prompts":        "Admin · Prompts",
  "/dashboard/admin/biblioteca":     "Admin · Biblioteca",
  "/dashboard/admin/usuarios":       "Admin · Usuários",
  "/dashboard/admin/financeiro":     "Admin · Financeiro",
  "/dashboard/admin/modelos":        "Admin · Modelos",
  "/dashboard/admin/afiliados":      "Admin · Afiliados",
  "/dashboard/admin/seguranca":      "Admin · Segurança",
  "/dashboard/admin/webhooks":       "Admin · Webhooks",
}

function getPageTitle(pathname: string): string {
  if (ROUTE_TITLES[pathname]) return ROUTE_TITLES[pathname]
  for (const [route, title] of Object.entries(ROUTE_TITLES)) {
    if (route !== "/dashboard" && pathname.startsWith(route)) return title
  }
  return "Dashboard"
}

// ─── Skeleton de loading auth ─────────────────────────────────────────────────

function AuthSkeleton() {
  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        alignItems: "center",
        justifyContent: "center",
        background: "#0D0D0D",
      }}
    >
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: "50%",
          border: "2.5px solid rgba(255,77,0,0.2)",
          borderTopColor: "#FF4D00",
          animation: "spin 0.7s linear infinite",
        }}
      />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

// ─── Shell ────────────────────────────────────────────────────────────────────

export function DashboardShell({ children }: { children: ReactNode }) {
  const { user, loading, logout } = useAuth()
  const pathname = usePathname()
  const title = getPageTitle(pathname)

  if (loading && !user) return <AuthSkeleton />

  const userName = user?.name    ?? "Usuário"
  const plan     = user?.plan    ?? "Starter"
  const isAdmin  = user?.isAdmin ?? false

  // Usuário autenticado mas sem plano pago — mostra gate de seleção
  const needsPlan   = !!user && !isAdmin && user.plan === "Free"
  const planStatus  = user?.plan_status ?? "active"
  const isSuspended = !!user && !isAdmin && planStatus === "suspended"

  // Calcula dias restantes para vencimento do plano
  const daysUntilExpiry = (() => {
    if (!user || isAdmin || user.plan === "Free" || isSuspended) return null
    if (!user.plan_expires_at) return null
    const diff = new Date(user.plan_expires_at).getTime() - Date.now()
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24))
    return days <= 3 ? days : null
  })()

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        overflow: "hidden",
        background: "#0D0D0D",
      }}
    >
      {/* Sidebar — desktop */}
      <div className="hidden md:flex flex-shrink-0">
        <Sidebar
          userName={userName}
          plan={plan}
          onLogout={logout}
          isAdmin={isAdmin}
        />
      </div>

      {/* Conteúdo principal */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          minWidth: 0,
        }}
      >
        <Topbar
          title={title}
          userName={userName}
          onLogout={logout}
          isAdmin={isAdmin}
        />

        {/* Banner plano suspenso */}
        {isSuspended && (
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            gap: 12, background: "rgba(255,77,0,0.08)",
            borderBottom: "1px solid rgba(255,77,0,0.25)",
            padding: "10px 20px", flexShrink: 0,
          }}>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: 13, color: "#F5F5F5", margin: 0 }}>
              ⚠️ Seu acesso está limitado. Faça upgrade para continuar usando o MotionForge.
            </p>
            <a
              href="/dashboard/upgrade"
              style={{
                flexShrink: 0, padding: "6px 16px",
                background: "#FF4D00", color: "#fff",
                fontFamily: "var(--font-sans)", fontSize: 12, fontWeight: 700,
                letterSpacing: "0.1em", textTransform: "uppercase",
                textDecoration: "none", borderRadius: 4,
              }}
            >
              Ver planos
            </a>
          </div>
        )}

        {/* Banner vencimento próximo (≤ 3 dias) */}
        {daysUntilExpiry !== null && (
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            gap: 12, background: "rgba(245,158,11,0.08)",
            borderBottom: "1px solid rgba(245,158,11,0.25)",
            padding: "10px 20px", flexShrink: 0,
          }}>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: 13, color: "#F5F5F5", margin: 0 }}>
              🕐 Seu plano vence em{" "}
              <strong style={{ color: "#F59E0B" }}>
                {daysUntilExpiry <= 0 ? "hoje" : daysUntilExpiry === 1 ? "1 dia" : `${daysUntilExpiry} dias`}
              </strong>
              . Renove para não perder o acesso.
            </p>
            <a
              href="/dashboard/planos"
              style={{
                flexShrink: 0, padding: "6px 16px",
                background: "#F59E0B", color: "#000",
                fontFamily: "var(--font-sans)", fontSize: 12, fontWeight: 700,
                letterSpacing: "0.1em", textTransform: "uppercase",
                textDecoration: "none", borderRadius: 4,
              }}
            >
              Renovar agora
            </a>
          </div>
        )}

        {/* Área scrollável — pb-16 em mobile p/ não ficar atrás da nav */}
        <main style={{ flex: 1, overflowY: "scroll", scrollbarWidth: "none" }} className="pb-16 md:pb-0 [&::-webkit-scrollbar]:hidden">
          {children}
        </main>
      </div>

      {/* Bottom nav — mobile */}
      <MobileNav />

      {/* Gate de plano — bloqueia acesso para usuários sem plano */}
      {needsPlan && <PlanGate />}
    </div>
  )
}
