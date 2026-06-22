"use client"

import { useState, useRef } from "react"
import { motion } from "framer-motion"
import { Wand2, Copy, Check, Loader2, ImagePlus, X, Infinity as InfinityIcon, Lock } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import Link from "next/link"

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
  const { user } = useAuth()
  const [produto, setProduto]         = useState("")
  const [nicho, setNicho]             = useState("")
  const [diferencial, setDiferencial] = useState("")
  const [tom, setTom]                 = useState("urgência e desejo")
  const [imageBase64, setImageBase64]   = useState<string | null>(null)
  const [imageMimeType, setImageMimeType] = useState<string>("image/jpeg")
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [dragOver, setDragOver]         = useState(false)
  const [loading, setLoading]           = useState(false)
  const [result, setResult]             = useState<CopyResult | null>(null)
  const [error, setError]               = useState("")
  const [limitReached, setLimitReached] = useState(false)
  const [geracoesUsadas, setGeracoesUsadas] = useState<number | null>(null)
  const [copiedKey, setCopiedKey]       = useState<string | null>(null)
  const fileInputRef                    = useRef<HTMLInputElement>(null)

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

  function processImage(file: File) {
    if (!file.type.startsWith("image/")) return
    if (file.size > 5 * 1024 * 1024) { setError("Imagem deve ter no máximo 5MB."); return }
    setImageMimeType(file.type)
    const reader = new FileReader()
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string
      setImagePreview(dataUrl)
      // Extrai apenas o base64 (sem o prefixo data:...)
      setImageBase64(dataUrl.split(",")[1])
    }
    reader.readAsDataURL(file)
  }

  function handleFileInput(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) processImage(file)
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files?.[0]
    if (file) processImage(file)
  }

  function removeImage() {
    setImageBase64(null)
    setImagePreview(null)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  function handleReset() {
    setProduto("")
    setNicho("")
    setDiferencial("")
    setTom("urgência e desejo")
    setImageBase64(null)
    setImagePreview(null)
    setResult(null)
    setError("")
    if (fileInputRef.current) fileInputRef.current.value = ""
    window.scrollTo({ top: 0, behavior: "smooth" })
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
      const token = localStorage.getItem("mf_token") ?? ""
      const res = await fetch("/api/generate-copy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ produto, nicho, diferencial, tom, imageBase64, imageMimeType }),
      })
      const data = await res.json()
      if (res.status === 429 && data.limitReached) {
        setLimitReached(true)
        setGeracoesUsadas(data.geracoes_usadas ?? 30)
        return
      }
      if (!res.ok) { setError(data.error ?? "Erro ao gerar."); return }
      if (data.geracoes_usadas !== undefined) setGeracoesUsadas(data.geracoes_usadas)
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
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", marginBottom: "6px", flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
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

          {/* Contador de uso por plano */}
          {user?.plan === "Starter" ? (
            <div style={{
              display: "flex", alignItems: "center", gap: "8px",
              padding: "6px 14px", borderRadius: "9999px",
              background: (geracoesUsadas ?? user?.geracoes_usadas ?? 0) >= 30
                ? "rgba(239,68,68,0.08)"
                : "rgba(255,255,255,0.04)",
              border: `1px solid ${(geracoesUsadas ?? user?.geracoes_usadas ?? 0) >= 30
                ? "rgba(239,68,68,0.3)"
                : "rgba(255,255,255,0.08)"}`,
            }}>
              <span style={{
                fontFamily: "'Space Grotesk', sans-serif", fontSize: "13px", fontWeight: 700,
                color: (geracoesUsadas ?? user?.geracoes_usadas ?? 0) >= 30 ? "#ef4444" : "#00E5FF",
              }}>
                {geracoesUsadas ?? user?.geracoes_usadas ?? "—"}/30
              </span>
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", color: "rgba(245,245,245,0.4)" }}>
                gerações este mês
              </span>
            </div>
          ) : (
            <div style={{
              display: "flex", alignItems: "center", gap: "6px",
              padding: "6px 14px", borderRadius: "9999px",
              background: "rgba(255,77,0,0.06)", border: "1px solid rgba(255,77,0,0.2)",
            }}>
              <InfinityIcon size={13} style={{ color: "#FF4D00" }} />
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", fontWeight: 700, color: "#FF4D00" }}>
                Ilimitado
              </span>
            </div>
          )}
        </div>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", color: "rgba(245,245,245,0.4)", margin: 0 }}>
          Descreva seu produto e a IA gera hooks, CTAs e script de vídeo prontos para o TikTok Shop.
        </p>
      </motion.div>

      {/* ── Limite atingido ── */}
      {limitReached && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          style={{
            display: "flex", flexDirection: "column", alignItems: "center", gap: "16px",
            padding: "48px 32px", marginBottom: "24px",
            background: "rgba(239,68,68,0.04)", border: "1px solid rgba(239,68,68,0.2)",
            borderRadius: "16px", textAlign: "center",
          }}
        >
          <div style={{
            width: "56px", height: "56px", borderRadius: "14px",
            background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Lock size={24} style={{ color: "#ef4444" }} />
          </div>
          <div>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "16px", fontWeight: 700, color: "#F5F5F5", margin: "0 0 6px" }}>
              Limite de gerações atingido
            </p>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", color: "rgba(245,245,245,0.4)", margin: 0, lineHeight: 1.6 }}>
              Você usou todas as 30 gerações mensais do plano Starter.<br />
              Faça upgrade para Pro e tenha geração de copy ilimitada.
            </p>
          </div>
          <Link
            href="/#planos"
            style={{
              display: "inline-flex", alignItems: "center", gap: "8px",
              padding: "12px 28px", borderRadius: "8px",
              background: "#FF4D00", color: "white", textDecoration: "none",
              fontFamily: "'DM Sans', sans-serif", fontSize: "13px", fontWeight: 700,
            }}
          >
            Fazer upgrade para Pro
          </Link>
        </motion.div>
      )}

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

            {/* Foto do produto */}
            <div className="sm:col-span-2">
              <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "rgba(245,245,245,0.5)", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "1px", fontFamily: "'DM Sans', sans-serif" }}>
                Foto do produto <span style={{ fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>(opcional — ajuda a IA a criar copy mais precisa)</span>
              </label>

              {imagePreview ? (
                <div style={{ position: "relative", display: "inline-block" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imagePreview}
                    alt="Preview do produto"
                    style={{ width: "120px", height: "120px", objectFit: "cover", borderRadius: "10px", border: "1px solid rgba(255,77,0,0.3)", display: "block" }}
                  />
                  <button
                    onClick={removeImage}
                    style={{
                      position: "absolute", top: "-8px", right: "-8px",
                      width: "22px", height: "22px", borderRadius: "50%",
                      background: "#1A1A1A", border: "1px solid rgba(255,255,255,0.15)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      cursor: "pointer", color: "rgba(245,245,245,0.6)",
                    }}
                  >
                    <X size={11} />
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={e => { e.preventDefault(); setDragOver(true) }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                  style={{
                    border: `1px dashed ${dragOver ? "rgba(255,77,0,0.6)" : "rgba(255,255,255,0.12)"}`,
                    borderRadius: "10px",
                    padding: "24px",
                    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "8px",
                    cursor: "pointer",
                    background: dragOver ? "rgba(255,77,0,0.05)" : "transparent",
                    transition: "all 150ms ease",
                  }}
                >
                  <ImagePlus size={24} style={{ color: dragOver ? "#FF4D00" : "rgba(245,245,245,0.2)" }} />
                  <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "12px", color: "rgba(245,245,245,0.35)", textAlign: "center" }}>
                    Arraste ou clique para anexar<br />
                    <span style={{ fontSize: "11px", color: "rgba(245,245,245,0.2)" }}>JPG, PNG, WEBP · máx 5MB</span>
                  </span>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileInput}
                style={{ display: "none" }}
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

          <div style={{ marginTop: "20px", display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <button
              onClick={handleGenerate}
              disabled={loading || limitReached}
              style={{
                display: "flex", alignItems: "center", gap: "8px",
                background: (loading || limitReached) ? "rgba(255,77,0,0.5)" : "#FF4D00",
                color: "#fff", border: "none", borderRadius: "8px",
                padding: "12px 24px", fontSize: "13px", fontWeight: 700,
                letterSpacing: "0.5px", fontFamily: "'DM Sans', sans-serif",
                cursor: (loading || limitReached) ? "not-allowed" : "pointer",
                transition: "background 150ms ease, transform 150ms ease",
                boxShadow: (loading || limitReached) ? "none" : "0 0 20px rgba(255,77,0,0.25)",
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

            {(produto || nicho || diferencial || imagePreview || result) && (
              <button
                onClick={handleReset}
                disabled={loading}
                style={{
                  display: "flex", alignItems: "center", gap: "6px",
                  background: "transparent",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "rgba(245,245,245,0.45)",
                  borderRadius: "8px", padding: "12px 18px",
                  fontSize: "13px", fontWeight: 600,
                  fontFamily: "'DM Sans', sans-serif",
                  cursor: loading ? "not-allowed" : "pointer",
                  transition: "all 150ms ease",
                }}
                onMouseEnter={e => { if (!loading) { const el = e.currentTarget as HTMLButtonElement; el.style.borderColor = "rgba(239,68,68,0.4)"; el.style.color = "#ef4444" } }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLButtonElement; el.style.borderColor = "rgba(255,255,255,0.1)"; el.style.color = "rgba(245,245,245,0.45)" }}
              >
                <X size={13} />
                Limpar tudo
              </button>
            )}
          </div>
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

          {/* Nova copy */}
          <button
            onClick={handleReset}
            style={{
              alignSelf: "flex-start",
              display: "flex", alignItems: "center", gap: "6px",
              background: "transparent", border: "1px solid rgba(255,255,255,0.1)",
              color: "rgba(245,245,245,0.5)", fontFamily: "'DM Sans', sans-serif",
              fontSize: "12px", fontWeight: 600, padding: "9px 16px",
              borderRadius: "8px", cursor: "pointer", transition: "all 150ms ease",
            }}
            onMouseEnter={e => { const el = e.currentTarget as HTMLButtonElement; el.style.borderColor = "rgba(255,77,0,0.4)"; el.style.color = "#FF4D00" }}
            onMouseLeave={e => { const el = e.currentTarget as HTMLButtonElement; el.style.borderColor = "rgba(255,255,255,0.1)"; el.style.color = "rgba(245,245,245,0.5)" }}
          >
            <X size={12} />
            Limpar e gerar nova copy
          </button>
        </motion.div>
      )}
    </div>
  )
}
