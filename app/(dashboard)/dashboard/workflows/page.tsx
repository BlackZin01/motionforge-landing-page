"use client"

import { useState, useEffect } from "react"
import dynamic from "next/dynamic"
import { Play, Pencil, Trash2, Plus, GitBranch, X, Loader2, CheckCircle, AlertCircle, Download } from "lucide-react"
import type { Node, Edge } from "@xyflow/react"
import { MODEL_ID_MAP, I2V_MODEL_IDS } from "@/components/dashboard/workflows/node-card"
import type { ModelData, ImageData, TriggerData, OutputData } from "@/components/dashboard/workflows/node-card"
import { useToast } from "@/components/dashboard/shared/toast"

const WorkflowEditor = dynamic(
  () => import("@/components/dashboard/workflows/canvas"),
  { ssr: false }
)

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

interface ExecutionResult {
  stepIndex: number
  modelName: string
  outputType: "video" | "image"
  outputUrl: string | null
  run: number
  error?: string
}

interface ExecutionProgress {
  current: number
  total: number
  step: string
}

// ─── Helpers de execução ──────────────────────────────────────────────────────

function getModelNodesInOrder(nodes: Node[], edges: Edge[]): Node[] {
  const childrenMap = new Map<string, string[]>()
  for (const node of nodes) childrenMap.set(node.id, [])
  for (const edge of edges) childrenMap.get(edge.source)?.push(edge.target)

  const triggerNode = nodes.find((n) => n.type === "trigger")
  if (!triggerNode) return []

  const result: Node[] = []
  const visited = new Set<string>()
  const queue = [triggerNode.id]

  while (queue.length > 0) {
    const nodeId = queue.shift()!
    if (visited.has(nodeId)) continue
    visited.add(nodeId)
    const node = nodes.find((n) => n.id === nodeId)
    if (!node) continue
    if (node.type === "model") result.push(node)
    for (const childId of childrenMap.get(nodeId) ?? []) {
      if (!visited.has(childId)) queue.push(childId)
    }
  }
  return result
}

function getConnectedImageNode(modelNodeId: string, nodes: Node[], edges: Edge[]): Node | null {
  for (const edge of edges) {
    if (edge.target !== modelNodeId) continue
    const src = nodes.find((n) => n.id === edge.source)
    if (src?.type === "image") return src
  }
  return null
}

async function pollJob(jobId: string, maxAttempts = 120): Promise<string | null> {
  for (let i = 0; i < maxAttempts; i++) {
    await new Promise((r) => setTimeout(r, 2000))
    // Cookie httpOnly enviado automaticamente pelo browser
    const res = await fetch(`/api/generations/${jobId}`)
    if (!res.ok) continue
    const data = await res.json()
    if (data.status === "completed") return data.output_url ?? null
    if (data.status === "failed") throw new Error("Geração falhou no servidor")
  }
  throw new Error("Timeout: geração muito lenta")
}

async function downloadFile(url: string, filename: string) {
  try {
    const proxyUrl = `/api/download?url=${encodeURIComponent(url)}&filename=${encodeURIComponent(filename)}`
    const res = await fetch(proxyUrl)
    const blob = await res.blob()
    const blobUrl = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = blobUrl
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(blobUrl)
  } catch {
    window.open(url, "_blank")
  }
}

// ─── Componente de resultados ─────────────────────────────────────────────────

