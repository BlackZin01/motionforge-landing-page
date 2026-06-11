"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { Zap } from "lucide-react"
import { StatsHUD } from "@/components/dashboard/home/stats-hud"
import { UsageChart } from "@/components/dashboard/home/usage-chart"
import { RecentGrid } from "@/components/dashboard/home/recent-grid"
import { Skeleton } from "@/components/dashboard/shared/skeleton"

// ─── Mock data ────────────────────────────────────────────────────────────────
// TODO: integrar API — buscar dados reais do usuário autenticado

const MOCK = {
  credits: 3847,
  videos: 43,
  images: 84,
  workflows: 6,
}

const hasGenerations = true

// ─── Variantes de animação ───────────────────────────────────────────────────

const EASE_FORGE = [0.22, 1, 0.36, 1] as const

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: EASE_FORGE, delay: i * 0.1 },
  }),
}

// ─── Skeleton de loading ──────────────────────────────────────────────────────

function LoadingSkeleton() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Saudação skeleton */}
      <div>
        <Skeleton className="h-7 w-48 mb-2" />
        <Skeleton className="h-4 w-72" />
      </div>

      {/* Stats skeleton */}
      <div
        style={{ display: "grid", gap: "2px" }}
        className="sm:grid-cols-2 lg:grid-cols-4"
      >
        {[0, 1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-28 rounded-xl" />
        ))}
      </div>

      {/* Chart skeleton */}
      <Skeleton className="h-56 rounded-xl" />

      {/* Grid skeleton */}
      <div>
        <Skeleton className="h-4 w-24 mb-3" />
        <div
          style={{ display: "grid", gap: "8px" }}
          className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
        >
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Página principal ─────────────────────────────────────────────────────────

export default function DashboardHomePage() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800)
    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return (
      <div
        style={{
          padding: "24px",
          maxWidth: "1400px",
          margin: "0 auto",
        }}
      >
        <LoadingSkeleton />
      </div>
    )
  }

  return (
    <div
      style={{
        padding: "24px",
        maxWidth: "1400px",
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        gap: "24px",
      }}
    >
      {/* Saudação */}
      <motion.div
        custom={0}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
      >
        <h1
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "22px",
            fontWeight: 700,
            color: "#F5F5F5",
            marginBottom: "4px",
          }}
        >
          Bom dia, Matheus.
        </h1>
        <p
          style={{
            fontSize: "13px",
            color: "rgba(245,245,245,0.4)",
          }}
        >
          Você tem {MOCK.credits.toLocaleString("pt-BR")} créditos. Pronto pra gerar?
        </p>
      </motion.div>

      {/* Stats HUD */}
      <motion.div
        custom={1}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
      >
        <StatsHUD
          credits={MOCK.credits}
          videos={MOCK.videos}
          images={MOCK.images}
          workflows={MOCK.workflows}
        />
      </motion.div>

      {/* Gráfico de uso */}
      <motion.div
        custom={2}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
      >
        <UsageChart />
      </motion.div>

      {/* Gerações recentes ou CTA vazio */}
      <motion.div
        custom={3}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
      >
        {hasGenerations ? (
          <RecentGrid />
        ) : (
          /* CTA para primeiro uso */
          <div
            style={{
              border: "1px dashed rgba(255,255,255,0.08)",
              borderRadius: "12px",
              padding: "48px",
              textAlign: "center",
            }}
          >
            <div style={{ marginBottom: "16px" }}>
              <Zap
                size={40}
                style={{ color: "rgba(255,77,0,0.5)", margin: "0 auto" }}
              />
            </div>

            <h2
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "16px",
                fontWeight: 700,
                color: "#F5F5F5",
                marginBottom: "8px",
              }}
            >
              Nenhuma geração ainda.
            </h2>

            <p
              style={{
                fontSize: "13px",
                color: "rgba(245,245,245,0.4)",
                marginBottom: "24px",
              }}
            >
              Crie seu primeiro conteúdo com IA agora.
            </p>

            <Link
              href="/dashboard/studio"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                background: "#FF4D00",
                color: "white",
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 700,
                fontSize: "14px",
                letterSpacing: "1px",
                textTransform: "uppercase",
                padding: "14px 28px",
                borderRadius: "8px",
                textDecoration: "none",
              }}
            >
              ⚡ FAZER PRIMEIRA GERAÇÃO
            </Link>
          </div>
        )}
      </motion.div>
    </div>
  )
}
