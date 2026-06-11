"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { AuthCard } from "@/components/auth/auth-card"

function Spinner() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none"
      style={{ animation: "spin 0.8s linear infinite" }} aria-hidden="true">
      <circle cx="9" cy="9" r="7" stroke="rgba(255,255,255,0.25)" strokeWidth="2" />
      <path d="M9 2 A7 7 0 0 1 16 9" stroke="white" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

type Status = "idle" | "loading" | "sent"

export default function RecuperarSenhaPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<Status>("idle")
  const [error, setError] = useState("")
  const [focused, setFocused] = useState(false)

  async function handleSubmit() {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Digite um e-mail válido.")
      return
    }
    setError("")
    setStatus("loading")
    try {
      await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
      // sempre redireciona — não revela se email existe
      if (typeof window !== "undefined") {
        sessionStorage.setItem("mf_recovery_email", email)
      }
      router.push("/recuperar-senha/verificar")
    } catch {
      setError("Erro ao conectar com o servidor. Tente novamente.")
      setStatus("idle")
    }
  }

  return (
    <AuthCard>
      {/* Ícone */}
      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <div style={{
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          width: 52, height: 52, borderRadius: "50%",
          background: "rgba(255,77,0,0.10)", border: "1px solid rgba(255,77,0,0.25)",
        }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-forge-orange)"
            strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="2" y="4" width="20" height="16" rx="3" />
            <path d="M22 7l-10 7L2 7" />
          </svg>
        </div>
      </div>

      <h1 style={{
        fontFamily: "var(--font-sans)", fontSize: 22, fontWeight: 700,
        color: "var(--color-forge-white)", textAlign: "center", marginBottom: 8,
      }}>
        Recuperar senha
      </h1>
      <p style={{
        fontFamily: "var(--font-sans)", fontSize: 14,
        color: "var(--color-forge-muted)", textAlign: "center", marginBottom: 28,
        lineHeight: 1.5,
      }}>
        Digite seu e-mail e enviaremos um código de 6 dígitos para redefinir sua senha.
      </p>

      <div style={{ marginBottom: 20 }}>
        <label style={{
          display: "block", fontSize: 13, fontWeight: 600,
          color: "rgba(245,245,245,0.65)", marginBottom: 6,
          fontFamily: "var(--font-sans)",
        }}>
          E-mail
        </label>
        <input
          type="email"
          placeholder="seu@email.com"
          value={email}
          onChange={(e) => { setEmail(e.target.value); setError("") }}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          style={{
            background: "#0D0D0D",
            border: `1px solid ${error ? "#ef4444" : focused ? "var(--color-forge-orange)" : "rgba(255,255,255,0.10)"}`,
            borderRadius: 8, padding: "12px 16px", fontSize: 14,
            color: "var(--color-forge-white)", width: "100%", outline: "none",
            transition: "border-color 200ms ease", fontFamily: "var(--font-sans)",
          }}
          autoComplete="email"
          disabled={status === "loading"}
        />
        {error && (
          <p style={{ fontSize: 12, color: "#ef4444", marginTop: 4, fontFamily: "var(--font-sans)" }}>
            {error}
          </p>
        )}
      </div>

      <button
        type="button"
        onClick={handleSubmit}
        disabled={status === "loading"}
        style={{
          width: "100%", display: "flex", alignItems: "center", justifyContent: "center",
          gap: 8, background: "var(--color-forge-orange)", color: "#fff", border: "none",
          borderRadius: 8, padding: "14px 24px", fontSize: 13, fontWeight: 700,
          letterSpacing: "0.12em", textTransform: "uppercase", fontFamily: "var(--font-sans)",
          cursor: status === "loading" ? "not-allowed" : "pointer",
          opacity: status === "loading" ? 0.6 : 1,
          boxShadow: "0 0 20px rgba(255,77,0,0.3)",
          transition: "opacity 200ms ease, box-shadow 200ms ease, transform 200ms ease",
          marginBottom: 20,
        }}
        onMouseEnter={(e) => {
          if (status !== "loading") {
            ;(e.currentTarget as HTMLButtonElement).style.boxShadow = "0 0 36px rgba(255,77,0,0.55)"
            ;(e.currentTarget as HTMLButtonElement).style.transform = "scale(1.015)"
          }
        }}
        onMouseLeave={(e) => {
          ;(e.currentTarget as HTMLButtonElement).style.boxShadow = "0 0 20px rgba(255,77,0,0.3)"
          ;(e.currentTarget as HTMLButtonElement).style.transform = "scale(1)"
        }}
      >
        {status === "loading" ? <><Spinner /> Enviando...</> : "Enviar código"}
      </button>

      <p style={{
        textAlign: "center", fontSize: 13,
        color: "var(--color-forge-muted)", fontFamily: "var(--font-sans)",
      }}>
        Lembrou a senha?{" "}
        <Link href="/login" style={{ color: "var(--color-forge-orange)", textDecoration: "none", fontWeight: 700 }}>
          Entrar
        </Link>
      </p>
    </AuthCard>
  )
}
