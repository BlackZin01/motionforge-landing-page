"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Play, Pencil, Trash2, Plus, X } from "lucide-react"
import Canvas, { type WorkflowNode } from "@/components/dashboard/workflows/canvas"

// ─── Dados mock ───────────────────────────────────────────────────────────────
// TODO: integrar API — buscar workflows do usuário

const MOCK_WORKFLOWS = [
  {
    id: "1",
    name: "UGC TikTok Shop",
    steps: ["Seedance Fast", "Kling Std", "Hailuo 2.3"],
    lastRun: "Hoje",
    generations: 12,
  },
  {
    id: "2",
    name: "Imagem + Vídeo Pro",
    steps: ["Nano Banana Pro", "Seedance 2.0"],
    lastRun: "Ontem",
    generations: 8,
  },
  {
    id: "3",
    name: "Batch Criativo",
    steps: ["FLUX 2 Dev", "Wan 2.7", "Seedance Fast"],
    lastRun: "3 dias atrás",
    generations: 31,
  },
]

// Custo padrão por modelo
const MODEL_COSTS: Record<string, number> = {
  "Seedance Fast": 25,
  "Seedance 2.0": 35,
  "Wan 2.7": 20,
  "Kling Std": 45,
  "Kling Pro": 60,
  "Kling O1": 80,
  "Hailuo 2.3": 30,
  "Veo 3.1 Lite": 40,
}

// ─── Nodes padrão ao abrir o drawer ──────────────────────────────────────────

const DEFAULT_NODES: WorkflowNode[] = [
  { id: "default-1", model: "Seedance Fast", cost: 25 },
  { id: "default-2", model: "Kling Std", cost: 45 },
]

// ─── Componente ──────────────────────────────────────────────────────────────

