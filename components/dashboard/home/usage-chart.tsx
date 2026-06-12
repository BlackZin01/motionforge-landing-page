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

// ─── Mês atual dinâmico ───────────────────────────────────────────────────────

const MONTHS = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"]

function getCurrentMonthLabel() {
  const now = new Date()
  return `${MONTHS[now.getMonth()]} ${now.getFullYear()}`
}

function getDaysInCurrentMonth() {
  const now = new Date()
  const days = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()
  const month = now.getMonth() + 1
  return Array.from({ length: days }, (_, i) => ({
    day: `${i + 1}/${month < 10 ? "0" + month : month}`,
    credits: 0,
  }))
}

// ─── Componente ──────────────────────────────────────────────────────────────

interface UsageChartProps {
  // TODO: aceitar dados reais da API — por enquanto sempre vazio
  data?: { day: string; credits: number }[]
}

export function UsageChart({ data }: UsageChartProps) {
  const chartData = data ?? getDaysInCurrentMonth()
  const hasActivity = chartData.some((d) => d.credits > 0)

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
          marginBottom: "16px",
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
          Consumo — {getCurrentMonthLabel()}
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

      {/* Gráfico ou empty state */}
      {!hasActivity ? (
        <div
          style={{
            height: "180px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
          }}
        >
          <p
            style={{
              fontSize: "12px",
              color: "rgba(245,245,245,0.25)",
              margin: 0,
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            Nenhuma geração neste mês ainda.
          </p>
          <p
            style={{
              fontSize: "11px",
              color: "rgba(245,245,245,0.18)",
              margin: 0,
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            O gráfico aparecerá após sua primeira geração.
          </p>
        </div>
      ) : (
        <div style={{ height: "180px" }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
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
      )}
    </div>
  )
}
