"use client"

import { useCallback, useRef } from "react"
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  BackgroundVariant,
  Controls,
  addEdge,
  useNodesState,
  useEdgesState,
  type Node,
  type Edge,
  type Connection,
  MarkerType,
} from "@xyflow/react"
import "@xyflow/react/dist/style.css"
import { Zap, CheckCircle, Save, ArrowLeft, Image as ImageIcon, AlignLeft, Mic } from "lucide-react"
import { TriggerNode, ModelNode, OutputNode, ImageNode, TextNode, VoiceNode, MODEL_COSTS, VOICE_MODELS } from "./node-card"

// ─── Node types (definido fora do componente — obrigatório no React Flow) ─────

const NODE_TYPES = {
  trigger: TriggerNode,
  model: ModelNode,
  result: OutputNode,
  image: ImageNode,
  text: TextNode,
  voice: VoiceNode,
}

const EDGE_DEFAULTS = {
  type: "smoothstep" as const,
  style: { stroke: "rgba(255,255,255,.14)", strokeWidth: 1.5 },
  markerEnd: { type: MarkerType.ArrowClosed, color: "rgba(255,255,255,.2)" },
}

const INITIAL_NODES: Node[] = [
  {
    id: "trigger-1",
    type: "trigger",
    position: { x: 80, y: 160 },
    data: { prompt: "" },
  },
]

// ─── Props ────────────────────────────────────────────────────────────────────

export interface WorkflowEditorProps {
  name: string
  onNameChange: (n: string) => void
  onSave: (nodes: Node[], edges: Edge[]) => void
  onBack: () => void
  initialNodes?: Node[]
  initialEdges?: Edge[]
}

// ─── Editor interno (precisa estar dentro do ReactFlowProvider) ───────────────

