"use client"

import { useState, useEffect, useRef, useCallback } from "react"
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

const RESEND_SECONDS = 60
const CODE_LENGTH = 6

export default function VerificarCodigoPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [digits, setDigits] = useState<string[]>(Array(CODE_LENGTH).fill(""))
  const [status, setStatus] = useState<"idle" | "loading" | "resending">("idle")
  const [error, setError] = useState("")
  const [timer, setTimer] = useState(RESEND_SECONDS)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    const stored = typeof window !== "undefined" ? sessionStorage.getItem("mf_recovery_email") : null
    if (!stored) { router.push("/recuperar-senha"); return }
    setEmail(stored)
    inputRefs.current[0]?.focus()
  }, [router])

  useEffect(() => {
    if (timer <= 0) return
    const id = setTimeout(() => setTimer((t) => t - 1), 1000)
    return () => clearTimeout(id)
  }, [timer])

  const handleDigitChange = useCallback((idx: number, val: string) => {
    const char = val.replace(/\D/g, "").slice(-1)
    setDigits((prev) => {
      const next = [...prev]
      next[idx] = char
      return next
    })
    setError("")
    if (char && idx < CODE_LENGTH - 1) {
      inputRefs.current[idx + 1]?.focus()
    }
  }, [])

  const handleKeyDown = useCallback((idx: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !digits[idx] && idx > 0) {
      inputRefs.current[idx - 1]?.focus()
    }
    if (e.key === "Enter") handleVerify()
  }, [digits]) // eslint-disable-line react-hooks/exhaustive-deps

  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, CODE_LENGTH)
    if (!pasted) return
    const next = [...digits]
    for (let i = 0; i < pasted.length; i++) next[i] = pasted[i]
    setDigits(next)
    setError("")
    const lastIdx = Math.min(pasted.length, CODE_LENGTH - 1)
    inputRefs.current[lastIdx]?.focus()
  }, [digits])

  async function handleVerify() {
    const code = digits.join("")
    if (code.length < CODE_LENGTH) { setError("Digite todos os 6 dígitos."); return }
    setStatus("loading")
    setError("")
    try {
      const res = await fetch("/api/auth/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? "Código inválido ou expirado.")
        setStatus("idle")
        setDigits(Array(CODE_LENGTH).fill(""))
        inputRefs.current[0]?.focus()
        return
      }
      if (typeof window !== "undefined") {
        sessionStorage.setItem("mf_reset_token", data.reset_token)
      }
      router.push("/recuperar-senha/nova-senha")
    } catch {
      setError("Erro ao conectar com o servidor.")
      setStatus("idle")
    }
  }

  async function handleResend() {
    if (timer > 0) return
    setStatus("resending")
    setError("")
    try {
      await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
    } catch { /* silencioso */ }
    setTimer(RESEND_SECONDS)
    setDigits(Array(CODE_LENGTH).fill(""))
    inputRefs.current[0]?.focus()
    setStatus("idle")
  }

  const minutes = String(Math.floor(timer / 60)).padStart(2, "0")
  const seconds = String(timer % 60).padStart(2, "0")

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
            <rect x="5" y="2" width="14" height="20" rx="2" />
            <path d="M9 7h6M9 11h6M9 15h4" />
          </svg>
        </div>
      </div>

      <h1 style={{
        fontFamily: "var(--font-sans)", fontSize: 22, fontWeight: 700,
        color: "var(--color-forge-white)", textAlign: "center", marginBottom: 8,
      }}>
        Verifique seu e-mail
      </h1>
      <p style={{
        fontFamily: "var(--font-sans)", fontSize: 14,
        color: "var(--color-forge-muted)", textAlign: "center", marginBottom: 6,
        lineHeight: 1.5,
      }}>
        Enviamos um código de 6 dígitos para
      </p>
      <p style={{
        fontFamily: "var(--font-sans)", fontSize: 14, fontWeight: 700,
        color: "var(--color-forge-white)", textAlign: "center", marginBottom: 28,
      }}>
        {email}
      </p>

      {/* OTP inputs */}
      <div style={{ display: "flex", gap: 10, justifyContent: "center", marginBottom: 20 }}>
        {digits.map((d, i) => (
          <input
            key={i}
            ref={(el) => { inputRefs.current[i] = el }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={d}
            onChange={(e) => handleDigitChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            onPaste={handlePaste}
            disabled={status === "loading"}
            style={{
              width: 44, height: 52, textAlign: "center", fontSize: 22, fontWeight: 700,
              background: "#0D0D0D",
              border: `1px solid ${error ? "#ef4444" : d ? "var(--color-forge-orange)" : "rgba(255,255,255,0.15)"}`,
              borderRadius: 8, color: "var(--color-forge-white)", outline: "none",
              transition: "border-color 200ms ease", fontFamily: "var(--font-sans)",
              caretColor: "var(--color-forge-orange)",
            }}
          />
        ))}
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
        onClick={handleVerify}
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
        {status === "loading" ? <><Spinner /> Verificando...</> : "Verificar código"}
      </button>

      {/* Reenviar */}
      <p style={{
        textAlign: "center", fontSize: 13,
        color: "var(--color-forge-muted)", fontFamily: "var(--font-sans)",
      }}>
        Não recebeu o código?{" "}
        {timer > 0 ? (
          <span style={{ color: "rgba(245,245,245,0.35)" }}>
            Reenviar em {minutes}:{seconds}
          </span>
        ) : (
          <button
            type="button"
            onClick={handleResend}
            disabled={status === "resending"}
            style={{
              background: "none", border: "none", cursor: "pointer",
              color: "var(--color-forge-orange)", fontWeight: 700, fontSize: 13,
              fontFamily: "var(--font-sans)", padding: 0,
            }}
          >
            {status === "resending" ? "Enviando..." : "Reenviar"}
          </button>
        )}
      </p>
    </AuthCard>
  )
}
