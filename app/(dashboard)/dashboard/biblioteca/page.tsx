"use client"

import { useEffect, useState, useCallback } from "react"
import { motion } from "framer-motion"
import { ShoppingBag, ExternalLink, Search, Flame, TrendingUp, Crown, Sparkles, Zap, Lock } from "lucide-react"
import { useAuth } from "@/lib/auth-context"

// ─── Tipos ────────────────────────────────────────────────────────────────────

interface Produto {
  id: string
  nome: string
  nicho: string
  status: string
  descricao: string | null
  imagem_url: string | null
  link: string | null
  preco_medio: string | null
  score: number
  plano_minimo: string
  early_access_at: string | null
  created_at: string
}

// ─── Constantes ───────────────────────────────────────────────────────────────

const EASE_FORGE = [0.22, 1, 0.36, 1] as const

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.5, ease: EASE_FORGE, delay: i * 0.04 },
  }),
}

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
  viral:      { label: "Viral",      color: "#FF4D00", bg: "rgba(255,77,0,0.12)",    icon: <Flame size={11} /> },
  em_alta:    { label: "Em Alta",    color: "#00E5FF", bg: "rgba(0,229,255,0.10)",   icon: <TrendingUp size={11} /> },
  top_vendas: { label: "Top Vendas", color: "#FFD700", bg: "rgba(255,215,0,0.10)",   icon: <Crown size={11} /> },
  promissor:  { label: "Promissor",  color: "#A78BFA", bg: "rgba(167,139,250,0.10)", icon: <Sparkles size={11} /> },
}

// ─── Card de Produto ──────────────────────────────────────────────────────────

function ProdutoCard({ produto, index }: { produto: Produto; index: number }) {
  const st = STATUS_CONFIG[produto.status] ?? STATUS_CONFIG["em_alta"]
  const isEarlyAccess = produto.early_access_at != null && new Date(produto.early_access_at) > new Date()

  return (
    <motion.div
      custom={index}
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      style={{
        background: "#111111",
        border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: "12px",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Imagem */}
      <div style={{
        width: "100%", height: "180px",
        background: "#0D0D0D",
        position: "relative",
        overflow: "hidden",
        flexShrink: 0,
      }}>
        {produto.imagem_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={produto.imagem_url}
            alt={produto.nome}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <div style={{
            width: "100%", height: "100%",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <ShoppingBag size={40} style={{ color: "rgba(255,255,255,0.06)" }} />
          </div>
        )}

        {/* Badge status */}
        <div style={{
          position: "absolute", top: "10px", left: "10px",
          display: "flex", alignItems: "center", gap: "4px",
          background: st.bg, color: st.color,
          border: "1px solid " + st.color + "44",
          borderRadius: "9999px", padding: "4px 10px",
          fontSize: "10px", fontWeight: 700,
          textTransform: "uppercase", letterSpacing: "1px",
          fontFamily: "'DM Sans', sans-serif",
        }}>
          {st.icon}
          {st.label}
        </div>

        {/* Badge acesso antecipado (Agency) */}
        {isEarlyAccess && (
          <div style={{
            position: "absolute", bottom: "10px", left: "10px",
            display: "flex", alignItems: "center", gap: "4px",
            background: "rgba(74,222,128,0.15)", color: "#4ADE80",
            border: "1px solid rgba(74,222,128,0.3)",
            borderRadius: "9999px", padding: "3px 8px",
            fontSize: "9px", fontWeight: 700,
            textTransform: "uppercase", letterSpacing: "1px",
            fontFamily: "'DM Sans', sans-serif",
          }}>
            <Sparkles size={9} /> Acesso antecipado
          </div>
        )}

        {/* Score */}
        {produto.score > 0 && (
          <div style={{
            position: "absolute", top: "10px", right: "10px",
            background: "rgba(0,0,0,0.7)", borderRadius: "9999px",
            padding: "4px 10px", fontSize: "11px", fontWeight: 700,
            color: "#00E5FF", fontFamily: "'Space Grotesk', sans-serif",
          }}>
            {produto.score}
          </div>
        )}
      </div>

      {/* Conteúdo */}
      <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "8px", flex: 1 }}>
        {/* Nicho */}
        <span style={{
          fontSize: "10px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "2px",
          color: "rgba(245,245,245,0.3)", fontFamily: "'DM Sans', sans-serif",
        }}>
          {produto.nicho}
        </span>

        {/* Nome */}
        <h3 style={{
          fontFamily: "'DM Sans', sans-serif", fontSize: "14px", fontWeight: 700,
          color: "#F5F5F5", margin: 0, lineHeight: 1.3,
        }}>
          {produto.nome}
        </h3>

        {/* Descrição */}
        {produto.descricao && (
          <p style={{
            fontFamily: "'DM Sans', sans-serif", fontSize: "12px",
            color: "rgba(245,245,245,0.4)", margin: 0, lineHeight: 1.5,
          }}>
            {produto.descricao}
          </p>
        )}

        {/* Preço e link */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "auto", paddingTop: "8px" }}>
          {produto.preco_medio && (
            <span style={{
              fontFamily: "'Space Grotesk', sans-serif", fontSize: "13px", fontWeight: 700, color: "#00E5FF",
            }}>
              {produto.preco_medio}
            </span>
          )}

          {produto.link && (
            <a
              href={produto.link}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "flex", alignItems: "center", gap: "5px",
                background: "rgba(255,77,0,0.10)", border: "1px solid rgba(255,77,0,0.3)",
                color: "#FF4D00", padding: "6px 12px", borderRadius: "8px",
                fontFamily: "'DM Sans', sans-serif", fontSize: "11px", fontWeight: 700,
                textDecoration: "none", textTransform: "uppercase", letterSpacing: "1px",
                transition: "all 150ms ease",
                marginLeft: "auto",
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = "rgba(255,77,0,0.18)" }}
              onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = "rgba(255,77,0,0.10)" }}
            >
              Ver produto <ExternalLink size={11} />
            </a>
          )}
        </div>
      </div>
    </motion.div>
  )
}

