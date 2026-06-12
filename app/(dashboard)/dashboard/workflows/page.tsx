"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Play, Pencil, Trash2, Plus, X, GitBranch } from "lucide-react"
import Canvas, { type WorkflowNode } from "@/components/dashboard/workflows/canvas"

// ─── Custo padrão por modelo ──────────────────────────────────────────────────

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

// ─── Tipos ────────────────────────────────────────────────────────────────────

interface Workflow {
  id: string
  name: string
  steps: string[]
  lastRun: string
  generations: number
}

// ─── Nodes padrão ao criar novo workflow ──────────────────────────────────────

const DEFAULT_NODES: WorkflowNode[] = [
  { id: "default-1", model: "Seedance Fast", cost: 25 },
]

// ─── Empty State ──────────────────────────────────────────────────────────────

function EmptyState({ onNew }: { onNew: () => void }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "64px 24px",
        textAlign: "center",
        gap: "16px",
      }}
    >
      <div
        style={{
          width: 56,
          height: 56,
          borderRadius: "12px",
          background: "rgba(255,77,0,0.08)",
          border: "1px solid rgba(255,77,0,0.15)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <GitBranch size={24} style={{ color: "rgba(255,77,0,0.6)" }} />
      </div>
      <div>
        <h2
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "16px",
            fontWeight: 700,
            color: "#F5F5F5",
            marginBottom: "8px",
          }}
        >
          Nenhum workflow ainda.
        </h2>
        <p style={{ fontSize: "13px", color: "rgba(245,245,245,0.4)", marginBottom: 0 }}>
          Crie sequências de modelos para automatizar suas gerações.
        </p>
      </div>
      <button
        onClick={onNew}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "6px",
          background: "#FF4D00",
          color: "white",
          border: "none",
          borderRadius: "8px",
          padding: "10px 20px",
          fontSize: "13px",
          fontWeight: 700,
          fontFamily: "'DM Sans', sans-serif",
          cursor: "pointer",
          letterSpacing: "0.5px",
        }}
      >
        <Plus size={14} />
        Criar primeiro workflow
      </button>
    </div>
  )
}

// ─── Componente ──────────────────────────────────────────────────────────────

