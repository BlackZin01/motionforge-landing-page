"use client"

import { useEffect, useState } from "react"
import {
  ReactFlow,
  Handle,
  Position,
  BaseEdge,
  getBezierPath,
  Background,
  type NodeProps,
  type EdgeProps,
} from "@xyflow/react"
import "@xyflow/react/dist/style.css"
import type { Variants } from "framer-motion"
import { motion } from "framer-motion"

/* ── Variantes ──────────────────────────────────────────────── */
const EASE = [0.22, 1, 0.36, 1] as const

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [...EASE] } },
}

const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}

/* ── Custom Nodes ────────────────────────────────────────────── */
function ForgeInputNode({ data }: NodeProps) {
  return (
    <div
      style={{
        background: "#161616",
        border: "1px solid rgba(255,77,0,0.35)",
        borderLeft: "3px solid #FF4D00",
        padding: "14px 18px",
        width: 150,
      }}
    >
      <p
        style={{
          fontFamily: "var(--font-sans)",
          fontSize: 8,
          fontWeight: 700,
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          color: "#FF4D00",
          margin: "0 0 6px 0",
        }}
      >
        Entrada
      </p>
      <p
        style={{
          fontFamily: "var(--font-sans)",
          fontSize: 14,
          fontWeight: 700,
          color: "#F5F5F5",
          margin: "0 0 4px 0",
          lineHeight: 1.3,
        }}
      >
        {String(data.label ?? "")}
      </p>
      <p
        style={{
          fontFamily: "var(--font-sans)",
          fontSize: 11,
          color: "rgba(245,245,245,0.4)",
          margin: 0,
          lineHeight: 1.4,
        }}
      >
        {String(data.sub ?? "")}
      </p>
      <Handle
        type="source"
        position={Position.Right}
        style={{ background: "#FF4D00", border: "none", width: 8, height: 8 }}
      />
    </div>
  )
}

function ForgeModelNode({ data }: NodeProps) {
  const isOrange = data.color === "orange"
  const accent = isOrange ? "#FF4D00" : "#00E5FF"
  const borderColor = isOrange ? "rgba(255,77,0,0.22)" : "rgba(0,229,255,0.22)"
  const glowBg = isOrange ? "rgba(255,77,0,0.05)" : "rgba(0,229,255,0.05)"

  return (
    <div
      style={{
        background: `linear-gradient(135deg, #111111 60%, ${glowBg})`,
        border: `1px solid ${borderColor}`,
        padding: "10px 14px",
        width: 180,
        position: "relative",
      }}
    >
      <span
        style={{
          position: "absolute",
          top: -9,
          left: 10,
          background: "#0D0D0D",
          padding: "1px 8px",
          fontFamily: "var(--font-sans)",
          fontSize: 8,
          fontWeight: 700,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: accent,
          border: `1px solid ${borderColor}`,
        }}
      >
        {String(data.tag ?? "")}
      </span>
      <p
        style={{
          fontFamily: "var(--font-sans)",
          fontSize: 13,
          fontWeight: 700,
          color: "#F5F5F5",
          margin: 0,
          lineHeight: 1.3,
          paddingTop: 2,
        }}
      >
        {String(data.label ?? "")}
      </p>
      <Handle
        type="target"
        position={Position.Left}
        style={{ background: accent, border: "none", width: 8, height: 8 }}
      />
      <Handle
        type="source"
        position={Position.Right}
        style={{ background: accent, border: "none", width: 8, height: 8 }}
      />
    </div>
  )
}

function ForgeOutputNode({ data }: NodeProps) {
  return (
    <div
      style={{
        background: "#161616",
        border: "1px solid rgba(0,229,255,0.35)",
        borderRight: "3px solid #00E5FF",
        padding: "14px 18px",
        width: 150,
      }}
    >
      <p
        style={{
          fontFamily: "var(--font-sans)",
          fontSize: 8,
          fontWeight: 700,
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          color: "#00E5FF",
          margin: "0 0 6px 0",
        }}
      >
        Saída
      </p>
      <p
        style={{
          fontFamily: "var(--font-sans)",
          fontSize: 14,
          fontWeight: 700,
          color: "#F5F5F5",
          margin: "0 0 4px 0",
          lineHeight: 1.3,
        }}
      >
        {String(data.label ?? "")}
      </p>
      <p
        style={{
          fontFamily: "var(--font-sans)",
          fontSize: 11,
          color: "rgba(245,245,245,0.4)",
          margin: 0,
          lineHeight: 1.4,
        }}
      >
        {String(data.sub ?? "")}
      </p>
      <Handle
        type="target"
        position={Position.Left}
        style={{ background: "#00E5FF", border: "none", width: 8, height: 8 }}
      />
    </div>
  )
}

