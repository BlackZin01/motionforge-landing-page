"use client"

import { Plus } from "lucide-react"
import { NodeCard } from "./node-card"

// ─── Tipos ───────────────────────────────────────────────────────────────────

export interface WorkflowNode {
  id: string
  model: string
  cost: number
}

interface CanvasProps {
  nodes: WorkflowNode[]
  onAddNode: () => void
  onRemoveNode: (id: string) => void
  onChangeModel: (id: string, model: string) => void
}

// ─── Componente ──────────────────────────────────────────────────────────────

export default function Canvas({ nodes, onAddNode, onRemoveNode, onChangeModel }: CanvasProps) {
  return (
    <div
      style={{
        background: "#0D0D0D",
        backgroundImage:
          "radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)",
        backgroundSize: "20px 20px",
        borderRadius: "10px",
        padding: "20px",
        overflowX: "auto",
        minHeight: "160px",
      }}
    >
      {/* Linha de nodes */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          flexWrap: "nowrap",
          minWidth: "max-content",
        }}
      >
        {nodes.map((node, index) => (
          <div
            key={node.id}
            style={{ display: "flex", alignItems: "center", gap: "8px" }}
          >
            <NodeCard
              step={index + 1}
              model={node.model}
              cost={node.cost}
              onRemove={() => onRemoveNode(node.id)}
              onChangeModel={(m) => onChangeModel(node.id, m)}
            />

            {/* Seta entre nodes */}
            {index < nodes.length - 1 && (
              <span
                style={{
                  color: "rgba(245,245,245,0.4)",
                  fontSize: "18px",
                  flexShrink: 0,
                  userSelect: "none",
                }}
              >
                →
              </span>
            )}
          </div>
        ))}

        {/* Seta antes do botão adicionar (se houver nodes) */}
        {nodes.length > 0 && (
          <span
            style={{
              color: "rgba(245,245,245,0.4)",
              fontSize: "18px",
              flexShrink: 0,
              userSelect: "none",
            }}
          >
            →
          </span>
        )}

        {/* Botão Add Step */}
        <button
          onClick={onAddNode}
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px dashed rgba(255,255,255,0.08)",
            borderRadius: "8px",
            width: "140px",
            height: "80px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "4px",
            cursor: "pointer",
            flexShrink: 0,
            transition: "border-color 0.2s ease, color 0.2s ease",
            color: "rgba(245,245,245,0.4)",
          }}
          onMouseEnter={(e) => {
            const btn = e.currentTarget as HTMLButtonElement
            btn.style.borderColor = "rgba(255,77,0,0.3)"
            btn.style.color = "#FF4D00"
          }}
          onMouseLeave={(e) => {
            const btn = e.currentTarget as HTMLButtonElement
            btn.style.borderColor = "rgba(255,255,255,0.08)"
            btn.style.color = "rgba(245,245,245,0.4)"
          }}
        >
          <Plus size={16} />
          <span style={{ fontSize: "11px" }}>Add Step</span>
        </button>
      </div>
    </div>
  )
}
