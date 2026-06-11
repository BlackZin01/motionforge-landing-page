"use client"

import { useState, useEffect, useMemo } from "react"
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

function EyeIcon({ open }: { open: boolean }) {
  return open ? (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ) : (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  )
}

function passwordStrength(p: string): { label: string; color: string; pct: number } {
  if (!p) return { label: "", color: "transparent", pct: 0 }
  const hasNum  = /\d/.test(p)
  const hasSpec = /[^a-zA-Z0-9]/.test(p)
  if (p.length >= 8 && (hasNum || hasSpec)) return { label: "Forte",  color: "#22c55e", pct: 100 }
  if (p.length >= 4)                         return { label: "Média",  color: "#eab308", pct: 66  }
  return                                            { label: "Fraca",  color: "#ef4444", pct: 33  }
}

export default function NovaSenhaPage() {
  const router = useRouter()
  const [resetToken, setResetToken] = useState("")
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [showPass, setShowPass] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [focused, setFocused] = useState<string | null>(null)
  const [status, setStatus] = useState<"idle" | "loading" | "done">("idle")
  const [error, setError] = useState("")

  const strength = useMemo(() => passwordStrength(password), [password])

  useEffect(() => {
    const token = typeof window !== "undefined" ? sessionStorage.getItem("mf_reset_token") : null
    if (!token) { router.push("/recuperar-senha"); return }
    setResetToken(token)
  }, [router])

  async function handleSubmit() {
    if (!password || password.length < 8) {
      setError("A senha deve ter pelo menos 8 caracteres.")
      return
    }
    if (password !== confirm) {
      setError("Senhas não coincidem.")
      return
    }
    setError("")
    setStatus("loading")
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reset_token: resetToken, password }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? "Erro ao redefinir senha.")
        setStatus("idle")
        return
      }
      setStatus("done")
      if (typeof window !== "undefined") {
        sessionStorage.removeItem("mf_reset_token")
        sessionStorage.removeItem("mf_recovery_email")
      }
      setTimeout(() => router.push("/login"), 2000)
    } catch {
      setError("Erro ao conectar com o servidor.")
      setStatus("idle")
    }
  }

  const inputStyle = (field: string, hasError?: boolean): React.CSSProperties => ({
    background: "#0D0D0D",
    border: `1px solid ${hasError ? "#ef4444" : focused === field ? "var(--color-forge-orange)" : "rgba(255,255,255,0.10)"}`,
    borderRadius: 8, padding: "12px 44px 12px 16px", fontSize: 14,
    color: "var(--color-forge-white)", width: "100%", outline: "none",
    transition: "border-color 200ms ease", fontFamily: "var(--font-sans)",
  })

  if (status === "done") {
    return (
      <AuthCard>
        <div style={{ textAlign: "center", padding: "20px 0" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            width: 64, height: 64, borderRadius: "50%",
            background: "rgba(34,197,94,0.12)", border: "1px solid rgba(34,197,94,0.35)",
            marginBottom: 20,
          }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#22c55e"
              strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </div>
          <h2 style={{
            fontFamily: "var(--font-sans)", fontSize: 20, fontWeight: 700,
            color: "var(--color-forge-white)", marginBottom: 8,
          }}>
            Senha redefinida!
          </h2>
          <p style={{ fontFamily: "var(--font-sans)", fontSize: 14, color: "var(--color-forge-muted)" }}>
            Redirecionando para o login...
          </p>
        </div>
      </AuthCard>
    )
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
            <rect x="3" y="11" width="18" height="11" rx="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </div>
      </div>

      <h1 style={{
        fontFamily: "var(--font-sans)", fontSize: 22, fontWeight: 700,
        color: "var(--color-forge-white)", textAlign: "center", marginBottom: 8,
      }}>
        Nova senha
      </h1>
      <p style={{
        fontFamily: "var(--font-sans)", fontSize: 14,
        color: "var(--color-forge-muted)", textAlign: "center", marginBottom: 28,
      }}>
        Escolha uma senha forte para proteger sua conta.
      </p>

      {/* Senha */}
      <div style={{ marginBottom: 14 }}>
        <label style={{
          display: "block", fontSize: 13, fontWeight: 600,
          color: "rgba(245,245,245,0.65)", marginBottom: 6, fontFamily: "var(--font-sans)",
        }}>
          Nova senha
        </label>
        <div style={{ position: "relative" }}>
          <input
            type={showPass ? "text" : "password"}
            placeholder="Mínimo 8 caracteres"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError("") }}
            onFocus={() => setFocused("password")}
            onBlur={() => setFocused(null)}
            style={inputStyle("password")}
            autoComplete="new-password"
            disabled={status === "loading"}
          />
          <button type="button" onClick={() => setShowPass((v) => !v)}
            style={{
              position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
              background: "none", border: "none", cursor: "pointer",
              color: "rgba(245,245,245,0.35)", padding: 4, lineHeight: 0,
            }}
            aria-label={showPass ? "Ocultar senha" : "Mostrar senha"}
          >
            <EyeIcon open={showPass} />
          </button>
        </div>
        {password && (
          <div style={{ marginTop: 8 }}>
            <div style={{ height: 3, background: "rgba(255,255,255,0.08)", borderRadius: 2, overflow: "hidden" }}>
              <div style={{
                height: "100%", width: `${strength.pct}%`, background: strength.color,
                borderRadius: 2, transition: "width 0.35s ease, background 0.35s ease",
              }} />
            </div>
            <p style={{ fontSize: 11, color: strength.color, marginTop: 4, fontFamily: "var(--font-sans)" }}>
              {strength.label}
            </p>
          </div>
        )}
      </div>

      {/* Confirmar */}
      <div style={{ marginBottom: 24 }}>
        <label style={{
          display: "block", fontSize: 13, fontWeight: 600,
          color: "rgba(245,245,245,0.65)", marginBottom: 6, fontFamily: "var(--font-sans)",
        }}>
          Confirmar senha
        </label>
        <div style={{ position: "relative" }}>
          <input
            type={showConfirm ? "text" : "password"}
            placeholder="Repita a senha"
            value={confirm}
            onChange={(e) => { setConfirm(e.target.value); setError("") }}
            onFocus={() => setFocused("confirm")}
            onBlur={() => setFocused(null)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            style={inputStyle("confirm", !!(error && confirm !== password && confirm.length > 0))}
            autoComplete="new-password"
            disabled={status === "loading"}
          />
          <button type="button" onClick={() => setShowConfirm((v) => !v)}
            style={{
              position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
              background: "none", border: "none", cursor: "pointer",
              color: "rgba(245,245,245,0.35)", padding: 4, lineHeight: 0,
            }}
            aria-label={showConfirm ? "Ocultar senha" : "Mostrar senha"}
          >
            <EyeIcon open={showConfirm} />
          </button>
        </div>
        {confirm.length > 0 && confirm !== password && (
          <p style={{ fontSize: 12, color: "#ef4444", marginTop: 4, fontFamily: "var(--font-sans)" }}>
            Senhas não coincidem.
          </p>
        )}
      </div>

      {error && (
        <p style={{
          fontSize: 13, color: "#ef4444", textAlign: "center",
          marginBottom: 16, fontFamily: "var(--font-sans)",
        }}>
          {error}
        </p>
      )}

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
        {status === "loading" ? <><Spinner /> Salvando...</> : "Salvar nova senha"}
      </button>
    </AuthCard>
  )
}
