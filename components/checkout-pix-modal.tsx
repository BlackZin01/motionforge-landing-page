"use client"

import { useEffect, useRef, useState } from "react"
import { X, Copy, Check, RefreshCw, Loader2, ArrowRight } from "lucide-react"

type PixStatus = "PENDING" | "PAID" | "EXPIRED"
type Step = "cpf" | "qr"

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

function formatCpf(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 11)
  if (digits.length <= 3) return digits
  if (digits.length <= 6) return `${digits.slice(0,3)}.${digits.slice(3)}`
  if (digits.length <= 9) return `${digits.slice(0,3)}.${digits.slice(3,6)}.${digits.slice(6)}`
  return `${digits.slice(0,3)}.${digits.slice(3,6)}.${digits.slice(6,9)}-${digits.slice(9)}`
}

function isValidCpf(cpf: string): boolean {
  const d = cpf.replace(/\D/g, "")
  if (d.length !== 11 || /^(\d)\1+$/.test(d)) return false
  const calc = (len: number) => {
    let sum = 0
    for (let i = 0; i < len; i++) sum += parseInt(d[i]) * (len + 1 - i)
    const r = (sum * 10) % 11
    return r === 10 || r === 11 ? 0 : r
  }
  return calc(9) === parseInt(d[9]) && calc(10) === parseInt(d[10])
}

export function CheckoutPixModal({ plan, onSuccess, onClose }: CheckoutPixModalProps) {
  const [step, setStep]               = useState<Step>("cpf")
  const [cpf, setCpf]                 = useState("")
  const [cpfError, setCpfError]       = useState("")
  const [loading, setLoading]         = useState(false)
  const [error, setError]             = useState<string | null>(null)
  const [qrCode, setQrCode]           = useState<string | null>(null)
  const [copiaCola, setCopiaCola]     = useState<string>("")
  const [pixId, setPixId]             = useState<string>("")
  const [copied, setCopied]           = useState(false)
  const [status, setStatus]           = useState<PixStatus>("PENDING")
  const [secondsLeft, setSecondsLeft] = useState(EXPIRES_SECS)

  const pollingRef   = useRef<ReturnType<typeof setInterval> | null>(null)
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null)

  function getToken() {
    return typeof window !== "undefined" ? localStorage.getItem("mf_token") : null
  }

  function handleCpfChange(e: React.ChangeEvent<HTMLInputElement>) {
    setCpf(formatCpf(e.target.value))
    setCpfError("")
  }

  function handleCpfSubmit() {
    if (!isValidCpf(cpf)) { setCpfError("CPF inválido. Verifique e tente novamente."); return }
    setStep("qr")
    createPix(cpf)
  }

  async function createPix(userCpf: string) {
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
        body: JSON.stringify({ plan, cpf: userCpf }),
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
      } catch { /* ignora erros de rede */ }
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

  function handleRetry() {
    setStep("cpf")
    setCpf("")
    setError(null)
    setStatus("PENDING")
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

        {/* ── ETAPA CPF ── */}
        {step === "cpf" && (
          <div>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: 13, color: "rgba(245,245,245,0.55)", marginBottom: 20, lineHeight: 1.55 }}>
              Informe seu CPF para gerar o QR Code PIX. Ele é exigido pelo banco para processar o pagamento.
            </p>
            <label style={{ display: "block", fontFamily: "var(--font-sans)", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(245,245,245,0.4)", marginBottom: 8 }}>
              CPF
            </label>
            <input
              type="text"
              inputMode="numeric"
              placeholder="000.000.000-00"
              value={cpf}
              onChange={handleCpfChange}
              onKeyDown={(e) => { if (e.key === "Enter") handleCpfSubmit() }}
              style={{
                width: "100%", boxSizing: "border-box",
                background: "rgba(255,255,255,0.04)",
                border: `1px solid ${cpfError ? "rgba(255,77,0,0.5)" : "rgba(255,255,255,0.1)"}`,
                borderRadius: 6, padding: "12px 14px",
                color: "#F5F5F5", fontSize: 16,
                fontFamily: "var(--font-mono)",
                outline: "none", marginBottom: cpfError ? 6 : 20,
              }}
            />
            {cpfError && (
              <p style={{ fontFamily: "var(--font-sans)", fontSize: 12, color: "#FF4D00", marginBottom: 16 }}>{cpfError}</p>
            )}
            <button
              onClick={handleCpfSubmit}
              style={{
                width: "100%", padding: "13px 0",
                background: "#FF4D00", color: "#fff", border: "none", borderRadius: 6,
                fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 700,
                letterSpacing: "0.18em", textTransform: "uppercase",
                cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                boxShadow: "0 0 24px rgba(255,77,0,0.3)",
              }}
            >
              Gerar QR Code <ArrowRight size={15} />
            </button>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: 11, color: "rgba(245,245,245,0.2)", textAlign: "center", marginTop: 12 }}>
              Seus dados são usados apenas para processar o pagamento.
            </p>
          </div>
        )}

        {/* ── ETAPA QR CODE ── */}
        {step === "qr" && (
          <>
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
                  onClick={handleRetry}
                  style={{
                    padding: "10px 24px", background: "transparent", color: "#FF4D00",
                    border: "1px solid rgba(255,77,0,0.4)", borderRadius: 6,
                    fontWeight: 700, fontSize: 13, cursor: "pointer",
                    display: "inline-flex", alignItems: "center", gap: 6,
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
                  onClick={handleRetry}
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

                {/* QR Code — brCodeBase64 já vem com prefixo data:image/png;base64, */}
                {qrCode ? (
                  <div style={{ textAlign: "center", marginBottom: 16 }}>
                    <img
                      src={qrCode}
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
          </>
        )}
      </div>

      <style>{`@keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }`}</style>
    </div>
  )
}
