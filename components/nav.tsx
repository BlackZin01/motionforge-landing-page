"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { Logo } from "@/components/ui/logo"
import { trackEvent } from "@/lib/pixels"

const NAV_LINKS = [
  { label: "Para quem é", href: "#para-quem" },
  { label: "Como funciona", href: "#mecanismo" },
  { label: "Arsenal", href: "#arsenal" },
  { label: "Planos", href: "#planos" },
] as const

const SECTION_IDS = ["para-quem", "mecanismo", "arsenal", "planos"] as const

export function Nav() {
  const [activeSection, setActiveSection] = useState<string>("")
  const [menuOpen, setMenuOpen] = useState(false)
  const observersRef = useRef<IntersectionObserver[]>([])

  /* ── Active section via IntersectionObserver ─────────────── */
  useEffect(() => {
    const observers: IntersectionObserver[] = []

    SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id)
      if (!el) return

      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveSection(id)
        },
        { rootMargin: "-40% 0px -55% 0px", threshold: 0 }
      )
      obs.observe(el)
      observers.push(obs)
    })

    observersRef.current = observers
    return () => observers.forEach((o) => o.disconnect())
  }, [])

  /* ── Fechar menu ao redimensionar para desktop ───────────── */
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) setMenuOpen(false)
    }
    window.addEventListener("resize", onResize)
    return () => window.removeEventListener("resize", onResize)
  }, [])

  /* ── Bloquear scroll do body quando menu mobile aberto ───── */
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : ""
    return () => {
      document.body.style.overflow = ""
    }
  }, [menuOpen])

  const handleCtaClick = () => {
    trackEvent("ViewContent", { content_name: "CTA Nav" })
    setMenuOpen(false)
  }

  const hrefFromLabel = (href: string) => href

  return (
    <>
      <nav
        className="sticky top-0 z-40 w-full"
        style={{
          background: "rgba(13,13,13,0.97)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
        aria-label="Navegação principal"
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          {/* Logo */}
          <a href="#" aria-label="MotionForge — início">
            <Logo size="nav" />
          </a>

          {/* Links — desktop */}
          <ul className="hidden items-center gap-8 md:flex" role="list">
            {NAV_LINKS.map(({ label, href }) => {
              const sectionId = href.replace("#", "")
              const isActive = activeSection === sectionId
              return (
                <li key={href}>
                  <a
                    href={hrefFromLabel(href)}
                    className="relative text-sm font-medium transition-colors duration-200"
                    style={{
                      color: isActive
                        ? "var(--color-forge-white)"
                        : "var(--color-forge-muted)",
                      paddingBottom: "4px",
                    }}
                    aria-current={isActive ? "page" : undefined}
                  >
                    {label}
                    {/* Underline laranja no link ativo */}
                    {isActive && (
                      <span
                        className="absolute bottom-0 left-0 h-0.5 w-full"
                        style={{ background: "var(--color-forge-orange)" }}
                      />
                    )}
                  </a>
                </li>
              )
            })}
          </ul>

          {/* CTAs — desktop */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/login"
              className="inline-flex items-center justify-center text-sm font-bold uppercase tracking-wide px-6 py-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
              style={{
                color: "var(--color-forge-white)",
                border: "1px solid rgba(255,255,255,0.20)",
                transition: "border-color 220ms ease, transform 220ms ease",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement
                el.style.borderColor = "rgba(255,255,255,0.55)"
                el.style.transform = "scale(1.025)"
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement
                el.style.borderColor = "rgba(255,255,255,0.20)"
                el.style.transform = "scale(1)"
              }}
            >
              Entrar
            </Link>
            <a
              href="#planos"
              className="inline-flex items-center justify-center text-sm font-bold uppercase tracking-wide px-6 py-3 transition-opacity duration-200 hover:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
              style={{
                background: "var(--color-forge-orange)",
                color: "#FFFFFF",
              }}
              onClick={handleCtaClick}
            >
              Começar agora
            </a>
          </div>

          {/* Botão hamburger — mobile */}
          <button
            type="button"
            className="flex md:hidden flex-col justify-center items-center gap-1.5 p-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
            style={{ color: "var(--color-forge-white)" }}
            aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            <span
              className="block h-0.5 w-6 transition-all duration-200"
              style={{
                background: "currentColor",
                transform: menuOpen
                  ? "translateY(8px) rotate(45deg)"
                  : "none",
              }}
            />
            <span
              className="block h-0.5 w-6 transition-all duration-200"
              style={{
                background: "currentColor",
                opacity: menuOpen ? 0 : 1,
              }}
            />
            <span
              className="block h-0.5 w-6 transition-all duration-200"
              style={{
                background: "currentColor",
                transform: menuOpen
                  ? "translateY(-8px) rotate(-45deg)"
                  : "none",
              }}
            />
          </button>
        </div>
      </nav>

      {/* ── Menu overlay mobile ──────────────────────────────── */}
      <div
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Menu de navegação"
        className="fixed inset-0 z-50 flex flex-col md:hidden transition-all duration-300"
        style={{
          background: "var(--color-forge-black)",
          opacity: menuOpen ? 1 : 0,
          pointerEvents: menuOpen ? "auto" : "none",
          transform: menuOpen ? "translateX(0)" : "translateX(100%)",
        }}
      >
        {/* Header do overlay */}
        <div className="flex h-16 items-center justify-between px-6">
          <Logo size="nav" />
          <button
            type="button"
            className="p-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
            style={{ color: "var(--color-forge-white)" }}
            aria-label="Fechar menu"
            onClick={() => setMenuOpen(false)}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Links em Bebas Neue grande */}
        <ul
          className="flex flex-1 flex-col justify-center gap-8 px-8"
          role="list"
        >
          <li key="entrar-mobile">
            <Link
              href="/login"
              className="inline-flex items-center text-base font-medium transition-colors duration-200"
              style={{
                color: "var(--color-forge-white)",
                border: "1px solid rgba(255,255,255,0.25)",
                padding: "10px 20px",
              }}
              onClick={() => setMenuOpen(false)}
            >
              Entrar
            </Link>
          </li>
          {NAV_LINKS.map(({ label, href }) => (
            <li key={href}>
              <a
                href={href}
                className="block text-5xl leading-none tracking-wide transition-colors duration-200 hover:opacity-80"
                style={{
                  fontFamily: "var(--font-bebas)",
                  color: "var(--color-forge-white)",
                  letterSpacing: "3px",
                }}
                onClick={() => setMenuOpen(false)}
              >
                {label}
              </a>
            </li>
          ))}
        </ul>

        {/* CTA no rodapé do overlay */}
        <div className="px-8 pb-12">
          <a
            href="#planos"
            className="flex w-full items-center justify-center text-sm font-bold uppercase tracking-wide px-6 py-4 transition-opacity duration-200 hover:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
            style={{
              background: "var(--color-forge-orange)",
              color: "#FFFFFF",
            }}
            onClick={handleCtaClick}
          >
            Começar agora
          </a>
        </div>
      </div>
    </>
  )
}
