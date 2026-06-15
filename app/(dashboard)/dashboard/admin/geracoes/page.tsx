"use client"

import { useState, useEffect, useCallback } from "react"
import { Search, ChevronLeft, ChevronRight, ExternalLink, Trash2, User } from "lucide-react"
import { useSearchParams, useRouter } from "next/navigation"

interface Geracao {
  id: string
  model_id: string
  type: string
  status: string
  prompt: string
  output_url: string | null
  credits_used: number
  created_at: string
  user_name: string
  user_email: string
  user_id: string
}

const s: Record<string, React.CSSProperties> = {
  container: { padding: "24px" },
  title: { fontFamily: "'DM Sans', sans-serif", fontSize: "20px", fontWeight: 700, color: "#F5F5F5", marginBottom: "16px" },
  row: { display: "flex", gap: "10px", marginBottom: "16px", flexWrap: "wrap" as const },
  input: { background: "#0D0D0D", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "8px", padding: "8px 12px", color: "#F5F5F5", fontSize: "13px", fontFamily: "'DM Sans', sans-serif", outline: "none" },
  select: { background: "#0D0D0D", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "8px", padding: "8px 12px", color: "#F5F5F5", fontSize: "13px", fontFamily: "'DM Sans', sans-serif", outline: "none", cursor: "pointer" },
  table: { width: "100%", borderCollapse: "collapse" as const },
  th: { textAlign: "left" as const, fontSize: "10px", fontWeight: 700, color: "rgba(245,245,245,0.3)", fontFamily: "'DM Sans', sans-serif", letterSpacing: "1px", textTransform: "uppercase" as const, padding: "8px 12px", borderBottom: "1px solid rgba(255,255,255,0.05)" },
  td: { padding: "10px 12px", fontSize: "13px", color: "#F5F5F5", fontFamily: "'DM Sans', sans-serif", borderBottom: "1px solid rgba(255,255,255,0.04)", verticalAlign: "middle" as const },
  iconBtn: { background: "transparent", border: "none", cursor: "pointer", color: "rgba(245,245,245,0.4)", padding: "4px", borderRadius: "4px", display: "inline-flex", alignItems: "center" },
  pagination: { display: "flex", alignItems: "center", gap: "8px", marginTop: "16px", justifyContent: "flex-end" },
}

function statusBadge(st: string) {
  const map: Record<string, [string, string]> = {
    completed: ["#4ADE80", "rgba(74,222,128,0.08)"],
    pending:   ["#FCD34D", "rgba(252,211,77,0.08)"],
    failed:    ["#ef4444", "rgba(239,68,68,0.08)"],
  }
  const [color, bg] = map[st] ?? ["rgba(245,245,245,0.4)", "rgba(255,255,255,0.05)"]
  return <span style={{ background: bg, color, fontSize: "10px", fontWeight: 700, padding: "2px 8px", borderRadius: "9999px", fontFamily: "'DM Sans', sans-serif" }}>{st}</span>
}

function typeBadge(t: string) {
  return <span style={{ background: t === "video" ? "rgba(0,229,255,0.08)" : "rgba(255,77,0,0.08)", color: t === "video" ? "#00E5FF" : "#FF4D00", fontSize: "10px", fontWeight: 700, padding: "2px 8px", borderRadius: "9999px", fontFamily: "'DM Sans', sans-serif" }}>{t}</span>
}

