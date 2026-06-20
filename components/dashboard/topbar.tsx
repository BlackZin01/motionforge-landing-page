"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { ChevronDown, User, LogOut } from "lucide-react"
import { Logo } from "@/components/ui/logo"

// ─── Props ────────────────────────────────────────────────────────────────────

interface TopbarProps {
  title: string
  userName: string
  onLogout: () => void
  isAdmin?: boolean
}

// ─── Items do dropdown ────────────────────────────────────────────────────────

const DROPDOWN_LINKS = [
  { icon: User, label: "Perfil", href: "/dashboard/configuracoes" },
] as const

// ─── Componente ───────────────────────────────────────────────────────────────

export default function Topbar({ title, userName, onLogout, isAdmin }: TopbarProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const initial = userName.charAt(0).toUpperCase()

  // Fecha o dropdown ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false)
      }
    }

    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [dropdownOpen])

  return (
    <header
      style={{
        background: "rgba(10,10,10,0.95)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
        height: "52px",
        display: "flex",
        alignItems: "center",
        padding: "0 20px",
        gap: "16px",
        position: "sticky",
        top: 0,
        zIndex: 30,
      }}
    >
      {/* ── Esquerda: logo em mobile / título em desktop ── */}
      <div style={{ flex: 1, display: "flex", alignItems: "center" }}>
        {/* Logo — visível apenas em mobile (sidebar oculta) */}
        <div className="flex md:hidden">
          <Link href="/">
            <Logo size="nav" />
          </Link>
        </div>
        {/* Título da página — visível apenas em desktop */}
        <span
          className="hidden md:inline"
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "13px",
            fontWeight: 500,
            color: "rgba(245,245,245,0.4)",
          }}
        >
          {title}
        </span>
      </div>

      {/* ── Direita: avatar ── */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        {/* Avatar + dropdown */}
        <div ref={dropdownRef} style={{ position: "relative" }}>
          {/* Botão do avatar */}
          <button
            onClick={() => setDropdownOpen((prev) => !prev)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              padding: "0",
            }}
          >
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
                fontFamily: "'DM Sans', sans-serif",
                flexShrink: 0,
              }}
            >
              {initial}
            </div>
            <ChevronDown
              size={12}
              color="rgba(245,245,245,0.4)"
              style={{
                transition: "transform 200ms ease",
                transform: dropdownOpen ? "rotate(180deg)" : "rotate(0deg)",
              }}
            />
          </button>

          {/* Dropdown */}
          {dropdownOpen && (
            <div
              style={{
                position: "absolute",
                top: "calc(100% + 8px)",
                right: 0,
                background: "#1A1A1A",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: "8px",
                padding: "4px",
                minWidth: "140px",
                zIndex: 50,
              }}
            >
              {DROPDOWN_LINKS.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setDropdownOpen(false)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      padding: "8px 10px",
                      borderRadius: "6px",
                      fontSize: "13px",
                      color: "rgba(245,245,245,0.7)",
                      textDecoration: "none",
                      fontFamily: "'DM Sans', sans-serif",
                      transition: "background 150ms ease, color 150ms ease",
                    }}
                    onMouseEnter={(e) => {
                      const el = e.currentTarget as HTMLAnchorElement
                      el.style.background = "rgba(255,255,255,0.05)"
                      el.style.color = "#F5F5F5"
                    }}
                    onMouseLeave={(e) => {
                      const el = e.currentTarget as HTMLAnchorElement
                      el.style.background = "transparent"
                      el.style.color = "rgba(245,245,245,0.7)"
                    }}
                  >
                    <Icon size={14} />
                    {item.label}
                  </Link>
                )
              })}

              {/* Divider */}
              <div style={{ height: "1px", background: "rgba(255,255,255,0.06)", margin: "4px 0" }} />

              {/* Botão Sair */}
              <button
                onClick={() => { setDropdownOpen(false); onLogout() }}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "8px 10px",
                  borderRadius: "6px",
                  fontSize: "13px",
                  color: "rgba(245,245,245,0.7)",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "'DM Sans', sans-serif",
                  transition: "background 150ms ease, color 150ms ease",
                  textAlign: "left",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget
                  el.style.background = "rgba(239,68,68,0.08)"
                  el.style.color = "#ef4444"
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget
                  el.style.background = "transparent"
                  el.style.color = "rgba(245,245,245,0.7)"
                }}
              >
                <LogOut size={14} />
                Sair
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
