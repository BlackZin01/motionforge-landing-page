"use client"

import { memo, useRef, useState } from "react"
import { Handle, Position, useReactFlow, type NodeProps, type Node } from "@xyflow/react"
import { X, Zap, Play, CheckCircle, Image as ImageIcon, AlignLeft, Mic } from "lucide-react"
import { uploadFileToR2 } from "@/lib/upload-to-r2"

// ─── Modelos de vídeo/imagem ─────────────────────────────────────────────────

type ModelInfo = { cost: number; type: "video" | "image" }

export const MODELS: Record<string, ModelInfo> = {
  "Seedance Fast":  { cost: 25, type: "video" },
  "Seedance 2.0":   { cost: 35, type: "video" },
  "Wan 2.7":        { cost: 20, type: "video" },
  "Kling Std":      { cost: 45, type: "video" },
  "Kling Pro":      { cost: 60, type: "video" },
  "Kling O1":       { cost: 80, type: "video" },
  "Hailuo 2.3":     { cost: 30, type: "video" },
  "Veo 3.1 Lite":   { cost: 40, type: "video" },
  "GPT Image 2":    { cost: 15, type: "image" },
  "Flux Pro":       { cost: 20, type: "image" },
  "Ideogram 2.0":   { cost: 12, type: "image" },
  "DALL-E 3":       { cost: 18, type: "image" },
}

export const MODEL_COSTS: Record<string, number> = Object.fromEntries(
  Object.entries(MODELS).map(([k, v]) => [k, v.cost])
)

const VIDEO_MODELS = Object.entries(MODELS).filter(([, v]) => v.type === "video").map(([k]) => k)
const IMAGE_MODELS = Object.entries(MODELS).filter(([, v]) => v.type === "image").map(([k]) => k)

export const ASPECT_RATIOS = ["9:16", "16:9", "1:1", "4:3"] as const
export type AspectRatio = (typeof ASPECT_RATIOS)[number]

export const QUANTITIES = [1, 2, 4, 8] as const
export type Quantity = (typeof QUANTITIES)[number]

// ─── Modelos de voz ───────────────────────────────────────────────────────────

export const VOICE_MODELS: Record<string, number> = {
  "ElevenLabs":  8,
  "PlayHT":      6,
  "OpenAI TTS":  5,
  "Azure Neural": 4,
}

// ─── Shared ───────────────────────────────────────────────────────────────────

const LABEL: React.CSSProperties = {
  fontSize: "9px", color: "rgba(245,245,245,.3)",
  fontFamily: "'DM Sans',sans-serif", fontWeight: 700,
  textTransform: "uppercase", letterSpacing: "1px", margin: "0 0 5px",
}

function RemoveBtn({ onRemove }: { onRemove: () => void }) {
  return (
    <button
      onClick={onRemove}
      className="nodrag"
      style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(245,245,245,.28)", padding: "2px", display: "flex", borderRadius: "4px" }}
      onMouseEnter={(e) => { ;(e.currentTarget as HTMLButtonElement).style.color = "#ef4444" }}
      onMouseLeave={(e) => { ;(e.currentTarget as HTMLButtonElement).style.color = "rgba(245,245,245,.28)" }}
      aria-label="Remover nó"
    >
      <X size={13} />
    </button>
  )
}

// ─── Trigger Node ─────────────────────────────────────────────────────────────

export type TriggerData = { prompt: string }
type TriggerNodeType = Node<TriggerData, "trigger">