export default function AdminGeracoesPage() {
  const [items, setItems] = useState<Geracao[]>([])
  const [total, setTotal] = useState(0)
  const [pages, setPages] = useState(1)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState("")
  const [type, setType] = useState("")
  const [status, setStatus] = useState("")
  const sp = useSearchParams()
  const router = useRouter()
  const userId = sp.get("userId") ?? ""

  const token = typeof window !== "undefined" ? localStorage.getItem("mf_token") ?? "" : ""
  const headers = { Authorization: `Bearer ${token}` }

  const load = useCallback(async () => {
    const q = new URLSearchParams({ page: String(page), search, type, status, userId })
    const res = await fetch(`/api/admin/geracoes?${q}`, { headers })
    if (!res.ok) return
    const d = await res.json()
    setItems(d.generations ?? [])
    setTotal(d.total ?? 0)
    setPages(d.pages ?? 1)
  }, [page, search, type, status, userId])

  useEffect(() => { load() }, [load])

  async function del(id: string) {
    if (!confirm("Deletar esta geração?")) return
    await fetch(`/api/admin/geracoes/${id}`, { method: "DELETE", headers })
    load()
  }

  return (
    <div style={s.container}>
      <h1 style={s.title}>
        Gerações <span style={{ fontWeight: 400, color: "rgba(245,245,245,0.4)", fontSize: "14px" }}>({total})</span>
        {userId && <button onClick={() => router.push("/dashboard/admin/geracoes")} style={{ marginLeft: "12px", fontSize: "12px", color: "#FF4D00", background: "none", border: "none", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>× limpar filtro</button>}
      </h1>

      <div style={s.row}>
        <div style={{ position: "relative", flex: 1, minWidth: "200px" }}>
          <Search size={14} style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "rgba(245,245,245,0.3)" }} />
          <input style={{ ...s.input, paddingLeft: "30px", width: "100%", boxSizing: "border-box" }} placeholder="Buscar prompt ou usuário..." value={search} onChange={e => { setSearch(e.target.value); setPage(1) }} />
        </div>
        <select style={s.select} value={type} onChange={e => { setType(e.target.value); setPage(1) }}>
          <option value="">Todos os tipos</option>
          <option value="image">Imagem</option>
          <option value="video">Vídeo</option>
        </select>
        <select style={s.select} value={status} onChange={e => { setStatus(e.target.value); setPage(1) }}>
          <option value="">Todos os status</option>
          <option value="completed">Concluído</option>
          <option value="pending">Pendente</option>
          <option value="failed">Falhou</option>
        </select>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table style={s.table}>
          <thead>
            <tr>{["Usuário", "Modelo", "Tipo", "Status", "Créditos", "Data", "Ações"].map(h => <th key={h} style={s.th}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {items.map(g => (
              <tr key={g.id}>
                <td style={s.td}>
                  <div style={{ fontSize: "12px" }}>
                    <div style={{ fontWeight: 600, color: "#F5F5F5" }}>{g.user_name}</div>
                    <div style={{ color: "rgba(245,245,245,0.4)" }}>{g.user_email}</div>
                  </div>
                </td>
                <td style={s.td}><span style={{ fontSize: "12px", color: "rgba(245,245,245,0.6)", fontFamily: "'Space Grotesk', sans-serif" }}>{g.model_id}</span></td>
                <td style={s.td}>{typeBadge(g.type)}</td>
                <td style={s.td}>{statusBadge(g.status)}</td>
                <td style={s.td}><span style={{ color: "#00E5FF", fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600 }}>{g.credits_used}</span></td>
                <td style={s.td}><span style={{ fontSize: "11px", color: "rgba(245,245,245,0.4)" }}>{new Date(g.created_at).toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" })}</span></td>
                <td style={s.td}>
                  <div style={{ display: "flex", gap: "4px" }}>
                    {g.output_url && <a href={g.output_url} target="_blank" rel="noreferrer" style={{ ...s.iconBtn, textDecoration: "none" }}><ExternalLink size={13} /></a>}
                    <button style={s.iconBtn} title="Ver usuário" onClick={() => router.push(`/dashboard/admin/usuarios`)}><User size={13} /></button>
                    <button style={{ ...s.iconBtn, color: "#ef4444" }} onClick={() => del(g.id)}><Trash2 size={13} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pages > 1 && (
        <div style={s.pagination}>
          <span style={{ fontSize: "12px", color: "rgba(245,245,245,0.4)", fontFamily: "'DM Sans', sans-serif" }}>{page} / {pages}</span>
          <button style={{ ...s.iconBtn, border: "1px solid rgba(255,255,255,0.08)", borderRadius: "6px" }} disabled={page <= 1} onClick={() => setPage(p => p - 1)}><ChevronLeft size={14} /></button>
          <button style={{ ...s.iconBtn, border: "1px solid rgba(255,255,255,0.08)", borderRadius: "6px" }} disabled={page >= pages} onClick={() => setPage(p => p + 1)}><ChevronRight size={14} /></button>
        </div>
      )}
    </div>
  )
}
