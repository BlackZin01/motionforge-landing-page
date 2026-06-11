"use client"

import Link from "next/link"
import { GenerationCard } from "@/components/dashboard/shared/generation-card"

// ─── Mock data — gerações recentes ───────────────────────────────────────────
// TODO: integrar API — buscar histórico real do usuário

const RECENT = [
  { id: "1", type: "video" as const, model: "Seedance 2.0", credits: 35, date: "11/06" },
  { id: "2", type: "image" as const, model: "Nano Banana Pro", credits: 8, date: "11/06" },
  { id: "3", type: "video" as const, model: "Kling Std", credits: 45, date: "10/06" },
  { id: "4", type: "image" as const, model: "FLUX 2 Dev", credits: 3, date: "10/06" },
  { id: "5", type: "video" as const, model: "Wan 2.7", credits: 20, date: "09/06" },
  { id: "6", type: "image" as const, model: "Ideogram v3", credits: 3, date: "09/06" },
]

// ─── Componente ──────────────────────────────────────────────────────────────

export function RecentGrid() {
  return (
    <div>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "12px",
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
          Recentes
        </span>

        <Link
          href="/dashboard/historico"
          style={{
            fontSize: "12px",
            color: "#FF4D00",
            textDecoration: "none",
          }}
        >
          Ver tudo →
        </Link>
      </div>

      {/* Grid de cards */}
      <div
        style={{ display: "grid", gap: "8px" }}
        className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
      >
        {RECENT.map((item) => (
          <GenerationCard
            key={item.id}
            id={item.id}
            type={item.type}
            model={item.model}
            credits={item.credits}
            date={item.date}
          />
        ))}
      </div>
    </div>
  )
}