export const TriggerNode = memo(({ id, data, selected }: NodeProps<TriggerNodeType>) => {
  const { updateNodeData } = useReactFlow()

  return (
    <div style={{
      background: "linear-gradient(135deg,rgba(255,77,0,.1) 0%,rgba(255,77,0,.03) 100%)",
      border: `1px solid ${selected ? "#FF4D00" : "rgba(255,77,0,.25)"}`,
      borderRadius: "12px", padding: "14px 16px", width: "240px",
      boxShadow: selected ? "0 0 0 3px rgba(255,77,0,.12)" : "none",
      transition: "box-shadow .15s, border-color .15s",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
        <div style={{ width: 28, height: 28, borderRadius: "8px", background: "rgba(255,77,0,.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <Play size={13} style={{ color: "#FF4D00" }} />
        </div>
        <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "11px", fontWeight: 700, color: "#FF4D00", letterSpacing: "1.5px", textTransform: "uppercase" }}>
          Início
        </span>
      </div>

      <p style={LABEL}>Prompt</p>
      <textarea
        className="nodrag nowheel"
        value={data.prompt ?? ""}
        onChange={(e) => updateNodeData(id, { prompt: e.target.value })}
        placeholder="Descreva o que você quer gerar..."
        rows={3}
        style={{
          width: "100%", background: "rgba(0,0,0,.35)",
          border: "1px solid rgba(255,77,0,.18)", borderRadius: "6px",
          padding: "7px 9px", fontSize: "11px", color: "#F5F5F5",
          outline: "none", resize: "none",
          fontFamily: "'DM Sans',sans-serif", lineHeight: "1.5",
          boxSizing: "border-box", caretColor: "#FF4D00",
        }}
      />

      <Handle type="source" position={Position.Right}
        style={{ background: "#FF4D00", width: 10, height: 10, border: "2px solid #0D0D0D", right: -6 }} />
    </div>
  )
})
TriggerNode.displayName = "TriggerNode"

// ─── Image Node ───────────────────────────────────────────────────────────────

export type ImageData = { imageUrl?: string }
type ImageNodeType = Node<ImageData, "image">

export const ImageNode = memo(({ id, data, selected }: NodeProps<ImageNodeType>) => {
  const { setNodes, setEdges, updateNodeData } = useReactFlow()
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  function handleRemove() {
    setNodes((nds) => nds.filter((n) => n.id !== id))
    setEdges((eds) => eds.filter((e) => e.source !== id && e.target !== id))
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    e.target.value = ""

    // Preview local imediato
    const preview = URL.createObjectURL(file)
    setPreviewUrl(preview)
    setUploading(true)

    try {
      const token = localStorage.getItem("mf_token") ?? ""
      const cdnUrl = await uploadFileToR2(file, token)
      updateNodeData(id, { imageUrl: cdnUrl })
      setPreviewUrl(null)
    } catch {
      setPreviewUrl(null)
      updateNodeData(id, { imageUrl: undefined })
    } finally {
      setUploading(false)
    }
  }

  return (
    <div style={{
      background: "linear-gradient(135deg,rgba(74,222,128,.07) 0%,rgba(74,222,128,.02) 100%)",
      border: `1px solid ${selected ? "#4ADE80" : "rgba(74,222,128,.2)"}`,
      borderRadius: "12px", padding: "14px 16px", width: "185px",
      boxShadow: selected ? "0 0 0 3px rgba(74,222,128,.08)" : "none",
      transition: "box-shadow .15s, border-color .15s",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <div style={{ width: 24, height: 24, borderRadius: "6px", background: "rgba(74,222,128,.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <ImageIcon size={12} style={{ color: "#4ADE80" }} />
          </div>
          <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "10px", fontWeight: 700, color: "rgba(74,222,128,.75)", textTransform: "uppercase", letterSpacing: "1.5px" }}>
            Imagem
          </span>
        </div>
        <RemoveBtn onRemove={handleRemove} />
      </div>

      {/* Hidden file input */}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="nodrag"
        style={{ display: "none" }}
        onChange={handleFileChange}
      />

      {/* Preview or drop area */}
      {(previewUrl || data.imageUrl) ? (
        <div style={{ position: "relative" }}>
          <img
            src={previewUrl ?? data.imageUrl}
            alt="preview"
            style={{ width: "100%", borderRadius: "8px", display: "block", maxHeight: "120px", objectFit: "cover", cursor: uploading ? "default" : "pointer", opacity: uploading ? 0.5 : 1 }}
            onClick={() => !uploading && inputRef.current?.click()}
          />
          {uploading ? (
            <div style={{
              position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
              background: "rgba(0,0,0,.45)", borderRadius: "8px",
              fontSize: "10px", color: "#F5F5F5", fontFamily: "'DM Sans',sans-serif",
            }}>
              Enviando...
            </div>
          ) : (
            <div
              onClick={() => inputRef.current?.click()}
              style={{
                position: "absolute", bottom: "6px", right: "6px",
                background: "rgba(0,0,0,.6)", borderRadius: "4px",
                padding: "2px 6px", fontSize: "9px", color: "#F5F5F5",
                fontFamily: "'DM Sans',sans-serif", cursor: "pointer",
              }}
            >
              Trocar
            </div>
          )}
        </div>
      ) : (
        <div
          onClick={() => inputRef.current?.click()}
          style={{
            border: "1px dashed rgba(74,222,128,.3)",
            borderRadius: "8px", padding: "18px 12px",
            textAlign: "center", background: "rgba(74,222,128,.03)",
            cursor: "pointer", transition: "background .15s",
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.background = "rgba(74,222,128,.07)" }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.background = "rgba(74,222,128,.03)" }}
        >
          <ImageIcon size={22} style={{ color: "rgba(74,222,128,.4)", display: "block", margin: "0 auto 6px" }} />
          <p style={{ fontSize: "10px", color: "rgba(245,245,245,.3)", margin: 0, fontFamily: "'DM Sans',sans-serif" }}>
            Clique para adicionar
          </p>
        </div>
      )}

      <Handle type="source" position={Position.Right}
        style={{ background: "#4ADE80", width: 10, height: 10, border: "2px solid #0D0D0D", right: -6 }} />
    </div>
  )
})
ImageNode.displayName = "ImageNode"

// ─── Text Node ────────────────────────────────────────────────────────────────

export type TextData = { content: string }
type TextNodeType = Node<TextData, "text">

export const TextNode = memo(({ id, data, selected }: NodeProps<TextNodeType>) => {
  const { updateNodeData, setNodes, setEdges } = useReactFlow()

  function handleRemove() {
    setNodes((nds) => nds.filter((n) => n.id !== id))
    setEdges((eds) => eds.filter((e) => e.source !== id && e.target !== id))
  }

  return (
    <div style={{
      background: "linear-gradient(135deg,rgba(245,158,11,.09) 0%,rgba(245,158,11,.02) 100%)",
      border: `1px solid ${selected ? "#F59E0B" : "rgba(245,158,11,.22)"}`,
      borderRadius: "12px", padding: "14px 16px", width: "220px",
      boxShadow: selected ? "0 0 0 3px rgba(245,158,11,.1)" : "none",
      transition: "box-shadow .15s, border-color .15s",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <div style={{ width: 24, height: 24, borderRadius: "6px", background: "rgba(245,158,11,.14)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <AlignLeft size={12} style={{ color: "#F59E0B" }} />
          </div>
          <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "10px", fontWeight: 700, color: "rgba(245,158,11,.8)", textTransform: "uppercase", letterSpacing: "1.5px" }}>
            Texto
          </span>
        </div>
        <RemoveBtn onRemove={handleRemove} />
      </div>

      <p style={LABEL}>Conteúdo</p>
      <textarea
        className="nodrag nowheel"
        value={data.content ?? ""}
        onChange={(e) => updateNodeData(id, { content: e.target.value })}
        placeholder="Produto, contexto, descrição..."
        rows={3}
        style={{
          width: "100%", background: "rgba(0,0,0,.35)",
          border: "1px solid rgba(245,158,11,.18)", borderRadius: "6px",
          padding: "7px 9px", fontSize: "11px", color: "#F5F5F5",
          outline: "none", resize: "none",
          fontFamily: "'DM Sans',sans-serif", lineHeight: "1.5",
          boxSizing: "border-box", caretColor: "#F59E0B",
        }}
      />

      <Handle type="source" position={Position.Right}
        style={{ background: "#F59E0B", width: 10, height: 10, border: "2px solid #0D0D0D", right: -6 }} />
    </div>
  )
})
TextNode.displayName = "TextNode"

// ─── Voice Node ───────────────────────────────────────────────────────────────

export type VoiceData = { model: string; cost: number }
type VoiceNodeType = Node<VoiceData, "voice">

export const VoiceNode = memo(({ id, data, selected }: NodeProps<VoiceNodeType>) => {
  const { updateNodeData, setNodes, setEdges } = useReactFlow()

  function handleModelChange(model: string) {
    updateNodeData(id, { model, cost: VOICE_MODELS[model] ?? 5 })
  }

  function handleRemove() {
    setNodes((nds) => nds.filter((n) => n.id !== id))
    setEdges((eds) => eds.filter((e) => e.source !== id && e.target !== id))
  }

  return (
    <div style={{
      background: "linear-gradient(135deg,rgba(168,85,247,.09) 0%,rgba(168,85,247,.02) 100%)",
      border: `1px solid ${selected ? "#A855F7" : "rgba(168,85,247,.22)"}`,
      borderRadius: "12px", padding: "14px 16px", width: "210px",
      boxShadow: selected ? "0 0 0 3px rgba(168,85,247,.1)" : "none",
      transition: "box-shadow .15s, border-color .15s",
    }}>
      <Handle type="target" position={Position.Left}
        style={{ background: "rgba(168,85,247,.5)", width: 10, height: 10, border: "2px solid #0D0D0D", left: -6 }} />

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <div style={{ width: 24, height: 24, borderRadius: "6px", background: "rgba(168,85,247,.14)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Mic size={12} style={{ color: "#A855F7" }} />
          </div>
          <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "10px", fontWeight: 700, color: "rgba(168,85,247,.8)", textTransform: "uppercase", letterSpacing: "1.5px" }}>
            Voz IA
          </span>
        </div>
        <RemoveBtn onRemove={handleRemove} />
      </div>

      <p style={LABEL}>Modelo de voz</p>
      <select
        className="nodrag"
        value={data.model}
        onChange={(e) => handleModelChange(e.target.value)}
        style={{
          width: "100%", background: "#0D0D0D",
          border: "1px solid rgba(168,85,247,.2)",
          borderRadius: "6px", padding: "7px 10px",
          fontSize: "12px", color: "#F5F5F5",
          outline: "none", cursor: "pointer",
          fontFamily: "'DM Sans',sans-serif",
          marginBottom: "10px", appearance: "auto",
        }}
      >
        {Object.keys(VOICE_MODELS).map((m) => (
          <option key={m} value={m} style={{ background: "#111111" }}>
            {m} · {VOICE_MODELS[m]} cr
          </option>
        ))}
      </select>

      <div style={{ display: "flex", justifyContent: "center" }}>
        <span style={{
          background: "rgba(168,85,247,.1)",
          border: "1px solid rgba(168,85,247,.2)",
          borderRadius: "9999px", fontSize: "10px", color: "#A855F7",
          padding: "2px 10px", fontFamily: "'Space Grotesk',sans-serif",
        }}>
          {data.cost} créditos
        </span>
      </div>

      <Handle type="source" position={Position.Right}
        style={{ background: "rgba(168,85,247,.5)", width: 10, height: 10, border: "2px solid #0D0D0D", right: -6 }} />
    </div>
  )
})
VoiceNode.displayName = "VoiceNode"

// ─── Model Node ───────────────────────────────────────────────────────────────

export type ModelData = {
  model: string
  cost: number
  aspectRatio: AspectRatio
  outputType: "video" | "image"
}
type ModelNodeType = Node<ModelData, "model">

export const ModelNode = memo(({ id, data, selected }: NodeProps<ModelNodeType>) => {
  const { updateNodeData, setNodes, setEdges } = useReactFlow()

  function handleModelChange(model: string) {
    const info = MODELS[model] ?? { cost: 25, type: "video" as const }
    updateNodeData(id, { model, cost: info.cost, outputType: info.type })
  }

  function handleRemove() {
    setNodes((nds) => nds.filter((n) => n.id !== id))
    setEdges((eds) => eds.filter((e) => e.source !== id && e.target !== id))
  }

  const aspectRatio = data.aspectRatio ?? "9:16"
  const outputType = data.outputType ?? (MODELS[data.model]?.type ?? "video")

  return (
    <div style={{
      background: "#111111",
      border: `1px solid ${selected ? "rgba(255,255,255,.22)" : "rgba(255,255,255,.07)"}`,
      borderRadius: "12px", padding: "14px 16px", width: "230px",
      boxShadow: selected ? "0 0 0 3px rgba(255,255,255,.05)" : "none",
      transition: "box-shadow .15s, border-color .15s",
    }}>
      <Handle type="target" position={Position.Left}
        style={{ background: "rgba(255,255,255,.3)", width: 10, height: 10, border: "2px solid #0D0D0D", left: -6 }} />

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <div style={{ width: 24, height: 24, borderRadius: "6px", background: "rgba(0,229,255,.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Zap size={11} style={{ color: "#00E5FF" }} />
          </div>
          <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "10px", fontWeight: 700, color: "rgba(245,245,245,.4)", textTransform: "uppercase", letterSpacing: "1.5px" }}>
            Modelo IA
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
          <span style={{
            fontSize: "9px", fontWeight: 700, letterSpacing: ".5px",
            padding: "2px 6px", borderRadius: "4px", textTransform: "uppercase",
            background: outputType === "video" ? "rgba(255,77,0,.1)" : "rgba(74,222,128,.1)",
            color: outputType === "video" ? "#FF4D00" : "#4ADE80",
            border: `1px solid ${outputType === "video" ? "rgba(255,77,0,.2)" : "rgba(74,222,128,.2)"}`,
            fontFamily: "'DM Sans',sans-serif",
          }}>
            {outputType === "video" ? "Vídeo" : "Img"}
          </span>
          <RemoveBtn onRemove={handleRemove} />
        </div>
      </div>

      <select
        className="nodrag"
        value={data.model}
        onChange={(e) => handleModelChange(e.target.value)}
        style={{
          width: "100%", background: "#0D0D0D",
          border: "1px solid rgba(255,255,255,.08)",
          borderRadius: "6px", padding: "7px 10px",
          fontSize: "12px", color: "#F5F5F5",
          outline: "none", cursor: "pointer",
          fontFamily: "'DM Sans',sans-serif",
          marginBottom: "10px", appearance: "auto",
        }}
      >
        <optgroup label="── Vídeo ──">
          {VIDEO_MODELS.map((m) => (
            <option key={m} value={m} style={{ background: "#111111" }}>
              {m} · {MODELS[m].cost} cr
            </option>
          ))}
        </optgroup>
        <optgroup label="── Imagem ──">
          {IMAGE_MODELS.map((m) => (
            <option key={m} value={m} style={{ background: "#111111" }}>
              {m} · {MODELS[m].cost} cr
            </option>
          ))}
        </optgroup>
      </select>

      <p style={LABEL}>Proporção</p>
      <div style={{ display: "flex", gap: "4px", marginBottom: "10px" }}>
        {ASPECT_RATIOS.map((ar) => (
          <button
            key={ar}
            className="nodrag"
            onClick={() => updateNodeData(id, { aspectRatio: ar })}
            style={{
              flex: 1,
              background: aspectRatio === ar ? "rgba(0,229,255,.12)" : "rgba(255,255,255,.04)",
              border: `1px solid ${aspectRatio === ar ? "rgba(0,229,255,.3)" : "rgba(255,255,255,.06)"}`,
              borderRadius: "4px", padding: "3px 0", fontSize: "9px",
              color: aspectRatio === ar ? "#00E5FF" : "rgba(245,245,245,.35)",
              cursor: "pointer", fontFamily: "'DM Sans',sans-serif",
              fontWeight: aspectRatio === ar ? 700 : 400, transition: "all .12s",
            }}
          >
            {ar}
          </button>
        ))}
      </div>

      <div style={{ display: "flex", justifyContent: "center" }}>
        <span style={{
          background: "rgba(0,229,255,.08)", border: "1px solid rgba(0,229,255,.15)",
          borderRadius: "9999px", fontSize: "10px", color: "#00E5FF",
          padding: "2px 10px", fontFamily: "'Space Grotesk',sans-serif",
        }}>
          {data.cost} créditos
        </span>
      </div>

      <Handle type="source" position={Position.Right}
        style={{ background: "rgba(255,255,255,.3)", width: 10, height: 10, border: "2px solid #0D0D0D", right: -6 }} />
    </div>
  )
})
ModelNode.displayName = "ModelNode"

// ─── Output Node ─────────────────────────────────────────────────────────────

export type OutputData = { quantity: Quantity }
type OutputNodeType = Node<OutputData, "result">

export const OutputNode = memo(({ id, data, selected }: NodeProps<OutputNodeType>) => {
  const { updateNodeData } = useReactFlow()
  const qty = data.quantity ?? 1

  return (
    <div style={{
      background: "linear-gradient(135deg,rgba(0,229,255,.08) 0%,rgba(0,229,255,.02) 100%)",
      border: `1px solid ${selected ? "#00E5FF" : "rgba(0,229,255,.18)"}`,
      borderRadius: "12px", padding: "14px 16px", width: "195px",
      boxShadow: selected ? "0 0 0 3px rgba(0,229,255,.08)" : "none",
      transition: "box-shadow .15s, border-color .15s",
    }}>
      <Handle type="target" position={Position.Left}
        style={{ background: "#00E5FF", width: 10, height: 10, border: "2px solid #0D0D0D", left: -6 }} />

      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
        <div style={{ width: 28, height: 28, borderRadius: "8px", background: "rgba(0,229,255,.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <CheckCircle size={13} style={{ color: "#00E5FF" }} />
        </div>
        <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "11px", fontWeight: 700, color: "#00E5FF", letterSpacing: "1.5px", textTransform: "uppercase" }}>
          Saída
        </span>
      </div>

      <p style={LABEL}>Quantidade</p>
      <div style={{ display: "flex", gap: "4px", marginBottom: "10px" }}>
        {QUANTITIES.map((q) => (
          <button
            key={q}
            className="nodrag"
            onClick={() => updateNodeData(id, { quantity: q })}
            style={{
              flex: 1,
              background: qty === q ? "rgba(0,229,255,.12)" : "rgba(255,255,255,.04)",
              border: `1px solid ${qty === q ? "rgba(0,229,255,.3)" : "rgba(255,255,255,.06)"}`,
              borderRadius: "4px", padding: "4px 0", fontSize: "10px",
              color: qty === q ? "#00E5FF" : "rgba(245,245,245,.35)",
              cursor: "pointer", fontFamily: "'Space Grotesk',sans-serif",
              fontWeight: qty === q ? 700 : 400, transition: "all .12s",
            }}
          >
            {q}×
          </button>
        ))}
      </div>

      <p style={{ fontSize: "10px", color: "rgba(245,245,245,.28)", margin: 0, textAlign: "center", fontFamily: "'DM Sans',sans-serif" }}>
        {qty} {qty === 1 ? "arquivo gerado" : "arquivos gerados"} / execução
      </p>
    </div>
  )
})
OutputNode.displayName = "OutputNode"

// ─── Mapeamento nome-display → ID do backend ──────────────────────────────────

export const MODEL_ID_MAP: Record<string, string> = {
  "Seedance Fast": "seedance-fast",
  "Seedance 2.0":  "seedance-20",
  "Wan 2.7":       "wan-27",
  "Kling Std":     "kling-std",
  "Kling Pro":     "kling-pro",
  "Kling O1":      "kling-o1",
  "Hailuo 2.3":    "hailuo-23",
  "Veo 3.1 Lite":  "veo-31-lite",
  "GPT Image 2":   "gpt-image-2",
  "Flux Pro":      "nano-banana-pro",
  "Ideogram 2.0":  "ideogram-v3",
  "DALL-E 3":      "gpt-image-2",
}

// I2V models que requerem imagem de referência
export const I2V_MODEL_IDS = new Set(["wan-27", "hailuo-23"])
