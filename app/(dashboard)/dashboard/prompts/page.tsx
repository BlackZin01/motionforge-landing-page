"use client"

import { useEffect, useState, useCallback } from "react"
import { motion } from "framer-motion"
import { BookOpen, Copy, Check, Search, ChevronDown, Wand2, Loader2 } from "lucide-react"
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

function PromptCard({ prompt, index }: { prompt: Prompt; index: number }) {
  const [copied, setCopied] = useState(false)
  const [expanded, setExpanded] = useState(false)

  const cor = MODELO_COLORS[prompt.modelo_alvo] ?? { bg: "rgba(255,255,255,0.06)", color: "rgba(245,245,245,0.5)" }

  async function handleCopy() {
    await navigator.clipboard.writeText(prompt.conteudo)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
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
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "12px" }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Badges */}
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

          {/* Título */}
          <h3 style={{
            fontFamily: "'DM Sans', sans-serif", fontSize: "14px", fontWeight: 700,
            color: "#F5F5F5", margin: 0,
          }}>
            {prompt.titulo}
          </h3>

          {/* Descrição */}
          {prompt.descricao && (
            <p style={{
              fontFamily: "'DM Sans', sans-serif", fontSize: "12px",
              color: "rgba(245,245,245,0.4)", marginTop: "4px",
            }}>
              {prompt.descricao}
            </p>
          )}
        </div>

        {/* Botão copiar */}
        <button
          onClick={handleCopy}
          title="Copiar prompt"
          style={{
            flexShrink: 0, display: "flex", alignItems: "center", gap: "6px",
            background: copied ? "rgba(16,163,127,0.12)" : "rgba(255,77,0,0.10)",
            border: "1px solid " + (copied ? "rgba(16,163,127,0.3)" : "rgba(255,77,0,0.3)"),
            color: copied ? "#10A37F" : "#FF4D00",
            fontFamily: "'DM Sans', sans-serif", fontSize: "12px", fontWeight: 700,
            padding: "8px 14px", borderRadius: "8px", cursor: "pointer",
            transition: "all 200ms ease",
          }}
        >
          {copied ? <Check size={13} /> : <Copy size={13} />}
          {copied ? "Copiado!" : "Copiar"}
        </button>
      </div>

      {/* Conteúdo do prompt */}
      <div
        style={{
          background: "#0D0D0D",
          border: "1px solid rgba(255,255,255,0.05)",
          borderRadius: "8px",
          padding: "14px",
          position: "relative",
          overflow: "hidden",
          maxHeight: expanded ? "none" : "100px",
          transition: "max-height 300ms ease",
        }}
      >
        <pre style={{
          fontFamily: "'DM Sans', sans-serif", fontSize: "12px",
          color: "rgba(245,245,245,0.7)", whiteSpace: "pre-wrap",
          wordBreak: "break-word", margin: 0,
        }}>
          {prompt.conteudo}
        </pre>

        {/* Gradiente de fade quando colapsado */}
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
        <ChevronDown
          size={13}
          style={{ transform: expanded ? "rotate(180deg)" : "none", transition: "transform 200ms ease" }}
        />
        {expanded ? "Ver menos" : "Ver prompt completo"}
      </button>
    </motion.div>
  )
}

// ─── Copy Generator ───────────────────────────────────────────────────────────

interface CopyResult {
  hooks: string[]
  ctas: string[]
  script: string
}

