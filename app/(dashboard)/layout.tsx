// Server Component — sem "use client"

import type { ReactNode } from "react"
import Sidebar from "@/components/dashboard/sidebar"
import Topbar from "@/components/dashboard/topbar"
import ToastProvider from "@/components/dashboard/shared/toast"
import { DashboardTopbarWrapper } from "./dashboard-topbar-wrapper"

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
        {/* Sidebar — hidden em mobile (md:flex via className) */}
        <div style={{ display: "flex", flexShrink: 0 }} className="hidden md:flex">
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

          {/* Área de conteúdo scrollável */}
          <main style={{ flex: 1, overflowY: "auto" }}>
            {children}
          </main>
        </div>
      </div>
    </ToastProvider>
  )
}
