"use client"

import { useState } from "react"
import { Camera, Save, AlertTriangle } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { useToast } from "@/components/dashboard/shared/toast"

type ActiveTab = "perfil" | "seguranca"

export default function ConfiguracoesPage() {
  const { user, refreshUser } = useAuth()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState<ActiveTab>("perfil")

  // Perfil
  const [name, setName] = useState(user?.name ?? "")
  const email = user?.email ?? ""
  const plan  = user?.plan  ?? "Starter"
  const isAdmin = user?.isAdmin ?? false
  const [savingProfile, setSavingProfile] = useState(false)

  // Segurança
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [savingPassword, setSavingPassword] = useState(false)

  // ─── Salvar perfil ────────────────────────────────────────────────────────
  async function handleSaveProfile() {
    if (!name.trim() || name.trim().length < 2) {
      toast({ message: "Nome deve ter pelo menos 2 caracteres.", type: "error" })
      return
    }
    setSavingProfile(true)
    try {
      const token = localStorage.getItem("mf_token") ?? ""
      const res = await fetch("/api/auth/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name: name.trim() }),
      })
      const data = await res.json()
      if (!res.ok) {
        toast({ message: data.error ?? "Erro ao salvar.", type: "error" })
        return
      }
      await refreshUser()
      toast({ message: "Perfil atualizado com sucesso.", type: "success" })
    } catch {
      toast({ message: "Erro de conexão. Tente novamente.", type: "error" })
    } finally {
      setSavingProfile(false)
    }
  }

  // ─── Alterar senha ────────────────────────────────────────────────────────
  async function handleChangePassword() {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast({ message: "Preencha todos os campos.", type: "error" })
      return
    }
    if (newPassword !== confirmPassword) {
      toast({ message: "As senhas não coincidem.", type: "error" })
      return
    }
    if (newPassword.length < 8) {
      toast({ message: "Nova senha deve ter pelo menos 8 caracteres.", type: "error" })
      return
    }
    setSavingPassword(true)
    try {
      const token = localStorage.getItem("mf_token") ?? ""
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ currentPassword, newPassword }),
      })
      const data = await res.json()
      if (!res.ok) {
        toast({ message: data.error ?? "Erro ao alterar senha.", type: "error" })
        return
      }
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
      toast({ message: "Senha alterada com sucesso.", type: "success" })
    } catch {
      toast({ message: "Erro de conexão. Tente novamente.", type: "error" })
    } finally {
      setSavingPassword(false)
    }
  }

  // ─── Estilos ──────────────────────────────────────────────────────────────
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
  const btnPrimary = (loading: boolean): React.CSSProperties => ({
    background: "#FF4D00",
    color: "white",
    border: "none",
    borderRadius: "8px",
    padding: "10px 20px",
    fontWeight: 700,
    fontSize: "13px",
    fontFamily: "'DM Sans', sans-serif",
    cursor: loading ? "wait" : "pointer",
    opacity: loading ? 0.6 : 1,
    display: "flex",
    alignItems: "center",
    gap: "6px",
    alignSelf: "flex-start",
    transition: "opacity 0.2s ease",
  })

  return (
    <div style={{ padding: "24px", maxWidth: "600px", margin: "0 auto" }}>
      <h1 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "22px", fontWeight: 700, color: "#F5F5F5", marginBottom: "20px" }}>
        Configurações
      </h1>

      {/* Tabs */}
      <div style={{ display: "flex", borderBottom: "1px solid rgba(255,255,255,0.05)", marginBottom: "24px" }}>
        {(["perfil", "seguranca"] as ActiveTab[]).map((tab) => {
          const labels: Record<ActiveTab, string> = { perfil: "Perfil", seguranca: "Segurança" }
          const isActive = activeTab === tab
          return (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{
              background: "none", border: "none",
              borderBottom: `2px solid ${isActive ? "#FF4D00" : "transparent"}`,
              color: isActive ? "#F5F5F5" : "rgba(245,245,245,0.4)",
              padding: "10px 16px", fontSize: "13px",
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: isActive ? 700 : 400,
              cursor: "pointer", transition: "color 0.15s, border-color 0.15s",
              marginBottom: "-1px",
            }}>
              {labels[tab]}
            </button>
          )
        })}
      </div>

      {/* ─── ABA PERFIL ──────────────────────────────────────────────────────── */}
      {activeTab === "perfil" && (
        <div style={cardStyle}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div style={{
              width: "64px", height: "64px", borderRadius: "50%",
              background: "rgba(255,77,0,0.1)", border: "1px solid rgba(255,77,0,0.2)",
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            }}>
              <span style={{ fontSize: "26px", fontWeight: 700, color: "#FF4D00", fontFamily: "'DM Sans', sans-serif" }}>
                {(name || email || "U")[0].toUpperCase()}
              </span>
            </div>
            <button style={{ background: "none", border: "none", cursor: "not-allowed", color: "rgba(245,245,245,0.25)", fontSize: "12px", fontFamily: "'DM Sans', sans-serif", display: "flex", alignItems: "center", gap: "4px" }} disabled>
              <Camera size={12} /> Trocar foto (em breve)
            </button>
          </div>

          <div>
            <label style={labelStyle}>Nome</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} style={inputStyle} />
          </div>

          <div>
            <label style={labelStyle}>E-mail</label>
            <input type="email" value={email} readOnly disabled style={{ ...inputStyle, opacity: 0.5, cursor: "not-allowed" }} />
          </div>

          {!isAdmin && (
            <div>
              <label style={labelStyle}>Plano</label>
              <span style={{
                background: plan === "Agency" ? "rgba(74,222,128,.08)" : plan === "Pro" ? "rgba(0,229,255,.08)" : "rgba(245,245,245,.06)",
                border: `1px solid ${plan === "Agency" ? "rgba(74,222,128,.2)" : plan === "Pro" ? "rgba(0,229,255,.2)" : "rgba(245,245,245,.1)"}`,
                color: plan === "Agency" ? "#4ADE80" : plan === "Pro" ? "#00E5FF" : "rgba(245,245,245,.6)",
                fontSize: "12px", fontWeight: 700, padding: "4px 12px", borderRadius: "9999px",
                fontFamily: "'DM Sans', sans-serif", letterSpacing: "1px", display: "inline-block",
              }}>
                {plan}
              </span>
            </div>
          )}

          <button onClick={handleSaveProfile} disabled={savingProfile} style={btnPrimary(savingProfile)}>
            <Save size={14} />
            {savingProfile ? "Salvando..." : "Salvar alterações"}
          </button>
        </div>
      )}

      {/* ─── ABA SEGURANÇA ───────────────────────────────────────────────────── */}
      {activeTab === "seguranca" && (
        <div style={cardStyle}>
          <div>
            <label style={labelStyle}>Senha atual</label>
            <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} style={inputStyle} placeholder="••••••••" />
          </div>
          <div>
            <label style={labelStyle}>Nova senha</label>
            <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} style={inputStyle} placeholder="••••••••" />
          </div>
          <div>
            <label style={labelStyle}>Confirmar nova senha</label>
            <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} style={inputStyle} placeholder="••••••••" />
          </div>
          <button onClick={handleChangePassword} disabled={savingPassword} style={btnPrimary(savingPassword)}>
            {savingPassword ? "Alterando..." : "Alterar senha"}
          </button>

          <div style={{ marginTop: "8px", padding: "20px", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "8px", background: "rgba(239,68,68,0.03)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <AlertTriangle size={16} style={{ color: "#ef4444" }} />
              <span style={{ fontSize: "13px", fontWeight: 700, color: "#ef4444", fontFamily: "'DM Sans', sans-serif" }}>Zona de perigo</span>
            </div>
            <p style={{ fontSize: "12px", color: "rgba(245,245,245,0.4)", marginTop: "8px", fontFamily: "'DM Sans', sans-serif", lineHeight: 1.5 }}>
              Deletar sua conta remove permanentemente todos os seus dados.
            </p>
            <button
              onClick={() => toast({ message: "Entre em contato com o suporte para deletar sua conta.", type: "info" })}
              style={{
                marginTop: "12px", background: "transparent", border: "1px solid rgba(239,68,68,0.3)",
                color: "#F87171", borderRadius: "6px", padding: "8px 16px", fontSize: "12px",
                cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
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
