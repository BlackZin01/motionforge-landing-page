"use client"

import { motion } from "framer-motion"
import { Download, RefreshCw, Zap, Sparkles } from "lucide-react"
import { ProgressHUD } from "./progress-hud"

// ─── Tipos ───────────────────────────────────────────────────────────────────

interface OutputAreaProps {
  state: "idle" | "generating" | "done" | "error"
  model: string
  type: "image" | "video"
  prompt: string
  outputUrl: string | null
  creditsUsed: number
  errorMessage?: string | null
  onRegenerate: () => void
}

// ─── Dicas para o idle state ──────────────────────────────────────────────────

const TIPS = [
  { label: "Fique específico",   tip: "Mencione estilo visual, iluminação e câmera." },
  { label: "Use referências",    tip: "Cite estilos como 'estilo Wes Anderson' ou 'neon cyberpunk'." },
  { label: "Descreva movimento", tip: "Para vídeo: diga como os elementos se movem no plano." },
]

// ─── Botão de ação ────────────────────────────────────────────────────────────

function ActionBtn({
  icon, label, onClick, primary,
}: {
  icon: React.ReactNode
  label: string
  onClick?: () => void
  primary?: boolean
}) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "inline-flex", alignItems: "center", gap: "6px",
        padding: "7px 14px", fontSize: "12px", fontWeight: primary ? 700 : 400,
        borderRadius: "7px", cursor: "pointer",
        fontFamily: "'DM Sans',sans-serif",
        transition: "background .15s, border-color .15s",
        ...(primary
          ? { background: "#FF4D00", color: "#fff", border: "1px solid #FF4D00" }
          : { background: "rgba(255,255,255,.04)", color: "rgba(245,245,245,.7)", border: "1px solid rgba(255,255,255,.07)" }),
      }}
      onMouseEnter={(e) => {
        const b = e.currentTarget as HTMLButtonElement
        if (primary) b.style.opacity = "0.88"
        else b.style.background = "rgba(255,255,255,.08)"
      }}
      onMouseLeave={(e) => {
        const b = e.currentTarget as HTMLButtonElement
        b.style.opacity = "1"
        if (!primary) b.style.background = "rgba(255,255,255,.04)"
      }}
    >
      {icon}
      {label}
    </button>
  )
}

// ─── Download helper ──────────────────────────────────────────────────────────

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

// ─── Componente ──────────────────────────────────────────────────────────────

