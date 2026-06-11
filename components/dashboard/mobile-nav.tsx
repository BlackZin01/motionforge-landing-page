"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Zap, Home, Clock, Gem, Settings } from "lucide-react"

// ─── Itens da navegação mobile ────────────────────────────────────────────────

const NAV_ITEMS = [
  { href: "/dashboard/studio",        label: "Studio",    icon: Zap      },
  { href: "/dashboard",               label: "Início",    icon: Home     },
  { href: "/dashboard/historico",     label: "Histórico", icon: Clock    },
  { href: "/dashboard/creditos",      label: "Créditos",  icon: Gem      },
  { href: "/dashboard/configuracoes", label: "Config.",   icon: Settings },
] as const

// ─── Componente ───────────────────────────────────────────────────────────────

export function MobileNav() {
  const pathname = usePathname()

  function isActive(href: string): boolean {
    if (href === "/dashboard") return pathname === "/dashboard"
    if (href === "/dashboard/studio") return pathname.startsWith("/dashboard/studio")
    return pathname === href
  }

  return (
    <nav
      className="flex md:hidden"
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        height: "64px",
        background: "rgba(10,10,10,0.97)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderTop: "1px solid rgba(255,255,255,0.06)",
        alignItems: "stretch",
        justifyContent: "space-around",
        zIndex: 50,
      }}
    >
      {NAV_ITEMS.map((item) => {
        const active = isActive(item.href)
        const Icon = item.icon
        const isStudio = item.href === "/dashboard/studio"

        return (
          <Link
            key={item.href}
            href={item.href}
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "3px",
              textDecoration: "none",
              position: "relative",
              background: isStudio ? "rgba(255,77,0,0.06)" : "transparent",
              borderTop: active
                ? "2px solid #FF4D00"
                : isStudio
                ? "2px solid rgba(255,77,0,0.3)"
                : "2px solid transparent",
            }}
          >
            <Icon
              size={isStudio ? 22 : 19}
              strokeWidth={1.8}
              style={{
                color: active
                  ? "#FF4D00"
                  : isStudio
                  ? "rgba(255,77,0,0.7)"
                  : "rgba(245,245,245,0.35)",
                transition: "color 150ms ease",
              }}
            />
            <span
              style={{
                fontSize: "9px",
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: active ? 700 : 400,
                color: active
                  ? "#FF4D00"
                  : isStudio
                  ? "rgba(255,77,0,0.7)"
                  : "rgba(245,245,245,0.35)",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                lineHeight: 1,
              }}
            >
              {item.label}
            </span>
          </Link>
        )
      })}
    </nav>
  )
}
