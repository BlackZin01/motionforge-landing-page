"use client"

import { useState } from "react"
import { ImageIcon, Video, Download } from "lucide-react"

interface GenerationCardProps {
  id: string
  type: "image" | "video"
  model: string
  credits: number
  date: string
  compact?: boolean
  outputUrl?: string
  prompt?: string
}

async function downloadFile(url: string, filename: string) {
  try {
    const proxyUrl = `/api/download?url=${encodeURIComponent(url)}&filename=${encodeURIComponent(filename)}`
    const res = await fetch(proxyUrl)
    const blob = await res.blob()
    const blobUrl = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = blobUrl
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(blobUrl)
  } catch {
    window.open(url, "_blank")
  }
}

export function GenerationCard({
  type, model, credits, date, compact = false, outputUrl, prompt,
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
          display: "flex", alignItems: "center", justifyContent: "center",
          position: "relative", overflow: "hidden",
        }}
      >
        {outputUrl ? (
          type === "video" ? (
            <video
              src={outputUrl}
              muted
              loop
              playsInline
              autoPlay={isHovered}
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            />
          ) : (
            <img
              src={outputUrl}
              alt={prompt ?? model}
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            />
          )
        ) : (
          type === "image"
            ? <ImageIcon size={24} style={{ color: "rgba(255,77,0,0.3)" }} />
            : <Video size={24} style={{ color: "rgba(255,77,0,0.3)" }} />
        )}

        {/* Badge tipo */}
        <div
          style={{
            position: "absolute", top: "6px", left: "6px",
            background: "rgba(0,0,0,0.6)", border: "1px solid rgba(255,255,255,0.1)",
            fontSize: "9px", letterSpacing: "1.5px", textTransform: "uppercase",
            padding: "2px 6px", borderRadius: "4px", color: "rgba(245,245,245,0.7)",
          }}
        >
          {typeLabel}
        </div>

        {/* Hover overlay */}
        <div
          style={{
            position: "absolute", inset: 0,
            background: isHovered ? "rgba(0,0,0,0.65)" : "rgba(0,0,0,0)",
            transition: "background 0.2s ease",
            display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
          }}
        >
          {isHovered && outputUrl && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                const ext = type === "video" ? "mp4" : "png"
                downloadFile(outputUrl, `motionforge-${Date.now()}.${ext}`)
              }}
              style={{
                background: "#FF4D00", border: "none",
                borderRadius: "6px", padding: "5px 10px",
                fontSize: "10px", fontWeight: 700, color: "white",
                cursor: "pointer", display: "flex", alignItems: "center", gap: "4px",
                fontFamily: "'DM Sans',sans-serif",
              }}
            >
              <Download size={11} /> Download
            </button>
          )}
        </div>
      </div>

      {/* Footer */}
      {!compact && (
        <div
          style={{
            background: "rgba(0,0,0,0.3)", padding: "6px 10px",
            display: "flex", justifyContent: "space-between", alignItems: "center",
          }}
        >
          <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "10px", color: "#00E5FF" }}>
            {credits} cr.
          </span>
          <span style={{ fontSize: "10px", color: "rgba(245,245,245,0.4)" }}>
            {date}
          </span>
        </div>
      )}
    </div>
  )
}
