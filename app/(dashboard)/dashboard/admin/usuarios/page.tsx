"use client"

import { useState, useEffect, useCallback } from "react"
import { Search, ChevronLeft, ChevronRight, MoreVertical, Edit2, CreditCard, Crown, Ban, Trash2, Film, Mail } from "lucide-react"

interface Usuario {
  id: string
  name: string
  email: string
  plan: string
  credits: number
  is_admin: boolean
  banned_at: string | null
  deleted_at: string | null
  created_at: string
}

type Modal =
  | { type: "plan"; user: Usuario }
  | { type: "credits"; user: Usuario }
  | { type: "admin"; user: Usuario }
  | { type: "ban"; user: Usuario }
  | { type: "delete"; user: Usuario; step: 1 | 2; emailInput: string }
  | null

const badge = (color: string, bg: string): React.CSSProperties => ({ background: bg, color, fontSize: "10px", fontWeight: 700, padding: "2px 8px", borderRadius: "9999px", fontFamily: "'DM Sans', sans-serif", letterSpacing: "1px", display: "inline-block" })
const btn = (color = "#FF4D00"): React.CSSProperties => ({ background: color, color: "white", border: "none", borderRadius: "6px", padding: "6px 14px", fontSize: "12px", fontWeight: 700, fontFamily: "'DM Sans', sans-serif", cursor: "pointer" })

const s: Record<string, React.CSSProperties> = {
  container: {},
  title: { fontFamily: "'DM Sans', sans-serif", fontSize: "20px", fontWeight: 700, color: "#F5F5F5", marginBottom: "16px" },
  row: { display: "flex", gap: "10px", marginBottom: "16px", flexWrap: "wrap" },
  input: { background: "#0D0D0D", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "8px", padding: "8px 12px", color: "#F5F5F5", fontSize: "13px", fontFamily: "'DM Sans', sans-serif", outline: "none" },
  select: { background: "#0D0D0D", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "8px", padding: "8px 12px", color: "#F5F5F5", fontSize: "13px", fontFamily: "'DM Sans', sans-serif", outline: "none", cursor: "pointer" },
  table: { width: "100%", borderCollapse: "collapse" },
  th: { textAlign: "left", fontSize: "10px", fontWeight: 700, color: "rgba(245,245,245,0.3)", fontFamily: "'DM Sans', sans-serif", letterSpacing: "1px", textTransform: "uppercase", padding: "8px 12px", borderBottom: "1px solid rgba(255,255,255,0.05)" },
  td: { padding: "10px 12px", fontSize: "13px", color: "#F5F5F5", fontFamily: "'DM Sans', sans-serif", borderBottom: "1px solid rgba(255,255,255,0.04)", verticalAlign: "middle" },
  pagination: { display: "flex", alignItems: "center", gap: "8px", marginTop: "16px", justifyContent: "flex-end" },
  iconBtn: { background: "transparent", border: "none", cursor: "pointer", color: "rgba(245,245,245,0.4)", padding: "4px", borderRadius: "4px", display: "flex", alignItems: "center" },
  overlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 },
  modal: { background: "#111111", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "12px", padding: "24px", width: "360px", maxWidth: "90vw" },
  modalTitle: { fontFamily: "'DM Sans', sans-serif", fontSize: "15px", fontWeight: 700, color: "#F5F5F5", marginBottom: "16px" },
  modalInput: { background: "#0D0D0D", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", padding: "10px 12px", color: "#F5F5F5", fontSize: "13px", fontFamily: "'DM Sans', sans-serif", outline: "none", width: "100%", boxSizing: "border-box" },
  modalBtns: { display: "flex", gap: "8px", marginTop: "16px", justifyContent: "flex-end" },
  cancelBtn: { background: "transparent", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(245,245,245,0.6)", borderRadius: "6px", padding: "7px 14px", fontSize: "12px", fontFamily: "'DM Sans', sans-serif", cursor: "pointer" },
}

function statusBadge(u: Usuario) {
  if (u.deleted_at) return <span style={badge("rgba(245,245,245,0.4)", "rgba(255,255,255,0.06)")}>Deletado</span>
  if (u.banned_at) return <span style={badge("#ef4444", "rgba(239,68,68,0.1)")}>Banido</span>
  return <span style={badge("#4ADE80", "rgba(74,222,128,0.08)")}>Ativo</span>
}

function planBadge(plan: string) {
  const p = plan.toLowerCase()
  if (p === "agency") return <span style={badge("#4ADE80", "rgba(74,222,128,0.08)")}>{plan}</span>
  if (p === "pro") return <span style={badge("#00E5FF", "rgba(0,229,255,0.08)")}>{plan}</span>
  return <span style={badge("rgba(245,245,245,0.5)", "rgba(255,255,255,0.06)")}>{plan}</span>
}

function fmt(d: string) {
  return new Date(d).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "2-digit" })
}