// ─── Página principal ─────────────────────────────────────────────────────────

export default function BibliotecaPage() {
  const { user } = useAuth()
  const [produtos, setProdutos] = useState<Produto[]>([])
  const [nichos, setNichos] = useState<string[]>([])
  const [stats, setStats] = useState<{ status: string; count: string }[]>([])
  const [limitePlano, setLimitePlano] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [busca, setBusca] = useState("")
  const [nichoAtivo, setNichoAtivo] = useState("")
  const [statusAtivo, setStatusAtivo] = useState("")

  const fetchBiblioteca = useCallback(async () => {
    const token = localStorage.getItem("mf_token")
    if (!token || !user) return
    setLoading(true)
    try {
      const qs = new URLSearchParams({
        ...(nichoAtivo  ? { nicho: nichoAtivo }   : {}),
        ...(statusAtivo ? { status: statusAtivo } : {}),
      })
      const res = await fetch(`/api/biblioteca?${qs}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) return
      const data = await res.json()
      setProdutos(data.produtos ?? [])
      setNichos(data.nichos ?? [])
      setStats(data.stats ?? [])
      if (data.limite_plano) setLimitePlano(data.limite_plano)
    } finally {
      setLoading(false)
    }
  }, [user, nichoAtivo, statusAtivo])

  useEffect(() => { fetchBiblioteca() }, [fetchBiblioteca])

  const produtosFiltrados = produtos.filter(p =>
    busca === "" ||
    p.nome.toLowerCase().includes(busca.toLowerCase()) ||
    p.nicho.toLowerCase().includes(busca.toLowerCase()) ||
    p.descricao?.toLowerCase().includes(busca.toLowerCase())
  )

  const totalPorStatus = (s: string) => {
    const found = stats.find(r => r.status === s)
    return found ? Number(found.count) : 0
  }

  return (
    <div style={{ padding: "24px", maxWidth: "1400px", margin: "0 auto" }}>
      {/* Header */}
      <motion.div
        variants={fadeUp} custom={0} initial="hidden" animate="visible"
        style={{ marginBottom: "24px" }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "6px" }}>
          <ShoppingBag size={20} style={{ color: "#FF4D00" }} />
          <h1 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "20px", fontWeight: 700, color: "#F5F5F5", margin: 0 }}>
            Biblioteca de Anúncios
          </h1>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", color: "rgba(245,245,245,0.4)", margin: 0 }}>
            Produtos validados e em alta no TikTok Shopping. Curado semanalmente.
          </p>
          {limitePlano !== null && (
            <span style={{
              fontFamily: "'Space Grotesk', sans-serif", fontSize: "12px", fontWeight: 700,
              color: user?.plan === "Starter" && !user?.isAdmin ? "#FF4D00" : "#00E5FF",
              background: user?.plan === "Starter" && !user?.isAdmin ? "rgba(255,77,0,0.08)" : "rgba(0,229,255,0.06)",
              border: `1px solid ${user?.plan === "Starter" && !user?.isAdmin ? "rgba(255,77,0,0.25)" : "rgba(0,229,255,0.2)"}`,
              borderRadius: "9999px", padding: "3px 10px",
            }}>
              {produtos.length}/{limitePlano} produtos
            </span>
          )}
        </div>
      </motion.div>

      {/* ── Alerta Viral (Pro+) ──────────────────────────────────────────────── */}
      {user?.plan === "Starter" && !user?.isAdmin ? (
        <motion.div
          variants={fadeUp} custom={1} initial="hidden" animate="visible"
          style={{
            marginBottom: "24px",
            padding: "16px 20px",
            background: "rgba(255,77,0,0.04)",
            border: "1px solid rgba(255,77,0,0.15)",
            borderRadius: "12px",
            display: "flex",
            alignItems: "center",
            gap: "14px",
          }}
        >
          <div style={{
            width: "36px", height: "36px", borderRadius: "8px", flexShrink: 0,
            background: "rgba(255,77,0,0.08)", border: "1px solid rgba(255,77,0,0.2)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Lock size={16} style={{ color: "#FF4D00" }} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", fontWeight: 700, color: "#F5F5F5", margin: "0 0 2px" }}>
              Alertas de Produto Viral — disponível no Pro
            </p>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "12px", color: "rgba(245,245,245,0.4)", margin: 0 }}>
              Receba notificações em tempo real quando um produto explodir no TikTok Shop antes da concorrência.
            </p>
          </div>
          <a
            href="/#planos"
            style={{
              flexShrink: 0, padding: "8px 16px", borderRadius: "8px",
              background: "#FF4D00", color: "white", textDecoration: "none",
              fontFamily: "'DM Sans', sans-serif", fontSize: "12px", fontWeight: 700,
              whiteSpace: "nowrap",
            }}
          >
            Fazer upgrade
          </a>
        </motion.div>
      ) : (
        <motion.div
          variants={fadeUp} custom={1} initial="hidden" animate="visible"
          style={{ marginBottom: "24px" }}
        >
          <div style={{
            padding: "16px 20px",
            background: "rgba(255,77,0,0.06)",
            border: "1px solid rgba(255,77,0,0.25)",
            borderRadius: "12px",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
              <motion.div
                animate={{ scale: [1, 1.3, 1], opacity: [1, 0.6, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                style={{
                  width: "8px", height: "8px", borderRadius: "50%",
                  background: "#FF4D00", boxShadow: "0 0 8px rgba(255,77,0,0.8)",
                }}
              />
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", fontWeight: 700, color: "#FF4D00", textTransform: "uppercase", letterSpacing: "1.5px" }}>
                Alertas Virais · Ao vivo
              </span>
            </div>
            {produtos.filter(p => p.status === "viral").length === 0 ? (
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", color: "rgba(245,245,245,0.4)", margin: 0 }}>
                Nenhum produto explodindo no momento. Avisamos quando rolar.
              </p>
            ) : (
              <div style={{ display: "flex", gap: "10px", overflowX: "auto", scrollbarWidth: "none", paddingBottom: "4px" }}>
                {produtos.filter(p => p.status === "viral").slice(0, 5).map(p => (
                  <div key={p.id} style={{
                    flexShrink: 0, minWidth: "200px",
                    background: "#111111", border: "1px solid rgba(255,77,0,0.2)",
                    borderRadius: "10px", padding: "12px 14px",
                    display: "flex", alignItems: "center", gap: "10px",
                  }}>
                    <Zap size={14} style={{ color: "#FF4D00", flexShrink: 0 }} />
                    <div style={{ minWidth: 0 }}>
                      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "12px", fontWeight: 700, color: "#F5F5F5", margin: "0 0 2px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {p.nome}
                      </p>
                      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "10px", color: "rgba(245,245,245,0.4)", margin: 0, textTransform: "uppercase", letterSpacing: "1px" }}>
                        {p.nicho} · Score {p.score}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Stats rápidos */}
      <motion.div
        variants={fadeUp} custom={1} initial="hidden" animate="visible"
        style={{ display: "flex", gap: "8px", marginBottom: "24px", flexWrap: "wrap" }}
      >
        {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
          <button
            key={key}
            onClick={() => setStatusAtivo(statusAtivo === key ? "" : key)}
            style={{
              display: "flex", alignItems: "center", gap: "6px",
              padding: "8px 14px", borderRadius: "8px", cursor: "pointer",
              fontFamily: "'DM Sans', sans-serif", fontSize: "12px", fontWeight: 700,
              border: "1px solid",
              background: statusAtivo === key ? cfg.bg : "transparent",
              borderColor: statusAtivo === key ? cfg.color + "66" : "rgba(255,255,255,0.08)",
              color: statusAtivo === key ? cfg.color : "rgba(245,245,245,0.4)",
              transition: "all 150ms ease",
            }}
          >
            {cfg.icon}
            {cfg.label}
            <span style={{
              background: "rgba(255,255,255,0.08)", borderRadius: "9999px",
              padding: "1px 7px", fontSize: "10px",
            }}>
              {totalPorStatus(key)}
            </span>
          </button>
        ))}
      </motion.div>

      {/* Busca + filtro nicho */}
      <motion.div
        variants={fadeUp} custom={2} initial="hidden" animate="visible"
        style={{ display: "flex", gap: "10px", marginBottom: "16px", flexWrap: "wrap" }}
      >
        <div style={{
          display: "flex", alignItems: "center", gap: "8px",
          background: "#111111", border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "8px", padding: "0 12px", flex: "1", minWidth: "200px",
        }}>
          <Search size={14} style={{ color: "rgba(245,245,245,0.3)", flexShrink: 0 }} />
          <input
            type="text"
            placeholder="Buscar produto ou nicho..."
            value={busca}
            onChange={e => setBusca(e.target.value)}
            style={{
              background: "transparent", border: "none", outline: "none", width: "100%",
              color: "#F5F5F5", fontFamily: "'DM Sans', sans-serif", fontSize: "13px", padding: "10px 0",
            }}
          />
        </div>
      </motion.div>

      {/* Nichos */}
      {nichos.length > 0 && (
        <motion.div
          variants={fadeUp} custom={3} initial="hidden" animate="visible"
          style={{ display: "flex", gap: "8px", marginBottom: "20px", flexWrap: "wrap" }}
        >
          {["", ...nichos].map(n => (
            <button
              key={n || "todos"}
              onClick={() => setNichoAtivo(n)}
              style={{
                padding: "5px 12px", borderRadius: "9999px", cursor: "pointer",
                fontFamily: "'DM Sans', sans-serif", fontSize: "11px", fontWeight: 700,
                textTransform: "uppercase", letterSpacing: "1px",
                border: "1px solid",
                background: nichoAtivo === n ? "#FF4D00" : "transparent",
                borderColor: nichoAtivo === n ? "#FF4D00" : "rgba(255,255,255,0.08)",
                color: nichoAtivo === n ? "white" : "rgba(245,245,245,0.4)",
                transition: "all 150ms ease",
              }}
            >
              {n || "Todos"}
            </button>
          ))}
        </motion.div>
      )}

      {/* Grid de produtos */}
      {loading ? (
        <div style={{ display: "grid", gap: "12px", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))" }}>
          {[0, 1, 2, 3, 4, 5, 6, 7].map(i => (
            <div key={i} style={{ height: "320px", background: "#111111", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.06)" }} />
          ))}
        </div>
      ) : produtosFiltrados.length === 0 ? (
        <div style={{ textAlign: "center", padding: "64px 24px" }}>
          <ShoppingBag size={40} style={{ color: "rgba(255,255,255,0.1)", margin: "0 auto 16px" }} />
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "14px", color: "rgba(245,245,245,0.3)" }}>
            {busca || nichoAtivo || statusAtivo ? "Nenhum produto encontrado com esses filtros." : "Nenhum produto cadastrado ainda."}
          </p>
        </div>
      ) : (
        <div style={{ display: "grid", gap: "12px", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))" }}>
          {produtosFiltrados.map((p, i) => (
            <ProdutoCard key={p.id} produto={p} index={i} />
          ))}
        </div>
      )}
    </div>
  )
}
