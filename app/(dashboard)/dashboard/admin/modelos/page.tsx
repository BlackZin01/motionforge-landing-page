"use client"

import { useState, useEffect } from "react"
import { Edit2, ToggleLeft, ToggleRight } from "lucide-react"

interface ModelConfig {
  id: string
  model_id: string
  name: string
  type: string
  fal_model_id: string
  credits: number
  enabled: boolean
  plans: string
}

const PLAN_OPTIONS = ["starter", "pro", "agency"]

export default function AdminModelosPage() {
  const [models, setModels] = useState<ModelConfig[]>([])
  const [modal, setModal] = useState<{ type: "credits" | "plans"; model: ModelConfig; value: string | string[] } | null>(null)
  const [saving, setSaving] = useState(false)

  const token = typeof window !== "undefined" ? localStorage.getItem("mf_token") ?? "" : ""
  const headers = { "Content-Type": "application/json", Authorization: `Bearer ${token}` }

  const load = () => fetch("/api/admin/modelos", { headers }).then(r => r.json()).then(d => setModels(d.models ?? []))
  useEffect(() => { load() }, [])

  async function patch(id: string, body: Record<string, unknown>) {
    setSaving(true)
    try {
      await fetch(`/api/admin/modelos/${id}`, { method: "PATCH", headers, body: JSON.stringify(body) })
      await load()
      setModal(null)
    } finally { setSaving(false) }
  }

  function parsePlans(raw: string): string[] {
    try { return JSON.parse(raw) } catch { return [] }
  }

  const images = models.filter(m => m.type === "image")
  const videos = models.filter(m => m.type === "video")

  function ModelTable({ items }: { items: ModelConfig[] }) {
    return (
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>{["Nome", "FAL ID", "Créditos", "Planos", "Ativo", "Ações"].map(h => (
            <th key={h} style={{ textAlign: "left", fontSize: "10px", fontWeight: 700, color: "rgba(245,245,245,0.3)", fontFamily: "'DM Sans', sans-serif", letterSpacing: "1px", textTransform: "uppercase", padding: "8px 12px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>{h}</th>
          ))}</tr>
        </thead>
        <tbody>
          {items.map(m => (
            <tr key={m.id}>
              <td style={{ padding: "10px 12px", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                <div style={{ fontSize: "13px", fontWeight: 600, color: "#F5F5F5", fontFamily: "'DM Sans', sans-serif" }}>{m.name}</div>
                <div style={{ fontSize: "11px", color: "rgba(245,245,245,0.35)", fontFamily: "'Space Grotesk', sans-serif" }}>{m.model_id}</div>
              </td>
              <td style={{ padding: "10px 12px", borderBottom: "1px solid rgba(255,255,255,0.04)", fontSize: "11px", color: "rgba(245,245,245,0.4)", fontFamily: "'Space Grotesk', sans-serif", maxWidth: "180px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{m.fal_model_id}</td>
              <td style={{ padding: "10px 12px", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                <span style={{ color: "#00E5FF", fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "14px" }}>{m.credits}</span>
              </td>
              <td style={{ padding: "10px 12px", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
                  {parsePlans(m.plans).map(p => (
                    <span key={p} style={{ background: "rgba(255,255,255,0.05)", color: "rgba(245,245,245,0.6)", fontSize: "10px", fontWeight: 700, padding: "1px 7px", borderRadius: "9999px", fontFamily: "'DM Sans', sans-serif", textTransform: "capitalize" }}>{p}</span>
                  ))}
                </div>
              </td>
              <td style={{ padding: "10px 12px", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                <button onClick={() => patch(m.id, { enabled: !m.enabled })} style={{ background: "none", border: "none", cursor: "pointer", color: m.enabled ? "#4ADE80" : "rgba(245,245,245,0.2)", display: "flex", alignItems: "center" }}>
                  {m.enabled ? <ToggleRight size={22} /> : <ToggleLeft size={22} />}
                </button>
              </td>
              <td style={{ padding: "10px 12px", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                <div style={{ display: "flex", gap: "4px" }}>
                  <button style={{ background: "transparent", border: "none", cursor: "pointer", color: "rgba(245,245,245,0.4)", padding: "4px", borderRadius: "4px", display: "inline-flex" }} title="Editar créditos"
                    onClick={() => setModal({ type: "credits", model: m, value: String(m.credits) })}>
                    <Edit2 size={13} />
                  </button>
                  <button style={{ background: "transparent", border: "none", cursor: "pointer", color: "rgba(245,245,245,0.4)", padding: "4px", borderRadius: "4px", display: "inline-flex", fontSize: "10px", fontWeight: 700, fontFamily: "'DM Sans', sans-serif" }}
                    onClick={() => setModal({ type: "plans", model: m, value: parsePlans(m.plans) })}>
                    Planos
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    )
  }

  const sectionStyle: React.CSSProperties = { background: "#111111", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "12px", padding: "20px 24px", marginBottom: "16px" }
  const sectionTitle: React.CSSProperties = { fontSize: "11px", fontWeight: 700, color: "rgba(245,245,245,0.35)", fontFamily: "'DM Sans', sans-serif", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "12px" }

  return (
    <div className="p-4 sm:p-6">
      <h1 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "20px", fontWeight: 700, color: "#F5F5F5", marginBottom: "20px" }}>Modelos</h1>

      <div style={sectionStyle}>
        <div style={sectionTitle}>Imagem ({images.length})</div>
        <div style={{ overflowX: "auto" }}><ModelTable items={images} /></div>
      </div>

      <div style={sectionStyle}>
        <div style={sectionTitle}>Vídeo ({videos.length})</div>
        <div style={{ overflowX: "auto" }}><ModelTable items={videos} /></div>
      </div>

      {modal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }} onClick={() => setModal(null)}>
          <div style={{ background: "#111111", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "12px", padding: "24px", width: "340px" }} onClick={e => e.stopPropagation()}>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "14px", fontWeight: 700, color: "#F5F5F5", marginBottom: "16px" }}>
              {modal.type === "credits" ? "Editar Créditos" : "Editar Planos"} — {modal.model.name}
            </div>

            {modal.type === "credits" && (
              <input type="number" value={modal.value as string} onChange={e => setModal({ ...modal, value: e.target.value })}
                style={{ background: "#0D0D0D", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", padding: "10px 12px", color: "#F5F5F5", fontSize: "13px", fontFamily: "'DM Sans', sans-serif", outline: "none", width: "100%", boxSizing: "border-box" }} />
            )}

            {modal.type === "plans" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {PLAN_OPTIONS.map(p => {
                  const checked = (modal.value as string[]).includes(p)
                  return (
                    <label key={p} style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "13px", color: "#F5F5F5", fontFamily: "'DM Sans', sans-serif", textTransform: "capitalize" }}>
                      <input type="checkbox" checked={checked} onChange={() => {
                        const cur = modal.value as string[]
                        setModal({ ...modal, value: checked ? cur.filter(x => x !== p) : [...cur, p] })
                      }} style={{ accentColor: "#FF4D00" }} />
                      {p}
                    </label>
                  )
                })}
              </div>
            )}

            <div style={{ display: "flex", gap: "8px", marginTop: "16px", justifyContent: "flex-end" }}>
              <button onClick={() => setModal(null)} style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(245,245,245,0.6)", borderRadius: "6px", padding: "7px 14px", fontSize: "12px", fontFamily: "'DM Sans', sans-serif", cursor: "pointer" }}>Cancelar</button>
              <button disabled={saving} style={{ background: "#FF4D00", color: "white", border: "none", borderRadius: "6px", padding: "7px 14px", fontSize: "12px", fontWeight: 700, fontFamily: "'DM Sans', sans-serif", cursor: "pointer" }}
                onClick={() => {
                  if (modal.type === "credits") patch(modal.model.id, { credits: Number(modal.value) })
                  else patch(modal.model.id, { plans: modal.value })
                }}>Salvar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
