"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { Home, Clock, Settings, LogOut, Users, DollarSign, Webhook, Cpu, Handshake, Shield, BookOpen, ShoppingBag, LayoutList, Package, Wand2, UserCircle2 } from "lucide-react"
import { Logo } from "@/components/ui/logo"

// ─── Tipos ────────────────────────────────────────────────────────────────────

interface SidebarProps {
  userName: string
  plan: "Starter" | "Pro" | "Agency"
  onLogout: () => void
  isAdmin?: boolean
}

const ADMIN_NAV_ITEMS = [
  { href: "/dashboard/admin/usuarios",   label: "Usuários",    icon: Users       },
  { href: "/dashboard/admin/prompts",    label: "Prompts",     icon: LayoutList  },
  { href: "/dashboard/admin/biblioteca", label: "Biblioteca",  icon: Package     },
  { href: "/dashboard/admin/financeiro", label: "Financeiro",  icon: DollarSign  },
  { href: "/dashboard/admin/webhooks",   label: "Webhooks",    icon: Webhook     },
  { href: "/dashboard/admin/modelos",    label: "Modelos",     icon: Cpu         },
  { href: "/dashboard/admin/afiliados",  label: "Afiliados",   icon: Handshake   },
  { href: "/dashboard/admin/seguranca",  label: "Segurança",   icon: Shield      },
] as const

// ─── Itens de navegação ───────────────────────────────────────────────────────

const NAV_ITEMS = [
  { href: "/dashboard",               label: "Início",      icon: Home,        special: false },
  { href: "/dashboard/prompts",       label: "Prompts",     icon: BookOpen,    special: false },
  { href: "/dashboard/gerador",       label: "Gerador",     icon: Wand2,        special: false },
  { href: "/dashboard/avatar",        label: "Avatar IA",   icon: UserCircle2,  special: false },
  { href: "/dashboard/biblioteca",    label: "Biblioteca",  icon: ShoppingBag,  special: false },
  { href: "/dashboard/historico",     label: "Histórico",   icon: Clock,       special: false },
  { href: "/dashboard/configuracoes", label: "Config.",     icon: Settings,    special: false },
] as const

// ─── Badge de plano ───────────────────────────────────────────────────────────

const PLAN_BADGE: Record<"Starter" | "Pro" | "Agency", { bg: string; color: string }> = {
  Starter: { bg: "rgba(255,255,255,0.06)",  color: "rgba(245,245,245,0.4)" },
  Pro:     { bg: "rgba(0,229,255,0.08)",    color: "#00E5FF"               },
  Agency:  { bg: "rgba(74,222,128,0.08)",   color: "#4ADE80"               },
}

// ─── Componente ───────────────────────────────────────────────────────────────

