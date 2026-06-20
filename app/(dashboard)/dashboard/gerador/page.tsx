"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Wand2, Copy, Check, Loader2 } from "lucide-react"

// ─── Animação ─────────────────────────────────────────────────────────────────

const EASE_FORGE = [0.22, 1, 0.36, 1] as const

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.5, ease: EASE_FORGE, delay: i * 0.08 },
  }),
}

// ─── Tipos ────────────────────────────────────────────────────────────────────

interface CopyResult {
  hooks: string[]
  ctas: string[]
  script: string
}

// ─── Página ───────────────────────────────────────────────────────────────────

export default function GeradorPage() {
  const [produto, setProduto]         = useState("")
  const [nicho, setNicho]             = useState("")
  const [diferencial, setDiferencial] = useState("")
  const [tom, setTom]                 = useState("urgência e desejo")
  const [loading, setLoading]         = useState(false)
  const [result, setResult]           = useState<CopyResult | null>(null)
  const [error, setError]             = useState("")
  const [copiedKey, setCopiedKey]     = useState<string | null>(null)

  const TONS = ["urgência e desejo", "emocional", "direto e objetivo", "humor", "autoridade"]

  const INPUT_STYLE: React.CSSProperties = {
    background: "#0D0D0D",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "8px",
    padding: "11px 14px",
    fontSize: "13px",
    color: "#F5F5F5",
    fontFamily: "'DM Sans', sans-serif",
    width: "100%",
    outline: "none",
    transition: "border-color 150ms ease",
  }

  async function handleGenerate() {
    if (!produto.trim() || !nicho.trim()) {
      setError("Preencha pelo menos Produto e Nicho.")
      return
    }
    setError("")
    setLoading(true)
    setResult(null)
    try {
      const res = await fetch("/api/generate-copy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ produto, nicho, diferencial, tom }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error ?? "Erro ao gerar."); return }
      setResult(data)
    } catch {
      setError("Erro de conexão. Tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  async function handleCopy(text: string, key: string) {
    await navigator.clipboard.writeText(text)
    setCopiedKey(key)
    setTimeout(() => setCopiedKey(null), 2000)
  }

  return (
    <div style={{ padding: "24px", maxWidth: "860px", margin: "0 auto" }}>

      {/* ── Header ── */}
      <motion.div custom={0} variants={fadeUp} initial="hidden" animate="visible" style={{ marginBottom: "32px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "6px" }}>
          <div style={{
            width: "40px", height: "40px", borderRadius: "12px",
            background: "rgba(255,77,0,0.12)", display: "flex",
            alignItems: "center", justifyContent: "center", flexShrink: 0,
          }}>
            <Wand2 size={20} style={{ color: "#FF4D00" }} />
          </div>
          <h1 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "20px", fontWeight: 700, color: "#F5F5F5", margin: 0 }}>
            Gerador de Copy com IA
          </h1>
        </div>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", color: "rgba(245,245,245,0.4)", margin: 0 }}>
          Descreva seu produto e a IA gera hooks, CTAs e script de vídeo prontos para o TikTok Shop.
        </p>
      </motion.div>

      {/* ── Formulário ── */}
      <motion.div custom={1} variants={fadeUp} initial="hidden" animate="visible">
        <div style={{
          background: "#111111",
          border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: "16px",
          padding: "24px",
          marginBottom: "24px",
        }}>
          <div style={{ display: "grid", gap: "16px" }} className="grid-cols-1 sm:grid-cols-2">

            {/* Produto */}
            <div>
              <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "rgba(245,245,245,0.5)", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "1px", fontFamily: "'DM Sans', sans-serif" }}>
                Produto *
              </label>
              <input
                style={INPUT_STYLE}
                placeholder="ex: Creme facial hidratante"
                value={produto}
                onChange={e => setProduto(e.target.value)}
                onFocus={e => { (e.target as HTMLInputElement).style.borderColor = "rgba(255,77,0,0.4)" }}
                onBlur={e => { (e.target as HTMLInputElement).style.borderColor = "rgba(255,255,255,0.08)" }}
              />
            </div>

            {/* Nicho */}
            <div>
              <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "rgba(245,245,245,0.5)", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "1px", fontFamily: "'DM Sans', sans-serif" }}>
                Nicho *
              </label>
              <input
                style={INPUT_STYLE}
                placeholder="ex: Skincare, Beleza feminina"
                value={nicho}
                onChange={e => setNicho(e.target.value)}
                onFocus={e => { (e.target as HTMLInputElement).style.borderColor = "rgba(255,77,0,0.4)" }}
                onBlur={e => { (e.target as HTMLInputElement).style.borderColor = "rgba(255,255,255,0.08)" }}
              />
            </div>

            {/* Diferencial */}
            <div className="sm:col-span-2">
              <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "rgba(245,245,245,0.5)", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "1px", fontFamily: "'DM Sans', sans-serif" }}>
                Diferencial <span style={{ fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>(opcional)</span>
              </label>
              <input
                style={INPUT_STYLE}
                placeholder="ex: Resultados em 7 dias, sem parabenos, aprovado por dermatologistas"
                value={diferencial}
                onChange={e => setDiferencial(e.target.value)}
                onFocus={e => { (e.target as HTMLInputElement).style.borderColor = "rgba(255,77,0,0.4)" }}
                onBlur={e => { (e.target as HTMLInputElement).style.borderColor = "rgba(255,255,255,0.08)" }}
              />
            </div>

            {/* Tom */}
            <div className="sm:col-span-2">
              <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "rgba(245,245,245,0.5)", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "1px", fontFamily: "'DM Sans', sans-serif" }}>
                Tom da copy
              </label>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {TONS.map(t => (
                  <button
                    key={t}
                    onClick={() => setTom(t)}
                    style={{
                      padding: "7px 14px", borderRadius: "8px", cursor: "pointer",
                      fontFamily: "'DM Sans', sans-serif", fontSize: "12px", fontWeight: 600,
                      border: "1px solid",
                      background: tom === t ? "rgba(255,77,0,0.12)" : "transparent",
                      borderColor: tom === t ? "rgba(255,77,0,0.5)" : "rgba(255,255,255,0.08)",
                      color: tom === t ? "#FF4D00" : "rgba(245,245,245,0.45)",
                      transition: "all 150ms ease",
                    }}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {error && (
            <p style={{ fontSize: "12px", color: "#ef4444", marginTop: "14px", fontFamily: "'DM Sans', sans-serif" }}>
              {error}
            </p>
          )}

          <button
            onClick={handleGenerate}
            disabled={loading}
            style={{
              marginTop: "20px",
              display: "flex", alignItems: "center", gap: "8px",
              background: loading ? "rgba(255,77,0,0.5)" : "#FF4D00",
              color: "#fff", border: "none", borderRadius: "8px",
              padding: "12px 24px", fontSize: "13px", fontWeight: 700,
              letterSpacing: "0.5px",
              fontFamily: "'DM Sans', sans-serif",
              cursor: loading ? "not-allowed" : "pointer",
              transition: "background 150ms ease, transform 150ms ease",
              boxShadow: loading ? "none" : "0 0 20px rgba(255,77,0,0.25)",
            }}
            onMouseEnter={e => { if (!loading) (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.02)" }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)" }}
          >
            {loading
              ? <Loader2 size={15} style={{ animation: "spin 0.8s linear infinite" }} />
              : <Wand2 size={15} />
            }
            {loading ? "Gerando copy..." : "Gerar Copy"}
          </button>
        </div>
      </motion.div>

      {/* ── Resultado ── */}
      {result && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: EASE_FORGE }}
          style={{ display: "flex", flexDirection: "column", gap: "16px" }}
        >
          {/* Hooks */}
          <div style={{ background: "#111111", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "16px", padding: "20px" }}>
            <div style={{ fontSize: "11px", fontWeight: 700, color: "rgba(245,245,245,0.45)", textTransform: "uppercase", letterSpacing: "1.5px", fontFamily: "'DM Sans', sans-serif", marginBottom: "14px" }}>
              🎣 Hooks de abertura
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {result.hooks.map((hook, i) => (
                <div key={i} style={{
                  display: "flex", alignItems: "center", gap: "12px",
                  background: "#0D0D0D", border: "1px solid rgba(255,255,255,0.05)",
                  borderRadius: "8px", padding: "12px 14px",
                }}>
                  <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", color: "#F5F5F5", flex: 1, lineHeight: "1.5" }}>{hook}</span>
                  <button
                    onClick={() => handleCopy(hook, `hook-${i}`)}
                    title="Copiar"
                    style={{ background: "none", border: "none", cursor: "pointer", color: copiedKey === `hook-${i}` ? "#10A37F" : "rgba(245,245,245,0.3)", flexShrink: 0, padding: "4px", transition: "color 150ms ease" }}
                  >
                    {copiedKey === `hook-${i}` ? <Check size={14} /> : <Copy size={14} />}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* CTAs */}
          <div style={{ background: "#111111", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "16px", padding: "20px" }}>
            <div style={{ fontSize: "11px", fontWeight: 700, color: "rgba(245,245,245,0.45)", textTransform: "uppercase", letterSpacing: "1.5px", fontFamily: "'DM Sans', sans-serif", marginBottom: "14px" }}>
              🎯 CTAs
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {result.ctas.map((cta, i) => (
                <div key={i} style={{
                  display: "flex", alignItems: "center", gap: "12px",
                  background: "#0D0D0D", border: "1px solid rgba(255,255,255,0.05)",
                  borderRadius: "8px", padding: "12px 14px",
                }}>
                  <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", color: "#F5F5F5", flex: 1, lineHeight: "1.5" }}>{cta}</span>
                  <button
                    onClick={() => handleCopy(cta, `cta-${i}`)}
                    title="Copiar"
                    style={{ background: "none", border: "none", cursor: "pointer", color: copiedKey === `cta-${i}` ? "#10A37F" : "rgba(245,245,245,0.3)", flexShrink: 0, padding: "4px", transition: "color 150ms ease" }}
                  >
                    {copiedKey === `cta-${i}` ? <Check size={14} /> : <Copy size={14} />}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Script */}
          <div style={{ background: "#111111", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "16px", padding: "20px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px" }}>
              <div style={{ fontSize: "11px", fontWeight: 700, color: "rgba(245,245,245,0.45)", textTransform: "uppercase", letterSpacing: "1.5px", fontFamily: "'DM Sans', sans-serif" }}>
                🎬 Script de vídeo (30s)
              </div>
              <button
                onClick={() => handleCopy(result.script, "script")}
                title="Copiar script"
                style={{
                  display: "flex", alignItems: "center", gap: "6px",
                  background: copiedKey === "script" ? "rgba(16,163,127,0.1)" : "rgba(255,255,255,0.05)",
                  border: "1px solid " + (copiedKey === "script" ? "rgba(16,163,127,0.3)" : "rgba(255,255,255,0.08)"),
                  color: copiedKey === "script" ? "#10A37F" : "rgba(245,245,245,0.5)",
                  fontFamily: "'DM Sans', sans-serif", fontSize: "11px", fontWeight: 600,
                  padding: "5px 10px", borderRadius: "6px", cursor: "pointer",
                  transition: "all 150ms ease",
                }}
              >
                {copiedKey === "script" ? <Check size={12} /> : <Copy size={12} />}
                {copiedKey === "script" ? "Copiado!" : "Copiar"}
              </button>
            </div>
            <div style={{ background: "#0D0D0D", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "8px", padding: "16px" }}>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", color: "rgba(245,245,245,0.85)", lineHeight: "1.8", margin: 0 }}>
                {result.script}
              </p>
            </div>
          </div>

          {/* Gerar de novo */}
          <button
            onClick={() => { setResult(null); window.scrollTo({ top: 0, behavior: "smooth" }) }}
            style={{
              alignSelf: "flex-start",
              background: "transparent", border: "1px solid rgba(255,255,255,0.1)",
              color: "rgba(245,245,245,0.5)", fontFamily: "'DM Sans', sans-serif",
              fontSize: "12px", fontWeight: 600, padding: "8px 16px",
              borderRadius: "8px", cursor: "pointer", transition: "all 150ms ease",
            }}
            onMouseEnter={e => { const el = e.currentTarget as HTMLButtonElement; el.style.borderColor = "rgba(255,77,0,0.4)"; el.style.color = "#FF4D00" }}
            onMouseLeave={e => { const el = e.currentTarget as HTMLButtonElement; el.style.borderColor = "rgba(255,255,255,0.1)"; el.style.color = "rgba(245,245,245,0.5)" }}
          >
            ↑ Gerar novamente
          </button>
        </motion.div>
      )}
    </div>
  )
}