export default function WorkflowsPage() {
  const [workflows, setWorkflows] = useState(MOCK_WORKFLOWS)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [workflowName, setWorkflowName] = useState("")
  const [nodes, setNodes] = useState<WorkflowNode[]>(DEFAULT_NODES)
  const [editingId, setEditingId] = useState<string | null>(null)

  // ─── Cálculo de custo total ─────────────────────────────────────────────────

  const totalCost = nodes.reduce((acc, n) => acc + n.cost, 0)

  // ─── Handlers de nodes ──────────────────────────────────────────────────────

  function addNode() {
    const newNode: WorkflowNode = {
      id: Date.now().toString(),
      model: "Seedance Fast",
      cost: 25,
    }
    setNodes((prev) => [...prev, newNode])
  }

  function removeNode(id: string) {
    setNodes((prev) => prev.filter((n) => n.id !== id))
  }

  function changeModel(id: string, model: string) {
    setNodes((prev) =>
      prev.map((n) =>
        n.id === id
          ? { ...n, model, cost: MODEL_COSTS[model] ?? 25 }
          : n
      )
    )
  }

  // ─── Abrir drawer ────────────────────────────────────────────────────────────

  function openNewDrawer() {
    setEditingId(null)
    setWorkflowName("")
    setNodes([...DEFAULT_NODES])
    setDrawerOpen(true)
  }

  function openEditDrawer(id: string) {
    const wf = workflows.find((w) => w.id === id)
    if (!wf) return
    setEditingId(id)
    setWorkflowName(wf.name)
    setNodes(
      wf.steps.map((step, i) => ({
        id: `edit-${i}`,
        model: step,
        cost: MODEL_COSTS[step] ?? 25,
      }))
    )
    setDrawerOpen(true)
  }

  function closeDrawer() {
    setDrawerOpen(false)
  }

  // ─── Salvar workflow ─────────────────────────────────────────────────────────
  // TODO: salvar no banco de dados via API

  function saveWorkflow() {
    const steps = nodes.map((n) => n.model)
    if (editingId) {
      setWorkflows((prev) =>
        prev.map((w) =>
          w.id === editingId ? { ...w, name: workflowName || w.name, steps } : w
        )
      )
    } else {
      setWorkflows((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          name: workflowName || "Novo Workflow",
          steps,
          lastRun: "—",
          generations: 0,
        },
      ])
    }
    closeDrawer()
  }

  // ─── Deletar workflow ────────────────────────────────────────────────────────
  // TODO: deletar via API

  function deleteWorkflow(id: string) {
    setWorkflows((prev) => prev.filter((w) => w.id !== id))
  }

  // ─── Render ──────────────────────────────────────────────────────────────────

  return (
    <>
      <div
        style={{
          padding: "24px",
          maxWidth: "1400px",
          margin: "0 auto",
          position: "relative",
          minHeight: "calc(100vh - 52px)",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "24px",
          }}
        >
          <span
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "20px",
              fontWeight: 700,
              color: "#F5F5F5",
            }}
          >
            Workflows
          </span>
          <span
            style={{
              fontSize: "13px",
              color: "rgba(245,245,245,0.4)",
            }}
          >
            {workflows.length} workflows
          </span>
        </div>

        {/* Grid de workflows */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "8px",
          }}
        >
          {workflows.map((wf) => (
            <div
              key={wf.id}
              style={{
                background: "#111111",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: "12px",
                padding: "16px",
              }}
            >
              {/* Nome */}
              <span
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "14px",
                  fontWeight: 700,
                  color: "#F5F5F5",
                  display: "block",
                }}
              >
                {wf.name}
              </span>

              {/* Steps visual */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  marginTop: "8px",
                  flexWrap: "wrap",
                }}
              >
                {wf.steps.map((step, i) => (
                  <div
                    key={i}
                    style={{ display: "flex", alignItems: "center", gap: "6px" }}
                  >
                    <span
                      style={{
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(255,255,255,0.06)",
                        padding: "3px 8px",
                        borderRadius: "4px",
                        fontSize: "11px",
                        color: "rgba(245,245,245,0.4)",
                      }}
                    >
                      {step}
                    </span>
                    {i < wf.steps.length - 1 && (
                      <span
                        style={{
                          fontSize: "10px",
                          color: "rgba(245,245,245,0.4)",
                        }}
                      >
                        →
                      </span>
                    )}
                  </div>
                ))}
              </div>

              {/* Meta info */}
              <p
                style={{
                  fontSize: "11px",
                  color: "rgba(245,245,245,0.4)",
                  marginTop: "8px",
                  margin: "8px 0 0",
                }}
              >
                Última execução: {wf.lastRun} · {wf.generations} gerações
              </p>

              {/* Botões de ação */}
              <div style={{ display: "flex", gap: "6px", marginTop: "12px" }}>
                {/* Executar */}
                {/* TODO: integrar API de execução de workflow */}
                <button
                  style={{
                    background: "rgba(255,77,0,0.1)",
                    border: "1px solid rgba(255,77,0,0.3)",
                    borderRadius: "6px",
                    padding: "5px 10px",
                    fontSize: "12px",
                    color: "#FF4D00",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                    fontFamily: "'DM Sans', sans-serif",
                    fontWeight: 700,
                  }}
                >
                  <Play size={12} />
                  Executar
                </button>

                {/* Editar */}
                <button
                  onClick={() => openEditDrawer(wf.id)}
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.06)",
                    borderRadius: "6px",
                    padding: "5px 10px",
                    fontSize: "12px",
                    color: "rgba(245,245,245,0.4)",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                >
                  <Pencil size={12} />
                  Editar
                </button>

                {/* Deletar */}
                <button
                  onClick={() => deleteWorkflow(wf.id)}
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.06)",
                    borderRadius: "6px",
                    padding: "5px 10px",
                    fontSize: "12px",
                    color: "rgba(245,245,245,0.4)",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                    fontFamily: "'DM Sans', sans-serif",
                    transition: "color 0.15s ease",
                  }}
                  onMouseEnter={(e) => {
                    ;(e.currentTarget as HTMLButtonElement).style.color = "#ef4444"
                  }}
                  onMouseLeave={(e) => {
                    ;(e.currentTarget as HTMLButtonElement).style.color =
                      "rgba(245,245,245,0.4)"
                  }}
                >
                  <Trash2 size={12} />
                  Deletar
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FAB — Botão de ação flutuante */}
      <motion.div
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.96 }}
        style={{
          position: "fixed",
          bottom: "24px",
          right: "24px",
          zIndex: 40,
        }}
      >
        <button
          onClick={openNewDrawer}
          style={{
            width: "52px",
            height: "52px",
            background: "#FF4D00",
            color: "white",
            border: "none",
            borderRadius: "50%",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "box-shadow 0.2s ease",
            boxShadow: "0 4px 16px rgba(255,77,0,0.25)",
          }}
          onMouseEnter={(e) => {
            ;(e.currentTarget as HTMLButtonElement).style.boxShadow =
              "0 0 24px rgba(255,77,0,0.4)"
          }}
          onMouseLeave={(e) => {
            ;(e.currentTarget as HTMLButtonElement).style.boxShadow =
              "0 4px 16px rgba(255,77,0,0.25)"
          }}
          aria-label="Novo workflow"
        >
          <Plus size={20} />
        </button>
      </motion.div>

      {/* Drawer de criação/edição */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={closeDrawer}
              style={{
                position: "fixed",
                inset: 0,
                background: "rgba(0,0,0,0.5)",
                zIndex: 49,
              }}
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: 480 }}
              animate={{ x: 0 }}
              exit={{ x: 480 }}
              transition={{ type: "spring", damping: 28, stiffness: 280 }}
              style={{
                position: "fixed",
                right: 0,
                top: 0,
                bottom: 0,
                width: "480px",
                background: "#0A0A0A",
                borderLeft: "1px solid rgba(255,255,255,0.05)",
                zIndex: 50,
                display: "flex",
                flexDirection: "column",
                overflowY: "auto",
              }}
            >
              {/* Header do drawer */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "20px",
                  borderBottom: "1px solid rgba(255,255,255,0.05)",
                }}
              >
                <span
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "16px",
                    fontWeight: 700,
                    color: "#F5F5F5",
                  }}
                >
                  {editingId ? "Editar Workflow" : "Novo Workflow"}
                </span>
                <button
                  onClick={closeDrawer}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "rgba(245,245,245,0.4)",
                    display: "flex",
                    alignItems: "center",
                    transition: "color 0.15s ease",
                  }}
                  onMouseEnter={(e) => {
                    ;(e.currentTarget as HTMLButtonElement).style.color = "#F5F5F5"
                  }}
                  onMouseLeave={(e) => {
                    ;(e.currentTarget as HTMLButtonElement).style.color =
                      "rgba(245,245,245,0.4)"
                  }}
                >
                  <X size={20} />
                </button>
              </div>

              {/* Body do drawer */}
              <div
                style={{
                  padding: "20px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                  flex: 1,
                }}
              >
                {/* Input nome do workflow */}
                <input
                  type="text"
                  value={workflowName}
                  onChange={(e) => setWorkflowName(e.target.value)}
                  placeholder="Nome do workflow..."
                  style={{
                    background: "#111111",
                    border: "1px solid rgba(255,255,255,0.06)",
                    borderRadius: "8px",
                    padding: "10px 12px",
                    color: "#F5F5F5",
                    fontSize: "14px",
                    outline: "none",
                    width: "100%",
                    boxSizing: "border-box",
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                />

                {/* Canvas com nodes */}
                <Canvas
                  nodes={nodes}
                  onAddNode={addNode}
                  onRemoveNode={removeNode}
                  onChangeModel={changeModel}
                />

                {/* Custo total estimado */}
                <p
                  style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: "13px",
                    color: "#FF4D00",
                    margin: 0,
                  }}
                >
                  Custo total estimado: {totalCost} créditos por geração
                </p>

                {/* Botão salvar */}
                {/* TODO: salvar no banco de dados via API */}
                <button
                  onClick={saveWorkflow}
                  style={{
                    background: "#FF4D00",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    height: "44px",
                    width: "100%",
                    fontSize: "14px",
                    fontWeight: 700,
                    fontFamily: "'DM Sans', sans-serif",
                    cursor: "pointer",
                    letterSpacing: "0.5px",
                    transition: "opacity 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    ;(e.currentTarget as HTMLButtonElement).style.opacity = "0.88"
                  }}
                  onMouseLeave={(e) => {
                    ;(e.currentTarget as HTMLButtonElement).style.opacity = "1"
                  }}
                >
                  Salvar Workflow
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
