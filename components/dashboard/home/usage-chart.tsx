"use client"

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

// ─── Dados mock — 30 dias de consumo ─────────────────────────────────────────
// TODO: integrar API — buscar histórico real de créditos por dia

const data = Array.from({ length: 30 }, (_, i) => ({
  day: `${i + 1}/06`,
  credits: Math.floor(Math.random() * 160 + 20),
}))

// ─── Componente ──────────────────────────────────────────────────────────────

export function UsageChart() {
  return (
    <div
      style={{
        background: "#111111",
        border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: "12px",
        padding: "20px",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "13px",
            fontWeight: 500,
            color: "#F5F5F5",
          }}
        >
          Consumo — Junho 2026
        </span>

        <span
          style={{
            fontSize: "10px",
            color: "rgba(245,245,245,0.4)",
            background: "rgba(255,255,255,0.04)",
            padding: "2px 8px",
            borderRadius: "4px",
          }}
        >
          30 dias
        </span>
      </div>

      {/* Gráfico */}
      <div style={{ height: "180px", marginTop: "16px" }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
            <CartesianGrid
              stroke="rgba(255,255,255,0.04)"
              strokeDasharray="3 3"
            />
            <XAxis
              dataKey="day"
              tick={{ fill: "rgba(245,245,245,0.25)", fontSize: 10 }}
              tickLine={false}
              axisLine={false}
              interval={4}
            />
            <YAxis hide />
            <Tooltip
              contentStyle={{
                background: "#1A1A1A",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: 8,
                fontSize: 12,
              }}
              labelStyle={{ color: "#F5F5F5" }}
              itemStyle={{ color: "#FF4D00" }}
              cursor={{ stroke: "rgba(255,77,0,0.2)", strokeWidth: 1 }}
            />
            <Area
              type="monotone"
              dataKey="credits"
              stroke="#FF4D00"
              strokeWidth={2}
              fill="rgba(255,77,0,0.06)"
              dot={false}
              activeDot={{ r: 4, fill: "#FF4D00", stroke: "none" }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
