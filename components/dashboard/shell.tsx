"use client"

import type { ReactNode } from "react"
import { useAuth } from "@/lib/auth-context"
import Sidebar from "@/components/dashboard/sidebar"
import Topbar from "@/components/dashboard/topbar"
import { MobileNav } from "@/components/dashboard/mobile-nav"
import { UpgradeBanner } from "@/components/dashboard/shared/upgrade-banner"
import { usePathname } from "next/navigation"

// ─── Mapeamento pathname → título da página ───────────────────────────────────

const ROUTE_TITLES: Record<string, string> = {
  "/dashboard":               "Visão Geral",
  "/dashboard/studio":        "Studio",
  "/dashboard/historico":     "Histórico",
  "/dashboard/workflows":     "Workflows",
  "/dashboard/creditos":      "Créditos",
  "/dashboard/configuracoes": "Configurações",
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

  const userName   = user?.name        ?? "Usuário"
  const plan       = user?.plan        ?? "Starter"
  const credits    = user?.credits     ?? 0
  const total      = user?.totalCredits ?? 5000
  const renewDays  = user?.renewDays   ?? 30
  const isAdmin    = user?.isAdmin     ?? false

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
          credits={credits}
          total={total}
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
          credits={credits}
          total={total}
          renewDays={renewDays}
          userName={userName}
          onLogout={logout}
        />

        {/* Banner de upgrade / sem créditos */}
        <UpgradeBanner credits={credits} plan={plan} />

        {/* Área scrollável — pb-16 em mobile p/ não ficar atrás da nav */}
        <main style={{ flex: 1, overflowY: "scroll", scrollbarWidth: "none" }} className="pb-16 md:pb-0 [&::-webkit-scrollbar]:hidden">
          {children}
        </main>
      </div>

      {/* Bottom nav — mobile */}
      <MobileNav />
    </div>
  )
}
