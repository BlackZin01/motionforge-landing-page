"use client"

import { useEffect, useState, useCallback } from "react"
import { motion } from "framer-motion"
import { BookOpen, Copy, Check, Search, ExternalLink, ChevronDown, Lock } from "lucide-react"
import { useAuth } from "@/lib/auth-context"

// ─── Tipos ────────────────────────────────────────────────────────────────────

interface Prompt {
  id: string
  titulo: string
  descricao: string | null
  conteudo: string
  categoria: string
  modelo_alvo: string
  plano_minimo: string
  midia_url: string | null
  tiktok_url: string | null
  created_at: string
}

// ─── Constantes ───────────────────────────────────────────────────────────────

const EASE_FORGE = [0.22, 1, 0.36, 1] as const

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.5, ease: EASE_FORGE, delay: i * 0.05 },
  }),
}

const MODELO_COLORS: Record<string, { bg: string; color: string }> = {
  ChatGPT: { bg: "rgba(16,163,127,0.12)", color: "#10A37F" },
  Gemini:  { bg: "rgba(66,133,244,0.12)", color: "#4285F4" },
  Ambos:   { bg: "rgba(255,77,0,0.10)",   color: "#FF4D00" },
}

// ─── Card de Prompt ───────────────────────────────────────────────────────────

