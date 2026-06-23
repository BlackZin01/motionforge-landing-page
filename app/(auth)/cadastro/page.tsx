"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { AuthCard } from "@/components/auth/auth-card"
import { SocialButtons } from "@/components/auth/social-buttons"
import { AuthDivider } from "@/components/auth/divider"
import { trackEvent } from "@/lib/pixels"

/* ── Spinner ────────────────────────────────────────────────── */
function Spinner() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      style={{ animation: "spin 0.8s linear infinite" }}
      aria-hidden="true"
    >
      <circle cx="9" cy="9" r="7" stroke="rgba(255,255,255,0.25)" strokeWidth="2" />
      <path d="M9 2 A7 7 0 0 1 16 9" stroke="white" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

/* ── Ícone de olho ──────────────────────────────────────────── */
function EyeIcon({ open }: { open: boolean }) {
  return open ? (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ) : (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  )
}

/* ── Força da senha ─────────────────────────────────────────── */
function passwordStrength(p: string): { level: 0 | 1 | 2 | 3; label: string; color: string; pct: number } {
  if (!p) return { level: 0, label: "", color: "transparent", pct: 0 }
  const hasNum    = /\d/.test(p)
  const hasSpec   = /[^a-zA-Z0-9]/.test(p)
  if (p.length >= 8 && (hasNum || hasSpec))
    return { level: 3, label: "Forte",  color: "#22c55e", pct: 100 }
  if (p.length >= 4)
    return { level: 2, label: "Média",  color: "#eab308", pct: 66  }
  return           { level: 1, label: "Fraca",  color: "#ef4444", pct: 33  }
}

/* ── Tipos ──────────────────────────────────────────────────── */
type Status = "idle" | "loading"

interface Errors {
  name?: string
  email?: string
  password?: string
  confirm?: string
  terms?: string
}

