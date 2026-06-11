"use client"

import { useState } from "react"
import { GenerationPanel } from "@/components/dashboard/studio/generation-panel"
import { OutputArea } from "@/components/dashboard/studio/output-area"
import { useToast } from "@/components/dashboard/shared/toast"

// ─── Tipos ───────────────────────────────────────────────────────────────────

interface GenerationConfig {
  type: string
  model: string
  prompt: string
}

// ─── Componente ──────────────────────────────────────────────────────────────

export default function StudioPage() {
  const { toast } = useToast()

  const [generationState, setGenerationState] = useState<"idle" | "generating" | "done">("idle")
  const [currentModel, setCurrentModel] = useState("seedance-20")
  const [currentType, setCurrentType] = useState("video")
  const [credits] = useState(3847)

  // ── Iniciar geração ────────────────────────────────────────────────────────

  function handleGenerate({ type, model }: GenerationConfig) {
    setCurrentModel(model)
    setCurrentType(type)
    setGenerationState("generating")

    // TODO: chamar fal.ai / OpenRouter API com prompt e modelo selecionados
    setTimeout(() => {
      setGenerationState("done")
      toast({ message: "Geração concluída!", type: "success" })
    }, 5000)
  }

  // ── Regenerar ──────────────────────────────────────────────────────────────

  function handleRegenerate() {
    setGenerationState("idle")

    // TODO: chamar fal.ai / OpenRouter API novamente com os mesmos parâmetros
    setTimeout(() => {
      setGenerationState("generating")
    }, 200)

    setTimeout(() => {
      setGenerationState("done")
      toast({ message: "Regeneração concluída!", type: "success" })
    }, 5200)
  }

  return (
    <div style={{ display: "flex", height: "100%", overflow: "hidden" }}>
      {/* Painel esquerdo — configuração */}
      <div
        style={{
          width: "360px",
          flexShrink: 0,
          borderRight: "1px solid rgba(255,255,255,0.05)",
          overflowY: "auto",
          background: "#0A0A0A",
        }}
      >
        <GenerationPanel
          onGenerate={handleGenerate}
          credits={credits}
          generating={generationState === "generating"}
        />
      </div>

      {/* Área direita — output */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          background: "#0D0D0D",
        }}
      >
        <OutputArea
          state={generationState}
          model={currentModel}
          type={currentType as "image" | "video"}
          onRegenerate={handleRegenerate}
        />
      </div>
    </div>
  )
}