function PromptCard({ prompt, index, userPlan }: { prompt: Prompt; index: number; userPlan?: string }) {
  const planOrder: Record<string, number> = { starter: 0, pro: 1, agency: 2 }
  const userLevel  = planOrder[userPlan?.toLowerCase() ?? "starter"] ?? 0
  const needsLevel = planOrder[prompt.plano_minimo?.toLowerCase() ?? "starter"] ?? 0
  const locked = needsLevel > userLevel
  const [copied, setCopied] = useState(false)
  const [expanded, setExpanded] = useState(false)

  const cor = MODELO_COLORS[prompt.modelo_alvo] ?? { bg: "rgba(255,255,255,0.06)", color: "rgba(245,245,245,0.5)" }
  const isVideo = Boolean(prompt.midia_url && /\.(mp4|mov|webm)(\?.*)?$/i.test(prompt.midia_url))

  async function handleCopy() {
    await navigator.clipboard.writeText(prompt.conteudo)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (locked) {
    return (
      <motion.div
        custom={index} variants={fadeUp} initial="hidden" animate="visible"
        style={{
          background: "#111111", border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: "12px", overflow: "hidden", display: "flex",
          flexDirection: "column", position: "relative",
        }}
      >
        {/* Conteúdo borrado */}
        <div style={{ filter: "blur(4px)", opacity: 0.35, pointerEvents: "none", userSelect: "none" }}>
          {prompt.midia_url && (
            <div style={{ width: "100%", aspectRatio: "9/16", background: "#0D0D0D" }} />
          )}
          <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "10px" }}>
            <div style={{ height: "12px", background: "rgba(255,255,255,0.1)", borderRadius: "4px", width: "60%" }} />
            <div style={{ height: "10px", background: "rgba(255,255,255,0.06)", borderRadius: "4px", width: "40%" }} />
            <div style={{ height: "80px", background: "rgba(255,255,255,0.04)", borderRadius: "8px" }} />
          </div>
        </div>
        {/* Overlay de lock */}
        <div style={{
          position: "absolute", inset: 0,
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          gap: "10px", padding: "24px", textAlign: "center",
          background: "rgba(10,10,10,0.6)",
        }}>
          <div style={{
            width: "44px", height: "44px", borderRadius: "12px",
            background: "rgba(255,77,0,0.1)", border: "1px solid rgba(255,77,0,0.25)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Lock size={20} style={{ color: "#FF4D00" }} />
          </div>
          <div>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", fontWeight: 700, color: "#F5F5F5", margin: "0 0 4px" }}>
              Prompt exclusivo {prompt.plano_minimo?.toUpperCase()}
            </p>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", color: "rgba(245,245,245,0.4)", margin: 0 }}>
              Faça upgrade para desbloquear
            </p>
          </div>
          <a
            href="/#planos"
            style={{
              padding: "8px 20px", borderRadius: "8px",
              background: "#FF4D00", color: "white", textDecoration: "none",
              fontFamily: "'DM Sans', sans-serif", fontSize: "12px", fontWeight: 700,
            }}
          >
            Ver planos
          </a>
        </div>
      </motion.div>
    )
  }

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
      {/* ── Mídia (vídeo ou foto) ───────────────────────────────────────────── */}
      {prompt.midia_url && (
        <div style={{ width: "100%", aspectRatio: "9/16", background: "#0D0D0D", overflow: "hidden", flexShrink: 0 }}>
          {isVideo ? (
            <video
              src={prompt.midia_url}
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              controls
              playsInline
              muted
              loop
            />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={prompt.midia_url}
              alt={prompt.titulo}
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            />
          )}
        </div>
      )}

      {/* ── Conteúdo ────────────────────────────────────────────────────────── */}
      <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "12px", flex: 1 }}>
        {/* Badges + título + descrição */}
        <div>
          <div style={{ display: "flex", gap: "6px", marginBottom: "8px", flexWrap: "wrap" }}>
            <span style={{
              display: "inline-block", fontSize: "10px", fontWeight: 700,
              textTransform: "uppercase", letterSpacing: "1.5px", padding: "2px 8px",
              borderRadius: "9999px", background: cor.bg, color: cor.color,
              fontFamily: "'DM Sans', sans-serif",
            }}>
              {prompt.modelo_alvo}
            </span>
            <span style={{
              display: "inline-block", fontSize: "10px", fontWeight: 700,
              textTransform: "uppercase", letterSpacing: "1.5px", padding: "2px 8px",
              borderRadius: "9999px", background: "rgba(255,255,255,0.05)", color: "rgba(245,245,245,0.35)",
              fontFamily: "'DM Sans', sans-serif",
            }}>
              {prompt.categoria}
            </span>
          </div>
          <h3 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "14px", fontWeight: 700, color: "#F5F5F5", margin: 0 }}>
            {prompt.titulo}
          </h3>
          {prompt.descricao && (
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "12px", color: "rgba(245,245,245,0.4)", marginTop: "4px", marginBottom: 0 }}>
              {prompt.descricao}
            </p>
          )}
        </div>

        {/* Conteúdo do prompt */}
        <div style={{
          background: "#0D0D0D",
          border: "1px solid rgba(255,255,255,0.05)",
          borderRadius: "8px",
          padding: "14px",
          position: "relative",
          overflow: "hidden",
          maxHeight: expanded ? "none" : "96px",
          transition: "max-height 300ms ease",
        }}>
          <pre style={{
            fontFamily: "'DM Sans', sans-serif", fontSize: "12px",
            color: "rgba(245,245,245,0.7)", whiteSpace: "pre-wrap",
            wordBreak: "break-word", margin: 0, lineHeight: 1.6,
          }}>
            {prompt.conteudo}
          </pre>
          {!expanded && (
            <div style={{
              position: "absolute", bottom: 0, left: 0, right: 0, height: "40px",
              background: "linear-gradient(to bottom, transparent, #0D0D0D)",
            }} />
          )}
        </div>

        {/* Toggle expandir */}
        <button
          onClick={() => setExpanded(!expanded)}
          style={{
            display: "flex", alignItems: "center", gap: "4px",
            background: "transparent", border: "none", cursor: "pointer",
            color: "rgba(245,245,245,0.35)", fontSize: "11px",
            fontFamily: "'DM Sans', sans-serif", fontWeight: 600,
            padding: 0, alignSelf: "flex-start",
            transition: "color 150ms ease",
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = "#FF4D00" }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = "rgba(245,245,245,0.35)" }}
        >
          <ChevronDown size={13} style={{ transform: expanded ? "rotate(180deg)" : "none", transition: "transform 200ms ease" }} />
          {expanded ? "Ver menos" : "Ver prompt completo"}
        </button>

        {/* ── Botões de ação ─────────────────────────────────────────────────── */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "auto", paddingTop: "4px" }}>
          <button
            onClick={handleCopy}
            style={{
              width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
              background: copied ? "rgba(16,163,127,0.12)" : "rgba(255,77,0,0.10)",
              border: "1px solid " + (copied ? "rgba(16,163,127,0.3)" : "rgba(255,77,0,0.3)"),
              color: copied ? "#10A37F" : "#FF4D00",
              fontFamily: "'DM Sans', sans-serif", fontSize: "12px", fontWeight: 700,
              padding: "10px 14px", borderRadius: "8px", cursor: "pointer",
              transition: "all 200ms ease",
            }}
          >
            {copied ? <Check size={13} /> : <Copy size={13} />}
            {copied ? "Copiado!" : "Copiar prompt"}
          </button>

          {prompt.tiktok_url && (
            <a
              href={prompt.tiktok_url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                background: "#111827",
                border: "1px solid rgba(255,255,255,0.08)",
                color: "rgba(245,245,245,0.75)",
                fontFamily: "'DM Sans', sans-serif", fontSize: "12px", fontWeight: 700,
                padding: "10px 14px", borderRadius: "8px", cursor: "pointer",
                textDecoration: "none", transition: "all 200ms ease",
                boxSizing: "border-box",
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLAnchorElement
                el.style.background = "#000000"
                el.style.borderColor = "rgba(255,255,255,0.18)"
                el.style.color = "#ffffff"
                el.style.transform = "translateY(-1px)"
                el.style.boxShadow = "0 4px 12px rgba(0,0,0,0.4)"
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLAnchorElement
                el.style.background = "#111827"
                el.style.borderColor = "rgba(255,255,255,0.08)"
                el.style.color = "rgba(245,245,245,0.75)"
                el.style.transform = "translateY(0)"
                el.style.boxShadow = "none"
              }}
            >
              {/* Ícone TikTok SVG */}
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.82a8.18 8.18 0 0 0 4.78 1.52V6.9a4.85 4.85 0 0 1-1.01-.21z"/>
              </svg>
              Ver no TikTok
            </a>
          )}
        </div>
      </div>
    </motion.div>
  )
}