/* ── Página ─────────────────────────────────────────────────── */
export default function CadastroPage() {
  const router = useRouter()

  const [name, setName]             = useState("")
  const [email, setEmail]           = useState("")
  const [password, setPassword]     = useState("")
  const [confirm, setConfirm]       = useState("")
  const [showPass, setShowPass]     = useState(false)
  const [terms, setTerms]           = useState(false)
  const [status, setStatus]         = useState<Status>("idle")
  const [errors, setErrors]         = useState<Errors>({})
  const [focusedField, setFocused]  = useState<string | null>(null)

  const strength = useMemo(() => passwordStrength(password), [password])

  /* ── Validação ────────────────────────────────────────────── */
  function validate(): boolean {
    const e: Errors = {}
    if (!name.trim()) e.name = "Digite seu nome."
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      e.email = "Digite um e-mail válido."
    if (!password || password.length < 8)
      e.password = "A senha deve ter pelo menos 8 caracteres."
    if (confirm !== password) e.confirm = "Senhas não coincidem."
    if (!terms) e.terms = "Você precisa aceitar os termos."
    setErrors(e)
    return Object.keys(e).length === 0
  }

  /* ── Submit ───────────────────────────────────────────────── */
  async function handleSubmit() {
    if (!validate()) return
    setStatus("loading")
    trackEvent("CompleteRegistration", { currency: "BRL" })
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      })
      const data = await res.json()
      if (!res.ok) {
        const field = data.error?.includes("E-mail") ? "email" : undefined
        setErrors(field ? { email: data.error } : { name: data.error ?? "Erro ao criar conta." })
        setStatus("idle")
        return
      }
      // Cookie httpOnly já foi definido pelo servidor na resposta
      // Pré-cacheia dados do usuário para evitar spinner no dashboard
      try {
        const meRes = await fetch("/api/auth/me") // cookie enviado automaticamente
        if (meRes.ok) {
          const userData = await meRes.json()
          localStorage.setItem("mf_user", JSON.stringify(userData))
        }
      } catch {
        // Falha silenciosa — AuthProvider vai buscar depois
      }
      router.push("/dashboard")
    } catch {
      setErrors({ name: "Erro ao conectar com o servidor. Tente novamente." })
      setStatus("idle")
    }
  }

  /* ── Estilos de input ─────────────────────────────────────── */
  function inputStyle(field: string, hasError?: boolean): React.CSSProperties {
    return {
      background: "#0D0D0D",
      border: `1px solid ${
        hasError
          ? "#ef4444"
          : focusedField === field
          ? "var(--color-forge-orange)"
          : "rgba(255,255,255,0.10)"
      }`,
      borderRadius: 8,
      padding: "12px 16px",
      fontSize: 14,
      color: "var(--color-forge-white)",
      width: "100%",
      outline: "none",
      transition: "border-color 200ms ease",
      fontFamily: "var(--font-sans)",
    }
  }

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: 13,
    fontWeight: 600,
    color: "rgba(245,245,245,0.65)",
    marginBottom: 6,
    fontFamily: "var(--font-sans)",
  }

  const errorStyle: React.CSSProperties = {
    fontSize: 12,
    color: "#ef4444",
    marginTop: 4,
    fontFamily: "var(--font-sans)",
  }

  /* ── Render ───────────────────────────────────────────────── */
  return (
    <AuthCard>
      {/* Badge */}
      <div style={{ textAlign: "center", marginBottom: 16 }}>
        <span
          style={{
            display: "inline-block",
            background: "rgba(255,77,0,0.12)",
            border: "1px solid rgba(255,77,0,0.3)",
            borderRadius: 20,
            padding: "4px 14px",
            fontSize: 11,
            fontWeight: 700,
            color: "var(--color-forge-orange)",
            letterSpacing: "0.08em",
            fontFamily: "var(--font-sans)",
          }}
        >
          Planos a partir de R$ 197/mês
        </span>
      </div>

      {/* Headline */}
      <h1
        style={{
          fontFamily: "var(--font-sans)",
          fontSize: 22,
          fontWeight: 700,
          color: "var(--color-forge-white)",
          textAlign: "center",
          marginBottom: 6,
        }}
      >
        Crie sua conta
      </h1>
      <p
        style={{
          fontFamily: "var(--font-sans)",
          fontSize: 14,
          color: "var(--color-forge-muted)",
          textAlign: "center",
          marginBottom: 24,
        }}
      >
        Acesse prompts e produtos validados em menos de 60 segundos.
      </p>

      {/* Social */}
      <SocialButtons action="cadastro" />

      {/* Divisor */}
      <AuthDivider />

      {/* Nome */}
      <div style={{ marginBottom: 14 }}>
        <label style={labelStyle}>Nome completo</label>
        <input
          type="text"
          placeholder="Seu nome"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onFocus={() => setFocused("name")}
          onBlur={() => setFocused(null)}
          style={inputStyle("name", !!errors.name)}
          autoComplete="name"
        />
        {errors.name && <p style={errorStyle}>{errors.name}</p>}
      </div>

      {/* E-mail */}
      <div style={{ marginBottom: 14 }}>
        <label style={labelStyle}>E-mail</label>
        <input
          type="email"
          placeholder="seu@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onFocus={() => setFocused("email")}
          onBlur={() => setFocused(null)}
          style={inputStyle("email", !!errors.email)}
          autoComplete="email"
        />
        {errors.email && <p style={errorStyle}>{errors.email}</p>}
      </div>

      {/* Senha + barra de força */}
      <div style={{ marginBottom: 14 }}>
        <label style={labelStyle}>Senha</label>
        <div style={{ position: "relative" }}>
          <input
            type={showPass ? "text" : "password"}
            placeholder="Mínimo 8 caracteres"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onFocus={() => setFocused("password")}
            onBlur={() => setFocused(null)}
            style={{ ...inputStyle("password", !!errors.password), paddingRight: 44 }}
            autoComplete="new-password"
          />
          <button
            type="button"
            onClick={() => setShowPass((v) => !v)}
            style={{
              position: "absolute",
              right: 12,
              top: "50%",
              transform: "translateY(-50%)",
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "rgba(245,245,245,0.35)",
              padding: 4,
              lineHeight: 0,
            }}
            aria-label={showPass ? "Ocultar senha" : "Mostrar senha"}
          >
            <EyeIcon open={showPass} />
          </button>
        </div>

        {/* Barra de força */}
        {password && (
          <div style={{ marginTop: 8 }}>
            <div style={{ height: 3, background: "rgba(255,255,255,0.08)", borderRadius: 2, overflow: "hidden" }}>
              <div
                style={{
                  height: "100%",
                  width: `${strength.pct}%`,
                  background: strength.color,
                  borderRadius: 2,
                  transition: "width 0.35s ease, background 0.35s ease",
                }}
              />
            </div>
            <p style={{ fontSize: 11, color: strength.color, marginTop: 4, fontFamily: "var(--font-sans)" }}>
              {strength.label}
            </p>
          </div>
        )}
        {errors.password && <p style={errorStyle}>{errors.password}</p>}
      </div>

      {/* Confirmar senha */}
      <div style={{ marginBottom: 20 }}>
        <label style={labelStyle}>Confirmar senha</label>
        <input
          type="password"
          placeholder="Repita a senha"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          onFocus={() => setFocused("confirm")}
          onBlur={() => setFocused(null)}
          style={inputStyle("confirm", !!errors.confirm || (confirm.length > 0 && confirm !== password))}
          autoComplete="new-password"
        />
        {(errors.confirm || (confirm.length > 0 && confirm !== password)) && (
          <p style={errorStyle}>Senhas não coincidem.</p>
        )}
      </div>

      {/* Checkbox termos */}
      <div style={{ marginBottom: 24 }}>
        <label
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: 10,
            cursor: "pointer",
          }}
        >
          <div style={{ position: "relative", flexShrink: 0, marginTop: 1 }}>
            <input
              type="checkbox"
              checked={terms}
              onChange={(e) => setTerms(e.target.checked)}
              style={{ position: "absolute", opacity: 0, width: 16, height: 16, cursor: "pointer" }}
            />
            <div
              style={{
                width: 16,
                height: 16,
                border: `1px solid ${errors.terms ? "#ef4444" : terms ? "var(--color-forge-orange)" : "rgba(255,255,255,0.20)"}`,
                borderRadius: 4,
                background: terms ? "var(--color-forge-orange)" : "transparent",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 150ms ease",
              }}
            >
              {terms && (
                <svg width="10" height="8" viewBox="0 0 10 8" fill="none" aria-hidden="true">
                  <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </div>
          </div>
          <span style={{ fontSize: 12, color: "var(--color-forge-muted)", lineHeight: 1.5, fontFamily: "var(--font-sans)" }}>
            Concordo com os{" "}
            <Link href="/termos" style={{ color: "var(--color-forge-orange)", textDecoration: "none" }}>
              Termos de uso
            </Link>{" "}
            e{" "}
            <Link href="/privacidade" style={{ color: "var(--color-forge-orange)", textDecoration: "none" }}>
              Política de privacidade
            </Link>
          </span>
        </label>
        {errors.terms && <p style={{ ...errorStyle, marginTop: 6 }}>{errors.terms}</p>}
      </div>

      {/* Botão submit */}
      <button
        type="button"
        onClick={handleSubmit}
        disabled={status === "loading"}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          background: "var(--color-forge-orange)",
          color: "#fff",
          border: "none",
          borderRadius: 8,
          padding: "14px 24px",
          fontSize: 13,
          fontWeight: 700,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          fontFamily: "var(--font-sans)",
          cursor: status === "loading" ? "not-allowed" : "pointer",
          opacity: status === "loading" ? 0.6 : 1,
          boxShadow: "0 0 20px rgba(255,77,0,0.3)",
          transition: "opacity 200ms ease, box-shadow 200ms ease, transform 200ms ease",
          marginBottom: 20,
        }}
        onMouseEnter={(e) => {
          if (status !== "loading") {
            ;(e.currentTarget as HTMLButtonElement).style.boxShadow =
              "0 0 36px rgba(255,77,0,0.55)"
            ;(e.currentTarget as HTMLButtonElement).style.transform = "scale(1.015)"
          }
        }}
        onMouseLeave={(e) => {
          ;(e.currentTarget as HTMLButtonElement).style.boxShadow =
            "0 0 20px rgba(255,77,0,0.3)"
          ;(e.currentTarget as HTMLButtonElement).style.transform = "scale(1)"
        }}
      >
        {status === "loading" ? (
          <>
            <Spinner />
            Criando conta...
          </>
        ) : (
          "Criar conta grátis"
        )}
      </button>

      {/* Link login */}
      <p
        style={{
          textAlign: "center",
          fontSize: 13,
          color: "var(--color-forge-muted)",
          fontFamily: "var(--font-sans)",
          marginBottom: 16,
        }}
      >
        Já tem conta?{" "}
        <Link
          href="/login"
          style={{ color: "var(--color-forge-orange)", textDecoration: "none", fontWeight: 700 }}
        >
          Entrar
        </Link>
      </p>

      {/* Nota final */}
      <p
        style={{
          textAlign: "center",
          fontSize: 11,
          color: "rgba(245,245,245,0.28)",
          lineHeight: 1.6,
          fontFamily: "var(--font-sans)",
        }}
      >
        Sem cartão de crédito para começar.
        <br />
        Escolha o plano depois de explorar a plataforma.
      </p>
    </AuthCard>
  )
}
