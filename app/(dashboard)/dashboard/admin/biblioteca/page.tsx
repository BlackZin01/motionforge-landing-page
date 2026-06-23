"use client"

import { useEffect, useState, useCallback } from "react"
import { motion } from "framer-motion"
import { Plus, Trash2, Pencil, X, Package, Upload, Loader2 } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { uploadFileToR2 } from "@/lib/upload-to-r2"

// ─── Tipos ────────────────────────────────────────────────────────────────────

interface Produto {
  id: string
  nome: string
  nicho: string
  status: string
  descricao: string | null
  imagem_url: string | null
  link: string | null
  preco_medio: string | null
  score: number
  plano_minimo: string
  ativo: boolean
}

const CAMPOS_VAZIO = {
  nome: "", nicho: "", status: "em_alta", descricao: "",
  imagem_url: "", link: "", preco_medio: "", score: 0, plano_minimo: "starter",
}

const STATUS_OPTS = ["viral", "em_alta", "top_vendas", "promissor"]
const PLANOS      = ["starter", "pro", "agency"]

const STATUS_LABEL: Record<string, string> = {
  viral: "Viral", em_alta: "Em Alta", top_vendas: "Top Vendas", promissor: "Promissor",
}

// ─── Modal ────────────────────────────────────────────────────────────────────

