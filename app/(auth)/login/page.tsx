"use client"

import { useState } from "react"
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
      <path
        d="M9 2 A7 7 0 0 1 16 9"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
      />
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

/* ── Tipos de estado ────────────────────────────────────────── */
type Status = "idle" | "loading" | "error"

/* ── Helpers de auth ─────────────────────────────────────────── */
function saveSession(token: string) {
  if (typeof window === "undefined") return
  localStorage.setItem("mf_token", token)
  // Sincroniza cookie para o middleware conseguir proteger rotas server-side
  const maxAge = 7 * 24 * 60 * 60
  document.cookie = `mf_token=${encodeURIComponent(token)}; path=/; max-age=${maxAge}; SameSite=Lax`
}

/* ── Página ─────────────────────────────────────────────────── */
export default function LoginPage() {
  const router = useRouter()

  const [email, setEmail]           = useState("")
  const [password, setPassword]     = useState("")
  const [showPass, setShowPass]     = useState(false)
  const [status, setStatus]         = useState<Status>("idle")
  const [errors, setErrors]         = useState<{ email?: string; password?: string; general?: string }>({})
  const [focusedField, setFocused]  = useState<string | null>(null)

  /* ── Validação ────────────────────────────────────────────── */
  function validate() {
    const e: typeof errors = {}
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      e.email = "Digite um e-mail válido."
    if (!password || password.length < 8)
      e.password = "A senha deve ter pelo menos 8 caracteres."
    setErrors(e)
    return Object.keys(e).length === 0
  }

  /* ── Submit ───────────────────────────────────────────────── */
  async function handleSubmit() {
    if (!validate()) return
    setStatus("loading")
    setErrors({})
    trackEvent("Login", { method: "email" })
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (!res.ok) {
        setErrors({ general: data.error ?? "Credenciais inválidas." })
        setStatus("error")
        return
      }
      saveSession(data.token)
      router.push("/dashboard")
    } catch {
      setErrors({ general: "Erro ao conectar com o servidor. Tente novamente." })
      setStatus("error")
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

  /* ── Render ───────────────────────────────────────────────── */
  return (
    <AuthCard>
      {/* Headline */}
      <h1
        style={{
          fontFamily: "var(--font-sans)",
          fontSize: 22,
          fontWeight: 700,
          color: "var(--color-forge-white)",
          marginBottom: 6,
        }}
      >
        Bem-vindo de volta
      </h1>
      <p
        style={{
          fontFamily: "var(--font-sans)",
          fontSize: 14,
          color: "var(--color-forge-muted)",
          marginBottom: 24,
        }}
      >
        Entre na sua conta para continuar gerando.
      </p>

      {/* Social */}
      <SocialButtons action="login" />

      {/* Divisor */}
      <AuthDivider />

      {/* Erro geral */}
      {errors.general && (
        <p style={{ fontSize: 13, color: "#ef4444", marginBottom: 12, textAlign: "center" }}>
          {errors.general}
        </p>
      )}

      {/* Campo e-mail */}
      <div style={{ marginBottom: 14 }}>
        <label
          style={{
            display: "block",
            fontSize: 13,
            fontWeight: 600,
            color: "rgba(245,245,245,0.65)",
            marginBottom: 6,
            fontFamily: "var(--font-sans)",
          }}
        >
          E-mail
        </label>
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
        {errors.email && (
          <p style={{ fontSize: 12, color: "#ef4444", marginTop: 4, fontFamily: "var(--font-sans)" }}>
            {errors.email}
          </p>
        )}
      </div>

      {/* Campo senha */}
      <div style={{ marginBottom: 8 }}>
        <label
          style={{
            display: "block",
            fontSize: 13,
            fontWeight: 600,
            color: "rgba(245,245,245,0.65)",
            marginBottom: 6,
            fontFamily: "var(--font-sans)",
          }}
        >
          Senha
        </label>
        <div style={{ position: "relative" }}>
          <input
            type={showPass ? "text" : "password"}
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onFocus={() => setFocused("password")}
            onBlur={() => setFocused(null)}
            style={{ ...inputStyle("password", !!errors.password), paddingRight: 44 }}
            autoComplete="current-password"
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
        {errors.password && (
          <p style={{ fontSize: 12, color: "#ef4444", marginTop: 4, fontFamily: "var(--font-sans)" }}>
            {errors.password}
          </p>
        )}
      </div>

      {/* Esqueci senha */}
      <div style={{ textAlign: "right", marginBottom: 24 }}>
        <Link
          href="/recuperar-senha"
          style={{
            fontSize: 12,
            color: "var(--color-forge-muted)",
            textDecoration: "none",
            fontFamily: "var(--font-sans)",
            transition: "color 200ms ease",
          }}
          onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "var(--color-forge-white)")}
          onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "var(--color-forge-muted)")}
        >
          Esqueci minha senha
        </Link>
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
          marginBottom: 24,
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
            Entrando...
          </>
        ) : (
          "Entrar"
        )}
      </button>

      {/* Link cadastro */}
      <p
        style={{
          textAlign: "center",
          fontSize: 13,
          color: "var(--color-forge-muted)",
          fontFamily: "var(--font-sans)",
        }}
      >
        Não tem conta?{" "}
        <Link
          href="/cadastro"
          style={{
            color: "var(--color-forge-orange)",
            textDecoration: "none",
            fontWeight: 700,
          }}
        >
          Criar conta grátis
        </Link>
      </p>
    </AuthCard>
  )
}