export default function WorkflowsPage() {
  const [workflows, setWorkflows] = useState<Workflow[]>([])
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [workflowName, setWorkflowName] = useState("")
  const [nodes, setNodes] = useState<WorkflowNode[]>(DEFAULT_NODES)
  const [editingId, setEditingId] = useState<string | null>(null)

  // ─── Custo total ─────────────────────────────────────────────────────────────

  const totalCost = nodes.reduce((acc, n) => acc + n.cost, 0)

  // ─── Handlers de nodes ───────────────────────────────────────────────────────

  function addNode() {
    setNodes((prev) => [
      ...prev,
      { id: Date.now().toString(), model: "Seedance Fast", cost: 25 },
    ])
  }

  function removeNode(id: string) {
    setNodes((prev) => prev.filter((n) => n.id !== id))
  }

  function changeModel(id: string, model: string) {
    setNodes((prev) =>
      prev.map((n) =>
        n.id === id ? { ...n, model, cost: MODEL_COSTS[model] ?? 25 } : n
      )
    )
  }

  // ─── Abrir drawer ─────────────────────────────────────────────────────────────

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

  // ─── Salvar workflow ──────────────────────────────────────────────────────────
  // TODO: persistir via API /api/workflows

  function saveWorkflow() {
    const name = workflowName.trim() || "Workflow sem nome"
    const steps = nodes.map((n) => n.model)

    if (editingId) {
      setWorkflows((prev) =>
        prev.map((w) => (w.id === editingId ? { ...w, name, steps } : w))
      )
    } else {
      setWorkflows((prev) => [
        ...prev,
        { id: Date.now().toString(), name, steps, lastRun: "—", generations: 0 },
      ])
    }
    closeDrawer()
  }

  // ─── Deletar workflow ─────────────────────────────────────────────────────────
  // TODO: deletar via API /api/workflows/:id

  function deleteWorkflow(id: string) {
    setWorkflows((prev) => prev.filter((w) => w.id !== id))
  }

  // ─── Render ───────────────────────────────────────────────────────────────────

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
          {workflows.length > 0 && (
            <span style={{ fontSize: "13px", color: "rgba(245,245,245,0.4)" }}>
              {workflows.length} workflow{workflows.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>

        {/* Empty state ou grid */}
        {workflows.length === 0 ? (
          <EmptyState onNew={openNewDrawer} />
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
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
                          style={{ fontSize: "10px", color: "rgba(245,245,245,0.3)" }}
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
                    marginBottom: 0,
                  }}
                >
                  Última execução: {wf.lastRun}
                  {wf.generations > 0 && ` · ${wf.generations} gerações`}
                </p>

                {/* Ações */}
                <div style={{ display: "flex", gap: "6px", marginTop: "12px", flexWrap: "wrap" }}>
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
        )}
      </div>

      {/* FAB */}
      {workflows.length > 0 && (
        <motion.div
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.96 }}
          style={{ position: "fixed", bottom: "80px", right: "24px", zIndex: 40 }}
          className="md:bottom-6"
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
              boxShadow: "0 4px 16px rgba(255,77,0,0.3)",
            }}
            aria-label="Novo workflow"
          >
            <Plus size={20} />
          </button>
        </motion.div>
      )}

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
                background: "rgba(0,0,0,0.55)",
                zIndex: 49,
              }}
            />

            {/* Drawer — full-width em mobile, 480px em desktop */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 280 }}
              style={{
                position: "fixed",
                right: 0,
                top: 0,
                bottom: 0,
                background: "#0A0A0A",
                borderLeft: "1px solid rgba(255,255,255,0.05)",
                zIndex: 50,
                display: "flex",
                flexDirection: "column",
                overflowY: "auto",
              }}
              className="w-full md:w-[480px]"
            >
              {/* Header */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "20px",
                  borderBottom: "1px solid rgba(255,255,255,0.05)",
                  flexShrink: 0,
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
                    padding: 4,
                  }}
                  onMouseEnter={(e) => {
                    ;(e.currentTarget as HTMLButtonElement).style.color = "#F5F5F5"
                  }}
                  onMouseLeave={(e) => {
                    ;(e.currentTarget as HTMLButtonElement).style.color =
                      "rgba(245,245,245,0.4)"
                  }}
                  aria-label="Fechar"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Body */}
              <div
                style={{
                  padding: "20px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                  flex: 1,
                }}
              >
                {/* Nome do workflow */}
                <input
                  type="text"
                  value={workflowName}
                  onChange={(e) => setWorkflowName(e.target.value)}
                  placeholder="Nome do workflow..."
                  style={{
                    background: "#111111",
                    border: "1px solid rgba(255,255,255,0.08)",
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

                {/* Custo estimado */}
                <p
                  style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: "13px",
                    color: "#00E5FF",
                    margin: 0,
                  }}
                >
                  Custo estimado: {totalCost} créditos por geração
                </p>

                {/* Botão salvar */}
                <button
                  onClick={saveWorkflow}
                  disabled={nodes.length === 0}
                  style={{
                    background: nodes.length === 0 ? "rgba(255,77,0,0.4)" : "#FF4D00",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    height: "44px",
                    width: "100%",
                    fontSize: "14px",
                    fontWeight: 700,
                    fontFamily: "'DM Sans', sans-serif",
                    cursor: nodes.length === 0 ? "not-allowed" : "pointer",
                    letterSpacing: "0.5px",
                    transition: "opacity 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    if (nodes.length > 0) {
                      (e.currentTarget as HTMLButtonElement).style.opacity = "0.88"
                    }
                  }}
                  onMouseLeave={(e) => {
                    ;(e.currentTarget as HTMLButtonElement).style.opacity = "1"
                  }}
                >
                  Salvar Workflow
                </button>

                {nodes.length === 0 && (
                  <p
                    style={{
                      fontSize: "12px",
                      color: "rgba(245,245,245,0.4)",
                      textAlign: "center",
                      margin: 0,
                    }}
                  >
                    Adicione pelo menos um modelo ao workflow.
                  </p>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