export default function AdminUsuariosPage() {
  const [users, setUsers] = useState<Usuario[]>([])
  const [total, setTotal] = useState(0)
  const [pages, setPages] = useState(1)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState("")
  const [plan, setPlan] = useState("")
  const [status, setStatus] = useState("")
  const [modal, setModal] = useState<Modal>(null)
  const [modalValue, setModalValue] = useState("")
  const [saving, setSaving] = useState(false)
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)

  const headers = { "Content-Type": "application/json" }

  const load = useCallback(async () => {
    const q = new URLSearchParams({ page: String(page), search, plan, status })
    const res = await fetch(`/api/admin/usuarios?${q}`, { headers })
    if (!res.ok) return
    const d = await res.json()
    setUsers(d.users ?? [])
    setTotal(d.total ?? 0)
    setPages(d.pages ?? 1)
  }, [page, search, plan, status])

  useEffect(() => { load() }, [load])

  async function patchUser(id: string, body: Record<string, unknown>) {
    setSaving(true)
    try {
      await fetch(`/api/admin/usuarios/${id}`, { method: "PATCH", headers, body: JSON.stringify(body) })
      setModal(null)
      load()
    } finally { setSaving(false) }
  }

  async function deleteUser(id: string) {
    setSaving(true)
    try {
      await fetch(`/api/admin/usuarios/${id}`, { method: "DELETE", headers })
      setModal(null)
      load()
    } finally { setSaving(false) }
  }

  function openModal(type: "plan" | "credits" | "admin" | "ban", user: Usuario) {
    setOpenMenuId(null)
    if (type === "plan") setModalValue(user.plan)
    if (type === "credits") setModalValue(String(user.credits))
    setModal({ type, user } as Modal)
  }

  return (
    <div style={s.container} className="p-4 sm:p-6">
      <h1 style={s.title}>Usuários <span style={{ fontWeight: 400, color: "rgba(245,245,245,0.4)", fontSize: "14px" }}>({total})</span></h1>

      <div style={s.row}>
        <div style={{ position: "relative", flex: 1, minWidth: "200px" }}>
          <Search size={14} style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "rgba(245,245,245,0.3)" }} />
          <input style={{ ...s.input, paddingLeft: "30px", width: "100%", boxSizing: "border-box" }} placeholder="Buscar por nome ou email..." value={search} onChange={e => { setSearch(e.target.value); setPage(1) }} />
        </div>
        <select style={s.select} value={plan} onChange={e => { setPlan(e.target.value); setPage(1) }}>
          <option value="">Todos os planos</option>
          <option value="starter">Starter</option>
          <option value="pro">Pro</option>
          <option value="agency">Agency</option>
          <option value="free">Free</option>
        </select>
        <select style={s.select} value={status} onChange={e => { setStatus(e.target.value); setPage(1) }}>
          <option value="">Todos os status</option>
          <option value="ativo">Ativo</option>
          <option value="banido">Banido</option>
          <option value="deletado">Deletado</option>
        </select>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table style={s.table}>
          <thead>
            <tr>
              {["Nome / Email", "Plano", "Créditos", "Status", "Admin", "Criado", "Ações"].map(h => (
                <th key={h} style={s.th}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id} style={{ opacity: u.deleted_at ? 0.4 : 1 }}>
                <td style={s.td}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: "rgba(255,77,0,0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "#FF4D00", fontSize: "11px", fontWeight: 700, flexShrink: 0 }}>
                      {(u.name || u.email || "U")[0].toUpperCase()}
                    </div>
                    <div>
                      <div style={{ fontSize: "13px", fontWeight: 600, color: "#F5F5F5" }}>{u.name}</div>
                      <div style={{ fontSize: "11px", color: "rgba(245,245,245,0.4)" }}>{u.email}</div>
                    </div>
                  </div>
                </td>
                <td style={s.td}>{planBadge(u.plan)}</td>
                <td style={s.td}><span style={{ color: "#00E5FF", fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600 }}>{u.credits.toLocaleString()}</span></td>
                <td style={s.td}>{statusBadge(u)}</td>
                <td style={s.td}>{u.is_admin ? <span style={badge("#FF4D00", "rgba(255,77,0,0.1)")}>Admin</span> : <span style={{ color: "rgba(245,245,245,0.25)", fontSize: "12px" }}>—</span>}</td>
                <td style={s.td}><span style={{ color: "rgba(245,245,245,0.4)", fontSize: "12px" }}>{fmt(u.created_at)}</span></td>
                <td style={s.td}>
                  <div style={{ position: "relative" }}>
                    <button style={s.iconBtn} onClick={() => setOpenMenuId(openMenuId === u.id ? null : u.id)}>
                      <MoreVertical size={14} />
                    </button>
                    {openMenuId === u.id && (
                      <div style={{ position: "absolute", right: 0, top: "100%", background: "#1A1A1A", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", padding: "4px", zIndex: 50, width: "180px" }}>
                        {[
                          { icon: Edit2,   label: "Editar plano",   action: () => openModal("plan", u) },
                          { icon: CreditCard, label: "Editar créditos", action: () => openModal("credits", u) },
                          { icon: Crown,   label: u.is_admin ? "Remover admin" : "Tornar admin", action: () => openModal("admin", u) },
                          { icon: Ban,     label: u.banned_at ? "Desbanir" : "Banir",             action: () => openModal("ban", u) },
                          { icon: Film,    label: "Ver gerações",   action: () => window.open(`/dashboard/admin/geracoes?userId=${u.id}`, "_self") },
                          { icon: Mail,    label: "Enviar email",   action: () => window.open(`mailto:${u.email}`) },
                          { icon: Trash2,  label: "Deletar conta",  action: () => { setOpenMenuId(null); setModal({ type: "delete", user: u, step: 1, emailInput: "" }) }, danger: true },
                        ].map(item => (
                          <button key={item.label} onClick={item.action} style={{ display: "flex", alignItems: "center", gap: "8px", width: "100%", background: "transparent", border: "none", padding: "7px 10px", borderRadius: "6px", cursor: "pointer", fontSize: "12px", fontFamily: "'DM Sans', sans-serif", color: (item as { danger?: boolean }).danger ? "#ef4444" : "#F5F5F5", textAlign: "left" }}>
                            <item.icon size={12} />
                            {item.label}
                          </button>
                        ))}
                      </div>
                    )}
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

      {/* Modals */}
      {modal && modal.type === "plan" && (
        <div style={s.overlay} onClick={() => setModal(null)}>
          <div style={s.modal} onClick={e => e.stopPropagation()}>
            <div style={s.modalTitle}>Editar plano — {modal.user.name}</div>
            <select style={{ ...s.modalInput, cursor: "pointer" }} value={modalValue} onChange={e => setModalValue(e.target.value)}>
              {["starter", "pro", "agency", "free"].map(p => <option key={p} value={p}>{p}</option>)}
            </select>
            <div style={s.modalBtns}>
              <button style={s.cancelBtn} onClick={() => setModal(null)}>Cancelar</button>
              <button style={btn()} disabled={saving} onClick={() => patchUser(modal.user.id, { plan: modalValue })}>Salvar</button>
            </div>
          </div>
        </div>
      )}

      {modal && modal.type === "credits" && (
        <div style={s.overlay} onClick={() => setModal(null)}>
          <div style={s.modal} onClick={e => e.stopPropagation()}>
            <div style={s.modalTitle}>Editar créditos — {modal.user.name}</div>
            <input type="number" style={s.modalInput} value={modalValue} onChange={e => setModalValue(e.target.value)} />
            <div style={s.modalBtns}>
              <button style={s.cancelBtn} onClick={() => setModal(null)}>Cancelar</button>
              <button style={btn()} disabled={saving} onClick={() => patchUser(modal.user.id, { credits: Number(modalValue) })}>Salvar</button>
            </div>
          </div>
        </div>
      )}

      {modal && modal.type === "admin" && (
        <div style={s.overlay} onClick={() => setModal(null)}>
          <div style={s.modal} onClick={e => e.stopPropagation()}>
            <div style={s.modalTitle}>{modal.user.is_admin ? "Remover admin?" : "Tornar admin?"}</div>
            <p style={{ fontSize: "13px", color: "rgba(245,245,245,0.5)", fontFamily: "'DM Sans', sans-serif" }}>
              {modal.user.is_admin ? `${modal.user.name} perderá acesso ao painel admin.` : `${modal.user.name} terá acesso completo ao painel admin.`}
            </p>
            <div style={s.modalBtns}>
              <button style={s.cancelBtn} onClick={() => setModal(null)}>Cancelar</button>
              <button style={btn(modal.user.is_admin ? "#ef4444" : "#FF4D00")} disabled={saving} onClick={() => patchUser(modal.user.id, { isAdmin: !modal.user.is_admin })}>Confirmar</button>
            </div>
          </div>
        </div>
      )}

      {modal && modal.type === "ban" && (
        <div style={s.overlay} onClick={() => setModal(null)}>
          <div style={s.modal} onClick={e => e.stopPropagation()}>
            <div style={s.modalTitle}>{modal.user.banned_at ? "Desbanir usuário?" : "Banir usuário?"}</div>
            <p style={{ fontSize: "13px", color: "rgba(245,245,245,0.5)", fontFamily: "'DM Sans', sans-serif" }}>{modal.user.name} — {modal.user.email}</p>
            <div style={s.modalBtns}>
              <button style={s.cancelBtn} onClick={() => setModal(null)}>Cancelar</button>
              <button style={btn(modal.user.banned_at ? "#FF4D00" : "#ef4444")} disabled={saving}
                onClick={() => patchUser(modal.user.id, { bannedAt: modal.user.banned_at ? null : new Date().toISOString() })}>
                {modal.user.banned_at ? "Desbanir" : "Banir"}
              </button>
            </div>
          </div>
        </div>
      )}

      {modal && modal.type === "delete" && (
        <div style={s.overlay} onClick={() => setModal(null)}>
          <div style={s.modal} onClick={e => e.stopPropagation()}>
            <div style={{ ...s.modalTitle, color: "#ef4444" }}>Deletar conta</div>
            {modal.step === 1 ? (
              <>
                <p style={{ fontSize: "13px", color: "rgba(245,245,245,0.5)", fontFamily: "'DM Sans', sans-serif" }}>
                  Tem certeza? Esta ação é irreversível. Os dados do usuário serão anonimizados.
                </p>
                <div style={s.modalBtns}>
                  <button style={s.cancelBtn} onClick={() => setModal(null)}>Cancelar</button>
                  <button style={btn("#ef4444")} onClick={() => setModal({ ...modal, step: 2 })}>Continuar →</button>
                </div>
              </>
            ) : (
              <>
                <p style={{ fontSize: "13px", color: "rgba(245,245,245,0.5)", fontFamily: "'DM Sans', sans-serif", marginBottom: "12px" }}>
                  Digite o email <strong style={{ color: "#F5F5F5" }}>{modal.user.email}</strong> para confirmar:
                </p>
                <input style={s.modalInput} value={modal.emailInput} onChange={e => setModal({ ...modal, emailInput: e.target.value })} placeholder={modal.user.email} />
                <div style={s.modalBtns}>
                  <button style={s.cancelBtn} onClick={() => setModal({ ...modal, step: 1 })}>← Voltar</button>
                  <button style={{ ...btn("#ef4444"), opacity: modal.emailInput === modal.user.email ? 1 : 0.4 }} disabled={saving || modal.emailInput !== modal.user.email}
                    onClick={() => deleteUser(modal.user.id)}>
                    Confirmar exclusão
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