export default function Sidebar({ userName, plan, onLogout, isAdmin }: SidebarProps) {
  const pathname = usePathname()

  // Determina se o item está ativo
  function isActive(href: string): boolean {
    if (href === "/dashboard") return pathname === "/dashboard"
    return pathname.startsWith(href)
  }

  const planBadge = PLAN_BADGE[plan] ?? PLAN_BADGE["Starter"]
  const initial = userName.charAt(0).toUpperCase()

  return (
    <aside
      style={{
        background: "#0A0A0A",
        width: "220px",
        height: "100%",
        borderRight: "1px solid rgba(255,255,255,0.05)",
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
      }}
    >
      {/* ── Topo: Logo ── */}
      <div style={{ padding: "20px 16px" }}>
        <Link href="/" style={{ display: "inline-block" }}>
          <Logo size="nav" />
        </Link>
      </div>

      {/* Separador */}
      <div style={{ height: "1px", background: "rgba(255,255,255,0.05)" }} />

      {/* ── Navegação ── */}
      <nav
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "8px",
          scrollbarWidth: "none",
        }}
        className="[&::-webkit-scrollbar]:hidden"
      >
        {NAV_ITEMS.map((item) => {
          const active = isActive(item.href)
          const Icon = item.icon

          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                position: "relative",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "8px 12px",
                borderRadius: "8px",
                fontSize: "13px",
                fontWeight: 500,
                textDecoration: "none",
                fontFamily: "'DM Sans', sans-serif",
                marginBottom: "2px",
                transition: "background 150ms ease, color 150ms ease",
                color: active
                  ? "#FF4D00"
                  : item.special
                  ? "rgba(255,77,0,0.7)"
                  : "rgba(245,245,245,0.45)",
                background: active || item.special
                  ? "rgba(255,77,0,0.08)"
                  : "transparent",
                borderLeft: active
                  ? "2px solid #FF4D00"
                  : item.special
                  ? "2px solid rgba(255,77,0,0.3)"
                  : "2px solid transparent",
              }}
            >
              {active && (
                <motion.span
                  layoutId="nav-indicator"
                  style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: "2px",
                    background: "#FF4D00",
                    borderRadius: "0 2px 2px 0",
                  }}
                  transition={{ type: "spring", stiffness: 400, damping: 35 }}
                />
              )}

              <Icon size={15} strokeWidth={1.8} style={{ flexShrink: 0 }} />

              <span style={{ flex: 1 }}>{item.label}</span>

              {item.special && (
                <motion.div
                  animate={{ scale: [1, 1.4, 1] }}
                  transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                  style={{
                    width: "6px",
                    height: "6px",
                    background: "#FF4D00",
                    borderRadius: "50%",
                    flexShrink: 0,
                  }}
                />
              )}
            </Link>
          )
        })}

        {/* ── Seção Admin ── */}
        {isAdmin && (
          <>
            <div style={{ margin: "12px 0 6px", padding: "0 12px", display: "flex", alignItems: "center", gap: "8px" }}>
              <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.05)" }} />
              <span style={{ fontSize: "10px", fontWeight: 700, color: "rgba(245,245,245,0.25)", fontFamily: "'DM Sans', sans-serif", letterSpacing: "2px", textTransform: "uppercase" }}>
                ADMIN
              </span>
              <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.05)" }} />
            </div>
            {ADMIN_NAV_ITEMS.map((item) => {
              const active = pathname === item.href || pathname.startsWith(item.href + "/")
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  style={{
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "7px 12px",
                    borderRadius: "8px",
                    fontSize: "12px",
                    fontWeight: 500,
                    textDecoration: "none",
                    fontFamily: "'DM Sans', sans-serif",
                    marginBottom: "2px",
                    transition: "background 150ms ease, color 150ms ease",
                    color: active ? "#00E5FF" : "rgba(245,245,245,0.35)",
                    background: active ? "rgba(0,229,255,0.06)" : "transparent",
                    borderLeft: active ? "2px solid #00E5FF" : "2px solid transparent",
                  }}
                >
                  <Icon size={13} strokeWidth={1.8} style={{ flexShrink: 0 }} />
                  <span style={{ flex: 1 }}>{item.label}</span>
                </Link>
              )
            })}
          </>
        )}
      </nav>

      {/* ── Rodapé: info do usuário ── */}
      <div
        style={{
          borderTop: "1px solid rgba(255,255,255,0.05)",
          padding: "12px 16px",
        }}
      >
        {/* Avatar + info */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {/* Avatar circular */}
          <div
            style={{
              width: "32px",
              height: "32px",
              background: "rgba(255,77,0,0.15)",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#FF4D00",
              fontSize: "12px",
              fontWeight: 700,
              flexShrink: 0,
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            {initial}
          </div>

          {/* Nome + badge */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "12px",
                fontWeight: 700,
                color: "#F5F5F5",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {userName}
            </div>

            {/* Badge do plano */}
            <div style={{ marginTop: "2px" }}>
              <span
                style={{
                  display: "inline-block",
                  background: isAdmin ? "rgba(255,77,0,0.15)" : planBadge.bg,
                  color: isAdmin ? "#FF4D00" : planBadge.color,
                  fontSize: "10px",
                  fontWeight: 700,
                  letterSpacing: "1px",
                  textTransform: "uppercase",
                  padding: "0 6px",
                  height: "20px",
                  lineHeight: "20px",
                  borderRadius: "9999px",
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                {isAdmin ? "ADMIN" : plan}
              </span>
            </div>

          </div>

          {/* Botão de logout */}
          <button
            onClick={onLogout}
            title="Sair"
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
              padding: "6px",
              color: "rgba(245,245,245,0.25)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "6px",
              transition: "color 150ms ease, background 150ms ease",
              flexShrink: 0,
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget
              el.style.color = "#ef4444"
              el.style.background = "rgba(239,68,68,0.08)"
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget
              el.style.color = "rgba(245,245,245,0.25)"
              el.style.background = "transparent"
            }}
          >
            <LogOut size={14} />
          </button>
        </div>
      </div>
    </aside>
  )
}
