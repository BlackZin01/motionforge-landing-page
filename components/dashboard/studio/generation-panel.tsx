"use client"

import { useState } from "react"
import { ChevronDown, Upload } from "lucide-react"
import { ModelGrid, IMAGE_MODELS, VIDEO_MODELS } from "./model-grid"
import { motion, AnimatePresence } from "framer-motion"

// ─── Tipos ───────────────────────────────────────────────────────────────────

interface GenerationConfig {
  type: string
  model: string
  prompt: string
}

interface GenerationPanelProps {
  onGenerate: (config: GenerationConfig) => void
  credits: number
  generating: boolean
}

// ─── Spinner SVG ──────────────────────────────────────────────────────────────

function Spinner() {
  return (
    <>
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        style={{ animation: "spin 1s linear infinite" }}
      >
        <circle
          cx="8"
          cy="8"
          r="6"
          fill="none"
          stroke="white"
          strokeWidth="2"
          strokeDasharray="25 12"
        />
      </svg>
    </>
  )
}

// ─── Componente ──────────────────────────────────────────────────────────────

export function GenerationPanel({ onGenerate, credits, generating }: GenerationPanelProps) {
  const [mode, setMode] = useState<"image" | "video">("image")
  const [selectedModel, setSelectedModel] = useState("nano-banana-2")
  const [prompt, setPrompt] = useState("")
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [duration, setDuration] = useState<"5s" | "10s">("5s")
  const [aspect, setAspect] = useState<"16:9" | "9:16" | "1:1">("16:9")

  // Custo do modelo selecionado
  const allModels = [...IMAGE_MODELS, ...VIDEO_MODELS]
  const currentModel = allModels.find((m) => m.id === selectedModel)
  const cost = currentModel?.cost ?? 0

  // Ao trocar modo, seleciona o primeiro modelo disponível
  function handleModeChange(newMode: "image" | "video") {
    setMode(newMode)
    if (newMode === "image") {
      setSelectedModel("nano-banana-2")
    } else {
      setSelectedModel("seedance-fast")
    }
  }

  // Botão pill ativo/inativo
  const pillBase: React.CSSProperties = {
    flex: 1,
    padding: "8px",
    fontSize: "13px",
    cursor: "pointer",
    border: "1px solid rgba(255,255,255,0.06)",
    borderRadius: "8px",
    transition: "all 0.15s ease",
    fontFamily: "'DM Sans', sans-serif",
  }

  const pillActive: React.CSSProperties = {
    ...pillBase,
    background: "#FF4D00",
    color: "white",
    fontWeight: 700,
    border: "1px solid #FF4D00",
  }

  const pillInactive: React.CSSProperties = {
    ...pillBase,
    background: "rgba(255,255,255,0.04)",
    color: "rgba(245,245,245,0.4)",
  }

  // Pills de opção (duração / aspecto)
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
          padding: "4px 10px",
          fontSize: "11px",
          borderRadius: "6px",
          cursor: "pointer",
          border: isActive ? "1px solid rgba(255,77,0,0.4)" : "1px solid rgba(255,255,255,0.06)",
          background: isActive ? "rgba(255,77,0,0.1)" : "rgba(255,255,255,0.04)",
          color: isActive ? "#FF4D00" : "rgba(245,245,245,0.5)",
          transition: "all 0.15s ease",
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        {value}
      </button>
    )
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        overflowY: "auto",
      }}
    >
      {/* ── Seção 1: Toggle IMAGEM/VÍDEO ─────────────────────────────────── */}
      <div
        style={{
          padding: "16px",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        <div style={{ display: "flex", gap: "6px" }}>
          <button
            style={mode === "image" ? pillActive : pillInactive}
            onClick={() => handleModeChange("image")}
          >
            IMAGEM
          </button>
          <button
            style={mode === "video" ? pillActive : pillInactive}
            onClick={() => handleModeChange("video")}
          >
            VÍDEO
          </button>
        </div>
      </div>

      {/* ── Seção 2: Modelo ───────────────────────────────────────────────── */}
      <div style={{ padding: "12px 16px" }}>
        <p
          style={{
            fontSize: "10px",
            textTransform: "uppercase",
            letterSpacing: "2px",
            color: "rgba(245,245,245,0.4)",
            marginBottom: "8px",
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          MODELO
        </p>
        <ModelGrid
          type={mode}
          selected={selectedModel}
          onSelect={setSelectedModel}
          plan="Pro"
        />
      </div>

      {/* ── Seção 3: Prompt ───────────────────────────────────────────────── */}
      <div style={{ padding: "0 16px", marginBottom: "12px" }}>
        <p
          style={{
            fontSize: "10px",
            textTransform: "uppercase",
            letterSpacing: "2px",
            color: "rgba(245,245,245,0.4)",
            marginBottom: "6px",
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          PROMPT
        </p>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={3}
          placeholder="Descreva o que você quer gerar..."
          style={{
            width: "100%",
            resize: "none",
            background: "#111111",
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: "8px",
            padding: "10px",
            color: "#F5F5F5",
            fontSize: "13px",
            outline: "none",
            fontFamily: "'DM Sans', sans-serif",
            boxSizing: "border-box",
            transition: "border-color 0.15s ease, box-shadow 0.15s ease",
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = "#FF4D00"
            e.currentTarget.style.boxShadow = "0 0 0 2px rgba(255,77,0,0.1)"
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"
            e.currentTarget.style.boxShadow = "none"
          }}
        />
      </div>

      {/* ── Seção 4: Upload de referência (apenas vídeo) ──────────────────── */}
      {mode === "video" && (
        <div style={{ padding: "0 16px", marginBottom: "12px" }}>
          <p
            style={{
              fontSize: "10px",
              textTransform: "uppercase",
              letterSpacing: "2px",
              color: "rgba(245,245,245,0.4)",
              marginBottom: "6px",
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            IMAGEM REFERÊNCIA
          </p>
          <div
            style={{
              border: "1px dashed rgba(255,255,255,0.08)",
              borderRadius: "8px",
              padding: "20px",
              textAlign: "center",
              cursor: "pointer",
              transition: "border-color 0.15s ease, background 0.15s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "rgba(255,77,0,0.4)"
              e.currentTarget.style.background = "rgba(255,77,0,0.03)"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"
              e.currentTarget.style.background = "transparent"
            }}
          >
            <Upload
              size={20}
              style={{
                color: "rgba(245,245,245,0.4)",
                marginBottom: "6px",
                display: "block",
                margin: "0 auto 6px",
              }}
            />
            <p
              style={{
                fontSize: "12px",
                color: "rgba(245,245,245,0.4)",
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              Arraste ou clique
            </p>
          </div>
        </div>
      )}

      {/* ── Seção 5: Opções avançadas (apenas vídeo) ─────────────────────── */}
      {mode === "video" && (
        <div style={{ padding: "0 16px", marginBottom: "12px" }}>
          {/* Toggle */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              cursor: "pointer",
              marginBottom: showAdvanced ? "12px" : 0,
            }}
            onClick={() => setShowAdvanced(!showAdvanced)}
          >
            <span
              style={{
                fontSize: "12px",
                color: "rgba(245,245,245,0.4)",
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              Opções avançadas
            </span>
            <ChevronDown
              size={14}
              style={{
                color: "rgba(245,245,245,0.4)",
                transform: showAdvanced ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 0.2s ease",
              }}
            />
          </div>

          {/* Conteúdo colapsável */}
          <AnimatePresence>
            {showAdvanced && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                style={{ overflow: "hidden" }}
              >
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {/* Duração */}
                  <div>
                    <p
                      style={{
                        fontSize: "10px",
                        textTransform: "uppercase",
                        letterSpacing: "2px",
                        color: "rgba(245,245,245,0.4)",
                        marginBottom: "6px",
                        fontFamily: "'DM Sans', sans-serif",
                      }}
                    >
                      Duração
                    </p>
                    <div style={{ display: "flex", gap: "6px" }}>
                      <OptionPill value="5s" current={duration} onSelect={(v) => setDuration(v as "5s" | "10s")} />
                      <OptionPill value="10s" current={duration} onSelect={(v) => setDuration(v as "5s" | "10s")} />
                    </div>
                  </div>

                  {/* Aspecto */}
                  <div>
                    <p
                      style={{
                        fontSize: "10px",
                        textTransform: "uppercase",
                        letterSpacing: "2px",
                        color: "rgba(245,245,245,0.4)",
                        marginBottom: "6px",
                        fontFamily: "'DM Sans', sans-serif",
                      }}
                    >
                      Aspecto
                    </p>
                    <div style={{ display: "flex", gap: "6px" }}>
                      {(["16:9", "9:16", "1:1"] as const).map((a) => (
                        <OptionPill key={a} value={a} current={aspect} onSelect={(v) => setAspect(v as typeof aspect)} />
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* ── Seção 6: Resumo de custo ──────────────────────────────────────── */}
      <div
        style={{
          padding: "12px 16px",
          marginTop: "auto",
          borderTop: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        <div
          style={{
            background: "rgba(255,77,0,0.04)",
            borderLeft: "2px solid #FF4D00",
            borderRadius: "0 8px 8px 0",
            padding: "10px 12px",
          }}
        >
          <p
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "13px",
              fontWeight: 700,
              color: "#FF4D00",
              marginBottom: "2px",
            }}
          >
            Esta geração: {cost} créditos
          </p>
          <p
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "12px",
              color: "rgba(245,245,245,0.4)",
            }}
          >
            Saldo após: {credits - cost} créditos
          </p>
        </div>
      </div>

      {/* ── Seção 7: Botão Gerar ──────────────────────────────────────────── */}
      <div style={{ padding: "16px" }}>
        <button
          disabled={generating || !prompt.trim()}
          onClick={() => onGenerate({ type: mode, model: selectedModel, prompt })}
          style={{
            width: "100%",
            height: "48px",
            background: "#FF4D00",
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontSize: "15px",
            fontWeight: 700,
            letterSpacing: "1px",
            cursor: generating || !prompt.trim() ? "not-allowed" : "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            opacity: generating || !prompt.trim() ? 0.4 : 1,
            transition: "opacity 0.15s ease",
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          {generating ? (
            <>
              <Spinner />
              Gerando...
            </>
          ) : (
            "⚡ GERAR AGORA"
          )}
        </button>
      </div>
    </div>
  )
}
