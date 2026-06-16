"use client"

import { useState, useEffect } from "react"
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"

interface FinanceiroData {
  mrr: number
  totalPaying: number
  newPayingThisMonth: number
  churnThisMonth: number
  planBreakdown: Record<string, { count: number; price: number; total: number }>
  recentTopups: Array<{ name: string; email: string; value: number; credits: number; date: string }>
}

function KPICard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div style={{ background: "#111111", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "12px", padding: "20px 24px" }}>
      <div style={{ fontSize: "11px", fontWeight: 700, color: "rgba(245,245,245,0.35)", fontFamily: "'DM Sans', sans-serif", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "8px" }}>{label}</div>
      <div style={{ fontSize: "28px", fontWeight: 700, color: "#00E5FF", fontFamily: "'Space Grotesk', sans-serif", lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ fontSize: "12px", color: "rgba(245,245,245,0.4)", fontFamily: "'DM Sans', sans-serif", marginTop: "6px" }}>{sub}</div>}
    </div>
  )
}

const BRL = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })

export default function AdminFinanceiroPage() {
  const [data, setData] = useState<FinanceiroData | null>(null)
  const token = typeof window !== "undefined" ? localStorage.getItem("mf_token") ?? "" : ""

  useEffect(() => {
    fetch("/api/admin/financeiro", { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(setData).catch(() => {})
  }, [])

  // Dummy chart data (últimos 30 dias) - em produção viria da API
  const chartData = Array.from({ length: 30 }, (_, i) => ({
    day: i + 1,
    pagantes: Math.floor(Math.random() * 3),
  }))

  if (!data) return <div style={{ padding: "24px", color: "rgba(245,245,245,0.4)", fontFamily: "'DM Sans', sans-serif" }}>Carregando...</div>

  const planColors: Record<string, string> = { starter: "rgba(245,245,245,0.5)", pro: "#00E5FF", agency: "#4ADE80" }

  return (
    <div className="p-4 sm:p-6">
      <h1 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "20px", fontWeight: 700, color: "#F5F5F5", marginBottom: "20px" }}>Financeiro</h1>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "12px", marginBottom: "20px" }}>
        <KPICard label="MRR Atual" value={BRL(data.mrr)} sub="receita mensal recorrente" />
        <KPICard label="Usuários Pagos" value={String(data.totalPaying)} sub="planos ativos" />
        <KPICard label="Novos (mês)" value={String(data.newPayingThisMonth)} sub="novos pagantes" />
        <KPICard label="Churn (mês)" value={String(data.churnThisMonth)} sub="cancelamentos" />
      </div>

      {/* Breakdown por plano */}
      <div style={{ background: "#111111", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "12px", padding: "20px 24px", marginBottom: "20px" }}>
        <div style={{ fontSize: "11px", fontWeight: 700, color: "rgba(245,245,245,0.35)", fontFamily: "'DM Sans', sans-serif", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "16px" }}>Breakdown por Plano</div>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {Object.entries(data.planBreakdown).map(([plan, info]) => (
            <div key={plan} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ color: planColors[plan] ?? "#F5F5F5", fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: "13px", textTransform: "capitalize" }}>{plan}</span>
              <span style={{ color: "rgba(245,245,245,0.5)", fontSize: "12px", fontFamily: "'DM Sans', sans-serif" }}>{info.count} × {BRL(info.price)}</span>
              <span style={{ color: "#00E5FF", fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "14px" }}>{BRL(info.total)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Gráfico */}
      <div style={{ background: "#111111", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "12px", padding: "20px 24px", marginBottom: "20px" }}>
        <div style={{ fontSize: "11px", fontWeight: 700, color: "rgba(245,245,245,0.35)", fontFamily: "'DM Sans', sans-serif", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "16px" }}>Novos Pagantes — Últimos 30 Dias</div>
        <ResponsiveContainer width="100%" height={160}>
          <AreaChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="fillOrange" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#FF4D00" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#FF4D00" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="day" tick={{ fill: "rgba(245,245,245,0.2)", fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "rgba(245,245,245,0.2)", fontSize: 10 }} axisLine={false} tickLine={false} allowDecimals={false} />
            <Tooltip contentStyle={{ background: "#1A1A1A", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", fontFamily: "'DM Sans', sans-serif", fontSize: "12px" }} />
            <Area type="monotone" dataKey="pagantes" stroke="#FF4D00" strokeWidth={2} fill="url(#fillOrange)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Tabela top-ups */}
      <div style={{ background: "#111111", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "12px", padding: "20px 24px" }}>
        <div style={{ fontSize: "11px", fontWeight: 700, color: "rgba(245,245,245,0.35)", fontFamily: "'DM Sans', sans-serif", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "12px" }}>Pagamentos Recentes</div>
        {data.recentTopups.length === 0 ? (
          <div style={{ color: "rgba(245,245,245,0.3)", fontSize: "13px", fontFamily: "'DM Sans', sans-serif" }}>Nenhum dado disponível</div>
        ) : (
          <div style={{ overflowX: "auto" }}><table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>{["Usuário", "Plano", "Data"].map(h => <th key={h} style={{ textAlign: "left", fontSize: "10px", fontWeight: 700, color: "rgba(245,245,245,0.3)", fontFamily: "'DM Sans', sans-serif", letterSpacing: "1px", textTransform: "uppercase", padding: "6px 8px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {data.recentTopups.map((t, i) => (
                <tr key={i}>
                  <td style={{ padding: "8px", fontSize: "12px", color: "#F5F5F5", fontFamily: "'DM Sans', sans-serif", borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
                    <div>{t.name}</div><div style={{ color: "rgba(245,245,245,0.4)", fontSize: "11px" }}>{t.email}</div>
                  </td>
                  <td style={{ padding: "8px", fontSize: "12px", color: "#00E5FF", fontFamily: "'Space Grotesk', sans-serif", borderBottom: "1px solid rgba(255,255,255,0.03)" }}>{BRL(t.value || 0)}</td>
                  <td style={{ padding: "8px", fontSize: "11px", color: "rgba(245,245,245,0.4)", fontFamily: "'DM Sans', sans-serif", borderBottom: "1px solid rgba(255,255,255,0.03)" }}>{t.date ? new Date(t.date).toLocaleDateString("pt-BR") : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table></div>
        )}
      </div>
    </div>
  )
}
