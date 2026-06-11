"use client"

import { useEffect, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"

export default function AuthCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const processed = useRef(false)

  useEffect(() => {
    if (processed.current) return
    processed.current = true

    const token = searchParams.get("token")
    const error = searchParams.get("error")

    if (error) {
      const messages: Record<string, string> = {
        no_email: "Não foi possível obter seu e-mail. Tente outro método.",
        oauth_failed: "Autenticação falhou. Tente novamente.",
      }
      const msg = messages[error] ?? "Erro na autenticação."
      router.replace(`/login?error=${encodeURIComponent(msg)}`)
      return
    }

    if (!token) {
      router.replace("/login?error=Token+inválido")
      return
    }

    // Salva o token (mesma chave usada no login normal)
    localStorage.setItem("mf_token", token)

    // Busca dados do usuário para guardar no storage
    fetch("/api/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((user) => {
        if (user) localStorage.setItem("mf_user", JSON.stringify(user))
        router.replace("/dashboard")
      })
      .catch(() => router.replace("/dashboard"))
  }, [router, searchParams])

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--color-forge-black)",
        gap: 16,
      }}
    >
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: "50%",
          border: "3px solid rgba(255,77,0,0.2)",
          borderTopColor: "#FF4D00",
          animation: "spin 0.8s linear infinite",
        }}
      />
      <p
        style={{
          color: "rgba(245,245,245,0.5)",
          fontFamily: "var(--font-sans)",
          fontSize: 14,
        }}
      >
        Finalizando autenticação…
      </p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