function ProdutoModal({
  inicial, onSalvar, onFechar,
}: {
  inicial?: Partial<Produto>
  onSalvar: (dados: typeof CAMPOS_VAZIO) => Promise<void>
  onFechar: () => void
}) {
  const [form, setForm] = useState({
    ...CAMPOS_VAZIO,
    ...inicial,
    score: inicial?.score ?? 0,
    descricao: inicial?.descricao ?? "",
    imagem_url: inicial?.imagem_url ?? "",
    link: inicial?.link ?? "",
    preco_medio: inicial?.preco_medio ?? "",
  })
  const [salvando, setSalvando] = useState(false)
  const [uploadando, setUploadando] = useState(false)
  const [uploadErro, setUploadErro] = useState<string | null>(null)
  const isEdicao = Boolean(inicial?.id)

  async function handleUploadImagem(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadando(true)
    setUploadErro(null)
    try {
      const url = await uploadFileToR2(file)
      setForm(f => ({ ...f, imagem_url: url }))
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Erro ao enviar imagem"
      setUploadErro(msg)
      console.error("[upload]", err)
    } finally {
      setUploadando(false)
      e.target.value = ""
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSalvando(true)
    try { await onSalvar(form) } finally { setSalvando(false) }
  }

  const inp = (field: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm(f => ({ ...f, [field]: field === "score" ? Number(e.target.value) : e.target.value }))

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
      <div className="scrollbar-none" style={{
        background: "#111111", border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: "16px", width: "100%", maxWidth: "640px",
        maxHeight: "90vh", overflowY: "auto",
      }}>
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "20px 24px", borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}>
          <h2 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "16px", fontWeight: 700, color: "#F5F5F5", margin: 0 }}>
            {isEdicao ? "Editar Produto" : "Novo Produto"}
          </h2>
          <button onClick={onFechar} style={{ background: "transparent", border: "none", cursor: "pointer", color: "rgba(245,245,245,0.4)", padding: "4px" }}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "14px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div style={{ gridColumn: "1 / -1" }}>
              <label style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", fontWeight: 700, color: "rgba(245,245,245,0.4)", textTransform: "uppercase", letterSpacing: "1.5px", display: "block", marginBottom: "6px" }}>Nome *</label>
              <input required value={form.nome} onChange={inp("nome")} placeholder="Nome do produto" style={inputStyle} />
            </div>
            <div>
              <label style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", fontWeight: 700, color: "rgba(245,245,245,0.4)", textTransform: "uppercase", letterSpacing: "1.5px", display: "block", marginBottom: "6px" }}>Nicho *</label>
              <input required value={form.nicho} onChange={inp("nicho")} placeholder="Ex: Moda Feminina" style={inputStyle} />
            </div>
            <div>
              <label style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", fontWeight: 700, color: "rgba(245,245,245,0.4)", textTransform: "uppercase", letterSpacing: "1.5px", display: "block", marginBottom: "6px" }}>Status</label>
              <select value={form.status} onChange={inp("status")} style={inputStyle}>
                {STATUS_OPTS.map(s => <option key={s} value={s}>{STATUS_LABEL[s]}</option>)}
              </select>
            </div>
            <div style={{ gridColumn: "1 / -1" }}>
              <label style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", fontWeight: 700, color: "rgba(245,245,245,0.4)", textTransform: "uppercase", letterSpacing: "1.5px", display: "block", marginBottom: "6px" }}>Descrição</label>
              <textarea value={form.descricao} onChange={inp("descricao")} placeholder="Breve descrição do produto e oportunidade" rows={3} style={{ ...inputStyle, resize: "vertical" }} />
            </div>
            <div style={{ gridColumn: "1 / -1" }}>
              <label style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", fontWeight: 700, color: "rgba(245,245,245,0.4)", textTransform: "uppercase", letterSpacing: "1.5px", display: "block", marginBottom: "6px" }}>Imagem do produto</label>

              {/* Botão de upload */}
              <label style={{
                display: "inline-flex", alignItems: "center", gap: "8px",
                padding: "9px 16px", borderRadius: "8px", cursor: uploadando ? "wait" : "pointer",
                background: "rgba(255,77,0,0.08)", border: "1px solid rgba(255,77,0,0.25)",
                color: uploadando ? "rgba(255,77,0,0.5)" : "#FF4D00",
                fontFamily: "'DM Sans', sans-serif", fontSize: "12px", fontWeight: 700,
                marginBottom: "10px", transition: "opacity 200ms ease",
              }}>
                {uploadando ? <Loader2 size={13} style={{ animation: "spin 1s linear infinite" }} /> : <Upload size={13} />}
                {uploadando ? "Enviando para CDN..." : "Enviar foto"}
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  style={{ display: "none" }}
                  disabled={uploadando}
                  onChange={handleUploadImagem}
                />
              </label>

              {/* Erro de upload */}
              {uploadErro && (
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "12px", color: "#ef4444", marginBottom: "8px", marginTop: "4px" }}>
                  ⚠ {uploadErro}
                </p>
              )}

              {/* Preview */}
              {form.imagem_url && (
                <div style={{ marginBottom: "10px", borderRadius: "8px", overflow: "hidden", maxHeight: "140px", background: "#0D0D0D", border: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={form.imagem_url} alt="preview" style={{ maxHeight: "140px", maxWidth: "100%", objectFit: "contain", display: "block" }} />
                </div>
              )}

              {/* URL manual */}
              <input value={form.imagem_url} onChange={inp("imagem_url")} placeholder="Ou cole uma URL diretamente..." style={{ ...inputStyle, fontSize: "12px", color: "rgba(245,245,245,0.6)" }} />
            </div>
            <div style={{ gridColumn: "1 / -1" }}>
              <label style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", fontWeight: 700, color: "rgba(245,245,245,0.4)", textTransform: "uppercase", letterSpacing: "1.5px", display: "block", marginBottom: "6px" }}>Link do produto</label>
              <input value={form.link} onChange={inp("link")} placeholder="https://..." style={inputStyle} />
            </div>
            <div>
              <label style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", fontWeight: 700, color: "rgba(245,245,245,0.4)", textTransform: "uppercase", letterSpacing: "1.5px", display: "block", marginBottom: "6px" }}>Preço médio</label>
              <input value={form.preco_medio} onChange={inp("preco_medio")} placeholder="Ex: R$ 49,90" style={inputStyle} />
            </div>
            <div>
              <label style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", fontWeight: 700, color: "rgba(245,245,245,0.4)", textTransform: "uppercase", letterSpacing: "1.5px", display: "block", marginBottom: "6px" }}>Score (0–100)</label>
              <input type="number" min={0} max={100} value={form.score} onChange={inp("score")} style={inputStyle} />
            </div>
            <div>
              <label style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", fontWeight: 700, color: "rgba(245,245,245,0.4)", textTransform: "uppercase", letterSpacing: "1.5px", display: "block", marginBottom: "6px" }}>Plano mínimo</label>
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
            }}>Cancelar</button>
            <button type="submit" disabled={salvando} style={{
              padding: "10px 24px", borderRadius: "8px", cursor: salvando ? "wait" : "pointer",
              background: "#FF4D00", border: "none", color: "white",
              fontFamily: "'DM Sans', sans-serif", fontSize: "13px", fontWeight: 700, opacity: salvando ? 0.7 : 1,
            }}>{salvando ? "Salvando..." : isEdicao ? "Salvar" : "Criar"}</button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ─── Página principal ─────────────────────────────────────────────────────────