function EditorInner({
  name,
  onNameChange,
  onSave,
  onBack,
  initialNodes = INITIAL_NODES,
  initialEdges = [],
}: WorkflowEditorProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  const idRef = useRef(100)

  const outputQty = (nodes.find((n) => n.type === "result")?.data as { quantity?: number })?.quantity ?? 1
  const totalCost = nodes
    .filter((n) => n.type === "model" || n.type === "voice")
    .reduce((acc, n) => acc + ((n.data as { cost?: number }).cost ?? 0), 0) * outputQty

  const onConnect = useCallback(
    (connection: Connection) =>
      setEdges((eds) => addEdge({ ...connection, ...EDGE_DEFAULTS }, eds)),
    [setEdges]
  )

  function addModelNode() {
    const id = `model-${++idRef.current}`
    setNodes((nds) => [
      ...nds,
      {
        id,
        type: "model",
        position: { x: 200 + (nds.length * 70) % 350, y: 100 + (nds.length * 50) % 280 },
        data: { model: "Seedance Fast", cost: 25, aspectRatio: "9:16", outputType: "video" },
      },
    ])
  }

  function addImageNode() {
    const id = `image-${++idRef.current}`
    setNodes((nds) => [
      ...nds,
      {
        id,
        type: "image",
        position: { x: 80 + (nds.length * 40) % 200, y: 340 + (nds.length * 30) % 120 },
        data: {},
      },
    ])
  }

  function addOutputNode() {
    const id = `output-${++idRef.current}`
    setNodes((nds) => [
      ...nds,
      {
        id,
        type: "result",
        position: { x: 520 + (nds.length * 40) % 200, y: 160 },
        data: { quantity: 1 },
      },
    ])
  }

  function addTextNode() {
    const id = `text-${++idRef.current}`
    setNodes((nds) => [
      ...nds,
      {
        id,
        type: "text",
        position: { x: 80 + (nds.length * 40) % 200, y: 460 + (nds.length * 20) % 80 },
        data: { content: "" },
      },
    ])
  }

  function addVoiceNode() {
    const id = `voice-${++idRef.current}`
    setNodes((nds) => [
      ...nds,
      {
        id,
        type: "voice",
        position: { x: 340 + (nds.length * 50) % 200, y: 340 + (nds.length * 30) % 100 },
        data: { model: "ElevenLabs", cost: VOICE_MODELS["ElevenLabs"] },
      },
    ])
  }

  return (
    <>
      {/* Estilos do React Flow adaptados ao tema dark do MotionForge */}
      <style>{`
        .mf-flow .react-flow__controls {
          background: #111111;
          border: 1px solid rgba(255,255,255,.06);
          border-radius: 10px;
          box-shadow: none;
          overflow: hidden;
        }
        .mf-flow .react-flow__controls-button {
          background: #111111;
          border-bottom: 1px solid rgba(255,255,255,.05);
          fill: rgba(245,245,245,.4);
        }
        .mf-flow .react-flow__controls-button:hover {
          background: rgba(255,255,255,.05);
          fill: #F5F5F5;
        }
        .mf-flow .react-flow__controls-button:last-child {
          border-bottom: none;
        }
        .mf-flow .react-flow__controls-button svg {
          fill: rgba(245,245,245,.4);
        }
        .mf-flow .react-flow__controls-button:hover svg {
          fill: #F5F5F5;
        }
        .mf-flow .react-flow__edge-path {
          stroke: rgba(255,255,255,.14);
        }
        .mf-flow .react-flow__handle {
          transition: transform .15s;
        }
        .mf-flow .react-flow__handle:hover {
          transform: scale(1.4);
        }
        .mf-flow .react-flow__node.selected > div {
          border-color: rgba(255,255,255,.25) !important;
        }
        .mf-toolbar::-webkit-scrollbar { display: none; }
      `}</style>

      <div
        style={{
          position: "fixed",
          inset: 0,
          background: "#0D0D0D",
          zIndex: 100,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* ─── Top bar ─────────────────────────────────────────────────────── */}
        <div
          style={{
            height: "52px",
            background: "rgba(10,10,10,.98)",
            borderBottom: "1px solid rgba(255,255,255,.05)",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "0 16px",
            flexShrink: 0,
            zIndex: 10,
          }}
        >
          <button
            onClick={onBack}
            style={{
              background: "none", border: "none", cursor: "pointer",
              color: "rgba(245,245,245,.4)",
              display: "flex", alignItems: "center", gap: "6px",
              fontSize: "13px", fontFamily: "'DM Sans',sans-serif",
              padding: "4px 8px", borderRadius: "6px",
              transition: "color .15s",
              whiteSpace: "nowrap",
            }}
            onMouseEnter={(e) => {
              ;(e.currentTarget as HTMLButtonElement).style.color = "#F5F5F5"
            }}
            onMouseLeave={(e) => {
              ;(e.currentTarget as HTMLButtonElement).style.color = "rgba(245,245,245,.4)"
            }}
          >
            <ArrowLeft size={16} />
            Workflows
          </button>

          <div style={{ width: 1, height: 20, background: "rgba(255,255,255,.08)", flexShrink: 0 }} />

          <input
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            placeholder="Nome do workflow..."
            style={{
              background: "none", border: "none", outline: "none",
              color: "#F5F5F5",
              fontSize: "14px", fontWeight: 600,
              fontFamily: "'DM Sans',sans-serif",
              flex: 1,
              minWidth: 0,
            }}
          />

          {totalCost > 0 && (
            <span
              style={{
                fontFamily: "'Space Grotesk',sans-serif",
                fontSize: "12px", color: "#00E5FF",
                background: "rgba(0,229,255,.08)",
                border: "1px solid rgba(0,229,255,.15)",
                padding: "3px 10px", borderRadius: "9999px",
                whiteSpace: "nowrap", flexShrink: 0,
              }}
            >
              {totalCost} cr/geração
            </span>
          )}

          <button
            onClick={() => onSave(nodes, edges)}
            style={{
              background: "#FF4D00", border: "none", cursor: "pointer",
              color: "white",
              display: "flex", alignItems: "center", gap: "6px",
              fontSize: "13px", fontFamily: "'DM Sans',sans-serif", fontWeight: 700,
              padding: "7px 16px", borderRadius: "8px",
              transition: "opacity .2s",
              flexShrink: 0,
            }}
            onMouseEnter={(e) => {
              ;(e.currentTarget as HTMLButtonElement).style.opacity = "0.88"
            }}
            onMouseLeave={(e) => {
              ;(e.currentTarget as HTMLButtonElement).style.opacity = "1"
            }}
          >
            <Save size={14} />
            Salvar
          </button>
        </div>

        {/* ─── Canvas ──────────────────────────────────────────────────────── */}
        <div style={{ flex: 1, position: "relative" }}>
          <ReactFlow
            className="mf-flow"
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={NODE_TYPES}
            defaultEdgeOptions={EDGE_DEFAULTS}
            fitView
            fitViewOptions={{ padding: 0.35 }}
            style={{ background: "#0D0D0D" }}
            deleteKeyCode="Delete"
          >
            <Background
              variant={BackgroundVariant.Dots}
              gap={20}
              size={1}
              color="rgba(255,255,255,.07)"
            />
            <Controls showInteractive={false} />
          </ReactFlow>

          {/* ─── Toolbar inferior ──────────────────────────────────────────── */}
          <div
            className="mf-toolbar"
            style={{
              position: "absolute",
              bottom: "24px",
              left: "50%",
              transform: "translateX(-50%)",
              maxWidth: "calc(100vw - 32px)",
              background: "#141414",
              border: "1px solid rgba(255,255,255,.08)",
              borderRadius: "12px",
              padding: "8px 10px",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              zIndex: 10,
              boxShadow: "0 8px 32px rgba(0,0,0,.6)",
              overflowX: "auto",
              scrollbarWidth: "none",
            }}
          >
            <ToolbarBtn
              icon={<Zap size={13} />}
              label="Modelo IA"
              onClick={addModelNode}
            />
            <div style={{ width: 1, height: 20, background: "rgba(255,255,255,.06)" }} />
            <ToolbarBtn
              icon={<ImageIcon size={13} />}
              label="Imagem"
              onClick={addImageNode}
            />
            <div style={{ width: 1, height: 20, background: "rgba(255,255,255,.06)" }} />
            <ToolbarBtn
              icon={<CheckCircle size={13} />}
              label="Saída"
              onClick={addOutputNode}
            />
            <div style={{ width: 1, height: 20, background: "rgba(255,255,255,.06)" }} />
            <ToolbarBtn
              icon={<AlignLeft size={13} />}
              label="Texto"
              onClick={addTextNode}
            />
            <div style={{ width: 1, height: 20, background: "rgba(255,255,255,.06)" }} />
            <ToolbarBtn
              icon={<Mic size={13} />}
              label="Voz IA"
              onClick={addVoiceNode}
            />
          </div>
        </div>
      </div>
    </>
  )
}

// ─── Botão da toolbar ─────────────────────────────────────────────────────────

function ToolbarBtn({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode
  label: string
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      style={{
        background: "rgba(255,255,255,.04)",
        border: "1px solid rgba(255,255,255,.07)",
        borderRadius: "8px",
        padding: "8px 14px",
        cursor: "pointer",
        display: "flex", alignItems: "center", gap: "7px",
        color: "rgba(245,245,245,.65)",
        fontSize: "12px",
        fontFamily: "'DM Sans',sans-serif", fontWeight: 600,
        transition: "all .15s ease",
        whiteSpace: "nowrap",
      }}
      onMouseEnter={(e) => {
        const b = e.currentTarget as HTMLButtonElement
        b.style.background = "rgba(0,229,255,.08)"
        b.style.borderColor = "rgba(0,229,255,.2)"
        b.style.color = "#00E5FF"
      }}
      onMouseLeave={(e) => {
        const b = e.currentTarget as HTMLButtonElement
        b.style.background = "rgba(255,255,255,.04)"
        b.style.borderColor = "rgba(255,255,255,.07)"
        b.style.color = "rgba(245,245,245,.65)"
      }}
    >
      {icon}
      {label}
    </button>
  )
}

// ─── Export com ReactFlowProvider ─────────────────────────────────────────────

export default function WorkflowEditor(props: WorkflowEditorProps) {
  return (
    <ReactFlowProvider>
      <EditorInner {...props} />
    </ReactFlowProvider>
  )
}
