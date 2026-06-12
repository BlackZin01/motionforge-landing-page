"use client"

import { memo } from "react"
import { Handle, Position, useReactFlow, type NodeProps, type Node } from "@xyflow/react"
import { X, Zap, Play, CheckCircle } from "lucide-react"

// ─── Modelos disponíveis ──────────────────────────────────────────────────────

export const MODEL_COSTS: Record<string, number> = {
  "Seedance Fast": 25,
  "Seedance 2.0": 35,
  "Wan 2.7": 20,
  "Kling Std": 45,
  "Kling Pro": 60,
  "Kling O1": 80,
  "Hailuo 2.3": 30,
  "Veo 3.1 Lite": 40,
}

const VIDEO_MODELS = Object.keys(MODEL_COSTS)

// ─── Trigger Node ─────────────────────────────────────────────────────────────

export const TriggerNode = memo(({ selected }: NodeProps) => (
  <div
    style={{
      background: "linear-gradient(135deg,rgba(255,77,0,.1) 0%,rgba(255,77,0,.03) 100%)",
      border: `1px solid ${selected ? "#FF4D00" : "rgba(255,77,0,.25)"}`,
      borderRadius: "12px",
      padding: "14px 16px",
      minWidth: "180px",
      boxShadow: selected ? "0 0 0 3px rgba(255,77,0,.12)" : "none",
      transition: "box-shadow .15s, border-color .15s",
    }}
  >
    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
      <div
        style={{
          width: 28, height: 28, borderRadius: "8px",
          background: "rgba(255,77,0,.15)",
          display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <Play size={13} style={{ color: "#FF4D00" }} />
      </div>
      <span
        style={{
          fontFamily: "'DM Sans',sans-serif",
          fontSize: "11px", fontWeight: 700,
          color: "#FF4D00", letterSpacing: "1.5px", textTransform: "uppercase",
        }}
      >
        Início
      </span>
    </div>
    <p style={{ fontSize: "11px", color: "rgba(245,245,245,.4)", margin: 0 }}>
      Ponto de partida
    </p>

    <Handle
      type="source"
      position={Position.Right}
      style={{
        background: "#FF4D00",
        width: 10, height: 10,
        border: "2px solid #0D0D0D",
        right: -6,
      }}
    />
  </div>
))
TriggerNode.displayName = "TriggerNode"

// ─── Model Node ───────────────────────────────────────────────────────────────

export type ModelData = { model: string; cost: number }
type ModelNodeType = Node<ModelData, "model">

export const ModelNode = memo(({ id, data, selected }: NodeProps<ModelNodeType>) => {
  const { updateNodeData, setNodes, setEdges } = useReactFlow()

  function handleModelChange(model: string) {
    updateNodeData(id, { model, cost: MODEL_COSTS[model] ?? 25 })
  }

  function handleRemove() {
    setNodes((nds) => nds.filter((n) => n.id !== id))
    setEdges((eds) => eds.filter((e) => e.source !== id && e.target !== id))
  }

  return (
    <div
      style={{
        background: "#111111",
        border: `1px solid ${selected ? "rgba(255,255,255,.2)" : "rgba(255,255,255,.07)"}`,
        borderRadius: "12px",
        padding: "14px 16px",
        minWidth: "210px",
        boxShadow: selected ? "0 0 0 3px rgba(255,255,255,.05)" : "none",
        transition: "box-shadow .15s, border-color .15s",
      }}
    >
      <Handle
        type="target"
        position={Position.Left}
        style={{
          background: "rgba(255,255,255,.3)",
          width: 10, height: 10,
          border: "2px solid #0D0D0D",
          left: -6,
        }}
      />

      {/* Header */}
      <div
        style={{
          display: "flex", justifyContent: "space-between",
          alignItems: "center", marginBottom: "10px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <div
            style={{
              width: 24, height: 24, borderRadius: "6px",
              background: "rgba(0,229,255,.1)",
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <Zap size={11} style={{ color: "#00E5FF" }} />
          </div>
          <span
            style={{
              fontFamily: "'DM Sans',sans-serif",
              fontSize: "10px", fontWeight: 700,
              color: "rgba(245,245,245,.4)",
              textTransform: "uppercase", letterSpacing: "1.5px",
            }}
          >
            Modelo IA
          </span>
        </div>
        <button
          onClick={handleRemove}
          className="nodrag"
          style={{
            background: "none", border: "none", cursor: "pointer",
            color: "rgba(245,245,245,.3)", padding: "2px",
            display: "flex", alignItems: "center", borderRadius: "4px",
          }}
          onMouseEnter={(e) => {
            ;(e.currentTarget as HTMLButtonElement).style.color = "#ef4444"
          }}
          onMouseLeave={(e) => {
            ;(e.currentTarget as HTMLButtonElement).style.color = "rgba(245,245,245,.3)"
          }}
          aria-label="Remover nó"
        >
          <X size={14} />
        </button>
      </div>

      {/* Model select */}
      <select
        className="nodrag"
        value={data.model}
        onChange={(e) => handleModelChange(e.target.value)}
        style={{
          width: "100%",
          background: "#0D0D0D",
          border: "1px solid rgba(255,255,255,.07)",
          borderRadius: "6px",
          padding: "7px 10px",
          fontSize: "12px", color: "#F5F5F5",
          outline: "none", cursor: "pointer",
          fontFamily: "'DM Sans',sans-serif",
          marginBottom: "10px",
          appearance: "auto",
        }}
      >
        {VIDEO_MODELS.map((m) => (
          <option key={m} value={m} style={{ background: "#111111" }}>
            {m}
          </option>
        ))}
      </select>

      {/* Cost badge */}
      <div style={{ display: "flex", justifyContent: "center" }}>
        <span
          style={{
            background: "rgba(0,229,255,.08)",
            border: "1px solid rgba(0,229,255,.15)",
            borderRadius: "9999px",
            fontSize: "10px", color: "#00E5FF",
            padding: "2px 10px",
            fontFamily: "'Space Grotesk',sans-serif",
          }}
        >
          {data.cost} créditos
        </span>
      </div>

      <Handle
        type="source"
        position={Position.Right}
        style={{
          background: "rgba(255,255,255,.3)",
          width: 10, height: 10,
          border: "2px solid #0D0D0D",
          right: -6,
        }}
      />
    </div>
  )
})
ModelNode.displayName = "ModelNode"

// ─── Output Node ──────────────────────────────────────────────────────────────

export const OutputNode = memo(({ selected }: NodeProps) => (
  <div
    style={{
      background: "linear-gradient(135deg,rgba(0,229,255,.08) 0%,rgba(0,229,255,.02) 100%)",
      border: `1px solid ${selected ? "#00E5FF" : "rgba(0,229,255,.18)"}`,
      borderRadius: "12px",
      padding: "14px 16px",
      minWidth: "180px",
      boxShadow: selected ? "0 0 0 3px rgba(0,229,255,.08)" : "none",
      transition: "box-shadow .15s, border-color .15s",
    }}
  >
    <Handle
      type="target"
      position={Position.Left}
      style={{
        background: "#00E5FF",
        width: 10, height: 10,
        border: "2px solid #0D0D0D",
        left: -6,
      }}
    />
    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
      <div
        style={{
          width: 28, height: 28, borderRadius: "8px",
          background: "rgba(0,229,255,.1)",
          display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <CheckCircle size={13} style={{ color: "#00E5FF" }} />
      </div>
      <span
        style={{
          fontFamily: "'DM Sans',sans-serif",
          fontSize: "11px", fontWeight: 700,
          color: "#00E5FF", letterSpacing: "1.5px", textTransform: "uppercase",
        }}
      >
        Saída
      </span>
    </div>
    <p style={{ fontSize: "11px", color: "rgba(245,245,245,.4)", margin: 0 }}>
      Resultado final gerado
    </p>
  </div>
))
OutputNode.displayName = "OutputNode"
