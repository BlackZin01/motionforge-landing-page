"use client"

import { useEffect, useState, useCallback } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { BookOpen, ShoppingBag } from "lucide-react"
import { StatsHUD } from "@/components/dashboard/home/stats-hud"
import { UsageChart } from "@/components/dashboard/home/usage-chart"
import { Skeleton } from "@/components/dashboard/shared/skeleton"
import { useAuth } from "@/lib/auth-context"

// ─── Saudação baseada no horário de Brasília (UTC-3) ─────────────────────────

function getSaudacao(): string {
  const now = new Date()
  // Converte para horário de Brasília
  const horaBrasilia = new Date(
    now.toLocaleString("en-US", { timeZone: "America/Sao_Paulo" })
  ).getHours()

  if (horaBrasilia >= 5 && horaBrasilia < 12) return "Bom dia"
  if (horaBrasilia >= 12 && horaBrasilia < 18) return "Boa tarde"
  return "Boa noite"
}

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
  const { user, loading: authLoading } = useAuth()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!authLoading) {
      const timer = setTimeout(() => setLoading(false), 400)
      return () => clearTimeout(timer)
    }
  }, [authLoading])

  if (loading || authLoading) {
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

  const firstName    = user?.name?.split(" ")[0] ?? "Usuário"
  const credits      = user?.credits ?? 0
  const totalCredits = user?.totalCredits ?? 5000
  const isAdmin      = user?.isAdmin ?? false

  // Contadores de conteúdo (carregados do estado local após fetch)
  const [totalPrompts,  setTotalPrompts]  = useState(0)
  const [totalProdutos, setTotalProdutos] = useState(0)

  useEffect(() => {
    const token = localStorage.getItem("mf_token")
    if (!token) return
    // Busca contagens em paralelo
    Promise.all([
      fetch("/api/prompts", { headers: { Authorization: `Bearer ${token}` } }).then(r => r.ok ? r.json() : null),
      fetch("/api/biblioteca", { headers: { Authorization: `Bearer ${token}` } }).then(r => r.ok ? r.json() : null),
    ]).then(([p, b]) => {
      if (p) setTotalPrompts(p.prompts?.length ?? 0)
      if (b) setTotalProdutos(b.produtos?.length ?? 0)
    }).catch(() => {})
  }, [user])

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
          {getSaudacao()}, {firstName}.
        </h1>
        <p
          style={{
            fontSize: "13px",
            color: "rgba(245,245,245,0.4)",
          }}
        >
          {isAdmin ? "Modo admin ativo. Gerencie prompts e biblioteca." : `Você tem ${credits.toLocaleString("pt-BR")} créditos.`}
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
          credits={credits}
          totalCredits={totalCredits}
          prompts={totalPrompts}
          produtos={totalProdutos}
          isAdmin={isAdmin}
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

      {/* Acesso rápido */}
      <motion.div
        custom={3}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        style={{ display: "grid", gap: "12px", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}
      >
        <Link
          href="/dashboard/prompts"
          style={{
            display: "flex", alignItems: "center", gap: "16px",
            background: "#111111", border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: "12px", padding: "20px", textDecoration: "none",
            transition: "border-color 150ms ease",
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(255,77,0,0.3)" }}
          onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(255,255,255,0.06)" }}
        >
          <div style={{ width: "44px", height: "44px", borderRadius: "10px", background: "rgba(255,77,0,0.10)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <BookOpen size={20} style={{ color: "#FF4D00" }} />
          </div>
          <div>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "14px", fontWeight: 700, color: "#F5F5F5", marginBottom: "2px" }}>Biblioteca de Prompts</div>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "12px", color: "rgba(245,245,245,0.4)" }}>
              {totalPrompts > 0 ? `${totalPrompts} prompts disponíveis` : "Prompts prontos para usar"}
            </div>
          </div>
        </Link>

        <Link
          href="/dashboard/biblioteca"
          style={{
            display: "flex", alignItems: "center", gap: "16px",
            background: "#111111", border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: "12px", padding: "20px", textDecoration: "none",
            transition: "border-color 150ms ease",
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(0,229,255,0.3)" }}
          onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(255,255,255,0.06)" }}
        >
          <div style={{ width: "44px", height: "44px", borderRadius: "10px", background: "rgba(0,229,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <ShoppingBag size={20} style={{ color: "#00E5FF" }} />
          </div>
          <div>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "14px", fontWeight: 700, color: "#F5F5F5", marginBottom: "2px" }}>Biblioteca de Anúncios</div>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "12px", color: "rgba(245,245,245,0.4)" }}>
              {totalProdutos > 0 ? `${totalProdutos} produtos validados` : "Produtos em alta no TikTok Shop"}
            </div>
          </div>
        </Link>
      </motion.div>
    </div>
  )
}
