"use client"

import { motion } from "framer-motion"
import { Download, RefreshCw, Save, Plus, Video, Image, Zap } from "lucide-react"
import { ProgressHUD } from "./progress-hud"
import { GenerationCard } from "@/components/dashboard/shared/generation-card"

// ─── Tipos ───────────────────────────────────────────────────────────────────

interface OutputAreaProps {
  state: "idle" | "generating" | "done"
  model: string
  type: "image" | "video"
  onRegenerate: () => void
}

// ─── Mock do histórico da sessão ──────────────────────────────────────────────
// TODO: integrar API — manter histórico real da sessão no estado global

const SESSION_HISTORY = [
  { id: "s1", type: "video" as const, model: "Wan 2.7", credits: 20, date: "agora" },
  { id: "s2", type: "image" as const, model: "FLUX 2 Dev", credits: 3, date: "agora" },
  { id: "s3", type: "video" as const, model: "Seedance 2.0", credits: 35, date: "agora" },
  { id: "s4", type: "image" as const, model: "Ideogram v3", credits: 3, date: "agora" },
]

// ─── Estilo dos botões de ação ────────────────────────────────────────────────

const btnStyle: React.CSSProperties = {
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.06)",
  borderRadius: "6px",
  padding: "6px 12px",
  fontSize: "12px",
  color: "rgba(245,245,245,0.7)",
  cursor: "pointer",
  display: "inline-flex",
  alignItems: "center",
  gap: "6px",
}

// ─── Componente ──────────────────────────────────────────────────────────────

export function OutputArea({ state, model, type, onRegenerate }: OutputAreaProps) {
  // ── IDLE ──────────────────────────────────────────────────────────────────

  if (state === "idle") {
    return (
      <div
        style={{
          position: "relative",
          height: "100%",
          minHeight: "400px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "radial-gradient(circle at 50% 50%, rgba(255,77,0,0.03), transparent)",
          backgroundImage: "radial-gradient(rgba(255,255,255,0.02) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      >
        <Zap size={48} style={{ color: "rgba(255,77,0,0.3)", marginBottom: "16px" }} />
        <p
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "14px",
            color: "rgba(245,245,245,0.4)",
            textAlign: "center",
          }}
        >
          Configure e clique em Gerar.
        </p>
      </div>
    )
  }

  // ── GENERATING ────────────────────────────────────────────────────────────

  if (state === "generating") {
    return (
      <div
        style={{
          padding: "24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          minHeight: "400px",
        }}
      >
        {/* onComplete é passado via onRegenerate apenas para fechar o estado — a lógica real está no page */}
        <ProgressHUD model={model} onComplete={() => {}} />
      </div>
    )
  }

  // ── DONE ─────────────────────────────────────────────────────────────────

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      style={{
        padding: "24px",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
      }}
    >
      {/* Resultado gerado (placeholder visual) */}
      <div
        style={{
          position: "relative",
          borderRadius: "12px",
          overflow: "hidden",
          alignSelf: "center",
          width: "100%",
          maxWidth: "640px",
          boxShadow: "0 8px 32px rgba(255,77,0,0.15)",
        }}
      >
        <div
          style={{
            background: "linear-gradient(135deg, #1A1A1A 0%, #111111 50%, #0D0D0D 100%)",
            minHeight: "280px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "12px",
          }}
        >
          {type === "video" ? (
            <Video size={64} style={{ color: "rgba(255,77,0,0.4)" }} />
          ) : (
            <Image size={64} style={{ color: "rgba(255,77,0,0.4)" }} />
          )}
        </div>
      </div>

      {/* Barra de ações */}
      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
        <button style={btnStyle}>
          <Download size={14} />
          Download
        </button>
        <button
          style={btnStyle}
          onClick={onRegenerate}
          onMouseEnter={(e) => {
            ;(e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.08)"
          }}
          onMouseLeave={(e) => {
            ;(e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.04)"
          }}
        >
          <RefreshCw size={14} />
          Regenerar
        </button>
        <button style={btnStyle}>
          <Save size={14} />
          Salvar
        </button>
        <button style={btnStyle}>
          <Plus size={14} />
          Workflow
        </button>
      </div>

      {/* Metadados */}
      <p
        style={{
          fontSize: "11px",
          color: "rgba(245,245,245,0.4)",
        }}
      >
        {model} · 35 créditos · agora
      </p>

      {/* Histórico da sessão */}
      <div>
        <p
          style={{
            fontSize: "10px",
            textTransform: "uppercase",
            letterSpacing: "2px",
            color: "rgba(245,245,245,0.4)",
            marginBottom: "8px",
          }}
        >
          DESTA SESSÃO
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "6px",
          }}
        >
          {SESSION_HISTORY.map((item) => (
            <GenerationCard
              key={item.id}
              id={item.id}
              type={item.type}
              model={item.model}
              credits={item.credits}
              date={item.date}
              compact
            />
          ))}
        </div>
      </div>
    </motion.div>
  )
}
