"use client"

import { useState } from "react"
import { ImageIcon, Video } from "lucide-react"

// ─── Tipos ───────────────────────────────────────────────────────────────────

interface GenerationCardProps {
  id: string
  type: "image" | "video"
  model: string
  credits: number
  date: string
  compact?: boolean
}

// ─── Componente ──────────────────────────────────────────────────────────────

export function GenerationCard({
  type,
  model,
  credits,
  date,
  compact = false,
}: GenerationCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  const typeLabel = type === "image" ? "IMAGEM" : "VÍDEO"

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        background: "#111111",
        border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: "10px",
        overflow: "hidden",
        position: "relative",
        cursor: "pointer",
      }}
    >
      {/* Thumbnail */}
      <div
        style={{
          aspectRatio: "16/9",
          background: "linear-gradient(135deg, #1A1A1A, #0D0D0D)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
        {type === "image" ? (
          <ImageIcon size={24} style={{ color: "rgba(255,77,0,0.3)" }} />
        ) : (
          <Video size={24} style={{ color: "rgba(255,77,0,0.3)" }} />
        )}

        {/* Badge tipo — superior esquerdo */}
        <div
          style={{
            position: "absolute",
            top: "6px",
            left: "6px",
            background: "rgba(0,0,0,0.6)",
            border: "1px solid rgba(255,255,255,0.1)",
            fontSize: "9px",
            letterSpacing: "1.5px",
            textTransform: "uppercase",
            padding: "2px 6px",
            borderRadius: "4px",
            color: "rgba(245,245,245,0.7)",
          }}
        >
          {typeLabel}
        </div>

        {/* Badge modelo — superior direito */}
        <div
          style={{
            position: "absolute",
            top: "6px",
            right: "6px",
            background: "rgba(255,77,0,0.08)",
            border: "1px solid rgba(255,77,0,0.2)",
            fontSize: "9px",
            color: "#FF4D00",
            padding: "2px 6px",
            borderRadius: "4px",
          }}
        >
          {model}
        </div>

        {/* Hover overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: isHovered ? "rgba(0,0,0,0.7)" : "rgba(0,0,0,0)",
            transition: "background 0.2s ease",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "6px",
          }}
        >
          {isHovered && (
            <>
              <button
                style={{
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "6px",
                  padding: "4px 8px",
                  fontSize: "10px",
                  color: "white",
                  cursor: "pointer",
                }}
              >
                ⬇ Download
              </button>
              <button
                style={{
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "6px",
                  padding: "4px 8px",
                  fontSize: "10px",
                  color: "white",
                  cursor: "pointer",
                }}
              >
                🔁 Regen
              </button>
              <button
                style={{
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "6px",
                  padding: "4px 8px",
                  fontSize: "10px",
                  color: "white",
                  cursor: "pointer",
                }}
              >
                🗑 Deletar
              </button>
            </>
          )}
        </div>
      </div>

      {/* Footer (não compact) */}
      {!compact && (
        <div
          style={{
            background: "rgba(0,0,0,0.3)",
            padding: "6px 10px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "10px",
              color: "#00E5FF",
            }}
          >
            {credits} cr.
          </span>
          <span
            style={{
              fontSize: "10px",
              color: "rgba(245,245,245,0.4)",
            }}
          >
            {date}
          </span>
        </div>
      )}
    </div>
  )
}
