"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { BarChart3, TrendingUp, Sparkles, Lock, ExternalLink } from "lucide-react"
import { useAuth } from "@/lib/auth-context"

interface NichoStat {
  nicho: string
  total: string
  avg_score: string
  max_score: string
}

interface TopProduto {
  id: string
  nome: string
  nicho: string
  status: string
  score: number
  imagem_url: string | null
  link: string | null
  preco_medio: string | null
}

interface TendenciasData {
  nichos: NichoStat[]
  topPorNicho: TopProduto[]
  novosEssaSemana: TopProduto[]
  geradoEm: string
}

const EASE = [0.22, 1, 0.36, 1] as const

export default function TendenciasPage() {
  const { user } = useAuth()
  const [data, setData] = useState<TendenciasData | null>(null)
  const [loading, setLoading] = useState(true)
  const [locked, setLocked] = useState(false)

  const isAgency = user?.plan === "Agency" || user?.isAdmin

  useEffect(() => {
    // Cookie httpOnly é enviado automaticamente pelo browser
    fetch("/api/tendencias")
      .then(r => {
        if (r.status === 403) { setLocked(true); setLoading(false); return null }
        return r.json()
      })
      .then(d => { if (d) setData(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  if (!isAgency || locked) {
    return (
      <div style={{ padding: "32px", maxWidth: "600px", margin: "0 auto", textAlign: "center" }}>
        <div style={{
          background: "#111111", border: "1px solid rgba(74,222,128,0.2)",
          borderRadius: "16px", padding: "48px 32px",
        }}>
          <div style={{
            width: "56px", height: "56px", borderRadius: "50%",
            background: "rgba(74,222,128,0.1)", border: "1px solid rgba(74,222,128,0.2)",
            display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px",
          }}>
            <Lock size={24} style={{ color: "#4ADE80" }} />
          </div>
          <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "28px", letterSpacing: "2px", color: "#F5F5F5", margin: "0 0 12px" }}>
            RELATÓRIO DE TENDÊNCIAS
          </h2>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "14px", color: "rgba(245,245,245,0.5)", lineHeight: 1.6, margin: "0 0 24px" }}>
            Análise semanal de tendências por nicho — quais categorias estão crescendo, top produtos por segmento e novidades da semana.
            Exclusivo para o plano <strong style={{ color: "#4ADE80" }}>Agency</strong>.
          </p>
          <a href="/#planos" style={{
            display: "inline-block", background: "#4ADE80", color: "#0D0D0D",
            fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: "13px",
            textTransform: "uppercase", letterSpacing: "1px", padding: "12px 28px",
            borderRadius: "8px", textDecoration: "none",
          }}>
            Ver planos
          </a>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div style={{ padding: "24px" }}>
        <div style={{ display: "grid", gap: "16px" }}>
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} style={{ height: "100px", background: "#111", borderRadius: "12px" }} />
          ))}
        </div>
      </div>
    )
  }

  if (!data) return null

  return (
    <div style={{ padding: "24px 24px 40px", maxWidth: "1100px" }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: EASE }}
        style={{ marginBottom: "28px" }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "6px" }}>
          <div style={{
            width: "36px", height: "36px", borderRadius: "10px",
            background: "rgba(74,222,128,0.1)", border: "1px solid rgba(74,222,128,0.2)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <BarChart3 size={18} style={{ color: "#4ADE80" }} />
          </div>
          <h1 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "20px", fontWeight: 700, color: "#F5F5F5", margin: 0 }}>
            Relatório de Tendências
          </h1>
          <span style={{
            background: "rgba(74,222,128,0.08)", border: "1px solid rgba(74,222,128,0.2)",
            color: "#4ADE80", fontFamily: "'DM Sans', sans-serif", fontSize: "10px",
            fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase",
            padding: "2px 8px", borderRadius: "9999px",
          }}>
            Agency
          </span>
        </div>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", color: "rgba(245,245,245,0.4)", margin: 0 }}>
          Gerado em {new Date(data.geradoEm).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}
        </p>
      </motion.div>

      {/* Novos esta semana */}
      {data.novosEssaSemana.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05, ease: EASE }}
          style={{ marginBottom: "32px" }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
            <Sparkles size={15} style={{ color: "#4ADE80" }} />
            <h2 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "14px", fontWeight: 700, color: "#F5F5F5", margin: 0 }}>
              Novos esta semana
            </h2>
            <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "11px", color: "#4ADE80", fontWeight: 700 }}>
              {data.novosEssaSemana.length} produtos
            </span>
          </div>
          <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" as const }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "10px", minWidth: "460px" }}>
            {data.novosEssaSemana.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: i * 0.04, ease: EASE }}
                style={{
                  background: "#111", border: "1px solid rgba(74,222,128,0.1)",
                  borderRadius: "10px", padding: "12px",
                }}
              >
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", fontWeight: 700, color: "#F5F5F5", margin: "0 0 4px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {p.nome}
                </p>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", color: "rgba(245,245,245,0.35)", margin: "0 0 8px" }}>
                  {p.nicho}
                </p>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                    <TrendingUp size={10} style={{ color: "#4ADE80" }} />
                    <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "12px", fontWeight: 700, color: "#4ADE80" }}>
                      {p.score}
                    </span>
                  </div>
                  {p.link && (
                    <a href={p.link} target="_blank" rel="noopener noreferrer" style={{ color: "rgba(245,245,245,0.35)", display: "flex" }}>
                      <ExternalLink size={12} />
                    </a>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
          </div>
        </motion.section>
      )}

      {/* Ranking por nicho */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1, ease: EASE }}
        style={{ marginBottom: "32px" }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
          <BarChart3 size={15} style={{ color: "#00E5FF" }} />
          <h2 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "14px", fontWeight: 700, color: "#F5F5F5", margin: 0 }}>
            Ranking por nicho
          </h2>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {data.nichos.map((n, i) => {
            const maxScore = Math.max(...data.nichos.map(x => Number(x.avg_score)))
            const pct = maxScore > 0 ? (Number(n.avg_score) / maxScore) * 100 : 0
            return (
              <motion.div
                key={n.nicho}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.1 + i * 0.04, ease: EASE }}
                style={{
                  background: "#111", border: "1px solid rgba(255,255,255,0.05)",
                  borderRadius: "10px", padding: "12px 16px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "12px", fontWeight: 700, color: "rgba(0,229,255,0.5)", width: "20px", flexShrink: 0 }}>
                    #{i + 1}
                  </span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "6px" }}>
                      <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", fontWeight: 700, color: "#F5F5F5" }}>
                        {n.nicho}
                      </span>
                      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "11px", color: "rgba(245,245,245,0.35)" }}>
                          {n.total} produtos
                        </span>
                        <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "12px", fontWeight: 700, color: "#00E5FF" }}>
                          avg {n.avg_score}
                        </span>
                      </div>
                    </div>
                    <div style={{ height: "4px", background: "rgba(255,255,255,0.06)", borderRadius: "2px", overflow: "hidden" }}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.6, delay: 0.2 + i * 0.05, ease: EASE }}
                        style={{ height: "100%", background: "#00E5FF", borderRadius: "2px" }}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </motion.section>

      {/* Top produto por nicho */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.15, ease: EASE }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
          <TrendingUp size={15} style={{ color: "#FF4D00" }} />
          <h2 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "14px", fontWeight: 700, color: "#F5F5F5", margin: 0 }}>
            Top produto por nicho
          </h2>
        </div>
        <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" as const }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "10px", minWidth: "500px" }}>
          {data.topPorNicho.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.15 + i * 0.03, ease: EASE }}
              style={{
                background: "#111", border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: "10px", padding: "12px",
                transition: "border-color 200ms ease",
              }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = "rgba(255,77,0,0.2)")}
              onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)")}
            >
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "10px", fontWeight: 700, color: "rgba(245,245,245,0.3)", textTransform: "uppercase", letterSpacing: "1px", margin: "0 0 6px" }}>
                {p.nicho}
              </p>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", fontWeight: 700, color: "#F5F5F5", margin: "0 0 8px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {p.nome}
              </p>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                {p.preco_medio && (
                  <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "12px", fontWeight: 700, color: "#00E5FF" }}>
                    {p.preco_medio}
                  </span>
                )}
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginLeft: "auto" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "3px" }}>
                    <TrendingUp size={10} style={{ color: "#FF4D00" }} />
                    <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "11px", fontWeight: 700, color: "#FF4D00" }}>
                      {p.score}
                    </span>
                  </div>
                  {p.link && (
                    <a href={p.link} target="_blank" rel="noopener noreferrer" style={{ color: "rgba(245,245,245,0.3)", display: "flex" }}>
                      <ExternalLink size={11} />
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        </div>
      </motion.section>
    </div>
  )
}
