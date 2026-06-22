"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Layers, Plus, Trash2, Edit2, Check, X, Lock } from "lucide-react"
import { useAuth } from "@/lib/auth-context"

interface Profile {
  id: string
  nome: string
  nicho: string | null
  created_at: string
}

const EASE = [0.22, 1, 0.36, 1] as const
const MAX_PROFILES = 5

function getToken() {
  return typeof window !== "undefined" ? (localStorage.getItem("mf_token") ?? "") : ""
}

export default function PerfisPage() {
  const { user, refreshUser } = useAuth()
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [activeId, setActiveId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [newNome, setNewNome] = useState("")
  const [newNicho, setNewNicho] = useState("")
  const [saving, setSaving] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editNome, setEditNome] = useState("")
  const [editNicho, setEditNicho] = useState("")
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null)

  const isAgency = user?.plan === "Agency" || user?.isAdmin

  useEffect(() => {
    if (!isAgency) { setLoading(false); return }
    const token = getToken()
    fetch("/api/profiles", { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => {
        setProfiles(d.profiles ?? [])
        setActiveId(d.active_profile_id ?? null)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [isAgency])

  function flash(type: "ok" | "err", text: string) {
    setMsg({ type, text })
    setTimeout(() => setMsg(null), 3000)
  }

  async function handleCreate() {
    if (!newNome.trim()) return
    setSaving(true)
    const token = getToken()
    try {
      const res = await fetch("/api/profiles", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ nome: newNome.trim(), nicho: newNicho.trim() || null }),
      })
      const data = await res.json()
      if (!res.ok) { flash("err", data.error ?? "Erro ao criar perfil"); return }
      setProfiles(prev => [...prev, data])
      setNewNome(""); setNewNicho(""); setCreating(false)
      flash("ok", `Perfil "${data.nome}" criado!`)
    } catch { flash("err", "Erro de conexão") }
    finally { setSaving(false) }
  }

  async function handleActivate(id: string | null) {
    const token = getToken()
    const targetId = id ?? "none"
    try {
      const res = await fetch(`/api/profiles/${targetId}/activate`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) return
      setActiveId(id)
      await refreshUser()
      flash("ok", id ? "Perfil ativado" : "Perfil desativado (modo global)")
    } catch { flash("err", "Erro ao ativar perfil") }
  }

  async function handleEdit(p: Profile) {
    if (!editNome.trim()) return
    const token = getToken()
    try {
      const res = await fetch(`/api/profiles/${p.id}`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ nome: editNome.trim(), nicho: editNicho.trim() || null }),
      })
      const data = await res.json()
      if (!res.ok) { flash("err", data.error ?? "Erro ao editar"); return }
      setProfiles(prev => prev.map(x => x.id === p.id ? { ...x, nome: data.nome, nicho: data.nicho } : x))
      setEditingId(null)
      flash("ok", "Perfil atualizado")
    } catch { flash("err", "Erro de conexão") }
  }

  async function handleDelete(id: string) {
    const token = getToken()
    try {
      const res = await fetch(`/api/profiles/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) return
      setProfiles(prev => prev.filter(p => p.id !== id))
      if (activeId === id) { setActiveId(null); await refreshUser() }
      flash("ok", "Perfil removido")
    } catch { flash("err", "Erro ao remover") }
  }

  if (!isAgency) {
    return (
      <div style={{ padding: "32px", maxWidth: "600px", margin: "0 auto", textAlign: "center" }}>
        <div style={{ background: "#111", border: "1px solid rgba(74,222,128,0.2)", borderRadius: "16px", padding: "48px 32px" }}>
          <div style={{ width: "56px", height: "56px", borderRadius: "50%", background: "rgba(74,222,128,0.1)", border: "1px solid rgba(74,222,128,0.2)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
            <Lock size={24} style={{ color: "#4ADE80" }} />
          </div>
          <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "28px", letterSpacing: "2px", color: "#F5F5F5", margin: "0 0 12px" }}>MÚLTIPLOS PERFIS</h2>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "14px", color: "rgba(245,245,245,0.5)", lineHeight: 1.6, margin: "0 0 24px" }}>
            Gerencie até 5 lojas/perfis diferentes na mesma conta, cada um com seus próprios avatares. Exclusivo para o plano <strong style={{ color: "#4ADE80" }}>Agency</strong>.
          </p>
          <a href="/#planos" style={{ display: "inline-block", background: "#4ADE80", color: "#0D0D0D", fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: "13px", textTransform: "uppercase", letterSpacing: "1px", padding: "12px 28px", borderRadius: "8px", textDecoration: "none" }}>
            Ver planos
          </a>
        </div>
      </div>
    )
  }

  return (
    <div style={{ padding: "24px 24px 40px", maxWidth: "700px" }}>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: EASE }} style={{ marginBottom: "28px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "6px" }}>
          <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "rgba(74,222,128,0.1)", border: "1px solid rgba(74,222,128,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Layers size={18} style={{ color: "#4ADE80" }} />
          </div>
          <h1 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "20px", fontWeight: 700, color: "#F5F5F5", margin: 0 }}>
            Múltiplos Perfis
          </h1>
          <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "12px", fontWeight: 700, color: "#4ADE80" }}>
            {profiles.length}/{MAX_PROFILES}
          </span>
        </div>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", color: "rgba(245,245,245,0.4)", margin: 0 }}>
          Cada perfil isola os avatares salvos. O perfil ativo define o contexto atual do Avatar IA.
        </p>
      </motion.div>

      {/* Flash msg */}
      <AnimatePresence>
        {msg && (
          <motion.div
            initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            style={{ marginBottom: "16px", padding: "10px 14px", borderRadius: "8px", fontFamily: "'DM Sans', sans-serif", fontSize: "13px", fontWeight: 600,
              background: msg.type === "ok" ? "rgba(16,163,127,0.1)" : "rgba(239,68,68,0.1)",
              border: `1px solid ${msg.type === "ok" ? "rgba(16,163,127,0.3)" : "rgba(239,68,68,0.3)"}`,
              color: msg.type === "ok" ? "#10A37F" : "#ef4444",
            }}
          >
            {msg.text}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Perfil global (sem perfil ativo) */}
      <motion.div
        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, ease: EASE }}
        style={{ marginBottom: "8px", background: "#111", border: `1px solid ${activeId === null ? "rgba(74,222,128,0.3)" : "rgba(255,255,255,0.06)"}`, borderRadius: "10px", padding: "12px 16px", display: "flex", alignItems: "center", gap: "12px" }}
      >
        <div style={{ flex: 1 }}>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", fontWeight: 700, color: "#F5F5F5", margin: 0 }}>Global (sem perfil)</p>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", color: "rgba(245,245,245,0.35)", margin: "2px 0 0" }}>Avatares não vinculados a nenhuma loja</p>
        </div>
        {activeId === null ? (
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", fontWeight: 700, color: "#4ADE80", background: "rgba(74,222,128,0.1)", border: "1px solid rgba(74,222,128,0.25)", borderRadius: "9999px", padding: "3px 9px" }}>
            Ativo
          </span>
        ) : (
          <button onClick={() => handleActivate(null)} style={{ padding: "5px 12px", borderRadius: "6px", cursor: "pointer", background: "transparent", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(245,245,245,0.4)", fontFamily: "'DM Sans', sans-serif", fontSize: "11px", fontWeight: 600 }}>
            Ativar
          </button>
        )}
      </motion.div>

      {/* Lista de perfis */}
      {loading ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {[0, 1].map(i => <div key={i} style={{ height: "60px", background: "#111", borderRadius: "10px" }} />)}
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "16px" }}>
          {profiles.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05, ease: EASE }}
              style={{ background: "#111", border: `1px solid ${activeId === p.id ? "rgba(74,222,128,0.3)" : "rgba(255,255,255,0.06)"}`, borderRadius: "10px", padding: "12px 16px" }}
            >
              {editingId === p.id ? (
                <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                  <input value={editNome} onChange={e => setEditNome(e.target.value)} placeholder="Nome da loja" style={{ flex: 1, background: "#0D0D0D", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "6px", padding: "6px 10px", color: "#F5F5F5", fontFamily: "'DM Sans', sans-serif", fontSize: "13px", outline: "none" }} />
                  <input value={editNicho} onChange={e => setEditNicho(e.target.value)} placeholder="Nicho (opcional)" style={{ width: "130px", background: "#0D0D0D", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "6px", padding: "6px 10px", color: "#F5F5F5", fontFamily: "'DM Sans', sans-serif", fontSize: "13px", outline: "none" }} />
                  <button onClick={() => handleEdit(p)} style={{ padding: "6px 10px", borderRadius: "6px", cursor: "pointer", background: "rgba(74,222,128,0.1)", border: "1px solid rgba(74,222,128,0.25)", color: "#4ADE80", display: "flex" }}>
                    <Check size={14} />
                  </button>
                  <button onClick={() => setEditingId(null)} style={{ padding: "6px 10px", borderRadius: "6px", cursor: "pointer", background: "transparent", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(245,245,245,0.35)", display: "flex" }}>
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", fontWeight: 700, color: "#F5F5F5", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {p.nome}
                    </p>
                    {p.nicho && (
                      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", color: "rgba(245,245,245,0.35)", margin: "2px 0 0" }}>
                        {p.nicho}
                      </p>
                    )}
                  </div>
                  {activeId === p.id ? (
                    <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", fontWeight: 700, color: "#4ADE80", background: "rgba(74,222,128,0.1)", border: "1px solid rgba(74,222,128,0.25)", borderRadius: "9999px", padding: "3px 9px", flexShrink: 0 }}>
                      Ativo
                    </span>
                  ) : (
                    <button onClick={() => handleActivate(p.id)} style={{ padding: "5px 12px", borderRadius: "6px", cursor: "pointer", background: "transparent", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(245,245,245,0.4)", fontFamily: "'DM Sans', sans-serif", fontSize: "11px", fontWeight: 600, flexShrink: 0 }}>
                      Ativar
                    </button>
                  )}
                  <button onClick={() => { setEditingId(p.id); setEditNome(p.nome); setEditNicho(p.nicho ?? "") }} style={{ padding: "6px", borderRadius: "6px", cursor: "pointer", background: "transparent", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(245,245,245,0.35)", display: "flex" }}>
                    <Edit2 size={13} />
                  </button>
                  <button onClick={() => handleDelete(p.id)} style={{ padding: "6px", borderRadius: "6px", cursor: "pointer", background: "transparent", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(245,245,245,0.35)", display: "flex" }}>
                    <Trash2 size={13} />
                  </button>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}

      {/* Criar novo */}
      {profiles.length < MAX_PROFILES && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3, delay: 0.1 }}>
          {!creating ? (
            <button
              onClick={() => setCreating(true)}
              style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 16px", borderRadius: "8px", cursor: "pointer", background: "transparent", border: "1px dashed rgba(74,222,128,0.3)", color: "#4ADE80", fontFamily: "'DM Sans', sans-serif", fontSize: "13px", fontWeight: 600, width: "100%", transition: "all 150ms ease" }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(74,222,128,0.05)"; e.currentTarget.style.borderColor = "rgba(74,222,128,0.5)" }}
              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "rgba(74,222,128,0.3)" }}
            >
              <Plus size={15} /> Novo perfil
            </button>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
              style={{ background: "#111", border: "1px solid rgba(74,222,128,0.2)", borderRadius: "10px", padding: "14px 16px" }}
            >
              <div style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
                <input
                  autoFocus
                  value={newNome} onChange={e => setNewNome(e.target.value)}
                  placeholder="Nome da loja (ex: Loja Fitness)"
                  onKeyDown={e => e.key === "Enter" && handleCreate()}
                  style={{ flex: 1, background: "#0D0D0D", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "6px", padding: "8px 12px", color: "#F5F5F5", fontFamily: "'DM Sans', sans-serif", fontSize: "13px", outline: "none" }}
                />
                <input
                  value={newNicho} onChange={e => setNewNicho(e.target.value)}
                  placeholder="Nicho (opcional)"
                  onKeyDown={e => e.key === "Enter" && handleCreate()}
                  style={{ width: "140px", background: "#0D0D0D", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "6px", padding: "8px 12px", color: "#F5F5F5", fontFamily: "'DM Sans', sans-serif", fontSize: "13px", outline: "none" }}
                />
              </div>
              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  onClick={handleCreate} disabled={saving || !newNome.trim()}
                  style={{ flex: 1, padding: "8px 16px", borderRadius: "6px", cursor: saving ? "wait" : "pointer", background: "#4ADE80", border: "none", color: "#0D0D0D", fontFamily: "'DM Sans', sans-serif", fontSize: "13px", fontWeight: 700, opacity: saving || !newNome.trim() ? 0.5 : 1 }}
                >
                  {saving ? "Criando..." : "Criar perfil"}
                </button>
                <button onClick={() => { setCreating(false); setNewNome(""); setNewNicho("") }} style={{ padding: "8px 16px", borderRadius: "6px", cursor: "pointer", background: "transparent", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(245,245,245,0.4)", fontFamily: "'DM Sans', sans-serif", fontSize: "13px" }}>
                  Cancelar
                </button>
              </div>
            </motion.div>
          )}
        </motion.div>
      )}
    </div>
  )
}
