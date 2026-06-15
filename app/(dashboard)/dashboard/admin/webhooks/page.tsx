"use client"

import { useState, useEffect, useCallback } from "react"
import { ChevronLeft, ChevronRight, Eye } from "lucide-react"

interface WebhookLog {
  id: string
  source: string
  event: string
  status: string
  error: string | null
  created_at: string
}

const s: Record<string, React.CSSProperties> = {
  container: { padding: "24px" },
  title: { fontFamily: "'DM Sans', sans-serif", fontSize: "20px", fontWeight: 700, color: "#F5F5F5", marginBottom: "16px" },
  row: { display: "flex", gap: "10px", marginBottom: "16px", flexWrap: "wrap" as const },
  select: { background: "#0D0D0D", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "8px", padding: "8px 12px", color: "#F5F5F5", fontSize: "13px", fontFamily: "'DM Sans', sans-serif", outline: "none", cursor: "pointer" },
  th: { textAlign: "left" as const, fontSize: "10px", fontWeight: 700, color: "rgba(245,245,245,0.3)", fontFamily: "'DM Sans', sans-serif", letterSpacing: "1px", textTransform: "uppercase" as const, padding: "8px 12px", borderBottom: "1px solid rgba(255,255,255,0.05)" },
  td: { padding: "10px 12px", fontSize: "13px", color: "#F5F5F5", fontFamily: "'DM Sans', sans-serif", borderBottom: "1px solid rgba(255,255,255,0.04)", verticalAlign: "middle" as const },
  iconBtn: { background: "transparent", border: "none", cursor: "pointer", color: "rgba(245,245,245,0.4)", padding: "4px", borderRadius: "4px", display: "inline-flex", alignItems: "center" },
  overlay: { position: "fixed" as const, inset: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 },
  modal: { background: "#111111", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "12px", padding: "24px", width: "560px", maxWidth: "92vw", maxHeight: "80vh", display: "flex", flexDirection: "column" as const },
}

function statusBadge(st: string) {
  const map: Record<string, [string, string]> = {
    processed: ["#4ADE80", "rgba(74,222,128,0.08)"],
    error: ["#ef4444", "rgba(239,68,68,0.08)"],
    ignored: ["rgba(245,245,245,0.4)", "rgba(255,255,255,0.05)"],
  }
  const [color, bg] = map[st] ?? ["rgba(245,245,245,0.4)", "rgba(255,255,255,0.05)"]
  return <span style={{ background: bg, color, fontSize: "10px", fontWeight: 700, padding: "2px 8px", borderRadius: "9999px", fontFamily: "'DM Sans', sans-serif" }}>{st}</span>
}

function sourceBadge(src: string) {
  return <span style={{ background: "rgba(255,77,0,0.08)", color: "#FF4D00", fontSize: "10px", fontWeight: 700, padding: "2px 8px", borderRadius: "9999px", fontFamily: "'DM Sans', sans-serif" }}>{src}</span>
}

export default function AdminWebhooksPage() {
  const [logs, setLogs] = useState<WebhookLog[]>([])
  const [total, setTotal] = useState(0)
  const [pages, setPages] = useState(1)
  const [page, setPage] = useState(1)
  const [source, setSource] = useState("")
  const [status, setStatus] = useState("")
  const [payload, setPayload] = useState<Record<string, unknown> | null>(null)

  const token = typeof window !== "undefined" ? localStorage.getItem("mf_token") ?? "" : ""
  const headers = { Authorization: `Bearer ${token}` }

  const load = useCallback(async () => {
    const q = new URLSearchParams({ page: String(page), source, status })
    const res = await fetch(`/api/admin/webhooks?${q}`, { headers })
    if (!res.ok) return
    const d = await res.json()
    setLogs(d.logs ?? [])
    setTotal(d.total ?? 0)
    setPages(d.pages ?? 1)
  }, [page, source, status])

  useEffect(() => { load() }, [load])

  async function viewPayload(id: string) {
    const res = await fetch(`/api/admin/webhooks/${id}/payload`, { headers })
    if (!res.ok) return
    const d = await res.json()
    setPayload(d)
  }

  return (
    <div style={s.container}>
      <h1 style={s.title}>Webhooks <span style={{ fontWeight: 400, color: "rgba(245,245,245,0.4)", fontSize: "14px" }}>({total})</span></h1>

      <div style={s.row}>
        <select style={s.select} value={source} onChange={e => { setSource(e.target.value); setPage(1) }}>
          <option value="">Todas as fontes</option>
          <option value="kiwify">Kiwify</option>
          <option value="fal">fal.ai</option>
        </select>
        <select style={s.select} value={status} onChange={e => { setStatus(e.target.value); setPage(1) }}>
          <option value="">Todos os status</option>
          <option value="processed">Processado</option>
          <option value="error">Erro</option>
          <option value="ignored">Ignorado</option>
        </select>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>{["Fonte", "Evento", "Status", "Erro", "Recebido", "Ações"].map(h => <th key={h} style={s.th}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {logs.map(l => (
              <tr key={l.id}>
                <td style={s.td}>{sourceBadge(l.source)}</td>
                <td style={s.td}><span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "12px", color: "rgba(245,245,245,0.7)" }}>{l.event}</span></td>
                <td style={s.td}>{statusBadge(l.status)}</td>
                <td style={s.td}><span style={{ fontSize: "11px", color: "#ef4444", fontFamily: "'DM Sans', sans-serif" }}>{l.error ?? "—"}</span></td>
                <td style={s.td}><span style={{ fontSize: "11px", color: "rgba(245,245,245,0.4)" }}>{new Date(l.created_at).toLocaleString("pt-BR")}</span></td>
                <td style={s.td}>
                  <button style={s.iconBtn} title="Ver payload" onClick={() => viewPayload(l.id)}><Eye size={13} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pages > 1 && (
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "16px", justifyContent: "flex-end" }}>
          <span style={{ fontSize: "12px", color: "rgba(245,245,245,0.4)", fontFamily: "'DM Sans', sans-serif" }}>{page} / {pages}</span>
          <button style={{ ...s.iconBtn, border: "1px solid rgba(255,255,255,0.08)", borderRadius: "6px" }} disabled={page <= 1} onClick={() => setPage(p => p - 1)}><ChevronLeft size={14} /></button>
          <button style={{ ...s.iconBtn, border: "1px solid rgba(255,255,255,0.08)", borderRadius: "6px" }} disabled={page >= pages} onClick={() => setPage(p => p + 1)}><ChevronRight size={14} /></button>
        </div>
      )}

      {payload && (
        <div style={s.overlay} onClick={() => setPayload(null)}>
          <div style={s.modal} onClick={e => e.stopPropagation()}>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "14px", fontWeight: 700, color: "#F5F5F5", marginBottom: "12px", display: "flex", justifyContent: "space-between" }}>
              Payload
              <button style={{ background: "none", border: "none", color: "rgba(245,245,245,0.4)", cursor: "pointer", fontSize: "16px" }} onClick={() => setPayload(null)}>×</button>
            </div>
            <pre style={{ flex: 1, overflowY: "auto", background: "#0D0D0D", borderRadius: "8px", padding: "12px", fontSize: "11px", color: "#00E5FF", fontFamily: "'Space Grotesk', monospace", lineHeight: 1.6, scrollbarWidth: "none" }}>
              {JSON.stringify(payload, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  )
}
