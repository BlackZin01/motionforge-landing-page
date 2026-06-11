"use client"

import { X } from "lucide-react"

// ─── Tipos ───────────────────────────────────────────────────────────────────

interface NodeCardProps {
  step: number
  model: string
  cost: number
  onRemove: () => void
  onChangeModel: (m: string) => void
}

// ─── Modelos disponíveis ──────────────────────────────────────────────────────

const VIDEO_MODELS = [
  { value: "Seedance Fast", label: "Seedance Fast" },
  { value: "Seedance 2.0", label: "Seedance 2.0" },
  { value: "Wan 2.7", label: "Wan 2.7" },
  { value: "Kling Std", label: "Kling Std" },
  { value: "Kling Pro", label: "Kling Pro" },
  { value: "Kling O1", label: "Kling O1" },
  { value: "Hailuo 2.3", label: "Hailuo 2.3" },
  { value: "Veo 3.1 Lite", label: "Veo 3.1 Lite" },
]

// ─── Componente ──────────────────────────────────────────────────────────────

export function NodeCard({ step, model, cost, onRemove, onChangeModel }: NodeCardProps) {
  return (
    <div
      style={{
        background: "#111111",
        border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: "8px",
        padding: "12px",
        width: "140px",
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        flexShrink: 0,
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {/* Badge número do step */}
        <span
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: "11px",
            fontWeight: 700,
            color: "rgba(245,245,245,0.4)",
          }}
        >
          0{step}
        </span>

        {/* Botão remover */}
        <button
          onClick={onRemove}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "2px",
            display: "flex",
            alignItems: "center",
            color: "rgba(245,245,245,0.4)",
            transition: "color 0.15s ease",
          }}
          onMouseEnter={(e) => {
            ;(e.currentTarget as HTMLButtonElement).style.color = "#F5F5F5"
          }}
          onMouseLeave={(e) => {
            ;(e.currentTarget as HTMLButtonElement).style.color = "rgba(245,245,245,0.4)"
          }}
          aria-label="Remover step"
        >
          <X size={16} />
        </button>
      </div>

      {/* Select de modelo */}
      <select
        value={model}
        onChange={(e) => onChangeModel(e.target.value)}
        style={{
          width: "100%",
          background: "#0D0D0D",
          border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: "6px",
          padding: "6px 8px",
          fontSize: "11px",
          color: "#F5F5F5",
          outline: "none",
          cursor: "pointer",
        }}
      >
        {VIDEO_MODELS.map((m) => (
          <option key={m.value} value={m.value}>
            {m.label}
          </option>
        ))}
      </select>

      {/* Footer — badge de custo */}
      <div style={{ display: "flex", justifyContent: "center" }}>
        <span
          style={{
            background: "rgba(0,229,255,0.08)",
            border: "1px solid rgba(0,229,255,0.15)",
            borderRadius: "9999px",
            fontSize: "10px",
            color: "#00E5FF",
            padding: "2px 8px",
            fontFamily: "'Space Grotesk', sans-serif",
          }}
        >
          {cost} cr.
        </span>
      </div>
    </div>
  )
}

export default NodeCard
