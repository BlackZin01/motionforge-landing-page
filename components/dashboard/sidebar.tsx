"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { Zap, Home, Clock, GitBranch, Gem, Settings, LogOut } from "lucide-react"
import { Logo } from "@/components/ui/logo"

// ─── Tipos ────────────────────────────────────────────────────────────────────

interface SidebarProps {
  userName: string
  plan: "Starter" | "Pro" | "Agency"
  credits: number
  total: number
  onLogout: () => void
}

// ─── Itens de navegação ───────────────────────────────────────────────────────

const NAV_ITEMS = [
  { href: "/dashboard/studio",        label: "Studio",      icon: Zap,       special: true  },
  { href: "/dashboard",               label: "Início",      icon: Home,      special: false },
  { href: "/dashboard/historico",     label: "Histórico",   icon: Clock,     special: false },
  { href: "/dashboard/workflows",     label: "Workflows",   icon: GitBranch, special: false },
  { href: "/dashboard/creditos",      label: "Créditos",    icon: Gem,       special: false },
  { href: "/dashboard/configuracoes", label: "Config.",     icon: Settings,  special: false },
] as const

// ─── Badge de plano ───────────────────────────────────────────────────────────

const PLAN_BADGE: Record<"Starter" | "Pro" | "Agency", { bg: string; color: string }> = {
  Starter: { bg: "rgba(255,255,255,0.06)",  color: "rgba(245,245,245,0.4)" },
  Pro:     { bg: "rgba(0,229,255,0.08)",    color: "#00E5FF"               },
  Agency:  { bg: "rgba(74,222,128,0.08)",   color: "#4ADE80"               },
}

// ─── Componente ───────────────────────────────────────────────────────────────

export default function Sidebar({ userName, plan, credits, total, onLogout }: SidebarProps) {
  const pathname = usePathname()

  // Determina se o item está ativo
  function isActive(href: string): boolean {
    if (href === "/dashboard") return pathname === "/dashboard"
    if (href === "/dashboard/studio") return pathname.startsWith("/dashboard/studio")
    return pathname === href
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
        }}
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
                // Cor e fundo dependem do estado
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
              // Hover via CSS é aplicado inline — usamos onMouse para override simples
            >
              {/* Indicador de active com layoutId */}
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

              {/* Dot pulsante exclusivo do Studio */}
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
                  background: planBadge.bg,
                  color: planBadge.color,
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
                {plan}
              </span>
            </div>

            {/* Link de upgrade — apenas para plano Starter */}
            {plan === "Starter" && (
              <Link
                href="/dashboard/creditos"
                style={{
                  display: "block",
                  marginTop: "4px",
                  fontSize: "10px",
                  color: "#FF4D00",
                  textDecoration: "none",
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 600,
                }}
              >
                Upgrade ↑
              </Link>
            )}
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