// ─── Página principal ─────────────────────────────────────────────────────────

export default function PromptsPage() {
  const { user } = useAuth()
  const [prompts, setPrompts] = useState<Prompt[]>([])
  const [categorias, setCategorias] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [busca, setBusca] = useState("")
  const [categoriaAtiva, setCategoriaAtiva] = useState("")
  const [modeloAtivo, setModeloAtivo] = useState("")

  const fetchPrompts = useCallback(async () => {
    const token = localStorage.getItem("mf_token")
    if (!token) return
    setLoading(true)
    try {
      const qs = new URLSearchParams({
        ...(categoriaAtiva ? { categoria: categoriaAtiva } : {}),
        ...(modeloAtivo    ? { modelo: modeloAtivo }       : {}),
      })
      const res = await fetch(`/api/prompts?${qs}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) return
      const data = await res.json()
      setPrompts(data.prompts ?? [])
      setCategorias(data.categorias ?? [])
    } finally {
      setLoading(false)
    }
  }, [user, categoriaAtiva, modeloAtivo])

  useEffect(() => { fetchPrompts() }, [fetchPrompts])

  const promptsFiltrados = prompts.filter(p =>
    busca === "" ||
    p.titulo.toLowerCase().includes(busca.toLowerCase()) ||
    p.descricao?.toLowerCase().includes(busca.toLowerCase()) ||
    p.categoria.toLowerCase().includes(busca.toLowerCase())
  )

  const MODELOS = ["ChatGPT", "Gemini", "Ambos"]

  return (
    <div style={{ padding: "24px", maxWidth: "1200px", margin: "0 auto" }}>
      {/* Header */}
      <motion.div
        variants={fadeUp} custom={0} initial="hidden" animate="visible"
        style={{ marginBottom: "24px" }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "6px" }}>
          <BookOpen size={20} style={{ color: "#FF4D00" }} />
          <h1 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "20px", fontWeight: 700, color: "#F5F5F5", margin: 0 }}>
            Biblioteca de Prompts
          </h1>
        </div>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", color: "rgba(245,245,245,0.4)", margin: 0 }}>
          Prompts prontos para ChatGPT, Gemini e outros modelos. Copie e use.
        </p>
      </motion.div>

      {/* Filtros */}
      <motion.div
        variants={fadeUp} custom={1} initial="hidden" animate="visible"
        style={{ display: "flex", gap: "10px", marginBottom: "24px", flexWrap: "wrap" }}
      >
        {/* Busca */}
        <div style={{
          display: "flex", alignItems: "center", gap: "8px",
          background: "#111111", border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "8px", padding: "0 12px", flex: "1", minWidth: "200px",
        }}>
          <Search size={14} style={{ color: "rgba(245,245,245,0.3)", flexShrink: 0 }} />
          <input
            type="text"
            placeholder="Buscar prompt..."
            value={busca}
            onChange={e => setBusca(e.target.value)}
            style={{
              background: "transparent", border: "none", outline: "none", width: "100%",
              color: "#F5F5F5", fontFamily: "'DM Sans', sans-serif", fontSize: "13px", padding: "10px 0",
            }}
          />
        </div>

        {/* Filtro modelo */}
        {["", ...MODELOS].map(m => (
          <button
            key={m || "todos"}
            onClick={() => setModeloAtivo(m)}
            style={{
              padding: "8px 14px", borderRadius: "8px", cursor: "pointer",
              fontFamily: "'DM Sans', sans-serif", fontSize: "12px", fontWeight: 700,
              border: "1px solid",
              background: modeloAtivo === m ? "rgba(255,77,0,0.10)" : "transparent",
              borderColor: modeloAtivo === m ? "rgba(255,77,0,0.4)" : "rgba(255,255,255,0.08)",
              color: modeloAtivo === m ? "#FF4D00" : "rgba(245,245,245,0.4)",
              transition: "all 150ms ease",
            }}
          >
            {m || "Todos"}
          </button>
        ))}
      </motion.div>

      {/* Categorias */}
      {categorias.length > 0 && (
        <motion.div
          variants={fadeUp} custom={2} initial="hidden" animate="visible"
          style={{ display: "flex", gap: "8px", marginBottom: "20px", flexWrap: "wrap" }}
        >
          {["", ...categorias].map(cat => (
            <button
              key={cat || "todas"}
              onClick={() => setCategoriaAtiva(cat)}
              style={{
                padding: "5px 12px", borderRadius: "9999px", cursor: "pointer",
                fontFamily: "'DM Sans', sans-serif", fontSize: "11px", fontWeight: 700,
                textTransform: "uppercase", letterSpacing: "1px",
                border: "1px solid",
                background: categoriaAtiva === cat ? "#FF4D00" : "transparent",
                borderColor: categoriaAtiva === cat ? "#FF4D00" : "rgba(255,255,255,0.08)",
                color: categoriaAtiva === cat ? "white" : "rgba(245,245,245,0.4)",
                transition: "all 150ms ease",
              }}
            >
              {cat || "Todas"}
            </button>
          ))}
        </motion.div>
      )}

      {/* Grid de prompts */}
      {loading ? (
        <div style={{ display: "grid", gap: "16px", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" }}>
          {[0, 1, 2, 3, 4, 5].map(i => (
            <div key={i} style={{ height: "180px", background: "#111111", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.06)", animation: "pulse 1.5s ease infinite" }} />
          ))}
        </div>
      ) : promptsFiltrados.length === 0 ? (
        <div style={{ textAlign: "center", padding: "64px 24px" }}>
          <BookOpen size={40} style={{ color: "rgba(255,255,255,0.1)", margin: "0 auto 16px" }} />
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "14px", color: "rgba(245,245,245,0.3)" }}>
            {busca || categoriaAtiva || modeloAtivo ? "Nenhum prompt encontrado com esses filtros." : "Nenhum prompt cadastrado ainda."}
          </p>
        </div>
      ) : (
        <div style={{ display: "grid", gap: "16px", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" }}>
          {promptsFiltrados.map((p, i) => (
            <PromptCard key={p.id} prompt={p} index={i} userPlan={user?.isAdmin ? "Agency" : user?.plan} />
          ))}
        </div>
      )}
    </div>
  )
}
