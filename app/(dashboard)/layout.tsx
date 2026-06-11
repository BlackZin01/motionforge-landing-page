// Server Component — sem "use client"

import type { ReactNode } from "react"
import Sidebar from "@/components/dashboard/sidebar"
import ToastProvider from "@/components/dashboard/shared/toast"
import { DashboardTopbarWrapper } from "./dashboard-topbar-wrapper"
import { MobileNav } from "@/components/dashboard/mobile-nav"

// ─── Dados mock ───────────────────────────────────────────────────────────────
// TODO: integrar API — buscar do servidor/Supabase

const MOCK_USER = {
  userName: "Matheus",
  plan: "Pro" as const,
  credits: 3847,
  total: 5000,
  renewDays: 18,
}

// ─── Layout ───────────────────────────────────────────────────────────────────

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <ToastProvider>
      <div
        style={{
          display: "flex",
          height: "100vh",
          overflow: "hidden",
          background: "#0D0D0D",
        }}
      >
        {/* Sidebar — hidden em mobile */}
        <div className="hidden md:flex flex-shrink-0">
          <Sidebar
            userName={MOCK_USER.userName}
            plan={MOCK_USER.plan}
            credits={MOCK_USER.credits}
            total={MOCK_USER.total}
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
          {/* Topbar com título derivado da rota atual (Client Component) */}
          <DashboardTopbarWrapper
            credits={MOCK_USER.credits}
            total={MOCK_USER.total}
            renewDays={MOCK_USER.renewDays}
            userName={MOCK_USER.userName}
          />

          {/* Área de conteúdo scrollável — padding bottom em mobile para não ficar atrás da nav */}
          <main style={{ flex: 1, overflowY: "auto" }} className="pb-16 md:pb-0">
            {children}
          </main>
        </div>
      </div>

      {/* Navegação bottom — apenas mobile */}
      <MobileNav />
    </ToastProvider>
  )
}
