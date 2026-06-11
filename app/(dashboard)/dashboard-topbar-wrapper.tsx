"use client"

import { usePathname } from "next/navigation"
import Topbar from "@/components/dashboard/topbar"

// ─── Props (repassadas do layout server) ─────────────────────────────────────

interface DashboardTopbarWrapperProps {
  credits: number
  total: number
  renewDays: number
  userName: string
}

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
  // Correspondência exata primeiro
  if (ROUTE_TITLES[pathname]) return ROUTE_TITLES[pathname]

  // Correspondência por prefixo (sub-rotas do studio, etc.)
  for (const [route, title] of Object.entries(ROUTE_TITLES)) {
    if (route !== "/dashboard" && pathname.startsWith(route)) {
      return title
    }
  }

  return "Dashboard"
}

// ─── Componente ───────────────────────────────────────────────────────────────

export function DashboardTopbarWrapper({
  credits,
  total,
  renewDays,
  userName,
}: DashboardTopbarWrapperProps) {
  const pathname = usePathname()
  const title = getPageTitle(pathname)

  return (
    <Topbar
      title={title}
      credits={credits}
      total={total}
      renewDays={renewDays}
      userName={userName}
    />
  )
}
