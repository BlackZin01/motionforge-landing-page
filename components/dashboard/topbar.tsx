"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { Zap, ChevronDown, User, LogOut } from "lucide-react"
import { CreditBar } from "./credit-bar"

// ─── Props ────────────────────────────────────────────────────────────────────

interface TopbarProps {
  title: string
  credits: number
  total: number
  renewDays: number
  userName: string
}

// ─── Items do dropdown ────────────────────────────────────────────────────────

const DROPDOWN_ITEMS = [
  { icon: User,   label: "Perfil", href: "/dashboard/configuracoes" },
  { icon: LogOut, label: "Sair",   href: "/"                         },
] as const

// ─── Componente ───────────────────────────────────────────────────────────────

export default function Topbar({ title, credits, total, renewDays, userName }: TopbarProps) {
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
      {/* ── Esquerda: título da página ── */}
      <div style={{ flex: 1 }}>
        <span
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

      {/* ── Direita: credit bar + botão gerar + avatar ── */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        {/* Barra de créditos */}
        <CreditBar credits={credits} total={total} renewDays={renewDays} />

        {/* Botão ⚡ Gerar → vai para o Studio */}
        <Link
          href="/dashboard/studio"
          style={{
            background: "#FF4D00",
            color: "#FFFFFF",
            borderRadius: "6px",
            padding: "6px 12px",
            fontSize: "12px",
            fontWeight: 700,
            letterSpacing: "1px",
            textTransform: "uppercase",
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
            gap: "4px",
            fontFamily: "'DM Sans', sans-serif",
            whiteSpace: "nowrap",
            transition: "opacity 200ms ease",
          }}
        >
          <Zap size={12} />
          Gerar
        </Link>

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
              {DROPDOWN_ITEMS.map((item) => {
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
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
