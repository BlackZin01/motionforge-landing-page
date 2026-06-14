"use client"

import { Lock } from "lucide-react"

// ─── Tipos ───────────────────────────────────────────────────────────────────

type Plan = "Starter" | "Pro" | "Agency"
type Tag = "FAST" | "STD" | "PRO" | "MAX"

interface ImageModel {
  id: string
  name: string
  cost: number
  tag: Tag
  minPlan: Plan
  badge?: string
}

interface VideoModel {
  id: string
  name: string
  cost: number
  duration: string
  tag: Tag
  minPlan: Plan
  badge?: string
}

interface ModelGridProps {
  type: "image" | "video"
  selected: string
  onSelect: (id: string) => void
  plan: Plan
}

// ─── Modelos disponíveis ──────────────────────────────────────────────────────

const IMAGE_MODELS: ImageModel[] = [
  { id: "nano-banana-2", name: "Nano Banana 2", cost: 2, tag: "FAST", minPlan: "Starter" },
  { id: "gpt-image-2", name: "GPT Image 2", cost: 10, tag: "STD", minPlan: "Starter" },
  { id: "flux-2-dev", name: "FLUX 2 Dev", cost: 3, tag: "STD", minPlan: "Starter" },
  { id: "flux-2-pro", name: "FLUX 2 Pro", cost: 5, tag: "PRO", minPlan: "Pro", badge: "Pro" },
  { id: "nano-banana-pro", name: "Nano Banana Pro", cost: 8, tag: "PRO", minPlan: "Pro", badge: "Pro" },
  { id: "ideogram-v3", name: "Ideogram v3", cost: 3, tag: "STD", minPlan: "Starter" },
  { id: "imagen-4-fast", name: "Imagen 4 Fast", cost: 2, tag: "FAST", minPlan: "Agency", badge: "Agency" },
]

const VIDEO_MODELS: VideoModel[] = [
  { id: "seedance-fast", name: "Seedance Fast", cost: 25, duration: "5s", tag: "FAST", minPlan: "Starter" },
  { id: "seedance-20", name: "Seedance 2.0", cost: 35, duration: "5s", tag: "STD", minPlan: "Starter" },
  { id: "wan-27", name: "Wan 2.7", cost: 20, duration: "5s", tag: "FAST", minPlan: "Starter" },
  { id: "kling-std", name: "Kling Std", cost: 45, duration: "5s", tag: "PRO", minPlan: "Pro", badge: "Pro" },
  { id: "kling-pro", name: "Kling Pro", cost: 90, duration: "10s", tag: "PRO", minPlan: "Agency", badge: "Agency" },
  { id: "kling-o1", name: "Kling O1", cost: 120, duration: "10s", tag: "MAX", minPlan: "Agency", badge: "Agency" },
  { id: "hailuo-23", name: "Hailuo 2.3", cost: 40, duration: "5s", tag: "STD", minPlan: "Pro", badge: "Pro" },
  { id: "veo-31-lite", name: "Veo 3.1 Lite", cost: 60, duration: "5s", tag: "PRO", minPlan: "Agency", badge: "Agency" },
]

// ─── Hierarquia de planos ─────────────────────────────────────────────────────

const PLAN_ORDER: Record<Plan, number> = {
  Starter: 0,
  Pro: 1,
  Agency: 2,
}

// ─── Cores das tags ───────────────────────────────────────────────────────────

const TAG_STYLES: Record<Tag, { bg: string; color: string }> = {
  FAST: { bg: "rgba(74,222,128,0.1)", color: "rgb(74,222,128)" },
  STD:  { bg: "rgba(0,229,255,0.1)",  color: "#00E5FF" },
  PRO:  { bg: "rgba(255,77,0,0.1)",   color: "#FF4D00" },
  MAX:  { bg: "rgba(168,85,247,0.1)", color: "rgb(168,85,247)" },
}

// ─── Cores dos badges de plano ────────────────────────────────────────────────

