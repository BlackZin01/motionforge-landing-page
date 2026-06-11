"use client"

import { useState } from "react"
import { Camera, Save, AlertTriangle } from "lucide-react"

// ─── Tipos ───────────────────────────────────────────────────────────────────

type ActiveTab = "perfil" | "preferencias" | "seguranca"

// ─── Modelos disponíveis ──────────────────────────────────────────────────────

const IMAGE_MODELS = [
  { value: "nano-banana-2", label: "Nano Banana Pro" },
  { value: "flux-2-dev", label: "FLUX 2 Dev" },
  { value: "ideogram-v3", label: "Ideogram v3" },
  { value: "recraft-v3", label: "Recraft v3" },
  { value: "stable-diffusion-xl", label: "Stable Diffusion XL" },
]

const VIDEO_MODELS = [
  { value: "seedance-20", label: "Seedance 2.0" },
  { value: "seedance-fast", label: "Seedance Fast" },
  { value: "kling-std", label: "Kling Std" },
  { value: "kling-pro", label: "Kling Pro" },
  { value: "wan-27", label: "Wan 2.7" },
  { value: "hailuo-23", label: "Hailuo 2.3" },
  { value: "veo-31-lite", label: "Veo 3.1 Lite" },
]

const ASPECT_OPTIONS = ["16:9", "9:16", "1:1"]

// ─── Componente ──────────────────────────────────────────────────────────────

