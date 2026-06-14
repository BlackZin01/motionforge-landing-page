"use client"

import { useState, useEffect, useCallback } from "react"
import { Search, Film, RefreshCw } from "lucide-react"
import { GenerationCard } from "@/components/dashboard/shared/generation-card"

const ITEMS_PER_PAGE = 18

type FilterType = "all" | "image" | "video"

interface Generation {
  id: string
  type: "image" | "video"
  model_id: string
  prompt: string
  status: string
  output_url: string | null
  credits_used: number
  created_at: string
}

function formatDate(iso: string) {
  const d = new Date(iso)
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })
}

export default function HistoricoPage() {
  const [filter, setFilter] = useState<FilterType>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [items, setItems] = useState<Generation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [offset, setOffset] = useState(0)
  const [hasMore, setHasMore] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)

  const fetchGenerations = useCallback(async (reset = false) => {
    const token = localStorage.getItem("mf_token") ?? ""
    const currentOffset = reset ? 0 : offset
    try {
      reset ? setLoading(true) : setLoadingMore(true)
      setError(false)
      const res = await fetch(`/api/generations?limit=${ITEMS_PER_PAGE}&offset=${currentOffset}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) { setError(true); return }
      const data = await res.json()
      const newItems: Generation[] = data.items ?? []
      if (reset) {
        setItems(newItems)
        setOffset(ITEMS_PER_PAGE)
      } else {
        setItems(prev => [...prev, ...newItems])
        setOffset(currentOffset + ITEMS_PER_PAGE)
      }
      setHasMore(newItems.length === ITEMS_PER_PAGE)
    } catch {
      setError(true)
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => { fetchGenerations(true) }, [fetchGenerations])

  // Filtragem client-side
  const filtered = items.filter((g) => {
    const passFilter = filter === "all" || g.type === filter
    const passSearch = !searchQuery || g.model_id.toLowerCase().includes(searchQuery.toLowerCase()) || g.prompt.toLowerCase().includes(searchQuery.toLowerCase())
    return passFilter && passSearch && g.status === "completed"
  })

  return (
    <div style={{ padding: "24px", maxWidth: "1400px", margin: "0 auto" }}>
      {/* Barra de filtros */}
      <div
        style={{
          position: "sticky", top: 0, background: "#0D0D0D",
          paddingTop: "12px", paddingBottom: "12px",
          zIndex: 10, marginBottom: "16px",
          display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center",
        }}
      >
        {(["all", "image", "video"] as FilterType[]).map((f) => {
          const labels: Record<FilterType, string> = { all: "Todos", image: "Imagem", video: "Vídeo" }
          const isActive = filter === f
          return (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                background: isActive ? "#FF4D00" : "rgba(255,255,255,0.04)",
                border: `1px solid ${isActive ? "#FF4D00" : "rgba(255,255,255,0.06)"}`,
                color: isActive ? "white" : "rgba(245,245,245,0.4)",
                padding: "6px 14px", borderRadius: "9999px",
                fontSize: "12px", fontWeight: 700, cursor: "pointer",
                fontFamily: "'DM Sans', sans-serif", transition: "all 0.15s ease",
                whiteSpace: "nowrap",
              }}
            >
              {labels[f]}
            </button>
          )
        })}

        <div style={{ position: "relative", flex: 1, minWidth: "200px" }}>
          <Search
            size={14}
            style={{
              position: "absolute", left: "10px", top: "50%",
              transform: "translateY(-50%)", color: "rgba(245,245,245,0.4)", pointerEvents: "none",
            }}
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por modelo ou prompt..."
            style={{
              width: "100%", background: "#111111",
              border: "1px solid rgba(255,255,255,0.06)", borderRadius: "8px",
              padding: "8px 12px 8px 32px", color: "#F5F5F5",
              fontSize: "13px", outline: "none",
              fontFamily: "'DM Sans', sans-serif", boxSizing: "border-box",
            }}
          />
        </div>

        <button
          onClick={() => fetchGenerations(true)}
          title="Atualizar"
          style={{
            background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.06)",
            borderRadius: "8px", padding: "8px 10px", cursor: "pointer",
            color: "rgba(245,245,245,.5)", display: "flex", alignItems: "center",
          }}
        >
          <RefreshCw size={14} />
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <div style={{ display: "flex", justifyContent: "center", padding: "72px 0" }}>
          <p style={{ fontFamily: "'DM Sans',sans-serif", color: "rgba(245,245,245,.35)", fontSize: "13px" }}>
            Carregando gerações...
          </p>
        </div>
      )}

      {/* Erro */}
      {!loading && error && (
        <div style={{ textAlign: "center", padding: "72px 24px" }}>
          <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "14px", color: "rgba(245,245,245,.5)", margin: "0 0 12px" }}>
            Erro ao carregar histórico.
          </p>
          <button
            onClick={() => fetchGenerations(true)}
            style={{
              background: "#FF4D00", border: "none", borderRadius: "8px",
              padding: "8px 20px", color: "#fff", fontSize: "13px",
              fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans',sans-serif",
            }}
          >
            Tentar novamente
          </button>
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && filtered.length === 0 && (
        <div
          style={{
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            padding: "72px 24px", textAlign: "center",
          }}
        >
          <div
            style={{
              width: 56, height: 56, borderRadius: "14px",
              background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.07)",
              display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "16px",
            }}
          >
            <Film size={24} style={{ color: "rgba(245,245,245,.25)" }} />
          </div>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "14px", fontWeight: 700, color: "rgba(245,245,245,.5)", margin: "0 0 6px" }}>
            {searchQuery || filter !== "all" ? "Nenhuma geração encontrada" : "Nenhuma geração ainda"}
          </p>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", color: "rgba(245,245,245,.3)", margin: 0 }}>
            {searchQuery || filter !== "all"
              ? "Tente mudar os filtros de busca."
              : "Vá ao Studio e crie sua primeira imagem ou vídeo."}
          </p>
        </div>
      )}

      {/* Grid */}
      {!loading && !error && filtered.length > 0 && (
        <>
          <div
            style={{ gap: "8px" }}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6"
          >
            {filtered.map((g) => (
              <GenerationCard
                key={g.id}
                id={g.id}
                type={g.type}
                model={g.model_id}
                credits={g.credits_used}
                date={formatDate(g.created_at)}
                outputUrl={g.output_url ?? undefined}
                prompt={g.prompt}
              />
            ))}
          </div>

          {hasMore && (
            <div style={{ marginTop: "24px", textAlign: "center" }}>
              <button
                onClick={() => fetchGenerations(false)}
                disabled={loadingMore}
                style={{
                  background: "transparent", border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: "8px", padding: "10px 24px",
                  color: loadingMore ? "rgba(245,245,245,.25)" : "rgba(245,245,245,0.4)",
                  fontSize: "13px", cursor: loadingMore ? "not-allowed" : "pointer",
                  fontFamily: "'DM Sans', sans-serif", transition: "border-color 0.15s ease, color 0.15s ease",
                }}
              >
                {loadingMore ? "Carregando..." : "Carregar mais"}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
