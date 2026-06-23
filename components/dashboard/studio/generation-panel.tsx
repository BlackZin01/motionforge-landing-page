"use client"

import { useState, useRef } from "react"
import { ChevronDown, Upload, X } from "lucide-react"
import { ModelGrid, IMAGE_MODELS, VIDEO_MODELS } from "./model-grid"
import { motion, AnimatePresence } from "framer-motion"
import { uploadFileToR2 } from "@/lib/upload-to-r2"

// ─── Tipos ───────────────────────────────────────────────────────────────────

interface GenerationConfig {
  type: string
  model: string
  prompt: string
  aspectRatio: string
  referenceImageUrl?: string | null
}

interface GenerationPanelProps {
  onGenerate: (config: GenerationConfig) => void
  credits: number
  generating: boolean
  isAdmin?: boolean
}

// ─── Spinner ──────────────────────────────────────────────────────────────────

function Spinner() {
  return (
    <>
      <style>{`
        @keyframes mf-spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>
      <svg
        width="15" height="15" viewBox="0 0 16 16"
        style={{ animation: "mf-spin 0.9s linear infinite", flexShrink: 0 }}
      >
        <circle cx="8" cy="8" r="6" fill="none" stroke="white" strokeWidth="2" strokeDasharray="25 12" />
      </svg>
    </>
  )
}

// ─── Helpers visuais ──────────────────────────────────────────────────────────

const SECTION_LABEL: React.CSSProperties = {
  fontSize: "10px", textTransform: "uppercase",
  letterSpacing: "2px", color: "rgba(245,245,245,0.35)",
  marginBottom: "8px", fontFamily: "'DM Sans', sans-serif",
  fontWeight: 700,
}

function SectionDivider() {
  return <div style={{ height: 1, background: "rgba(255,255,255,.04)", margin: "0 0 14px" }} />
}

// ─── Componente ──────────────────────────────────────────────────────────────

export function GenerationPanel({ onGenerate, credits, generating, isAdmin }: GenerationPanelProps) {
  const [mode, setMode] = useState<"image" | "video">("image")
  const [selectedModel, setSelectedModel] = useState("nano-banana-2")
  const [prompt, setPrompt] = useState("")
  const [showDuration, setShowDuration] = useState(false)
  const [duration, setDuration] = useState("8s")
  const [aspect, setAspect] = useState<"9:16" | "16:9" | "1:1">("9:16")
  const [refImage, setRefImage] = useState<string | null>(null)
  const [refImagePreview, setRefImagePreview] = useState<string | null>(null)
  const [uploadingImage, setUploadingImage] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const allModels = [...IMAGE_MODELS, ...VIDEO_MODELS]
  const currentModel = allModels.find((m) => m.id === selectedModel)
  const cost = currentModel?.cost ?? 0

  function handleModeChange(newMode: "image" | "video") {
    setMode(newMode)
    setSelectedModel(newMode === "image" ? "nano-banana-2" : "seedance-fast")
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    e.target.value = ""

    // Preview local imediato
    const preview = URL.createObjectURL(file)
    setRefImagePreview(preview)
    setRefImage(null)
    setUploadingImage(true)

    try {
      const cdnUrl = await uploadFileToR2(file)
      setRefImage(cdnUrl)
    } catch {
      setRefImagePreview(null)
      setRefImage(null)
    } finally {
      setUploadingImage(false)
    }
  }

  function handleRemoveRefImage() {
    setRefImage(null)
    setRefImagePreview(null)
    setUploadingImage(false)
  }

  // ── Pill de opção ──────────────────────────────────────────────────────────

  function OptionPill({
    value,
    current,
    onSelect,
  }: {
    value: string
    current: string
    onSelect: (v: string) => void
  }) {
    const isActive = value === current
    return (
      <button
        onClick={() => onSelect(value)}
        style={{
          padding: "5px 11px", fontSize: "11px", borderRadius: "6px",
          cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
          border: isActive ? "1px solid rgba(255,77,0,.4)" : "1px solid rgba(255,255,255,.06)",
          background: isActive ? "rgba(255,77,0,.1)" : "rgba(255,255,255,.04)",
          color: isActive ? "#FF4D00" : "rgba(245,245,245,.45)",
          transition: "all .15s ease",
          whiteSpace: "nowrap",
        }}
      >
        {value}
      </button>
    )
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100%" }}>

      {/* ── 1. Modo + Proporção ─────────────────────────────────────────────── */}
      <div style={{ padding: "16px 16px 14px", borderBottom: "1px solid rgba(255,255,255,.05)" }}>

        {/* Toggle Imagem / Vídeo */}
        <div style={{ display: "flex", gap: "6px", marginBottom: "14px" }}>
          {(["image", "video"] as const).map((m) => (
            <button
              key={m}
              onClick={() => handleModeChange(m)}
              style={{
                flex: 1, padding: "9px 8px",
                fontSize: "13px", fontWeight: 700,
                cursor: "pointer", borderRadius: "8px",
                fontFamily: "'DM Sans', sans-serif",
                transition: "all .15s ease",
                ...(mode === m
                  ? { background: "#FF4D00", color: "#fff", border: "1px solid #FF4D00" }
                  : { background: "rgba(255,255,255,.04)", color: "rgba(245,245,245,.4)", border: "1px solid rgba(255,255,255,.06)" }),
              }}
            >
              {m === "image" ? "IMAGEM" : "VÍDEO"}
            </button>
          ))}
        </div>

        {/* Proporção — sempre visível */}
        <p style={SECTION_LABEL}>Proporção</p>
        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
          {(["9:16", "16:9", "1:1"] as const).map((ar) => (
            <OptionPill key={ar} value={ar} current={aspect} onSelect={(v) => setAspect(v as typeof aspect)} />
          ))}
        </div>
      </div>

      {/* ── 2. Modelo ───────────────────────────────────────────────────────── */}
      <div style={{ padding: "14px 16px" }}>
        <p style={SECTION_LABEL}>Modelo</p>
        <ModelGrid type={mode} selected={selectedModel} onSelect={setSelectedModel} plan={isAdmin ? "Agency" : "Pro"} />
      </div>

      <SectionDivider />

      {/* ── 3. Prompt ───────────────────────────────────────────────────────── */}
      <div style={{ padding: "0 16px 14px" }}>
        <p style={SECTION_LABEL}>Prompt</p>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={4}
          placeholder="Descreva o que você quer gerar com o máximo de detalhes..."
          style={{
            width: "100%", resize: "vertical", minHeight: "90px",
            background: "#111111",
            border: "1px solid rgba(255,255,255,.06)",
            borderRadius: "8px", padding: "10px 12px",
            color: "#F5F5F5", fontSize: "13px", lineHeight: "1.55",
            outline: "none", fontFamily: "'DM Sans', sans-serif",
            boxSizing: "border-box",
            transition: "border-color .15s ease, box-shadow .15s ease",
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = "#FF4D00"
            e.currentTarget.style.boxShadow = "0 0 0 2px rgba(255,77,0,.1)"
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = "rgba(255,255,255,.06)"
            e.currentTarget.style.boxShadow = "none"
          }}
        />
      </div>

      {/* ── 4. Imagem de referência ─────────────────────────────────────────── */}
      {(
        <div style={{ padding: "0 16px 14px" }}>
          <p style={SECTION_LABEL}>
            Imagem de referência{" "}
            <span style={{ opacity: .45, textTransform: "none", letterSpacing: 0 }}>(opcional)</span>
          </p>

          <input
            ref={fileRef} type="file" accept="image/*"
            style={{ display: "none" }}
            onChange={handleFileChange}
          />

          {(refImagePreview || refImage) ? (
            <div style={{ position: "relative" }}>
              <img
                src={refImagePreview ?? refImage!} alt="referência"
                onClick={() => !uploadingImage && fileRef.current?.click()}
                style={{
                  width: "100%", display: "block", borderRadius: "8px",
                  maxHeight: "110px", objectFit: "cover", cursor: uploadingImage ? "default" : "pointer",
                  border: "1px solid rgba(255,255,255,.08)",
                  opacity: uploadingImage ? 0.5 : 1,
                }}
              />
              {uploadingImage && (
                <div style={{
                  position: "absolute", inset: 0, display: "flex",
                  alignItems: "center", justifyContent: "center",
                  background: "rgba(0,0,0,.45)", borderRadius: "8px",
                  fontSize: "11px", color: "#F5F5F5", fontFamily: "'DM Sans',sans-serif", gap: 6,
                }}>
                  <Spinner /> Enviando...
                </div>
              )}
              {!uploadingImage && (
                <>
                  <button
                    onClick={handleRemoveRefImage}
                    style={{
                      position: "absolute", top: 6, right: 6,
                      width: 22, height: 22, borderRadius: "50%",
                      background: "rgba(0,0,0,.75)", border: "none",
                      cursor: "pointer", color: "#F5F5F5",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}
                  >
                    <X size={11} />
                  </button>
                  <span
                    style={{
                      position: "absolute", bottom: 6, left: 8,
                      fontSize: "9px", color: "rgba(245,245,245,.5)",
                      background: "rgba(0,0,0,.6)", borderRadius: "4px", padding: "2px 6px",
                      fontFamily: "'DM Sans',sans-serif",
                    }}
                  >
                    Clique para trocar
                  </span>
                </>
              )}
            </div>
          ) : (
            <div
              onClick={() => fileRef.current?.click()}
              style={{
                border: "1px dashed rgba(255,255,255,.1)", borderRadius: "8px",
                padding: "18px 16px", textAlign: "center", cursor: "pointer",
                transition: "border-color .15s, background .15s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "rgba(255,77,0,.35)"
                e.currentTarget.style.background = "rgba(255,77,0,.03)"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,.1)"
                e.currentTarget.style.background = "transparent"
              }}
            >
              <Upload size={18} style={{ color: "rgba(245,245,245,.3)", display: "block", margin: "0 auto 6px" }} />
              <p style={{ fontSize: "11px", color: "rgba(245,245,245,.35)", fontFamily: "'DM Sans',sans-serif", margin: 0 }}>
                Arraste ou clique para adicionar
              </p>
            </div>
          )}
        </div>
      )}

      {/* ── 5. Duração (vídeo) ──────────────────────────────────────────────── */}
      {mode === "video" && (
        <div style={{ padding: "0 16px 10px" }}>
          <div
            onClick={() => setShowDuration(!showDuration)}
            style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              cursor: "pointer", padding: "8px 0",
              borderTop: "1px solid rgba(255,255,255,.04)",
            }}
          >
            <span style={{ fontSize: "11px", color: "rgba(245,245,245,.4)", fontFamily: "'DM Sans',sans-serif" }}>
              Duração: <strong style={{ color: "rgba(245,245,245,.65)" }}>{duration}</strong>
            </span>
            <ChevronDown
              size={13}
              style={{
                color: "rgba(245,245,245,.35)",
                transform: showDuration ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform .2s ease",
              }}
            />
          </div>
          <AnimatePresence>
            {showDuration && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.18, ease: "easeInOut" }}
                style={{ overflow: "hidden" }}
              >
                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", paddingTop: "8px" }}>
                  {["5s", "8s", "15s", "20s", "30s", "60s"].map((d) => (
                    <OptionPill key={d} value={d} current={duration} onSelect={setDuration} />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Espaçador */}
      <div style={{ flex: 1 }} />

      {/* ── 6. Resumo de custo ──────────────────────────────────────────────── */}
      <div style={{ padding: "12px 16px 0", borderTop: "1px solid rgba(255,255,255,.05)" }}>
        <div
          style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            background: "rgba(0,229,255,.04)", border: "1px solid rgba(0,229,255,.08)",
            borderRadius: "8px", padding: "10px 14px",
          }}
        >
          <div>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "10px", color: "rgba(245,245,245,.35)", margin: "0 0 2px", textTransform: "uppercase", letterSpacing: "1px" }}>
              Esta geração
            </p>
            <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: "15px", fontWeight: 700, color: "#00E5FF", margin: 0 }}>
              {cost} cr.
            </p>
          </div>
          <div style={{ textAlign: "right" }}>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "10px", color: "rgba(245,245,245,.35)", margin: "0 0 2px", textTransform: "uppercase", letterSpacing: "1px" }}>
              Saldo após
            </p>
            <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: "15px", fontWeight: 700, color: isAdmin ? "#00E5FF" : credits - cost < 0 ? "#ef4444" : "rgba(245,245,245,.55)", margin: 0 }}>
              {isAdmin ? "∞" : credits - cost}
            </p>
          </div>
        </div>
      </div>

      {/* ── 7. Botão Gerar ──────────────────────────────────────────────────── */}
      <div style={{ padding: "12px 16px 18px" }}>
        <button
          disabled={generating || !prompt.trim() || uploadingImage}
          onClick={() => onGenerate({ type: mode, model: selectedModel, prompt, aspectRatio: aspect, referenceImageUrl: refImage })}
          style={{
            width: "100%", height: "50px",
            background: "#FF4D00",
            color: "white", border: "none", borderRadius: "10px",
            fontSize: "14px", fontWeight: 700, letterSpacing: "1.5px",
            cursor: generating || !prompt.trim() || uploadingImage ? "not-allowed" : "pointer",
            opacity: generating || !prompt.trim() || uploadingImage ? 0.38 : 1,
            display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
            transition: "opacity .2s",
            fontFamily: "'DM Sans',sans-serif",
            boxShadow: generating || !prompt.trim() ? "none" : "0 4px 20px rgba(255,77,0,.28)",
          }}
          onMouseEnter={(e) => {
            if (!generating && prompt.trim()) {
              ;(e.currentTarget as HTMLButtonElement).style.opacity = "0.88"
            }
          }}
          onMouseLeave={(e) => {
            ;(e.currentTarget as HTMLButtonElement).style.opacity = generating || !prompt.trim() ? "0.38" : "1"
          }}
        >
          {generating ? <><Spinner />Gerando...</> : "⚡ GERAR AGORA"}
        </button>
      </div>
    </div>
  )
}
