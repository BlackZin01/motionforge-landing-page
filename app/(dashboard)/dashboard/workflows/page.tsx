"use client"

import { useState } from "react"
import { Play, Pencil, Trash2, Plus, GitBranch } from "lucide-react"
import type { Node, Edge } from "@xyflow/react"
import WorkflowEditor from "@/components/dashboard/workflows/canvas"

// ─── Tipos ────────────────────────────────────────────────────────────────────

interface Workflow {
  id: string
  name: string
  nodes: Node[]
  edges: Edge[]
  createdAt: string
  totalCost: number
  modelCount: number
}

// ─── Empty State ──────────────────────────────────────────────────────────────

function EmptyState({ onNew }: { onNew: () => void }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "80px 24px",
        textAlign: "center",
        gap: "16px",
      }}
    >
      <div
        style={{
          width: 56, height: 56, borderRadius: "12px",
          background: "rgba(255,77,0,.08)",
          border: "1px solid rgba(255,77,0,.15)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}
      >
        <GitBranch size={24} style={{ color: "rgba(255,77,0,.6)" }} />
      </div>
      <div>
        <h2
          style={{
            fontFamily: "'DM Sans',sans-serif",
            fontSize: "16px", fontWeight: 700, color: "#F5F5F5",
            marginBottom: "8px",
          }}
        >
          Nenhum workflow ainda.
        </h2>
        <p style={{ fontSize: "13px", color: "rgba(245,245,245,.4)", margin: 0 }}>
          Crie sequências visuais de modelos de IA para automatizar suas gerações.
        </p>
      </div>
      <button
        onClick={onNew}
        style={{
          display: "inline-flex", alignItems: "center", gap: "6px",
          background: "#FF4D00", color: "white", border: "none",
          borderRadius: "8px", padding: "10px 20px",
          fontSize: "13px", fontWeight: 700,
          fontFamily: "'DM Sans',sans-serif",
          cursor: "pointer", letterSpacing: ".5px",
          transition: "opacity .2s",
        }}
        onMouseEnter={(e) => {
          ;(e.currentTarget as HTMLButtonElement).style.opacity = "0.88"
        }}
        onMouseLeave={(e) => {
          ;(e.currentTarget as HTMLButtonElement).style.opacity = "1"
        }}
      >
        <Plus size={14} />
        Criar primeiro workflow
      </button>
    </div>
  )
}

// ─── Página ───────────────────────────────────────────────────────────────────

