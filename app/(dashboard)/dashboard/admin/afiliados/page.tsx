"use client"

import { useState, useEffect } from "react"
import { CheckCircle } from "lucide-react"

interface Afiliado {
  id: string
  name: string
  email: string
  referrals: number
  commission_total: number
  commission_paid: number
  commission_pending: number
}

interface Totais {
  affiliates: number
  total: number
  paid: number
  pending: number
}

const BRL = (v: number) => Number(v).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })

function KPICard({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ background: "#111111", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "12px", padding: "18px 20px" }}>
      <div style={{ fontSize: "10px", fontWeight: 700, color: "rgba(245,245,245,0.3)", fontFamily: "'DM Sans', sans-serif", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "6px" }}>{label}</div>
      <div style={{ fontSize: "22px", fontWeight: 700, color: "#00E5FF", fontFamily: "'Space Grotesk', sans-serif" }}>{value}</div>
    </div>
  )
}

export default function AdminAfiliadosPage() {
  const [afiliados, setAfiliados] = useState<Afiliado[]>([])
  const [totais, setTotais] = useState<Totais>({ affiliates: 0, total: 0, paid: 0, pending: 0 })
  const [saving, setSaving] = useState<string | null>(null)

  const token = typeof window !== "undefined" ? localStorage.getItem("mf_token") ?? "" : ""
  const headers = { "Content-Type": "application/json", Authorization: `Bearer ${token}` }

  const load = () => fetch("/api/admin/afiliados", { headers }).then(r => r.json()).then(d => {
    setAfiliados(d.affiliates ?? [])
    setTotais(d.totals ?? { affiliates: 0, total: 0, paid: 0, pending: 0 })
  })

  useEffect(() => { load() }, [])

  async function marcarPago(id: string) {
    if (!confirm("Marcar todas as comissões como pagas?")) return
    setSaving(id)
    try {
      await fetch(`/api/admin/afiliados/${id}/pagar`, {
        method: "PATCH",
        headers,
        body: JSON.stringify({ referralIds: [] }),
      })
      await load()
    } finally { setSaving(null) }
  }

  return (
    <div style={{ padding: "24px" }}>
      <h1 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "20px", fontWeight: 700, color: "#F5F5F5", marginBottom: "20px" }}>Afiliados</h1>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "12px", marginBottom: "24px" }}>
        <KPICard label="Afiliados ativos" value={String(totais.affiliates)} />
        <KPICard label="Comissões geradas" value={BRL(totais.total)} />
        <KPICard label="Comissões pagas" value={BRL(totais.paid)} />
        <KPICard label="Pendente a pagar" value={BRL(totais.pending)} />
      </div>

      {afiliados.length === 0 ? (
        <div style={{ background: "#111111", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "12px", padding: "40px", textAlign: "center", color: "rgba(245,245,245,0.3)", fontFamily: "'DM Sans', sans-serif", fontSize: "14px" }}>
          Nenhum afiliado ainda
        </div>
      ) : (
        <div style={{ background: "#111111", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "12px", padding: "0 24px 8px", overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>{["Afiliado", "Indicações", "Gerado", "Pago", "Saldo", "Ações"].map(h => (
                <th key={h} style={{ textAlign: "left", fontSize: "10px", fontWeight: 700, color: "rgba(245,245,245,0.3)", fontFamily: "'DM Sans', sans-serif", letterSpacing: "1px", textTransform: "uppercase", padding: "16px 12px 8px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>{h}</th>
              ))}</tr>
            </thead>
            <tbody>
              {afiliados.map(a => (
                <tr key={a.id}>
                  <td style={{ padding: "12px", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                    <div style={{ fontSize: "13px", fontWeight: 600, color: "#F5F5F5", fontFamily: "'DM Sans', sans-serif" }}>{a.name}</div>
                    <div style={{ fontSize: "11px", color: "rgba(245,245,245,0.4)", fontFamily: "'DM Sans', sans-serif" }}>{a.email}</div>
                  </td>
                  <td style={{ padding: "12px", borderBottom: "1px solid rgba(255,255,255,0.04)", color: "#F5F5F5", fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600 }}>{a.referrals}</td>
                  <td style={{ padding: "12px", borderBottom: "1px solid rgba(255,255,255,0.04)", color: "#00E5FF", fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600 }}>{BRL(a.commission_total)}</td>
                  <td style={{ padding: "12px", borderBottom: "1px solid rgba(255,255,255,0.04)", color: "#4ADE80", fontFamily: "'Space Grotesk', sans-serif" }}>{BRL(a.commission_paid)}</td>
                  <td style={{ padding: "12px", borderBottom: "1px solid rgba(255,255,255,0.04)", color: Number(a.commission_pending) > 0 ? "#FCD34D" : "rgba(245,245,245,0.4)", fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700 }}>{BRL(a.commission_pending)}</td>
                  <td style={{ padding: "12px", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                    {Number(a.commission_pending) > 0 && (
                      <button disabled={saving === a.id} onClick={() => marcarPago(a.id)}
                        style={{ background: "rgba(74,222,128,0.1)", border: "1px solid rgba(74,222,128,0.2)", color: "#4ADE80", borderRadius: "6px", padding: "5px 10px", fontSize: "11px", fontWeight: 700, fontFamily: "'DM Sans', sans-serif", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px" }}>
                        <CheckCircle size={11} /> Marcar pago
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