export function OutputArea({ state, model, type, prompt, outputUrl, creditsUsed, errorMessage, onRegenerate }: OutputAreaProps) {

  // ── IDLE ────────────────────────────────────────────────────────────────────

  if (state === "idle") {
    return (
      <div
        style={{
          height: "100%", minHeight: "420px",
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          padding: "40px 24px",
          background: "radial-gradient(ellipse 60% 40% at 50% 50%, rgba(255,77,0,.04) 0%, transparent 70%)",
        }}
      >
        <div
          style={{
            width: 64, height: 64, borderRadius: "16px",
            background: "rgba(255,77,0,.07)", border: "1px solid rgba(255,77,0,.15)",
            display: "flex", alignItems: "center", justifyContent: "center",
            marginBottom: "20px",
          }}
        >
          <Zap size={28} style={{ color: "rgba(255,77,0,.5)" }} />
        </div>
        <h3 style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "15px", fontWeight: 700, color: "#F5F5F5", margin: "0 0 6px", textAlign: "center" }}>
          Pronto para gerar
        </h3>
        <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "13px", color: "rgba(245,245,245,.4)", margin: "0 0 32px", textAlign: "center" }}>
          Configure o modelo e escreva seu prompt ao lado.
        </p>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", justifyContent: "center", maxWidth: "560px" }}>
          {TIPS.map((t) => (
            <div
              key={t.label}
              style={{
                background: "#111111", border: "1px solid rgba(255,255,255,.06)",
                borderRadius: "10px", padding: "12px 14px",
                flex: "1 1 150px", minWidth: "140px", maxWidth: "180px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "6px" }}>
                <Sparkles size={11} style={{ color: "#FF4D00", flexShrink: 0 }} />
                <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "11px", fontWeight: 700, color: "#F5F5F5" }}>
                  {t.label}
                </span>
              </div>
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "11px", color: "rgba(245,245,245,.4)", margin: 0, lineHeight: "1.5" }}>
                {t.tip}
              </p>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // ── GENERATING ──────────────────────────────────────────────────────────────

  if (state === "generating") {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", minHeight: "420px", padding: "24px" }}>
        <ProgressHUD model={model} onComplete={() => {}} />
      </div>
    )
  }

  // ── ERROR ───────────────────────────────────────────────────────────────────

  if (state === "error") {
    return (
      <div
        style={{
          height: "100%", minHeight: "420px",
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center", padding: "40px 24px",
        }}
      >
        <div
          style={{
            width: 64, height: 64, borderRadius: "16px",
            background: "rgba(239,68,68,.08)", border: "1px solid rgba(239,68,68,.2)",
            display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "16px",
          }}
        >
          <span style={{ fontSize: "28px" }}>⚠️</span>
        </div>
        <h3 style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "15px", fontWeight: 700, color: "#F5F5F5", margin: "0 0 8px" }}>
          Geração falhou
        </h3>
        {errorMessage ? (
          <div
            style={{
              background: "rgba(239,68,68,.06)", border: "1px solid rgba(239,68,68,.18)",
              borderRadius: "8px", padding: "10px 16px", marginBottom: "20px",
              maxWidth: "360px",
            }}
          >
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "13px", color: "rgba(239,100,100,.9)", margin: 0, textAlign: "center", lineHeight: "1.5" }}>
              {errorMessage}
            </p>
          </div>
        ) : (
          <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "13px", color: "rgba(245,245,245,.4)", margin: "0 0 20px", textAlign: "center" }}>
            Seus créditos foram estornados automaticamente.
          </p>
        )}
        <ActionBtn icon={<RefreshCw size={13} />} label="Tentar novamente" onClick={onRegenerate} />
      </div>
    )
  }

  // ── DONE ────────────────────────────────────────────────────────────────────

  const ext = type === "video" ? "mp4" : "png"
  const filename = `motionforge-${Date.now()}.${ext}`

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "16px" }}
    >
      {/* Resultado */}
      <div
        style={{
          position: "relative", borderRadius: "14px", overflow: "hidden",
          alignSelf: "center", width: "100%", maxWidth: "640px",
          boxShadow: "0 8px 40px rgba(0,0,0,.5), 0 0 0 1px rgba(255,255,255,.06)",
        }}
      >
        {outputUrl ? (
          type === "video" ? (
            <video
              src={outputUrl}
              controls
              autoPlay
              loop
              playsInline
              style={{ width: "100%", display: "block", borderRadius: "14px" }}
            />
          ) : (
            <img
              src={outputUrl}
              alt={prompt}
              style={{ width: "100%", display: "block", borderRadius: "14px" }}
            />
          )
        ) : (
          /* Fallback se outputUrl vier null mas status=done */
          <div
            style={{
              background: "#1A1A1A", minHeight: "300px",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            <p style={{ fontFamily: "'DM Sans',sans-serif", color: "rgba(245,245,245,.4)", fontSize: "13px" }}>
              Processando...
            </p>
          </div>
        )}

        {/* Badge de sucesso */}
        <div
          style={{
            position: "absolute", top: 12, right: 12,
            background: "rgba(74,222,128,.12)", border: "1px solid rgba(74,222,128,.25)",
            borderRadius: "6px", padding: "3px 9px",
            display: "flex", alignItems: "center", gap: "5px",
          }}
        >
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#4ADE80" }} />
          <span style={{ fontSize: "10px", fontWeight: 700, color: "#4ADE80", fontFamily: "'DM Sans',sans-serif", letterSpacing: "1px", textTransform: "uppercase" }}>
            Concluído
          </span>
        </div>
      </div>

      {/* Ações */}
      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" }}>
        {outputUrl && (
          <ActionBtn
            icon={<Download size={13} />}
            label="Download"
            primary
            onClick={() => downloadFile(outputUrl, filename)}
          />
        )}
        <ActionBtn icon={<RefreshCw size={13} />} label="Regenerar" onClick={onRegenerate} />
      </div>

      {/* Metadados */}
      {(model || creditsUsed > 0) && (
        <p style={{ fontSize: "11px", color: "rgba(245,245,245,.35)", fontFamily: "'Space Grotesk',sans-serif", margin: 0 }}>
          {model}{creditsUsed > 0 ? ` · ${creditsUsed} cr` : ""} · agora
        </p>
      )}

      {/* Prompt usado */}
      {prompt && (
        <div
          style={{
            background: "#111111", border: "1px solid rgba(255,255,255,.05)",
            borderRadius: "8px", padding: "10px 14px",
          }}
        >
          <p style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "2px", color: "rgba(245,245,245,.3)", fontFamily: "'DM Sans',sans-serif", fontWeight: 700, margin: "0 0 4px" }}>
            Prompt
          </p>
          <p style={{ fontSize: "12px", color: "rgba(245,245,245,.55)", fontFamily: "'DM Sans',sans-serif", margin: 0, lineHeight: "1.5" }}>
            {prompt}
          </p>
        </div>
      )}
    </motion.div>
  )
}