export default function ConfiguracoesPage() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("perfil")

  // ─── Estado — Perfil ──────────────────────────────────────────────────────
  const [name, setName] = useState("Matheus Victor")
  const [email] = useState("matheus@motionforge.com.br")

  // ─── Estado — Preferências ────────────────────────────────────────────────
  const [defaultImageModel, setDefaultImageModel] = useState("nano-banana-2")
  const [defaultVideoModel, setDefaultVideoModel] = useState("seedance-20")
  const [defaultAspect, setDefaultAspect] = useState("16:9")
  const [autoSave, setAutoSave] = useState(true)

  // ─── Estado — Segurança ───────────────────────────────────────────────────
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  // ─── Estado — Feedback de salvo ──────────────────────────────────────────
  const [saved, setSaved] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  // ─── Handler salvar ──────────────────────────────────────────────────────
  // TODO: integrar API de atualização de perfil/preferências

  function handleSave() {
    setSubmitting(true)
    setTimeout(() => {
      setSubmitting(false)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    }, 1000)
  }

  // ─── Estilos compartilhados ───────────────────────────────────────────────

  const inputStyle: React.CSSProperties = {
    background: "#0D0D0D",
    border: "1px solid rgba(255,255,255,0.06)",
    borderRadius: "8px",
    padding: "10px 12px",
    color: "#F5F5F5",
    fontSize: "14px",
    outline: "none",
    width: "100%",
    boxSizing: "border-box",
    fontFamily: "'DM Sans', sans-serif",
  }

  const labelStyle: React.CSSProperties = {
    fontSize: "12px",
    color: "rgba(245,245,245,0.4)",
    fontFamily: "'DM Sans', sans-serif",
    fontWeight: 700,
    marginBottom: "6px",
    display: "block",
    textTransform: "uppercase",
    letterSpacing: "1px",
  }

  const cardStyle: React.CSSProperties = {
    background: "#111111",
    border: "1px solid rgba(255,255,255,0.06)",
    borderRadius: "12px",
    padding: "24px",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  }

  // ─── Render ──────────────────────────────────────────────────────────────

  return (
    <div
      style={{
        padding: "24px",
        maxWidth: "600px",
        margin: "0 auto",
      }}
    >
      {/* Título */}
      <h1
        style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: "22px",
          fontWeight: 700,
          color: "#F5F5F5",
          marginBottom: "20px",
        }}
      >
        Configurações
      </h1>

      {/* Tabs */}
      <div
        style={{
          display: "flex",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
          marginBottom: "24px",
          gap: 0,
        }}
      >
        {(["perfil", "preferencias", "seguranca"] as ActiveTab[]).map((tab) => {
          const labels: Record<ActiveTab, string> = {
            perfil: "Perfil",
            preferencias: "Preferências",
            seguranca: "Segurança",
          }
          const isActive = activeTab === tab
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                background: "none",
                border: "none",
                borderBottom: `2px solid ${isActive ? "#FF4D00" : "transparent"}`,
                color: isActive ? "#F5F5F5" : "rgba(245,245,245,0.4)",
                padding: "10px 16px",
                fontSize: "13px",
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: isActive ? 700 : 400,
                cursor: "pointer",
                transition: "color 0.15s ease, border-color 0.15s ease",
                marginBottom: "-1px",
              }}
            >
              {labels[tab]}
            </button>
          )
        })}
      </div>

      {/* ─── ABA PERFIL ───────────────────────────────────────────────────────── */}
      {activeTab === "perfil" && (
        <div style={cardStyle}>
          {/* Avatar + upload */}
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            {/* Avatar placeholder */}
            <div
              style={{
                width: "64px",
                height: "64px",
                borderRadius: "50%",
                background: "rgba(255,77,0,0.1)",
                border: "1px solid rgba(255,77,0,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <span
                style={{
                  fontSize: "26px",
                  fontWeight: 700,
                  color: "#FF4D00",
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                M
              </span>
            </div>

            {/* Botão trocar foto */}
            {/* TODO: upload para Supabase Storage */}
            <button
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "rgba(245,245,245,0.4)",
                fontSize: "12px",
                fontFamily: "'DM Sans', sans-serif",
                display: "flex",
                alignItems: "center",
                gap: "4px",
                transition: "color 0.15s ease",
              }}
              onMouseEnter={(e) => {
                ;(e.currentTarget as HTMLButtonElement).style.color = "#F5F5F5"
              }}
              onMouseLeave={(e) => {
                ;(e.currentTarget as HTMLButtonElement).style.color =
                  "rgba(245,245,245,0.4)"
              }}
            >
              <Camera size={12} />
              Trocar foto
            </button>
          </div>

          {/* Campo nome */}
          <div>
            <label style={labelStyle}>Nome</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={inputStyle}
            />
          </div>

          {/* Campo email (readonly) */}
          <div>
            <label style={labelStyle}>E-mail</label>
            <input
              type="email"
              value={email}
              readOnly
              disabled
              style={{ ...inputStyle, opacity: 0.5, cursor: "not-allowed" }}
            />
          </div>

          {/* Plano */}
          <div>
            <label style={labelStyle}>Plano</label>
            <span
              style={{
                background: "rgba(0,229,255,0.08)",
                border: "1px solid rgba(0,229,255,0.2)",
                color: "#00E5FF",
                fontSize: "12px",
                fontWeight: 700,
                padding: "4px 12px",
                borderRadius: "9999px",
                fontFamily: "'DM Sans', sans-serif",
                letterSpacing: "1px",
                display: "inline-block",
              }}
            >
              Pro
            </span>
          </div>

          {/* Botão salvar */}
          <button
            onClick={handleSave}
            disabled={submitting}
            style={{
              background: saved ? "#4ADE80" : "#FF4D00",
              color: "white",
              border: "none",
              borderRadius: "8px",
              padding: "10px 20px",
              fontWeight: 700,
              fontSize: "13px",
              fontFamily: "'DM Sans', sans-serif",
              cursor: submitting ? "wait" : "pointer",
              transition: "background 0.3s ease, opacity 0.2s ease",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              alignSelf: "flex-start",
            }}
          >
            <Save size={14} />
            {saved ? "Salvo!" : submitting ? "Salvando..." : "Salvar alterações"}
          </button>
        </div>
      )}

      {/* ─── ABA PREFERÊNCIAS ─────────────────────────────────────────────────── */}
      {activeTab === "preferencias" && (
        <div style={{ ...cardStyle, gap: "20px" }}>
          {/* Modelo padrão de imagem */}
          <div>
            <label style={labelStyle}>Modelo padrão — Imagem</label>
            <select
              value={defaultImageModel}
              onChange={(e) => setDefaultImageModel(e.target.value)}
              style={{ ...inputStyle, cursor: "pointer" }}
            >
              {IMAGE_MODELS.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
          </div>

          {/* Modelo padrão de vídeo */}
          <div>
            <label style={labelStyle}>Modelo padrão — Vídeo</label>
            <select
              value={defaultVideoModel}
              onChange={(e) => setDefaultVideoModel(e.target.value)}
              style={{ ...inputStyle, cursor: "pointer" }}
            >
              {VIDEO_MODELS.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
          </div>

          {/* Aspecto padrão */}
          <div>
            <label style={labelStyle}>Aspecto padrão</label>
            <div style={{ display: "flex", gap: "8px" }}>
              {ASPECT_OPTIONS.map((aspect) => {
                const isActive = defaultAspect === aspect
                return (
                  <button
                    key={aspect}
                    onClick={() => setDefaultAspect(aspect)}
                    style={{
                      background: isActive ? "rgba(255,77,0,0.1)" : "rgba(255,255,255,0.04)",
                      border: `1px solid ${isActive ? "rgba(255,77,0,0.4)" : "rgba(255,255,255,0.06)"}`,
                      borderRadius: "8px",
                      padding: "8px 16px",
                      color: isActive ? "#FF4D00" : "rgba(245,245,245,0.4)",
                      fontSize: "13px",
                      fontWeight: 700,
                      fontFamily: "'Space Grotesk', sans-serif",
                      cursor: "pointer",
                      transition: "all 0.15s ease",
                    }}
                  >
                    {aspect}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Toggle auto-save */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span
              style={{
                fontSize: "13px",
                color: "#F5F5F5",
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              Salvar automaticamente as gerações
            </span>

            {/* Toggle switch */}
            <div
              onClick={() => setAutoSave((prev) => !prev)}
              style={{
                position: "relative",
                width: "40px",
                height: "22px",
                borderRadius: "11px",
                background: autoSave ? "#FF4D00" : "rgba(255,255,255,0.1)",
                cursor: "pointer",
                transition: "background 0.25s ease",
                flexShrink: 0,
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: "3px",
                  left: autoSave ? "20px" : "3px",
                  width: "16px",
                  height: "16px",
                  background: "white",
                  borderRadius: "50%",
                  transition: "left 0.25s ease",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.3)",
                }}
              />
            </div>
          </div>

          {/* Botão salvar preferências */}
          {/* TODO: integrar API de atualização de preferências */}
          <button
            onClick={handleSave}
            disabled={submitting}
            style={{
              background: saved ? "#4ADE80" : "#FF4D00",
              color: "white",
              border: "none",
              borderRadius: "8px",
              padding: "10px 20px",
              fontWeight: 700,
              fontSize: "13px",
              fontFamily: "'DM Sans', sans-serif",
              cursor: submitting ? "wait" : "pointer",
              transition: "background 0.3s ease",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              alignSelf: "flex-start",
            }}
          >
            <Save size={14} />
            {saved ? "Salvo!" : submitting ? "Salvando..." : "Salvar preferências"}
          </button>
        </div>
      )}

      {/* ─── ABA SEGURANÇA ────────────────────────────────────────────────────── */}
      {activeTab === "seguranca" && (
        <div style={cardStyle}>
          {/* Form alterar senha */}
          <div>
            <label style={labelStyle}>Senha atual</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              style={inputStyle}
              placeholder="••••••••"
            />
          </div>

          <div>
            <label style={labelStyle}>Nova senha</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              style={inputStyle}
              placeholder="••••••••"
            />
          </div>

          <div>
            <label style={labelStyle}>Confirmar nova senha</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              style={inputStyle}
              placeholder="••••••••"
            />
          </div>

          {/* Botão alterar senha */}
          {/* TODO: integrar API de alteração de senha */}
          <button
            style={{
              background: "#FF4D00",
              color: "white",
              border: "none",
              borderRadius: "8px",
              padding: "10px 20px",
              fontWeight: 700,
              fontSize: "13px",
              fontFamily: "'DM Sans', sans-serif",
              cursor: "pointer",
              alignSelf: "flex-start",
              transition: "opacity 0.2s ease",
            }}
            onMouseEnter={(e) => {
              ;(e.currentTarget as HTMLButtonElement).style.opacity = "0.88"
            }}
            onMouseLeave={(e) => {
              ;(e.currentTarget as HTMLButtonElement).style.opacity = "1"
            }}
          >
            Alterar senha
          </button>

          {/* Zona de perigo */}
          <div
            style={{
              marginTop: "16px",
              padding: "20px",
              border: "1px solid rgba(239,68,68,0.2)",
              borderRadius: "8px",
              background: "rgba(239,68,68,0.03)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <AlertTriangle size={16} style={{ color: "#ef4444" }} />
              <span
                style={{
                  fontSize: "13px",
                  fontWeight: 700,
                  color: "#ef4444",
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                Zona de perigo
              </span>
            </div>

            <p
              style={{
                fontSize: "12px",
                color: "rgba(245,245,245,0.4)",
                marginTop: "8px",
                fontFamily: "'DM Sans', sans-serif",
                lineHeight: 1.5,
              }}
            >
              Deletar sua conta remove permanentemente todos os seus dados.
            </p>

            {/* Botão deletar conta */}
            {/* TODO: confirmar com modal antes de deletar — integrar API */}
            <button
              onClick={() => {
                // TODO: confirmar com modal antes de deletar
              }}
              style={{
                marginTop: "12px",
                background: "transparent",
                border: "1px solid rgba(239,68,68,0.3)",
                color: "#F87171",
                borderRadius: "6px",
                padding: "8px 16px",
                fontSize: "12px",
                cursor: "pointer",
                fontFamily: "'DM Sans', sans-serif",
                transition: "border-color 0.15s ease, background 0.15s ease",
              }}
              onMouseEnter={(e) => {
                const btn = e.currentTarget as HTMLButtonElement
                btn.style.borderColor = "rgba(239,68,68,0.6)"
                btn.style.background = "rgba(239,68,68,0.06)"
              }}
              onMouseLeave={(e) => {
                const btn = e.currentTarget as HTMLButtonElement
                btn.style.borderColor = "rgba(239,68,68,0.3)"
                btn.style.background = "transparent"
              }}
            >
              Deletar conta
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
