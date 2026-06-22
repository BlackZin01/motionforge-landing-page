"use client"

import { useEffect, useRef, useState } from "react"
import { X, Copy, Check, RefreshCw, Loader2 } from "lucide-react"

type PixStatus = "PENDING" | "PAID" | "EXPIRED"

interface CheckoutPixModalProps {
  plan: "starter" | "pro" | "agency"
  onSuccess: () => void
  onClose: () => void
}

const PLAN_LABELS: Record<string, string> = {
  starter: "Starter — R$ 97/mês",
  pro:     "Pro — R$ 197/mês",
  agency:  "Agency — R$ 397/mês",
}

const EXPIRES_SECS = 3600

export function CheckoutPixModal({ plan, onSuccess, onClose }: CheckoutPixModalProps) {
  const [loading, setLoading]         = useState(true)
  const [error, setError]             = useState<string | null>(null)
  const [qrCode, setQrCode]           = useState<string | null>(null)
  const [copiaCola, setCopiaCola]     = useState<string>("")
  const [pixId, setPixId]             = useState<string>("")
  const [copied, setCopied]           = useState(false)
  const [status, setStatus]           = useState<PixStatus>("PENDING")
  const [secondsLeft, setSecondsLeft] = useState(EXPIRES_SECS)

  const pollingRef  = useRef<ReturnType<typeof setInterval> | null>(null)
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null)

  function getToken() {
    return typeof window !== "undefined" ? localStorage.getItem("mf_token") : null
  }

  async function createPix() {
    setLoading(true)
    setError(null)
    setStatus("PENDING")
    setSecondsLeft(EXPIRES_SECS)

    const token = getToken()
    if (!token) { setError("Sessão expirada. Faça login novamente."); setLoading(false); return }

    try {
      const res  = await fetch("/api/checkout/pix", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error ?? "Erro ao gerar QR Code"); setLoading(false); return }

      setQrCode(data.qrCode ?? null)
      setCopiaCola(data.copiaCola ?? "")
      setPixId(data.pixId ?? "")
    } catch {
      setError("Erro de conexão. Tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  function startPolling(id: string) {
    if (pollingRef.current) clearInterval(pollingRef.current)
    const token = getToken()
    if (!token || !id) return

    pollingRef.current = setInterval(async () => {
      try {
        const res  = await fetch(`/api/checkout/pix/status?pixId=${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        const data = await res.json()
        const s    = (data.status ?? "PENDING") as PixStatus
        setStatus(s)
        if (s === "PAID") {
          clearInterval(pollingRef.current!)
          clearInterval(countdownRef.current!)
          onSuccess()
        }
        if (s === "EXPIRED") {
          clearInterval(pollingRef.current!)
          clearInterval(countdownRef.current!)
        }
      } catch { /* ignora erros de rede no polling */ }
    }, 3000)
  }

  function startCountdown() {
    if (countdownRef.current) clearInterval(countdownRef.current)
    countdownRef.current = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) { clearInterval(countdownRef.current!); setStatus("EXPIRED"); return 0 }
        return s - 1
      })
    }, 1000)
  }

  useEffect(() => { createPix() }, [])

  useEffect(() => {
    if (pixId && status === "PENDING") {
      startPolling(pixId)
      startCountdown()
    }
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current)
      if (countdownRef.current) clearInterval(countdownRef.current)
    }
  }, [pixId])

  function handleCopy() {
    navigator.clipboard.writeText(copiaCola).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, "0")
  const ss = String(secondsLeft % 60).padStart(2, "0")

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 1000,
        display: "flex", alignItems: "center", justifyContent: "center",
        background: "rgba(0,0,0,0.75)", backdropFilter: "blur(6px)",
        padding: "16px",
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        style={{
          background: "#111111",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: "12px",
          width: "100%",
          maxWidth: "420px",
          padding: "28px 24px",
          position: "relative",
        }}
      >
        {/* Fechar */}
        <button
          onClick={onClose}
          style={{
            position: "absolute", top: 16, right: 16,
            background: "transparent", border: "none",
            color: "rgba(255,255,255,0.4)", cursor: "pointer",
          }}
        >
          <X size={18} />
        </button>

        {/* Header */}
        <p style={{ fontFamily: "var(--font-sans)", fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#FF4D00", marginBottom: 6 }}>
          Pagamento via PIX
        </p>
        <h3 style={{ fontFamily: "var(--font-bebas)", fontSize: 22, letterSpacing: "1px", color: "#F5F5F5", marginBottom: 20 }}>
          {PLAN_LABELS[plan]}
        </h3>

        {/* Conteúdo */}
        {loading && (
          <div style={{ textAlign: "center", padding: "40px 0", color: "rgba(255,255,255,0.4)" }}>
            <Loader2 size={32} style={{ animation: "spin 1s linear infinite", margin: "0 auto 12px" }} />
            <p style={{ fontSize: 13 }}>Gerando QR Code...</p>
          </div>
        )}

        {!loading && error && (
          <div style={{ textAlign: "center", padding: "24px 0" }}>
            <p style={{ color: "#FF4D00", fontSize: 14, marginBottom: 16 }}>{error}</p>
            <button
              onClick={createPix}
              style={{
                padding: "10px 24px", background: "#FF4D00", color: "#fff",
                border: "none", borderRadius: 6, fontWeight: 700, fontSize: 13,
                cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6,
              }}
            >
              <RefreshCw size={14} /> Tentar novamente
            </button>
          </div>
        )}

        {!loading && !error && status === "PAID" && (
          <div style={{ textAlign: "center", padding: "24px 0" }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>✅</div>
            <p style={{ color: "#4ADE80", fontSize: 16, fontWeight: 700 }}>Pagamento confirmado!</p>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, marginTop: 6 }}>Seu plano foi ativado.</p>
          </div>
        )}

        {!loading && !error && status === "EXPIRED" && (
          <div style={{ textAlign: "center", padding: "24px 0" }}>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 14, marginBottom: 16 }}>QR Code expirado.</p>
            <button
              onClick={createPix}
              style={{
                padding: "10px 24px", background: "transparent", color: "#FF4D00",
                border: "1px solid rgba(255,77,0,0.4)", borderRadius: 6,
                fontWeight: 700, fontSize: 13, cursor: "pointer",
                display: "inline-flex", alignItems: "center", gap: 6,
              }}
            >
              <RefreshCw size={14} /> Gerar novo QR Code
            </button>
          </div>
        )}

        {!loading && !error && status === "PENDING" && (
          <>
            {/* Timer */}
            <div style={{ textAlign: "center", marginBottom: 16 }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 20, color: secondsLeft < 300 ? "#FF4D00" : "#00E5FF" }}>
                {mm}:{ss}
              </span>
              <span style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginLeft: 8 }}>restantes</span>
            </div>

            {/* QR Code */}
            {qrCode ? (
              <div style={{ textAlign: "center", marginBottom: 16 }}>
                <img
                  src={`data:image/png;base64,${qrCode}`}
                  alt="QR Code PIX"
                  style={{ width: 200, height: 200, border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, margin: "0 auto", display: "block" }}
                />
              </div>
            ) : (
              <div style={{
                width: 200, height: 200, margin: "0 auto 16px",
                background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center",
                color: "rgba(255,255,255,0.3)", fontSize: 12,
              }}>
                QR Code indisponível
              </div>
            )}

            {/* Copia e Cola */}
            <p style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", textAlign: "center", marginBottom: 8 }}>
              Ou use o código Pix copia e cola:
            </p>
            <div style={{ display: "flex", gap: 8 }}>
              <input
                readOnly
                value={copiaCola}
                style={{
                  flex: 1, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 6, padding: "8px 12px", color: "rgba(255,255,255,0.7)",
                  fontSize: 11, fontFamily: "var(--font-mono)", overflow: "hidden", textOverflow: "ellipsis",
                }}
              />
              <button
                onClick={handleCopy}
                style={{
                  flexShrink: 0, padding: "8px 12px",
                  background: copied ? "rgba(74,222,128,0.1)" : "rgba(255,77,0,0.1)",
                  border: `1px solid ${copied ? "rgba(74,222,128,0.3)" : "rgba(255,77,0,0.3)"}`,
                  borderRadius: 6, color: copied ? "#4ADE80" : "#FF4D00", cursor: "pointer",
                }}
              >
                {copied ? <Check size={15} /> : <Copy size={15} />}
              </button>
            </div>

            <p style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", textAlign: "center", marginTop: 16 }}>
              Após o pagamento, o acesso é liberado automaticamente.
            </p>
          </>
        )}
      </div>

      <style>{`@keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }`}</style>
    </div>
  )
}
