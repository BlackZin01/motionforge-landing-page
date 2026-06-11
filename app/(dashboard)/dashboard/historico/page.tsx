"use client"

import { useState, useEffect } from "react"
import { Search } from "lucide-react"
import { GenerationCard } from "@/components/dashboard/shared/generation-card"
import { Skeleton } from "@/components/dashboard/shared/skeleton"

// ─── Dados mock ───────────────────────────────────────────────────────────────
// TODO: integrar API — buscar histórico de gerações do usuário

const ALL_GENERATIONS = Array.from({ length: 20 }, (_, i) => ({
  id: String(i + 1),
  type: (i % 3 === 0 ? "video" : "image") as "video" | "image",
  model: ["Seedance 2.0", "Nano Banana Pro", "FLUX 2 Dev", "Kling Std", "Wan 2.7", "Ideogram v3"][
    i % 6
  ],
  credits: [35, 8, 3, 45, 20, 3][i % 6],
  date: `${11 - Math.floor(i / 3)}/06`,
}))

const ITEMS_PER_PAGE = 9

// ─── Tipos ───────────────────────────────────────────────────────────────────

type FilterType = "all" | "image" | "video"

// ─── Componente ──────────────────────────────────────────────────────────────

export default function HistoricoPage() {
  const [filter, setFilter] = useState<FilterType>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)

  // Simula carregamento inicial
  // TODO: integrar API — substituir por fetch real
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800)
    return () => clearTimeout(timer)
  }, [])

  // Reseta página ao mudar filtro ou busca
  useEffect(() => {
    setPage(1)
  }, [filter, searchQuery])

  // ─── Filtragem ────────────────────────────────────────────────────────────────

  const filteredItems = ALL_GENERATIONS.filter((g) => {
    const passFilter = filter === "all" || g.type === filter
    const passSearch =
      !searchQuery || g.model.toLowerCase().includes(searchQuery.toLowerCase())
    return passFilter && passSearch
  })

  const displayedItems = filteredItems.slice(0, page * ITEMS_PER_PAGE)
  const hasMore = displayedItems.length < filteredItems.length

  // ─── Render ──────────────────────────────────────────────────────────────────

  return (
    <div
      style={{
        padding: "24px",
        maxWidth: "1400px",
        margin: "0 auto",
      }}
    >
      {/* Barra de filtros (sticky) */}
      <div
        style={{
          position: "sticky",
          top: 0,
          background: "#0D0D0D",
          paddingTop: "12px",
          paddingBottom: "12px",
          zIndex: 10,
          marginBottom: "16px",
          display: "flex",
          gap: "8px",
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        {/* Pills de filtro */}
        {(["all", "image", "video"] as FilterType[]).map((f) => {
          const labels: Record<FilterType, string> = {
            all: "Todos",
            image: "Imagem",
            video: "Vídeo",
          }
          const isActive = filter === f
          return (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                background: isActive ? "#FF4D00" : "rgba(255,255,255,0.04)",
                border: `1px solid ${isActive ? "#FF4D00" : "rgba(255,255,255,0.06)"}`,
                color: isActive ? "white" : "rgba(245,245,245,0.4)",
                padding: "6px 14px",
                borderRadius: "9999px",
                fontSize: "12px",
                fontWeight: 700,
                cursor: "pointer",
                fontFamily: "'DM Sans', sans-serif",
                transition: "all 0.15s ease",
                whiteSpace: "nowrap",
              }}
            >
              {labels[f]}
            </button>
          )
        })}

        {/* Campo de busca */}
        <div
          style={{
            position: "relative",
            flex: 1,
            minWidth: "200px",
          }}
        >
          <Search
            size={14}
            style={{
              position: "absolute",
              left: "10px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "rgba(245,245,245,0.4)",
              pointerEvents: "none",
            }}
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por modelo..."
            style={{
              width: "100%",
              background: "#111111",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: "8px",
              padding: "8px 12px 8px 32px",
              color: "#F5F5F5",
              fontSize: "13px",
              outline: "none",
              fontFamily: "'DM Sans', sans-serif",
              boxSizing: "border-box",
            }}
          />
        </div>
      </div>

      {/* Estado de loading */}
      {loading ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "8px",
          }}
        >
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="aspect-video" />
          ))}
        </div>
      ) : filteredItems.length === 0 ? (
        /* Sem resultados */
        <div
          style={{
            textAlign: "center",
            padding: "48px",
            color: "rgba(245,245,245,0.4)",
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "14px",
          }}
        >
          Nenhuma geração encontrada.
        </div>
      ) : (
        <>
          {/* Grid de gerações */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "8px",
            }}
            className="sm:grid-cols-2 lg:grid-cols-3"
          >
            {displayedItems.map((g) => (
              <GenerationCard
                key={g.id}
                id={g.id}
                type={g.type}
                model={g.model}
                credits={g.credits}
                date={g.date}
              />
            ))}
          </div>

          {/* Botão "Carregar mais" */}
          {hasMore && (
            <div style={{ marginTop: "24px", textAlign: "center" }}>
              <button
                onClick={() => setPage((p) => p + 1)}
                style={{
                  background: "transparent",
                  border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: "8px",
                  padding: "10px 24px",
                  color: "rgba(245,245,245,0.4)",
                  fontSize: "13px",
                  cursor: "pointer",
                  fontFamily: "'DM Sans', sans-serif",
                  transition: "border-color 0.15s ease, color 0.15s ease",
                }}
                onMouseEnter={(e) => {
                  const btn = e.currentTarget as HTMLButtonElement
                  btn.style.borderColor = "rgba(255,255,255,0.2)"
                  btn.style.color = "#F5F5F5"
                }}
                onMouseLeave={(e) => {
                  const btn = e.currentTarget as HTMLButtonElement
                  btn.style.borderColor = "rgba(255,255,255,0.06)"
                  btn.style.color = "rgba(245,245,245,0.4)"
                }}
              >
                Carregar mais
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