/* ── Energy Edge — partículas que percorrem o caminho ────────── */
function EnergyEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
}: EdgeProps) {
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  })

  const pathId = `ep-${id}`
  const rawColor = (data as Record<string, unknown> | undefined)?.color
  const color = typeof rawColor === "string" ? rawColor : "#FF4D00"
  const isOrange = color === "#FF4D00"
  const baseStroke = isOrange ? "rgba(255,77,0,0.18)" : "rgba(0,229,255,0.18)"
  const filterId = `glow-${id}`

  return (
    <g>
      <defs>
        <filter id={filterId} x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Path de referência para animateMotion */}
      <path id={pathId} d={edgePath} fill="none" stroke="none" />

      {/* Base stroke sutil */}
      <BaseEdge id={id} path={edgePath} style={{ stroke: baseStroke, strokeWidth: 1.5 }} />

      {/* 3 partículas escalonadas simulando fluxo de energia */}
      {([0, 0.38, 0.72] as const).map((offset, i) => (
        <circle key={i} r={2.5} fill={color} filter={`url(#${filterId})`} opacity={0.95}>
          <animateMotion
            dur="1.6s"
            repeatCount="indefinite"
            begin={`${-(offset * 1.6).toFixed(3)}s`}
            calcMode="linear"
          >
            <mpath href={`#${pathId}`} />
          </animateMotion>
        </circle>
      ))}
    </g>
  )
}

/* ── Tipos (fora do componente para não recriar a cada render) ── */
const NODE_TYPES = {
  "forge-input": ForgeInputNode,
  "forge-model": ForgeModelNode,
  "forge-output": ForgeOutputNode,
}

const EDGE_TYPES = { energy: EnergyEdge }

const NODES = [
  {
    id: "input",
    type: "forge-input",
    position: { x: 0, y: 108 },
    data: { label: "Seu Produto", sub: "URL · Imagem · Ficha" },
    draggable: false,
  },
  {
    id: "m1",
    type: "forge-model",
    position: { x: 248, y: 0 },
    data: { label: "Nano Banana Pro 4K", tag: "Vídeo", color: "orange" },
    draggable: false,
  },
  {
    id: "m2",
    type: "forge-model",
    position: { x: 248, y: 110 },
    data: { label: "Kling v3.0", tag: "Motion", color: "orange" },
    draggable: false,
  },
  {
    id: "m3",
    type: "forge-model",
    position: { x: 248, y: 220 },
    data: { label: "FLUX 2 Pro", tag: "Imagem", color: "cyan" },
    draggable: false,
  },
  {
    id: "output",
    type: "forge-output",
    position: { x: 520, y: 108 },
    data: { label: "UGC Pronto", sub: "60 segundos" },
    draggable: false,
  },
]

const EDGES = [
  { id: "e-i-m1", source: "input", target: "m1", type: "energy", data: { color: "#FF4D00" } },
  { id: "e-i-m2", source: "input", target: "m2", type: "energy", data: { color: "#FF4D00" } },
  { id: "e-i-m3", source: "input", target: "m3", type: "energy", data: { color: "#FF4D00" } },
  { id: "e-m1-o", source: "m1", target: "output", type: "energy", data: { color: "#00E5FF" } },
  { id: "e-m2-o", source: "m2", target: "output", type: "energy", data: { color: "#00E5FF" } },
  { id: "e-m3-o", source: "m3", target: "output", type: "energy", data: { color: "#00E5FF" } },
]

/* ── Diagrama (montado só no client para evitar hydration mismatch) */
function WorkflowDiagram() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  return (
    <div
      style={{
        width: "100%",
        height: 340,
        background: "#080808",
        border: "1px solid rgba(255,255,255,0.06)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {mounted && (
        <ReactFlow
          nodes={NODES}
          edges={EDGES}
          nodeTypes={NODE_TYPES}
          edgeTypes={EDGE_TYPES}
          fitView
          fitViewOptions={{ padding: 0.22 }}
          panOnDrag={false}
          zoomOnScroll={false}
          zoomOnPinch={false}
          zoomOnDoubleClick={false}
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable={false}
          proOptions={{ hideAttribution: true }}
          style={{ background: "transparent" }}
        >
          <Background color="rgba(255,255,255,0.025)" gap={24} size={1} />
        </ReactFlow>
      )}
    </div>
  )
}

/* ── Seção principal ────────────────────────────────────────── */
export function Workflows() {
  return (
    <section id="workflows" style={{ background: "var(--color-forge-black)" }}>
      <div className="mx-auto max-w-7xl px-6 py-24 lg:py-32">

        {/* Header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={stagger}
          className="mb-12 max-w-2xl"
        >
          <motion.p
            variants={fadeUp}
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "var(--color-forge-orange)",
              marginBottom: 16,
            }}
          >
            Workflows
          </motion.p>

          <motion.h2
            variants={fadeUp}
            style={{
              fontFamily: "var(--font-bebas)",
              fontSize: "clamp(36px, 5.5vw, 56px)",
              lineHeight: 1,
              letterSpacing: "3px",
              color: "var(--color-forge-white)",
              marginBottom: 16,
            }}
          >
            Um produto entra.
            <br />
            <span style={{ color: "var(--color-forge-orange)" }}>Conteúdo sai.</span>
          </motion.h2>

          <motion.p
            variants={fadeUp}
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: 16,
              lineHeight: 1.65,
              color: "var(--color-forge-muted)",
            }}
          >
            Conecte modelos em sequência. O workflow roda sozinho — por SKU, por cliente, por formato.
          </motion.p>
        </motion.div>

        {/* React Flow Diagram */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.7, ease: [...EASE] }}
        >
          <WorkflowDiagram />
        </motion.div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3, ease: [...EASE] }}
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: 13,
            color: "var(--color-forge-muted)",
            textAlign: "center",
            marginTop: 20,
          }}
        >
          50 variações de UGC por SKU — sem briefing, sem equipe.
        </motion.p>
      </div>
    </section>
  )
}
