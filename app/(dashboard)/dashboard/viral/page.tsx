"use client"

import { useEffect, useState, useCallback } from "react"
import { motion } from "framer-motion"
import { Flame, ExternalLink, TrendingUp, Lock } from "lucide-react"
import { useAuth } from "@/lib/auth-context"

interface ViralProduto {
  id: string
  nome: string
  nicho: string
  status: string
  descricao: string | null
  imagem_url: string | null
  link: string | null
  preco_medio: string | null
  score: number
  early_access_at: string | null
  updated_at: string
}

const EASE = [0.22, 1, 0.36, 1] as const

function getToken() {
  return typeof window !== "undefined" ? (localStorage.getItem("mf_token") ?? "") : ""
}

export default function ViralPage() {
  const { user } = useAuth()
  const [produtos, setProdutos] = useState<ViralProduto[]>([])
  const [nichos, setNichos] = useState<string[]>([])
  const [nichoAtivo, setNichoAtivo] = useState("")
  const [loading, setLoading] = useState(true)
  const [locked, setLocked] = useState(false)

  const isStarter = user?.plan === "Starter"

  const fetchViral = useCallback(async () => {
    const token = getToken()
    if (!token) return
    setLoading(true)
    try {
      const qs = nichoAtivo ? `?nicho=${encodeURIComponent(nichoAtivo)}` : ""
      const res = await fetch(`/api/viral${qs}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.status === 403) { setLocked(true); setLoading(false); return }
      const data = await res.json()
      setProdutos(data.viral ?? [])
      setNichos(data.nichos ?? [])
    } catch { /* ignore */ }
    setLoading(false)
  }, [nichoAtivo])

  useEffect(() => { fetchViral() }, [fetchViral])

  if (isStarter || locked) {
    return (
      <div style={{ padding: "32px", maxWidth: "600px", margin: "0 auto", textAlign: "center" }}>
        <div style={{
          background: "#111111", border: "1px solid rgba(255,77,0,0.2)",
          borderRadius: "16px", padding: "48px 32px",
        }}>
          <div style={{
            width: "56px", height: "56px", borderRadius: "50%",
            background: "rgba(255,77,0,0.1)", border: "1px solid rgba(255,77,0,0.2)",
            display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px",
          }}>
            <Lock size={24} style={{ color: "#FF4D00" }} />
          </div>
          <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "28px", letterSpacing: "2px", color: "#F5F5F5", margin: "0 0 12px" }}>
            ALERTAS DE VIRAL
          </h2>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "14px", color: "rgba(245,245,245,0.5)", lineHeight: 1.6, margin: "0 0 24px" }}>
            Veja em tempo real quais produtos estão explodindo nas redes, ordenados por score de engajamento.
            Disponível nos planos <strong style={{ color: "#FF4D00" }}>Pro</strong> e{" "}
            <strong style={{ color: "#4ADE80" }}>Agency</strong>.
          </p>
          <a href="/#planos" style={{
            display: "inline-block", background: "#FF4D00", color: "#fff",
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

  return (
    <div style={{ padding: "24px 24px 40px", maxWidth: "1100px" }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: EASE }}
        style={{ marginBottom: "24px" }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "6px" }}>
          <div style={{
            width: "36px", height: "36px", borderRadius: "10px",
            background: "rgba(255,77,0,0.1)", border: "1px solid rgba(255,77,0,0.2)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Flame size={18} style={{ color: "#FF4D00" }} />
          </div>
          <h1 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "20px", fontWeight: 700, color: "#F5F5F5", margin: 0 }}>
            Alertas de Viral
          </h1>
          <span style={{
            background: "rgba(255,77,0,0.1)", border: "1px solid rgba(255,77,0,0.2)",
            color: "#FF4D00", fontFamily: "'DM Sans', sans-serif", fontSize: "10px",
            fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase",
            padding: "2px 8px", borderRadius: "9999px",
          }}>
            Tempo real
          </span>
        </div>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", color: "rgba(245,245,245,0.4)", margin: 0 }}>
          Produtos com <strong style={{ color: "#FF4D00" }}>status em_alta</strong> ordenados pelo maior score de engajamento.
        </p>
      </motion.div>

      {/* Filtro de nichos */}
      {nichos.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "20px" }}
        >
          <button
            onClick={() => setNichoAtivo("")}
            style={{
              padding: "5px 12px", borderRadius: "9999px", cursor: "pointer",
              fontFamily: "'DM Sans', sans-serif", fontSize: "12px", fontWeight: 600,
              background: !nichoAtivo ? "rgba(255,77,0,0.12)" : "transparent",
              border: `1px solid ${!nichoAtivo ? "rgba(255,77,0,0.3)" : "rgba(255,255,255,0.08)"}`,
              color: !nichoAtivo ? "#FF4D00" : "rgba(245,245,245,0.4)",
              transition: "all 150ms ease",
            }}
          >
            Todos
          </button>
          {nichos.map(n => (
            <button
              key={n}
              onClick={() => setNichoAtivo(nichoAtivo === n ? "" : n)}
              style={{
                padding: "5px 12px", borderRadius: "9999px", cursor: "pointer",
                fontFamily: "'DM Sans', sans-serif", fontSize: "12px", fontWeight: 600,
                background: nichoAtivo === n ? "rgba(255,77,0,0.12)" : "transparent",
                border: `1px solid ${nichoAtivo === n ? "rgba(255,77,0,0.3)" : "rgba(255,255,255,0.08)"}`,
                color: nichoAtivo === n ? "#FF4D00" : "rgba(245,245,245,0.4)",
                transition: "all 150ms ease",
              }}
            >
              {n}
            </button>
          ))}
        </motion.div>
      )}

      {/* Grid */}
      {loading ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "12px" }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} style={{ height: "180px", background: "#111", borderRadius: "12px", animation: "pulse 1.5s ease-in-out infinite" }} />
          ))}
        </div>
      ) : produtos.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 0", color: "rgba(245,245,245,0.3)", fontFamily: "'DM Sans', sans-serif", fontSize: "14px" }}>
          Nenhum produto viral encontrado{nichoAtivo ? ` em "${nichoAtivo}"` : ""}.
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "12px" }}
        >
          {produtos.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: i * 0.04, ease: EASE }}
              style={{
                background: "#111111", border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: "12px", overflow: "hidden",
                transition: "border-color 200ms ease",
              }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = "rgba(255,77,0,0.25)")}
              onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)")}
            >
              {p.imagem_url && (
                <div style={{ height: "120px", overflow: "hidden", background: "#0D0D0D" }}>
                  <img src={p.imagem_url} alt={p.nome} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
              )}
              <div style={{ padding: "12px" }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: "8px", marginBottom: "6px" }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", fontWeight: 700, color: "#F5F5F5", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {p.nome}
                    </p>
                    <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", color: "rgba(245,245,245,0.35)", margin: "2px 0 0" }}>
                      {p.nicho}
                    </p>
                  </div>
                  <div style={{
                    display: "flex", alignItems: "center", gap: "3px",
                    background: "rgba(255,77,0,0.1)", border: "1px solid rgba(255,77,0,0.2)",
                    borderRadius: "9999px", padding: "2px 7px", flexShrink: 0,
                  }}>
                    <TrendingUp size={10} style={{ color: "#FF4D00" }} />
                    <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "11px", fontWeight: 700, color: "#FF4D00" }}>
                      {p.score}
                    </span>
                  </div>
                </div>
                {p.descricao && (
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", color: "rgba(245,245,245,0.4)", margin: "0 0 8px", lineHeight: 1.5, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                    {p.descricao}
                  </p>
                )}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  {p.preco_medio && (
                    <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "12px", fontWeight: 700, color: "#00E5FF" }}>
                      {p.preco_medio}
                    </span>
                  )}
                  {p.link && (
                    <a href={p.link} target="_blank" rel="noopener noreferrer" style={{
                      display: "flex", alignItems: "center", gap: "4px",
                      fontFamily: "'DM Sans', sans-serif", fontSize: "11px", fontWeight: 600,
                      color: "#FF4D00", textDecoration: "none",
                    }}>
                      Ver produto <ExternalLink size={10} />
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  )
}