export default function AdminBibliotecaPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [produtos, setProdutos] = useState<Produto[]>([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState<{ aberto: boolean; produto?: Produto }>({ aberto: false })
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)

  useEffect(() => {
    if (!authLoading && !user?.isAdmin) router.replace("/dashboard")
  }, [authLoading, user, router])

  const fetchProdutos = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/admin/biblioteca?page=1")
      if (!res.ok) return
      const data = await res.json()
      setProdutos(data.produtos ?? [])
    } finally { setLoading(false) }
  }, [])

  useEffect(() => { fetchProdutos() }, [fetchProdutos])

  async function salvar(dados: typeof CAMPOS_VAZIO) {
    const isEdicao = Boolean(modal.produto?.id)
    const url = isEdicao ? `/api/admin/biblioteca/${modal.produto!.id}` : "/api/admin/biblioteca"
    const res = await fetch(url, {
      method: isEdicao ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dados),
    })
    if (res.ok) { setModal({ aberto: false }); fetchProdutos() }
  }

  async function deletar(id: string) {
    const res = await fetch(`/api/admin/biblioteca/${id}`, { method: "DELETE" })
    if (res.ok) { setConfirmDelete(null); fetchProdutos() }
  }

  if (!user?.isAdmin) return null

  const STATUS_COLOR: Record<string, string> = {
    viral: "#FF4D00", em_alta: "#00E5FF", top_vendas: "#FFD700", promissor: "#A78BFA",
  }

  return (
    <div style={{ padding: "24px", maxWidth: "1200px", margin: "0 auto" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px", flexWrap: "wrap", gap: "12px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <Package size={20} style={{ color: "#00E5FF" }} />
          <div>
            <h1 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "18px", fontWeight: 700, color: "#F5F5F5", margin: 0 }}>Gerenciar Biblioteca</h1>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "12px", color: "rgba(245,245,245,0.3)", margin: 0 }}>{produtos.length} produtos cadastrados</p>
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
          <Plus size={15} /> Novo Produto
        </button>
      </div>

      {loading ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {[0,1,2,3].map(i => <div key={i} style={{ height: "64px", background: "#111111", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.06)" }} />)}
        </div>
      ) : produtos.length === 0 ? (
        <div style={{ textAlign: "center", padding: "64px 24px", border: "1px dashed rgba(255,255,255,0.08)", borderRadius: "12px" }}>
          <Package size={40} style={{ color: "rgba(255,255,255,0.1)", margin: "0 auto 12px" }} />
          <p style={{ fontFamily: "'DM Sans', sans-serif", color: "rgba(245,245,245,0.3)", fontSize: "14px" }}>
            Nenhum produto ainda. Clique em &quot;Novo Produto&quot; para adicionar.
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          {produtos.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              style={{
                display: "flex", alignItems: "center", gap: "12px",
                background: "#111111", border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: "10px", padding: "12px 16px", opacity: p.ativo ? 1 : 0.5,
              }}
            >
              {/* Imagem miniatura */}
              <div style={{
                width: "48px", height: "48px", borderRadius: "8px", flexShrink: 0,
                background: "#0D0D0D", overflow: "hidden", border: "1px solid rgba(255,255,255,0.06)",
              }}>
                {p.imagem_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.imagem_url} alt={p.nome} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  <Package size={20} style={{ margin: "14px auto", color: "rgba(255,255,255,0.1)", display: "block" }} />
                )}
              </div>

              {/* Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                  <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", fontWeight: 700, color: "#F5F5F5" }}>{p.nome}</span>
                  <span style={{ fontSize: "10px", padding: "1px 7px", borderRadius: "9999px", background: (STATUS_COLOR[p.status] ?? "#fff") + "18", color: STATUS_COLOR[p.status] ?? "#fff", fontWeight: 700 }}>
                    {STATUS_LABEL[p.status] ?? p.status}
                  </span>
                  <span style={{ fontSize: "10px", padding: "1px 7px", borderRadius: "9999px", background: "rgba(255,255,255,0.06)", color: "rgba(245,245,245,0.4)", fontWeight: 700 }}>{p.nicho}</span>
                  {p.score > 0 && <span style={{ fontSize: "10px", padding: "1px 7px", borderRadius: "9999px", background: "rgba(0,229,255,0.08)", color: "#00E5FF", fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif" }}>Score {p.score}</span>}
                </div>
                {p.descricao && <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", color: "rgba(245,245,245,0.3)", margin: "2px 0 0" }}>{p.descricao}</p>}
              </div>

              {/* Ações */}
              <div style={{ display: "flex", gap: "6px", flexShrink: 0 }}>
                <button onClick={() => setModal({ aberto: true, produto: p })} style={{
                  display: "flex", alignItems: "center", justifyContent: "center",
                  width: "32px", height: "32px", borderRadius: "8px", cursor: "pointer",
                  background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(245,245,245,0.5)",
                }}><Pencil size={13} /></button>
                {confirmDelete === p.id ? (
                  <>
                    <button onClick={() => deletar(p.id)} style={{ padding: "0 10px", height: "32px", borderRadius: "8px", cursor: "pointer", background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.4)", color: "#ef4444", fontFamily: "'DM Sans', sans-serif", fontSize: "11px", fontWeight: 700 }}>Confirmar</button>
                    <button onClick={() => setConfirmDelete(null)} style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "32px", height: "32px", borderRadius: "8px", cursor: "pointer", background: "transparent", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(245,245,245,0.4)" }}><X size={13} /></button>
                  </>
                ) : (
                  <button onClick={() => setConfirmDelete(p.id)} style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "32px", height: "32px", borderRadius: "8px", cursor: "pointer", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(245,245,245,0.4)" }}><Trash2 size={13} /></button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {modal.aberto && (
        <ProdutoModal
          inicial={modal.produto}
          onSalvar={salvar}
          onFechar={() => setModal({ aberto: false })}
        />
      )}
    </div>
  )
}