function ExecutionModal({
  workflowName,
  progress,
  results,
  onClose,
}: {
  workflowName: string
  progress: ExecutionProgress | null
  results: ExecutionResult[]
  onClose: () => void
}) {
  const isRunning = progress !== null
  const hasError = results.some((r) => r.error)

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 200,
        background: "rgba(0,0,0,.72)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "16px",
      }}
      onClick={(e) => { if (!isRunning && e.target === e.currentTarget) onClose() }}
    >
      <div
        style={{
          background: "#111111", border: "1px solid rgba(255,255,255,.08)",
          borderRadius: "16px", width: "100%", maxWidth: "680px",
          maxHeight: "85vh", display: "flex", flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,.06)",
            flexShrink: 0,
          }}
        >
          <div>
            <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "15px", fontWeight: 700, color: "#F5F5F5" }}>
              {workflowName}
            </span>
            {isRunning && (
              <span style={{ marginLeft: 10, fontSize: "12px", color: "rgba(245,245,245,.4)", fontFamily: "'DM Sans',sans-serif" }}>
                Executando...
              </span>
            )}
          </div>
          {!isRunning && (
            <button
              onClick={onClose}
              style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(245,245,245,.4)", display: "flex" }}
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Progress bar */}
        {isRunning && progress && (
          <div style={{ padding: "14px 20px 0", flexShrink: 0 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
              <span style={{ fontSize: "12px", color: "rgba(245,245,245,.5)", fontFamily: "'DM Sans',sans-serif" }}>
                {progress.step}
              </span>
              <span style={{ fontSize: "12px", color: "#00E5FF", fontFamily: "'Space Grotesk',sans-serif" }}>
                {progress.current}/{progress.total}
              </span>
            </div>
            <div style={{ height: 4, background: "rgba(255,255,255,.06)", borderRadius: 2, overflow: "hidden" }}>
              <div
                style={{
                  height: "100%", borderRadius: 2,
                  background: "linear-gradient(90deg, #FF4D00, #00E5FF)",
                  width: `${(progress.current / progress.total) * 100}%`,
                  transition: "width .4s ease",
                }}
              />
            </div>
          </div>
        )}

        {/* Results */}
        <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px" }}>
          {results.length === 0 && isRunning && (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 0", gap: "10px" }}>
              <Loader2 size={20} style={{ color: "#FF4D00", animation: "spin 1s linear infinite" }} />
              <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "13px", color: "rgba(245,245,245,.4)" }}>
                Aguardando primeira geração...
              </span>
              <style>{`@keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }`}</style>
            </div>
          )}

          {results.length === 0 && !isRunning && (
            <div style={{ padding: "40px 0", textAlign: "center" }}>
              {hasError ? (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
                  <AlertCircle size={28} style={{ color: "#ef4444" }} />
                  <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "13px", color: "rgba(245,245,245,.4)" }}>
                    Nenhum resultado gerado.
                  </span>
                </div>
              ) : null}
            </div>
          )}

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "12px" }}>
            {results.map((result, i) => (
              <div
                key={i}
                style={{
                  background: "#1A1A1A", borderRadius: "10px", overflow: "hidden",
                  border: result.error ? "1px solid rgba(239,68,68,.2)" : "1px solid rgba(255,255,255,.06)",
                }}
              >
                {/* Media */}
                {result.outputUrl && !result.error ? (
                  result.outputType === "video" ? (
                    <video
                      src={result.outputUrl}
                      controls
                      autoPlay
                      loop
                      playsInline
                      muted
                      style={{ width: "100%", display: "block", maxHeight: "160px", objectFit: "cover" }}
                    />
                  ) : (
                    <img
                      src={result.outputUrl}
                      alt={result.modelName}
                      style={{ width: "100%", display: "block", maxHeight: "160px", objectFit: "cover" }}
                    />
                  )
                ) : result.error ? (
                  <div style={{ height: "100px", display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(239,68,68,.05)" }}>
                    <AlertCircle size={22} style={{ color: "rgba(239,68,68,.5)" }} />
                  </div>
                ) : (
                  <div style={{ height: "100px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Loader2 size={20} style={{ color: "rgba(245,245,245,.2)", animation: "spin 1s linear infinite" }} />
                  </div>
                )}

                {/* Info */}
                <div style={{ padding: "10px 12px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                    <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "11px", fontWeight: 700, color: "#F5F5F5" }}>
                      {result.modelName}
                    </span>
                    {result.run > 1 && (
                      <span style={{ fontSize: "9px", color: "#00E5FF", fontFamily: "'Space Grotesk',sans-serif", background: "rgba(0,229,255,.08)", padding: "1px 6px", borderRadius: "4px" }}>
                        #{result.run}
                      </span>
                    )}
                  </div>
                  {result.error ? (
                    <p style={{ fontSize: "10px", color: "rgba(239,68,68,.7)", margin: 0, fontFamily: "'DM Sans',sans-serif" }}>
                      {result.error}
                    </p>
                  ) : result.outputUrl ? (
                    <button
                      onClick={() => downloadFile(result.outputUrl!, `motionforge-wf-${result.modelName.replace(/\s/g, "-").toLowerCase()}-${Date.now()}.${result.outputType === "video" ? "mp4" : "png"}`)}
                      style={{
                        background: "none", border: "none", cursor: "pointer",
                        color: "#FF4D00", fontSize: "10px", fontFamily: "'DM Sans',sans-serif",
                        display: "flex", alignItems: "center", gap: "4px", padding: 0,
                      }}
                    >
                      <Download size={10} />
                      Download
                    </button>
                  ) : (
                    <span style={{ fontSize: "10px", color: "rgba(245,245,245,.3)", fontFamily: "'DM Sans',sans-serif" }}>
                      Gerando...
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        {!isRunning && (
          <div
            style={{
              padding: "12px 20px", borderTop: "1px solid rgba(255,255,255,.05)",
              display: "flex", justifyContent: "space-between", alignItems: "center",
              flexShrink: 0,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <CheckCircle size={14} style={{ color: "#4ADE80" }} />
              <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "12px", color: "rgba(245,245,245,.4)" }}>
                {results.filter((r) => r.outputUrl && !r.error).length} de {results.length} geração(ões) concluída(s)
              </span>
            </div>
            <button
              onClick={onClose}
              style={{
                background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.08)",
                borderRadius: "8px", padding: "7px 16px",
                fontSize: "13px", fontFamily: "'DM Sans',sans-serif", fontWeight: 600,
                color: "rgba(245,245,245,.7)", cursor: "pointer",
              }}
            >
              Fechar
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Empty State ──────────────────────────────────────────────────────────────

function EmptyState({ onNew }: { onNew: () => void }) {
  return (
    <div
      style={{
        display: "flex", flexDirection: "column", alignItems: "center",
        justifyContent: "center", padding: "80px 24px",
        textAlign: "center", gap: "16px",
      }}
    >
      <div
        style={{
          width: 56, height: 56, borderRadius: "12px",
          background: "rgba(255,77,0,.08)", border: "1px solid rgba(255,77,0,.15)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}
      >
        <GitBranch size={24} style={{ color: "rgba(255,77,0,.6)" }} />
      </div>
      <div>
        <h2
          style={{
            fontFamily: "'DM Sans',sans-serif",
            fontSize: "16px", fontWeight: 700, color: "#F5F5F5", marginBottom: "8px",
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
          fontSize: "13px", fontWeight: 700, fontFamily: "'DM Sans',sans-serif",
          cursor: "pointer", letterSpacing: ".5px", transition: "opacity .2s",
        }}
        onMouseEnter={(e) => { ;(e.currentTarget as HTMLButtonElement).style.opacity = "0.88" }}
        onMouseLeave={(e) => { ;(e.currentTarget as HTMLButtonElement).style.opacity = "1" }}
      >
        <Plus size={14} />
        Criar primeiro workflow
      </button>
    </div>
  )
}

// ─── Página ───────────────────────────────────────────────────────────────────

export default function WorkflowsPage() {
  const { toast } = useToast()

  const [workflows, setWorkflows] = useState<Workflow[]>([])
  const [editorOpen, setEditorOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [workflowName, setWorkflowName] = useState("Novo Workflow")
  const [editorNodes, setEditorNodes] = useState<Node[]>([])
  const [editorEdges, setEditorEdges] = useState<Edge[]>([])

  // Execução
  const [executingId, setExecutingId] = useState<string | null>(null)
  const [executionProgress, setExecutionProgress] = useState<ExecutionProgress | null>(null)
  const [executionResults, setExecutionResults] = useState<ExecutionResult[]>([])
  const [executionWorkflowName, setExecutionWorkflowName] = useState("")
  const [showResultsModal, setShowResultsModal] = useState(false)

  // ── Persistência em localStorage ───────────────────────────────────────────

  useEffect(() => {
    try {
      const saved = localStorage.getItem("mf_workflows")
      if (saved) setWorkflows(JSON.parse(saved))
    } catch {}
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem("mf_workflows", JSON.stringify(workflows))
    } catch {}
  }, [workflows])

  // ── Abrir editor ───────────────────────────────────────────────────────────

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

  // ── Salvar workflow ────────────────────────────────────────────────────────

  function buildWorkflowObject(nodes: Node[], edges: Edge[]): Workflow {
    const name = workflowName.trim() || "Workflow sem nome"
    const modelNodes = nodes.filter((n) => n.type === "model")
    const outputQty = (nodes.find((n) => n.type === "result")?.data as { quantity?: number })?.quantity ?? 1
    const baseCost = nodes
      .filter((n) => n.type === "model" || n.type === "voice")
      .reduce((acc, n) => acc + ((n.data as { cost?: number }).cost ?? 0), 0)
    const totalCost = baseCost * outputQty
    const existingWf = editingId ? workflows.find((w) => w.id === editingId) : null
    return {
      id: editingId ?? Date.now().toString(),
      name,
      nodes,
      edges,
      createdAt: existingWf?.createdAt ?? new Date().toLocaleDateString("pt-BR"),
      totalCost,
      modelCount: modelNodes.length,
    }
  }

  function handleSave(nodes: Node[], edges: Edge[]) {
    const wf = buildWorkflowObject(nodes, edges)
    if (editingId) {
      setWorkflows((prev) => prev.map((w) => (w.id === editingId ? wf : w)))
    } else {
      setWorkflows((prev) => [...prev, wf])
    }
    setEditorOpen(false)
  }

  function handleSaveAndExecute(nodes: Node[], edges: Edge[]) {
    const wf = buildWorkflowObject(nodes, edges)
    if (editingId) {
      setWorkflows((prev) => prev.map((w) => (w.id === editingId ? wf : w)))
    } else {
      setWorkflows((prev) => [...prev, wf])
    }
    // Mantém o editor aberto — o modal de execução (zIndex 200) aparece por cima
    runWorkflow(wf)
  }

  function deleteWorkflow(id: string) {
    setWorkflows((prev) => prev.filter((w) => w.id !== id))
  }

  // ── Execução do workflow ───────────────────────────────────────────────────

  function executeWorkflow(workflowId: string) {
    const wf = workflows.find((w) => w.id === workflowId)
    if (wf) runWorkflow(wf)
  }

  async function runWorkflow(wf: Workflow) {
    // Validações
    const triggerNode = wf.nodes.find((n) => n.type === "trigger")
    const prompt = ((triggerNode?.data as TriggerData)?.prompt ?? "").trim()
    if (!prompt) {
      toast({ message: "O nó de início precisa de um prompt.", type: "error" })
      return
    }

    const modelNodes = getModelNodesInOrder(wf.nodes, wf.edges)
    if (modelNodes.length === 0) {
      toast({ message: "Adicione ao menos um nó de Modelo IA ao workflow.", type: "error" })
      return
    }

    const quantity = ((wf.nodes.find((n) => n.type === "result")?.data as OutputData)?.quantity ?? 1)
    // Abrir modal e iniciar
    setExecutingId(wf.id)
    setExecutionWorkflowName(wf.name)
    setExecutionResults([])
    setExecutionProgress({ current: 0, total: modelNodes.length * quantity, step: "Iniciando..." })
    setShowResultsModal(true)

    const allResults: ExecutionResult[] = []
    let stepIndex = 0

    try {
      for (let run = 1; run <= quantity; run++) {
        let previousOutputUrl: string | null = null

        for (let mi = 0; mi < modelNodes.length; mi++) {
          const modelNode = modelNodes[mi]
          const modelData = modelNode.data as ModelData
          const modelId = MODEL_ID_MAP[modelData.model]

          if (!modelId) {
            allResults.push({
              stepIndex,
              modelName: modelData.model,
              outputType: modelData.outputType ?? "image",
              outputUrl: null,
              run,
              error: `Modelo "${modelData.model}" não suportado.`,
            })
            setExecutionResults([...allResults])
            stepIndex++
            continue
          }

          // Atualiza progresso
          setExecutionProgress({
            current: stepIndex + 1,
            total: modelNodes.length * quantity,
            step: `${modelData.model}${quantity > 1 ? ` (run ${run}/${quantity})` : ""}`,
          })

          // Referência de imagem
          const imageNode = getConnectedImageNode(modelNode.id, wf.nodes, wf.edges)
          let referenceImageUrl: string | null = null
          if (imageNode) {
            referenceImageUrl = (imageNode.data as ImageData).imageUrl ?? null
          } else if (previousOutputUrl && I2V_MODEL_IDS.has(modelId)) {
            referenceImageUrl = previousOutputUrl
          }

          // Placeholder no modal enquanto gera
          const resultEntry: ExecutionResult = {
            stepIndex,
            modelName: modelData.model,
            outputType: modelData.outputType ?? "image",
            outputUrl: null,
            run,
          }
          allResults.push(resultEntry)
          setExecutionResults([...allResults])

          try {
            // Cookie httpOnly enviado automaticamente pelo browser
            const res: Response = await fetch("/api/generate", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                modelId,
                type: modelData.outputType ?? "image",
                prompt,
                aspectRatio: modelData.aspectRatio ?? "9:16",
                referenceImageUrl: referenceImageUrl ?? undefined,
              }),
            })

            const data = await res.json()

            if (!res.ok) {
              throw new Error(data.error ?? "Erro ao gerar")
            }

            let outputUrl: string | null = null

            if (res.status === 200 && data.outputUrl) {
              // Síncrono (OpenAI)
              outputUrl = data.outputUrl
            } else if (res.status === 202 && data.jobId) {
              // Assíncrono (fal.ai) — faz polling
              outputUrl = await pollJob(data.jobId)
            }

            previousOutputUrl = outputUrl
            resultEntry.outputUrl = outputUrl
          } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : "Erro desconhecido"
            resultEntry.error = msg
            previousOutputUrl = null
          }

          setExecutionResults([...allResults])
          stepIndex++
        }
      }

      const successCount = allResults.filter((r) => r.outputUrl && !r.error).length
      toast({
        message: `Workflow concluído! ${successCount}/${allResults.length} geração(ões) ok.`,
        type: successCount > 0 ? "success" : "error",
      })
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erro ao executar workflow"
      toast({ message: msg, type: "error" })
    } finally {
      setExecutionProgress(null)
      setExecutingId(null)
    }
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <>
      {/* Editor overlay */}
      {editorOpen && (
        <WorkflowEditor
          name={workflowName}
          onNameChange={setWorkflowName}
          onSave={handleSave}
          onExecute={handleSaveAndExecute}
          onBack={() => setEditorOpen(false)}
          initialNodes={editorNodes.length > 0 ? editorNodes : undefined}
          initialEdges={editorEdges}
        />
      )}

      {/* Modal de resultados */}
      {showResultsModal && (
        <ExecutionModal
          workflowName={executionWorkflowName}
          progress={executionProgress}
          results={executionResults}
          onClose={() => {
            if (executionProgress !== null) return // bloqueia fechar enquanto roda
            setShowResultsModal(false)
          }}
        />
      )}

      {/* Lista de workflows */}
      <div style={{ padding: "24px", maxWidth: "1400px", margin: "0 auto" }}>
        {/* Header */}
        <div
          style={{
            display: "flex", justifyContent: "space-between",
            alignItems: "center", marginBottom: "24px",
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
                background: "#FF4D00", border: "none", cursor: "pointer", color: "white",
                display: "flex", alignItems: "center", gap: "6px",
                fontSize: "13px", fontFamily: "'DM Sans',sans-serif", fontWeight: 700,
                padding: "8px 16px", borderRadius: "8px", transition: "opacity .2s",
              }}
              onMouseEnter={(e) => { ;(e.currentTarget as HTMLButtonElement).style.opacity = "0.88" }}
              onMouseLeave={(e) => { ;(e.currentTarget as HTMLButtonElement).style.opacity = "1" }}
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
            {workflows.map((wf) => {
              const isExecuting = executingId === wf.id
              return (
                <div
                  key={wf.id}
                  style={{
                    background: "#111111",
                    border: isExecuting
                      ? "1px solid rgba(255,77,0,.35)"
                      : "1px solid rgba(255,255,255,.06)",
                    borderRadius: "12px", padding: "16px",
                    transition: "border-color .2s",
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
                    {isExecuting && (
                      <span
                        style={{
                          fontSize: "11px", color: "#FF4D00",
                          background: "rgba(255,77,0,.08)",
                          border: "1px solid rgba(255,77,0,.2)",
                          padding: "2px 8px", borderRadius: "4px",
                          fontFamily: "'DM Sans',sans-serif",
                        }}
                      >
                        ⚡ Executando
                      </span>
                    )}
                  </div>

                  <p style={{ fontSize: "11px", color: "rgba(245,245,245,.28)", margin: "0 0 12px" }}>
                    Criado em {wf.createdAt}
                  </p>

                  {/* Ações */}
                  <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                    <button
                      onClick={() => executeWorkflow(wf.id)}
                      disabled={!!executingId}
                      style={{
                        background: executingId ? "rgba(255,77,0,.05)" : "rgba(255,77,0,.1)",
                        border: "1px solid rgba(255,77,0,.3)",
                        borderRadius: "6px", padding: "5px 10px",
                        fontSize: "12px", color: executingId ? "rgba(255,77,0,.4)" : "#FF4D00",
                        cursor: executingId ? "not-allowed" : "pointer",
                        display: "flex", alignItems: "center", gap: "4px",
                        fontFamily: "'DM Sans',sans-serif", fontWeight: 700,
                      }}
                    >
                      {isExecuting
                        ? <><Loader2 size={11} style={{ animation: "spin 1s linear infinite" }} />Executando</>
                        : <><Play size={12} />Executar</>
                      }
                    </button>

                    <button
                      onClick={() => openEdit(wf.id)}
                      disabled={!!executingId}
                      style={{
                        background: "rgba(255,255,255,.04)",
                        border: "1px solid rgba(255,255,255,.06)",
                        borderRadius: "6px", padding: "5px 10px",
                        fontSize: "12px", color: "rgba(245,245,245,.4)",
                        cursor: executingId ? "not-allowed" : "pointer",
                        display: "flex", alignItems: "center", gap: "4px",
                        fontFamily: "'DM Sans',sans-serif",
                      }}
                    >
                      <Pencil size={12} />
                      Editar
                    </button>

                    <button
                      onClick={() => deleteWorkflow(wf.id)}
                      disabled={!!executingId}
                      style={{
                        background: "rgba(255,255,255,.04)",
                        border: "1px solid rgba(255,255,255,.06)",
                        borderRadius: "6px", padding: "5px 10px",
                        fontSize: "12px", color: "rgba(245,245,245,.4)",
                        cursor: executingId ? "not-allowed" : "pointer",
                        display: "flex", alignItems: "center", gap: "4px",
                        fontFamily: "'DM Sans',sans-serif", transition: "color .15s",
                      }}
                      onMouseEnter={(e) => {
                        if (!executingId) { (e.currentTarget as HTMLButtonElement).style.color = "#ef4444" }
                      }}
                      onMouseLeave={(e) => {
                        ;(e.currentTarget as HTMLButtonElement).style.color = "rgba(245,245,245,.4)"
                      }}
                    >
                      <Trash2 size={12} />
                      Deletar
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </>
  )
}
