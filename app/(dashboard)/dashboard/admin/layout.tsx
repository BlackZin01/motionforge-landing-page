"use client"

import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import Link from "next/link"
import { Users, Film, DollarSign, Webhook, Cpu, Handshake, Shield } from "lucide-react"
import type { ReactNode } from "react"

const ADMIN_TABS = [
  { href: "/dashboard/admin/usuarios",   label: "Usuários",   icon: Users      },
  { href: "/dashboard/admin/geracoes",   label: "Gerações",   icon: Film       },
  { href: "/dashboard/admin/financeiro", label: "Financeiro", icon: DollarSign },
  { href: "/dashboard/admin/webhooks",   label: "Webhooks",   icon: Webhook    },
  { href: "/dashboard/admin/modelos",    label: "Modelos",    icon: Cpu        },
  { href: "/dashboard/admin/afiliados",  label: "Afiliados",  icon: Handshake  },
  { href: "/dashboard/admin/seguranca",  label: "Segurança",  icon: Shield     },
] as const

function AdminMobileSubNav() {
  const pathname = usePathname()
  return (
    <div
      className="flex md:hidden"
      style={{
        overflowX: "auto",
        scrollbarWidth: "none",
        background: "#0A0A0A",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        padding: "0 4px",
        flexShrink: 0,
      }}
    >
      <div style={{ display: "flex", gap: "2px", minWidth: "max-content", padding: "6px 4px" }}>
        {ADMIN_TABS.map((tab) => {
          const active = pathname === tab.href
          const Icon = tab.icon
          return (
            <Link
              key={tab.href}
              href={tab.href}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "5px",
                padding: "6px 10px",
                borderRadius: "7px",
                fontSize: "11px",
                fontWeight: active ? 700 : 500,
                fontFamily: "'DM Sans', sans-serif",
                textDecoration: "none",
                color: active ? "#00E5FF" : "rgba(245,245,245,0.4)",
                background: active ? "rgba(0,229,255,0.08)" : "transparent",
                border: `1px solid ${active ? "rgba(0,229,255,0.2)" : "transparent"}`,
                whiteSpace: "nowrap",
                transition: "all 150ms ease",
              }}
            >
              <Icon size={12} strokeWidth={1.8} />
              {tab.label}
            </Link>
          )
        })}
      </div>
    </div>
  )
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && (!user || !user.isAdmin)) {
      router.replace("/dashboard")
    }
  }, [user, loading, router])

  if (loading || !user?.isAdmin) return null

  return (
    <>
      <AdminMobileSubNav />
      {children}
    </>
  )
}