export default function WorkflowsPage() {
  const [workflows, setWorkflows] = useState<Workflow[]>([])
  const [editorOpen, setEditorOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [workflowName, setWorkflowName] = useState("Novo Workflow")
  const [editorNodes, setEditorNodes] = useState<Node[]>([])
  const [editorEdges, setEditorEdges] = useState<Edge[]>([])

  // ─── Abrir editor ──────────────────────────────────────────────────────────

  function openNew() {
    setEditingId(null)
    setWorkflowName("Novo Workflow")
    setEditorNodes([])
    setEditorEdges([])
    setEditorOpen(true)
  }

  function openEdit(id: string) {
    const wf = workflows.find((w) => w.id === id)
    if (!wf) return
    setEditingId(id)
    setWorkflowName(wf.name)
    setEditorNodes(wf.nodes)
    setEditorEdges(wf.edges)
    setEditorOpen(true)
  }

  // ─── Salvar workflow ───────────────────────────────────────────────────────

  function handleSave(nodes: Node[], edges: Edge[]) {
    const name = workflowName.trim() || "Workflow sem nome"
    const modelNodes = nodes.filter((n) => n.type === "model")
    const totalCost = modelNodes.reduce(
      (acc, n) => acc + ((n.data as { cost?: number }).cost ?? 0),
      0
    )

    if (editingId) {
      setWorkflows((prev) =>
        prev.map((w) =>
          w.id === editingId
            ? { ...w, name, nodes, edges, totalCost, modelCount: modelNodes.length }
            : w
        )
      )
    } else {
      setWorkflows((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          name,
          nodes,
          edges,
          createdAt: new Date().toLocaleDateString("pt-BR"),
          totalCost,
          modelCount: modelNodes.length,
        },
      ])
    }
    setEditorOpen(false)
  }

  function deleteWorkflow(id: string) {
    setWorkflows((prev) => prev.filter((w) => w.id !== id))
  }

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <>
      {/* Editor overlay (cobre tudo quando aberto) */}
      {editorOpen && (
        <WorkflowEditor
          name={workflowName}
          onNameChange={setWorkflowName}
          onSave={handleSave}
          onBack={() => setEditorOpen(false)}
          initialNodes={editorNodes.length > 0 ? editorNodes : undefined}
          initialEdges={editorEdges}
        />
      )}

      {/* Lista de workflows */}
      <div
        style={{
          padding: "24px",
          maxWidth: "1400px",
          margin: "0 auto",
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
              fontFamily: "'DM Sans',sans-serif",
              fontSize: "20px", fontWeight: 700, color: "#F5F5F5",
            }}
          >
            Workflows
          </span>

          {workflows.length > 0 && (
            <button
              onClick={openNew}
              style={{
                background: "#FF4D00", border: "none", cursor: "pointer",
                color: "white",
                display: "flex", alignItems: "center", gap: "6px",
                fontSize: "13px", fontFamily: "'DM Sans',sans-serif", fontWeight: 700,
                padding: "8px 16px", borderRadius: "8px",
                transition: "opacity .2s",
              }}
              onMouseEnter={(e) => {
                ;(e.currentTarget as HTMLButtonElement).style.opacity = "0.88"
              }}
              onMouseLeave={(e) => {
                ;(e.currentTarget as HTMLButtonElement).style.opacity = "1"
              }}
            >
              <Plus size={14} />
              Novo Workflow
            </button>
          )}
        </div>

        {/* Conteúdo */}
        {workflows.length === 0 ? (
          <EmptyState onNew={openNew} />
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
                  border: "1px solid rgba(255,255,255,.06)",
                  borderRadius: "12px",
                  padding: "16px",
                }}
              >
                {/* Nome */}
                <span
                  style={{
                    fontFamily: "'DM Sans',sans-serif",
                    fontSize: "14px", fontWeight: 700, color: "#F5F5F5",
                    display: "block", marginBottom: "8px",
                  }}
                >
                  {wf.name}
                </span>

                {/* Badges */}
                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "10px" }}>
                  <span
                    style={{
                      fontSize: "11px", color: "rgba(245,245,245,.4)",
                      background: "rgba(255,255,255,.03)",
                      border: "1px solid rgba(255,255,255,.06)",
                      padding: "2px 8px", borderRadius: "4px",
                    }}
                  >
                    {wf.modelCount} modelo{wf.modelCount !== 1 ? "s" : ""}
                  </span>
                  {wf.totalCost > 0 && (
                    <span
                      style={{
                        fontSize: "11px", color: "#00E5FF",
                        background: "rgba(0,229,255,.06)",
                        border: "1px solid rgba(0,229,255,.12)",
                        padding: "2px 8px", borderRadius: "4px",
                        fontFamily: "'Space Grotesk',sans-serif",
                      }}
                    >
                      {wf.totalCost} cr/geração
                    </span>
                  )}
                </div>

                <p
                  style={{
                    fontSize: "11px", color: "rgba(245,245,245,.28)",
                    margin: "0 0 12px",
                  }}
                >
                  Criado em {wf.createdAt}
                </p>

                {/* Ações */}
                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                  <button
                    style={{
                      background: "rgba(255,77,0,.1)",
                      border: "1px solid rgba(255,77,0,.3)",
                      borderRadius: "6px",
                      padding: "5px 10px",
                      fontSize: "12px", color: "#FF4D00",
                      cursor: "pointer",
                      display: "flex", alignItems: "center", gap: "4px",
                      fontFamily: "'DM Sans',sans-serif", fontWeight: 700,
                    }}
                  >
                    <Play size={12} />
                    Executar
                  </button>

                  <button
                    onClick={() => openEdit(wf.id)}
                    style={{
                      background: "rgba(255,255,255,.04)",
                      border: "1px solid rgba(255,255,255,.06)",
                      borderRadius: "6px",
                      padding: "5px 10px",
                      fontSize: "12px", color: "rgba(245,245,245,.4)",
                      cursor: "pointer",
                      display: "flex", alignItems: "center", gap: "4px",
                      fontFamily: "'DM Sans',sans-serif",
                    }}
                  >
                    <Pencil size={12} />
                    Editar
                  </button>

                  <button
                    onClick={() => deleteWorkflow(wf.id)}
                    style={{
                      background: "rgba(255,255,255,.04)",
                      border: "1px solid rgba(255,255,255,.06)",
                      borderRadius: "6px",
                      padding: "5px 10px",
                      fontSize: "12px", color: "rgba(245,245,245,.4)",
                      cursor: "pointer",
                      display: "flex", alignItems: "center", gap: "4px",
                      fontFamily: "'DM Sans',sans-serif",
                      transition: "color .15s",
                    }}
                    onMouseEnter={(e) => {
                      ;(e.currentTarget as HTMLButtonElement).style.color = "#ef4444"
                    }}
                    onMouseLeave={(e) => {
                      ;(e.currentTarget as HTMLButtonElement).style.color =
                        "rgba(245,245,245,.4)"
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
    </>
  )
}
