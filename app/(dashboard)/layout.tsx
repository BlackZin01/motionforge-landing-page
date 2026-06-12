// Server Component — sem "use client"

import type { ReactNode } from "react"
import { AuthProvider } from "@/lib/auth-context"
import ToastProvider from "@/components/dashboard/shared/toast"
import { DashboardShell } from "@/components/dashboard/shell"

// ─── Layout ───────────────────────────────────────────────────────────────────

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <ToastProvider>
      <AuthProvider>
        <DashboardShell>{children}</DashboardShell>
      </AuthProvider>
    </ToastProvider>
  )
}
