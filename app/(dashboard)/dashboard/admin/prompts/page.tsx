"use client"

import { useEffect, useState, useCallback } from "react"
import { motion } from "framer-motion"
import { Plus, Trash2, Pencil, X, Check, LayoutList } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"

// ─── Tipos ────────────────────────────────────────────────────────────────────

interface Prompt {
  id: string
  titulo: string
  descricao: string | null
  conteudo: string
  categoria: string
  modelo_alvo: string
  plano_minimo: string
  ativo: boolean
  created_at: string
}

const CAMPOS_VAZIO = {
  titulo: "", descricao: "", conteudo: "",
  categoria: "Geral", modelo_alvo: "ChatGPT", plano_minimo: "starter",
}

const MODELOS = ["ChatGPT", "Gemini", "Ambos"]
const PLANOS  = ["starter", "pro", "agency"]

// ─── Modal de formulário ──────────────────────────────────────────────────────

function PromptModal({
  inicial, onSalvar, onFechar,
}: {
  inicial?: Partial<Prompt>
  onSalvar: (dados: typeof CAMPOS_VAZIO) => Promise<void>
  onFechar: () => void
}) {
  const [form, setForm] = useState({ ...CAMPOS_VAZIO, ...inicial, descricao: inicial?.descricao ?? "" })
  const [salvando, setSalvando] = useState(false)
  const isEdicao = Boolean(inicial?.id)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSalvando(true)
    try { await onSalvar(form) } finally { setSalvando(false) }
  }

  const inp = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [field]: e.target.value }))

  const inputStyle: React.CSSProperties = {
    width: "100%", background: "#0D0D0D", border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "8px", padding: "10px 12px", color: "#F5F5F5",
    fontFamily: "'DM Sans', sans-serif", fontSize: "13px", outline: "none",
    boxSizing: "border-box",
  }

  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 100,
      display: "flex", alignItems: "center", justifyContent: "center", padding: "16px",
    }}>
      <div style={{
        background: "#111111", border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: "16px", width: "100%", maxWidth: "600px",
        maxHeight: "90vh", overflowY: "auto",
      }}>
        {/* Header modal */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "20px 24px", borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}>
          <h2 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "16px", fontWeight: 700, color: "#F5F5F5", margin: 0 }}>
            {isEdicao ? "Editar Prompt" : "Novo Prompt"}
          </h2>
          <button onClick={onFechar} style={{ background: "transparent", border: "none", cursor: "pointer", color: "rgba(245,245,245,0.4)", padding: "4px" }}>
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "16px" }}>
          <div>
            <label style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", fontWeight: 700, color: "rgba(245,245,245,0.4)", textTransform: "uppercase", letterSpacing: "1.5px", display: "block", marginBottom: "6px" }}>
              Título *
            </label>
            <input required value={form.titulo} onChange={inp("titulo")} placeholder="Ex: Roteiro para vídeo de produto" style={inputStyle} />
          </div>

          <div>
            <label style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", fontWeight: 700, color: "rgba(245,245,245,0.4)", textTransform: "uppercase", letterSpacing: "1.5px", display: "block", marginBottom: "6px" }}>
              Descrição curta
            </label>
            <input value={form.descricao ?? ""} onChange={inp("descricao")} placeholder="Breve descrição do que esse prompt faz" style={inputStyle} />
          </div>

          <div>
            <label style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", fontWeight: 700, color: "rgba(245,245,245,0.4)", textTransform: "uppercase", letterSpacing: "1.5px", display: "block", marginBottom: "6px" }}>
              Conteúdo do prompt *
            </label>
            <textarea
              required
              value={form.conteudo}
              onChange={inp("conteudo")}
              placeholder="Cole aqui o prompt completo..."
              rows={8}
              style={{ ...inputStyle, resize: "vertical", lineHeight: 1.6 }}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
            <div>
              <label style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", fontWeight: 700, color: "rgba(245,245,245,0.4)", textTransform: "uppercase", letterSpacing: "1.5px", display: "block", marginBottom: "6px" }}>
                Categoria
              </label>
              <input value={form.categoria} onChange={inp("categoria")} placeholder="Ex: Copy, Roteiro, Hashtags" style={inputStyle} />
            </div>
            <div>
              <label style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", fontWeight: 700, color: "rgba(245,245,245,0.4)", textTransform: "uppercase", letterSpacing: "1.5px", display: "block", marginBottom: "6px" }}>
                Modelo alvo
              </label>
              <select value={form.modelo_alvo} onChange={inp("modelo_alvo")} style={inputStyle}>
                {MODELOS.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", fontWeight: 700, color: "rgba(245,245,245,0.4)", textTransform: "uppercase", letterSpacing: "1.5px", display: "block", marginBottom: "6px" }}>
                Plano mínimo
              </label>
              <select value={form.plano_minimo} onChange={inp("plano_minimo")} style={inputStyle}>
                {PLANOS.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          </div>

          <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end", paddingTop: "8px" }}>
            <button type="button" onClick={onFechar} style={{
              padding: "10px 20px", borderRadius: "8px", cursor: "pointer",
              background: "transparent", border: "1px solid rgba(255,255,255,0.12)",
              color: "rgba(245,245,245,0.5)", fontFamily: "'DM Sans', sans-serif", fontSize: "13px", fontWeight: 700,
            }}>
              Cancelar
            </button>
            <button type="submit" disabled={salvando} style={{
              padding: "10px 24px", borderRadius: "8px", cursor: salvando ? "wait" : "pointer",
              background: "#FF4D00", border: "none", color: "white",
              fontFamily: "'DM Sans', sans-serif", fontSize: "13px", fontWeight: 700,
              opacity: salvando ? 0.7 : 1,
            }}>
              {salvando ? "Salvando..." : isEdicao ? "Salvar" : "Criar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ─── Página principal ─────────────────────────────────────────────────────────

export default function AdminPromptsPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [prompts, setPrompts] = useState<Prompt[]>([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState<{ aberto: boolean; prompt?: Prompt }>({ aberto: false })
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)

  useEffect(() => {
    if (!authLoading && !user?.isAdmin) router.replace("/dashboard")
  }, [authLoading, user, router])

  const token = () => localStorage.getItem("mf_token") ?? ""

  const fetchPrompts = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/admin/prompts?page=1", { headers: { Authorization: `Bearer ${token()}` } })
      if (!res.ok) return
      const data = await res.json()
      setPrompts(data.prompts ?? [])
    } finally { setLoading(false) }
  }, [])

  useEffect(() => { fetchPrompts() }, [fetchPrompts])

  async function salvar(dados: typeof CAMPOS_VAZIO) {
    const isEdicao = Boolean(modal.prompt?.id)
    const url = isEdicao ? `/api/admin/prompts/${modal.prompt!.id}` : "/api/admin/prompts"
    const res = await fetch(url, {
      method: isEdicao ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token()}` },
      body: JSON.stringify(dados),
    })
    if (res.ok) { setModal({ aberto: false }); fetchPrompts() }
  }

  async function deletar(id: string) {
    const res = await fetch(`/api/admin/prompts/${id}`, {
      method: "DELETE", headers: { Authorization: `Bearer ${token()}` },
    })
    if (res.ok) { setConfirmDelete(null); fetchPrompts() }
  }

  async function toggleAtivo(p: Prompt) {
    await fetch(`/api/admin/prompts/${p.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token()}` },
      body: JSON.stringify({ ativo: !p.ativo }),
    })
    fetchPrompts()
  }

  if (!user?.isAdmin) return null

  return (
    <div style={{ padding: "24px", maxWidth: "1200px", margin: "0 auto" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px", flexWrap: "wrap", gap: "12px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <LayoutList size={20} style={{ color: "#00E5FF" }} />
          <div>
            <h1 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "18px", fontWeight: 700, color: "#F5F5F5", margin: 0 }}>
              Gerenciar Prompts
            </h1>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "12px", color: "rgba(245,245,245,0.3)", margin: 0 }}>
              {prompts.length} prompts cadastrados
            </p>
          </div>
        </div>
        <button
          onClick={() => setModal({ aberto: true })}
          style={{
            display: "flex", alignItems: "center", gap: "8px",
            background: "#FF4D00", border: "none", color: "white",
            fontFamily: "'DM Sans', sans-serif", fontSize: "13px", fontWeight: 700,
            padding: "10px 20px", borderRadius: "8px", cursor: "pointer",
          }}
        >
          <Plus size={15} /> Novo Prompt
        </button>
      </div>

      {/* Tabela */}
      {loading ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {[0,1,2,3,4].map(i => <div key={i} style={{ height: "60px", background: "#111111", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.06)" }} />)}
        </div>
      ) : prompts.length === 0 ? (
        <div style={{ textAlign: "center", padding: "64px 24px", border: "1px dashed rgba(255,255,255,0.08)", borderRadius: "12px" }}>
          <LayoutList size={40} style={{ color: "rgba(255,255,255,0.1)", margin: "0 auto 12px" }} />
          <p style={{ fontFamily: "'DM Sans', sans-serif", color: "rgba(245,245,245,0.3)", fontSize: "14px" }}>
            Nenhum prompt ainda. Clique em &quot;Novo Prompt&quot; para começar.
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          {prompts.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              style={{
                display: "flex", alignItems: "center", gap: "12px",
                background: "#111111", border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: "10px", padding: "12px 16px",
                opacity: p.ativo ? 1 : 0.5,
              }}
            >
              {/* Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "2px" }}>
                  <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", fontWeight: 700, color: "#F5F5F5" }}>
                    {p.titulo}
                  </span>
                  <span style={{ fontSize: "10px", padding: "1px 7px", borderRadius: "9999px", background: "rgba(0,229,255,0.08)", color: "#00E5FF", fontWeight: 700 }}>
                    {p.modelo_alvo}
                  </span>
                  <span style={{ fontSize: "10px", padding: "1px 7px", borderRadius: "9999px", background: "rgba(255,255,255,0.06)", color: "rgba(245,245,245,0.4)", fontWeight: 700 }}>
                    {p.categoria}
                  </span>
                  <span style={{ fontSize: "10px", padding: "1px 7px", borderRadius: "9999px", background: "rgba(255,255,255,0.04)", color: "rgba(245,245,245,0.3)", fontWeight: 700 }}>
                    {p.plano_minimo}
                  </span>
                </div>
                {p.descricao && (
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", color: "rgba(245,245,245,0.3)", margin: 0 }}>
                    {p.descricao}
                  </p>
                )}
              </div>

              {/* Ações */}
              <div style={{ display: "flex", gap: "6px", flexShrink: 0 }}>
                <button
                  onClick={() => toggleAtivo(p)}
                  title={p.ativo ? "Desativar" : "Ativar"}
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "center",
                    width: "32px", height: "32px", borderRadius: "8px", cursor: "pointer",
                    background: p.ativo ? "rgba(16,163,127,0.1)" : "rgba(255,255,255,0.05)",
                    border: "1px solid " + (p.ativo ? "rgba(16,163,127,0.3)" : "rgba(255,255,255,0.1)"),
                    color: p.ativo ? "#10A37F" : "rgba(245,245,245,0.3)",
                  }}
                >
                  <Check size={13} />
                </button>
                <button
                  onClick={() => setModal({ aberto: true, prompt: p })}
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "center",
                    width: "32px", height: "32px", borderRadius: "8px", cursor: "pointer",
                    background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
                    color: "rgba(245,245,245,0.5)",
                  }}
                >
                  <Pencil size={13} />
                </button>
                {confirmDelete === p.id ? (
                  <>
                    <button onClick={() => deletar(p.id)} style={{
                      padding: "0 10px", height: "32px", borderRadius: "8px", cursor: "pointer",
                      background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.4)",
                      color: "#ef4444", fontFamily: "'DM Sans', sans-serif", fontSize: "11px", fontWeight: 700,
                    }}>Confirmar</button>
                    <button onClick={() => setConfirmDelete(null)} style={{
                      display: "flex", alignItems: "center", justifyContent: "center",
                      width: "32px", height: "32px", borderRadius: "8px", cursor: "pointer",
                      background: "transparent", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(245,245,245,0.4)",
                    }}><X size={13} /></button>
                  </>
                ) : (
                  <button onClick={() => setConfirmDelete(p.id)} style={{
                    display: "flex", alignItems: "center", justifyContent: "center",
                    width: "32px", height: "32px", borderRadius: "8px", cursor: "pointer",
                    background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
                    color: "rgba(245,245,245,0.4)",
                  }}><Trash2 size={13} /></button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modal.aberto && (
        <PromptModal
          inicial={modal.prompt}
          onSalvar={salvar}
          onFechar={() => setModal({ aberto: false })}
        />
      )}
    </div>
  )
}
