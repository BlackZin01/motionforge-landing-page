"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Settings, Shield, BookOpen, ShoppingBag, Wand2, UserCircle2, Flame, BarChart3, Layers, CreditCard } from "lucide-react"
import { useAuth } from "@/lib/auth-context"

const NAV_ITEMS = [
  { href: "/dashboard",               label: "Início",     icon: Home,        admin: false },
  { href: "/dashboard/prompts",       label: "Prompts",    icon: BookOpen,    admin: false },
  { href: "/dashboard/gerador",       label: "Gerador",    icon: Wand2,       admin: false },
  { href: "/dashboard/avatar",        label: "Avatar",     icon: UserCircle2, admin: false },
  { href: "/dashboard/biblioteca",    label: "Biblioteca", icon: ShoppingBag, admin: false },
  { href: "/dashboard/viral",         label: "Viral",      icon: Flame,       admin: false },
  { href: "/dashboard/tendencias",    label: "Tendências", icon: BarChart3,   admin: false },
  { href: "/dashboard/perfis",        label: "Perfis",     icon: Layers,      admin: false },
  { href: "/dashboard/planos",        label: "Planos",     icon: CreditCard,  admin: false },
  { href: "/dashboard/configuracoes", label: "Config.",    icon: Settings,    admin: false },
  { href: "/dashboard/admin/usuarios",label: "Admin",      icon: Shield,      admin: true  },
]

export function MobileNav() {
  const pathname = usePathname()
  const { user } = useAuth()
  const isAdmin = user?.isAdmin ?? false

  const visibleItems = NAV_ITEMS.filter(item => !item.admin || isAdmin)

  function isActive(href: string): boolean {
    if (href === "/dashboard") return pathname === "/dashboard"
    if (href === "/dashboard/admin/usuarios") return pathname.startsWith("/dashboard/admin")
    return pathname.startsWith(href)
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
        zIndex: 50,
        overflowX: "auto",
        overflowY: "hidden",
        alignItems: "stretch",
        scrollbarWidth: "none",
        msOverflowStyle: "none",
      } as React.CSSProperties}
    >
      {visibleItems.map((item) => {
        const active = isActive(item.href)
        const Icon = item.icon
        const isAdminLink = item.admin

        return (
          <Link
            key={item.href}
            href={item.href}
            style={{
              flexShrink: 0,
              width: "64px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "3px",
              textDecoration: "none",
              background: isAdminLink ? "rgba(0,229,255,0.04)" : "transparent",
              borderTop: active
                ? isAdminLink ? "2px solid #00E5FF" : "2px solid #FF4D00"
                : isAdminLink
                ? "2px solid rgba(0,229,255,0.2)"
                : "2px solid transparent",
            }}
          >
            <Icon
              size={17}
              strokeWidth={1.8}
              style={{
                color: active
                  ? isAdminLink ? "#00E5FF" : "#FF4D00"
                  : isAdminLink
                  ? "rgba(0,229,255,0.45)"
                  : "rgba(245,245,245,0.35)",
                transition: "color 150ms ease",
              }}
            />
            <span
              style={{
                fontSize: "8px",
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: active ? 700 : 400,
                color: active
                  ? isAdminLink ? "#00E5FF" : "#FF4D00"
                  : isAdminLink
                  ? "rgba(0,229,255,0.45)"
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