function CopyGenerator() {
  const [produto, setProduto]       = useState("")
  const [nicho, setNicho]           = useState("")
  const [diferencial, setDiferencial] = useState("")
  const [tom, setTom]               = useState("urgência e desejo")
  const [loading, setLoading]       = useState(false)
  const [result, setResult]         = useState<CopyResult | null>(null)
  const [error, setError]           = useState("")
  const [copiedKey, setCopiedKey]   = useState<string | null>(null)
  const [open, setOpen]             = useState(true)

  async function handleGenerate() {
    if (!produto.trim() || !nicho.trim()) {
      setError("Preencha pelo menos produto e nicho.")
      return
    }
    setError("")
    setLoading(true)
    setResult(null)
    try {
      const res = await fetch("/api/generate-copy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ produto, nicho, diferencial, tom }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error ?? "Erro ao gerar."); return }
      setResult(data)
    } catch {
      setError("Erro de conexão. Tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  async function handleCopy(text: string, key: string) {
    await navigator.clipboard.writeText(text)
    setCopiedKey(key)
    setTimeout(() => setCopiedKey(null), 2000)
  }

  const INPUT_STYLE: React.CSSProperties = {
    background: "#0D0D0D",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "8px",
    padding: "10px 14px",
    fontSize: "13px",
    color: "#F5F5F5",
    fontFamily: "'DM Sans', sans-serif",
    width: "100%",
    outline: "none",
  }

  const TONS = ["urgência e desejo", "emocional", "direto e objetivo", "humor", "autoridade"]

  return (
    <div style={{
      background: "#111111",
      border: "1px solid rgba(255,77,0,0.15)",
      borderRadius: "16px",
      marginBottom: "32px",
      overflow: "hidden",
    }}>
      {/* Header */}
      <button
        onClick={() => setOpen(v => !v)}
        style={{
          width: "100%", display: "flex", alignItems: "center", gap: "12px",
          padding: "18px 20px", background: "transparent", border: "none",
          cursor: "pointer", textAlign: "left",
        }}
      >
        <div style={{
          width: "36px", height: "36px", borderRadius: "10px",
          background: "rgba(255,77,0,0.12)", display: "flex",
          alignItems: "center", justifyContent: "center", flexShrink: 0,
        }}>
          <Wand2 size={18} style={{ color: "#FF4D00" }} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "15px", fontWeight: 700, color: "#F5F5F5" }}>
            Gerador de Copy com IA
          </div>
          <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "12px", color: "rgba(245,245,245,0.4)", marginTop: "2px" }}>
            Descreva seu produto e a IA gera hooks, CTAs e script de vídeo prontos
          </div>
        </div>
        <ChevronDown
          size={16}
          style={{ color: "rgba(245,245,245,0.4)", transform: open ? "rotate(180deg)" : "none", transition: "transform 200ms ease", flexShrink: 0 }}
        />
      </button>

      {open && (
        <div style={{ padding: "0 20px 20px" }}>
          <div style={{ height: "1px", background: "rgba(255,255,255,0.05)", marginBottom: "20px" }} />

          {/* Formulário */}
          <div style={{ display: "grid", gap: "12px" }} className="grid-cols-1 sm:grid-cols-2">
            <div>
              <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "rgba(245,245,245,0.5)", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "1px", fontFamily: "'DM Sans', sans-serif" }}>
                Produto *
              </label>
              <input
                style={INPUT_STYLE}
                placeholder="ex: Creme facial hidratante"
                value={produto}
                onChange={e => setProduto(e.target.value)}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "rgba(245,245,245,0.5)", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "1px", fontFamily: "'DM Sans', sans-serif" }}>
                Nicho *
              </label>
              <input
                style={INPUT_STYLE}
                placeholder="ex: Skincare, Beleza feminina"
                value={nicho}
                onChange={e => setNicho(e.target.value)}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "rgba(245,245,245,0.5)", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "1px", fontFamily: "'DM Sans', sans-serif" }}>
                Diferencial
              </label>
              <input
                style={INPUT_STYLE}
                placeholder="ex: Resultados em 7 dias, sem parabenos"
                value={diferencial}
                onChange={e => setDiferencial(e.target.value)}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "rgba(245,245,245,0.5)", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "1px", fontFamily: "'DM Sans', sans-serif" }}>
                Tom
              </label>
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                {TONS.map(t => (
                  <button
                    key={t}
                    onClick={() => setTom(t)}
                    style={{
                      padding: "6px 10px", borderRadius: "6px", cursor: "pointer",
                      fontFamily: "'DM Sans', sans-serif", fontSize: "11px", fontWeight: 600,
                      border: "1px solid",
                      background: tom === t ? "rgba(255,77,0,0.12)" : "transparent",
                      borderColor: tom === t ? "rgba(255,77,0,0.4)" : "rgba(255,255,255,0.08)",
                      color: tom === t ? "#FF4D00" : "rgba(245,245,245,0.4)",
                      transition: "all 150ms ease",
                    }}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {error && (
            <p style={{ fontSize: "12px", color: "#ef4444", marginTop: "12px", fontFamily: "'DM Sans', sans-serif" }}>
              {error}
            </p>
          )}

          <button
            onClick={handleGenerate}
            disabled={loading}
            style={{
              marginTop: "16px",
              display: "flex", alignItems: "center", gap: "8px",
              background: loading ? "rgba(255,77,0,0.4)" : "#FF4D00",
              color: "#fff", border: "none", borderRadius: "8px",
              padding: "11px 20px", fontSize: "13px", fontWeight: 700,
              fontFamily: "'DM Sans', sans-serif", cursor: loading ? "not-allowed" : "pointer",
              transition: "background 150ms ease",
            }}
          >
            {loading ? <Loader2 size={14} style={{ animation: "spin 0.8s linear infinite" }} /> : <Wand2 size={14} />}
            {loading ? "Gerando..." : "Gerar Copy"}
          </button>

          {/* Resultado */}
          {result && (
            <div style={{ marginTop: "24px", display: "flex", flexDirection: "column", gap: "16px" }}>
              {/* Hooks */}
              <div>
                <div style={{ fontSize: "11px", fontWeight: 700, color: "rgba(245,245,245,0.5)", textTransform: "uppercase", letterSpacing: "1px", fontFamily: "'DM Sans', sans-serif", marginBottom: "10px" }}>
                  🎣 Hooks de abertura
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {result.hooks.map((hook, i) => (
                    <div key={i} style={{
                      display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px",
                      background: "#0D0D0D", border: "1px solid rgba(255,255,255,0.05)",
                      borderRadius: "8px", padding: "12px 14px",
                    }}>
                      <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", color: "#F5F5F5", flex: 1 }}>{hook}</span>
                      <button
                        onClick={() => handleCopy(hook, `hook-${i}`)}
                        style={{ background: "none", border: "none", cursor: "pointer", color: copiedKey === `hook-${i}` ? "#10A37F" : "rgba(245,245,245,0.35)", flexShrink: 0, padding: "4px" }}
                      >
                        {copiedKey === `hook-${i}` ? <Check size={14} /> : <Copy size={14} />}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTAs */}
              <div>
                <div style={{ fontSize: "11px", fontWeight: 700, color: "rgba(245,245,245,0.5)", textTransform: "uppercase", letterSpacing: "1px", fontFamily: "'DM Sans', sans-serif", marginBottom: "10px" }}>
                  🎯 CTAs
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {result.ctas.map((cta, i) => (
                    <div key={i} style={{
                      display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px",
                      background: "#0D0D0D", border: "1px solid rgba(255,255,255,0.05)",
                      borderRadius: "8px", padding: "12px 14px",
                    }}>
                      <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", color: "#F5F5F5", flex: 1 }}>{cta}</span>
                      <button
                        onClick={() => handleCopy(cta, `cta-${i}`)}
                        style={{ background: "none", border: "none", cursor: "pointer", color: copiedKey === `cta-${i}` ? "#10A37F" : "rgba(245,245,245,0.35)", flexShrink: 0, padding: "4px" }}
                      >
                        {copiedKey === `cta-${i}` ? <Check size={14} /> : <Copy size={14} />}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Script */}
              <div>
                <div style={{ fontSize: "11px", fontWeight: 700, color: "rgba(245,245,245,0.5)", textTransform: "uppercase", letterSpacing: "1px", fontFamily: "'DM Sans', sans-serif", marginBottom: "10px" }}>
                  🎬 Script de vídeo (30s)
                </div>
                <div style={{
                  background: "#0D0D0D", border: "1px solid rgba(255,255,255,0.05)",
                  borderRadius: "8px", padding: "16px", position: "relative",
                }}>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", color: "rgba(245,245,245,0.85)", lineHeight: "1.7", margin: 0 }}>
                    {result.script}
                  </p>
                  <button
                    onClick={() => handleCopy(result.script, "script")}
                    style={{
                      position: "absolute", top: "12px", right: "12px",
                      background: "none", border: "none", cursor: "pointer",
                      color: copiedKey === "script" ? "#10A37F" : "rgba(245,245,245,0.35)", padding: "4px",
                    }}
                  >
                    {copiedKey === "script" ? <Check size={14} /> : <Copy size={14} />}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
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
        plano: user?.plan?.toLowerCase() ?? "starter",
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

  // Filtro de busca local
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

      {/* Copy Generator */}
      <motion.div
        variants={fadeUp} custom={1} initial="hidden" animate="visible"
      >
        <CopyGenerator />
      </motion.div>

      {/* Filtros */}
      <motion.div
        variants={fadeUp} custom={2} initial="hidden" animate="visible"
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
          variants={fadeUp} custom={3} initial="hidden" animate="visible"
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
        <div style={{ display: "grid", gap: "12px", gridTemplateColumns: "repeat(auto-fill, minmax(380px, 1fr))" }}>
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
        <div style={{ display: "grid", gap: "12px", gridTemplateColumns: "repeat(auto-fill, minmax(380px, 1fr))" }}>
          {promptsFiltrados.map((p, i) => (
            <PromptCard key={p.id} prompt={p} index={i} />
          ))}
        </div>
      )}
    </div>
  )
}
