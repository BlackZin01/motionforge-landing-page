"use client"

import { Logo } from "@/components/ui/logo"

const NAV_LINKS = [
  { label: "Para quem", href: "#para-quem" },
  { label: "Como funciona", href: "#mecanismo" },
  { label: "Modelos", href: "#arsenal" },
  { label: "Workflows", href: "#workflows" },
  { label: "Planos", href: "#planos" },
]

const LEGAL_LINKS = [
  { label: "Termos de uso", href: "#" },
  { label: "Privacidade", href: "#" },
  { label: "Contato", href: "mailto:contato@motionforge.com.br" },
]

/* ── Link com hover inline ──────────────────────────────────── */
function FooterLink({
  href,
  children,
  fontSize = 14,
}: {
  href: string
  children: React.ReactNode
  fontSize?: number
}) {
  return (
    <a
      href={href}
      style={{
        fontFamily: "var(--font-sans)",
        fontSize,
        color: "var(--color-forge-muted)",
        textDecoration: "none",
        transition: "color 200ms ease",
      }}
      onMouseEnter={(e) => {
        ;(e.currentTarget as HTMLAnchorElement).style.color = "var(--color-forge-white)"
      }}
      onMouseLeave={(e) => {
        ;(e.currentTarget as HTMLAnchorElement).style.color = "var(--color-forge-muted)"
      }}
    >
      {children}
    </a>
  )
}

/* ── Footer ─────────────────────────────────────────────────── */
export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer
      style={{
        background: "var(--color-forge-black)",
        borderTop: "1px solid var(--color-forge-border)",
      }}
    >
      <div className="mx-auto max-w-7xl px-6 py-16">

        {/* Top row */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-10 mb-14">

          {/* Logo + tagline */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 300 }}>
            <Logo size="nav" />
            <p
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: 14,
                lineHeight: 1.65,
                color: "var(--color-forge-muted)",
                margin: 0,
              }}
            >
              A plataforma de geração de vídeo e imagem com IA para quem precisa
              de volume sem abrir mão de qualidade.
            </p>
          </div>

          {/* Links de navegação */}
          <nav aria-label="Links do footer">
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
                display: "flex",
                flexDirection: "column",
                gap: 12,
              }}
            >
              {NAV_LINKS.map(({ label, href }) => (
                <li key={label}>
                  <FooterLink href={href}>{label}</FooterLink>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Bottom row */}
        <div
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-3"
          style={{
            borderTop: "1px solid var(--color-forge-border)",
            paddingTop: 24,
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: 12,
              color: "var(--color-forge-muted)",
              margin: 0,
            }}
          >
            © {year} MotionForge. Todos os direitos reservados.
          </p>

          <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
            {LEGAL_LINKS.map(({ label, href }) => (
              <FooterLink key={label} href={href} fontSize={12}>
                {label}
              </FooterLink>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