const BADGE_STYLES: Record<string, { bg: string; color: string }> = {
  Pro:    { bg: "rgba(0,229,255,0.08)", color: "#00E5FF" },
  Agency: { bg: "rgba(74,222,128,0.1)", color: "rgb(74,222,128)" },
}

// ─── Componente ──────────────────────────────────────────────────────────────

export function ModelGrid({ type, selected, onSelect, plan }: ModelGridProps) {
  const models = type === "image" ? IMAGE_MODELS : VIDEO_MODELS

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "6px",
      }}
    >
      {models.map((model) => {
        const isLocked = PLAN_ORDER[model.minPlan] > PLAN_ORDER[plan]
        const isSelected = selected === model.id
        const tagStyle = TAG_STYLES[model.tag]
        const badgeStyle = model.badge ? BADGE_STYLES[model.badge] : null

        return (
          <div
            key={model.id}
            onClick={() => !isLocked && onSelect(model.id)}
            style={{
              background: isSelected ? "rgba(255,77,0,0.08)" : "#111111",
              border: isSelected
                ? "1.5px solid #FF4D00"
                : "1px solid rgba(255,255,255,0.06)",
              borderRadius: "8px",
              padding: "10px",
              cursor: isLocked ? "not-allowed" : "pointer",
              position: "relative",
              opacity: isLocked ? 0.4 : 1,
              transition: "border-color 0.15s ease, background 0.15s ease",
            }}
            onMouseEnter={(e) => {
              if (!isLocked && !isSelected) {
                ;(e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,77,0,0.3)"
              }
            }}
            onMouseLeave={(e) => {
              if (!isLocked && !isSelected) {
                ;(e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,255,255,0.06)"
              }
            }}
          >
            {/* Nome + duração (vídeo) */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                marginBottom: "6px",
              }}
            >
              <span
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "12px",
                  fontWeight: 700,
                  color: "#F5F5F5",
                }}
              >
                {model.name}
              </span>
              {"duration" in model && (
                <span
                  style={{
                    fontSize: "9px",
                    color: "rgba(245,245,245,0.4)",
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.06)",
                    borderRadius: "4px",
                    padding: "1px 4px",
                  }}
                >
                  {(model as VideoModel).duration}
                </span>
              )}
            </div>

            {/* Tags e custo */}
            <div style={{ display: "flex", alignItems: "center", gap: "4px", flexWrap: "wrap" }}>
              {/* Tag */}
              <span
                style={{
                  fontSize: "9px",
                  background: tagStyle.bg,
                  color: tagStyle.color,
                  padding: "2px 5px",
                  borderRadius: "4px",
                  fontWeight: 700,
                  letterSpacing: "0.5px",
                }}
              >
                {model.tag}
              </span>

              {/* Custo */}
              <span
                style={{
                  fontSize: "10px",
                  background: "rgba(0,229,255,0.08)",
                  border: "1px solid rgba(0,229,255,0.15)",
                  color: "#00E5FF",
                  padding: "2px 5px",
                  borderRadius: "4px",
                }}
              >
                {model.cost} cr.
              </span>

              {/* Badge Pro / Agency */}
              {badgeStyle && model.badge && (
                <span
                  style={{
                    fontSize: "9px",
                    background: badgeStyle.bg,
                    color: badgeStyle.color,
                    padding: "2px 5px",
                    borderRadius: "4px",
                    fontWeight: 700,
                  }}
                >
                  {model.badge}
                </span>
              )}
            </div>

            {/* Ícone de cadeado se bloqueado */}
            {isLocked && (
              <div
                style={{
                  position: "absolute",
                  top: "8px",
                  right: "8px",
                }}
              >
                <Lock size={12} style={{ color: "rgba(245,245,245,0.5)" }} />
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

// ─── Exportar arrays para uso externo ────────────────────────────────────────

export { IMAGE_MODELS, VIDEO_MODELS }
export type { ImageModel, VideoModel, Plan }
