"use client"

import { useState, useEffect, useRef } from "react"
import { GenerationPanel } from "@/components/dashboard/studio/generation-panel"
import { OutputArea } from "@/components/dashboard/studio/output-area"
import { useToast } from "@/components/dashboard/shared/toast"
import { useAuth } from "@/lib/auth-context"

interface GenerationConfig {
  type: string
  model: string
  prompt: string
  aspectRatio: string
  referenceImageUrl?: string | null
}

export default function StudioPage() {
  const { toast } = useToast()
  const { user, refreshUser } = useAuth()

  const [generationState, setGenerationState] = useState<"idle" | "generating" | "done" | "error">("idle")
  const [currentModel, setCurrentModel] = useState("")
  const [currentType, setCurrentType] = useState<"image" | "video">("video")
  const [outputUrl, setOutputUrl] = useState<string | null>(null)
  const [currentPrompt, setCurrentPrompt] = useState("")
  const [currentCredits, setCurrentCredits] = useState(0)
  const [lastConfig, setLastConfig] = useState<GenerationConfig | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const credits = 0
  const isAdmin = user?.isAdmin ?? false

  // ── Responsividade ─────────────────────────────────────────────────────────
  const [isMobile, setIsMobile] = useState(false)
  const [mobileTab, setMobileTab] = useState<"config" | "output">("config")

  useEffect(() => {
    function check() { setIsMobile(window.innerWidth < 768) }
    check()
    window.addEventListener("resize", check)
    return () => window.removeEventListener("resize", check)
  }, [])

  // Para o polling ao desmontar e restaura título
  useEffect(() => {
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current)
      document.title = "Studio | MotionForge"
    }
  }, [])

  // Pede permissão de notificação do browser
  function requestNotificationPermission() {
    if (typeof Notification !== "undefined" && Notification.permission === "default") {
      Notification.requestPermission()
    }
  }

  function fireNotification(title: string, body: string) {
    if (typeof Notification !== "undefined" && Notification.permission === "granted") {
      new Notification(title, {
        body,
        icon: "/favicon.ico",
      })
    }
  }

  // ── Polling de status do job ────────────────────────────────────────────────
  function startPolling(jobId: string) {
    if (pollingRef.current) clearInterval(pollingRef.current)

    pollingRef.current = setInterval(async () => {
      try {
        const token = localStorage.getItem("mf_token") ?? ""
        const res = await fetch(`/api/generations/${jobId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!res.ok) return
        const data = await res.json()

        if (data.status === "completed") {
          if (pollingRef.current) clearInterval(pollingRef.current)
          setOutputUrl(data.output_url ?? null)
          setGenerationState("done")
          document.title = "✅ Pronto! | MotionForge"
          setTimeout(() => { document.title = "Studio | MotionForge" }, 5000)
          await refreshUser()
          toast({ message: "Geração concluída! ✓", type: "success" })
          fireNotification("MotionForge — Pronto! 🎬", "Sua geração foi concluída. Clique para ver o resultado.")
        } else if (data.status === "failed") {
          if (pollingRef.current) clearInterval(pollingRef.current)
          setGenerationState("error")
          document.title = "Studio | MotionForge"
          await refreshUser()
          toast({ message: "A geração falhou. Créditos estornados.", type: "error" })
          fireNotification("MotionForge — Falhou", "A geração falhou. Seus créditos foram estornados.")
        }
      } catch {}
    }, 2000)
  }

  // ── Geração ────────────────────────────────────────────────────────────────
  async function handleGenerate(config: GenerationConfig) {
    setLastConfig(config)
    setCurrentModel(config.model)
    setCurrentType(config.type as "image" | "video")
    setCurrentPrompt(config.prompt)
    setOutputUrl(null)
    setErrorMessage(null)
    setGenerationState("generating")
    document.title = "⚡ Gerando... | MotionForge"
    requestNotificationPermission()
    if (isMobile) setMobileTab("output")

    try {
      const token = localStorage.getItem("mf_token") ?? ""
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          modelId: config.model,
          type: config.type,
          prompt: config.prompt,
          aspectRatio: config.aspectRatio,
          referenceImageUrl: config.referenceImageUrl ?? undefined,
        }),
      })

      const data = await res.json()

      if (res.status === 402) {
        setGenerationState("idle")
        toast({ message: "Créditos insuficientes. Faça upgrade para continuar.", type: "error" })
        return
      }

      if (!res.ok) {
        const msg = data.error ?? "Erro ao gerar. Tente novamente."
        setErrorMessage(msg)
        setGenerationState("error")
        toast({ message: msg, type: "error" })
        return
      }

      // Sync (imagem OpenAI) — retorna 200 com outputUrl direto
      if (res.status === 200 && data.outputUrl) {
        setOutputUrl(data.outputUrl)
        setCurrentCredits(data.creditsUsed ?? 0)
        setGenerationState("done")
        document.title = "✅ Pronto! | MotionForge"
        setTimeout(() => { document.title = "Studio | MotionForge" }, 5000)
        await refreshUser()
        toast({ message: "Imagem gerada! ✓", type: "success" })
        fireNotification("MotionForge — Pronto! 🖼️", "Sua imagem foi gerada. Clique para ver.")
        return
      }

      // Async (fal.ai) — retorna 202 com jobId, inicia polling
      if (res.status === 202 && data.jobId) {
        setCurrentCredits(data.creditsUsed ?? 0)
        startPolling(data.jobId)
        return
      }

      setGenerationState("error")
      toast({ message: "Resposta inesperada do servidor.", type: "error" })
    } catch {
      setGenerationState("error")
      toast({ message: "Erro de conexão. Verifique sua internet.", type: "error" })
    }
  }

  function handleRegenerate() {
    if (!lastConfig) return
    setGenerationState("idle")
    if (isMobile) setMobileTab("config")
    setTimeout(() => handleGenerate(lastConfig!), 200)
  }

  // ── Mobile layout ──────────────────────────────────────────────────────────
  if (isMobile) {
    return (
      <div style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>
        <div
          style={{
            display: "flex",
            background: "#0A0A0A",
            borderBottom: "1px solid rgba(255,255,255,.06)",
            flexShrink: 0,
          }}
        >
          {(["config", "output"] as const).map((tab) => {
            const isActive = mobileTab === tab
            return (
              <button
                key={tab}
                onClick={() => setMobileTab(tab)}
                style={{
                  flex: 1, padding: "13px 8px",
                  fontSize: "13px", fontWeight: 700,
                  fontFamily: "'DM Sans',sans-serif",
                  background: "none", border: "none", cursor: "pointer",
                  color: isActive ? "#FF4D00" : "rgba(245,245,245,.4)",
                  borderBottom: isActive ? "2px solid #FF4D00" : "2px solid transparent",
                  transition: "color .15s, border-color .15s",
                }}
              >
                {tab === "config" ? "Configurar" : (
                  <>
                    Resultado
                    {generationState === "generating" && (
                      <span style={{ marginLeft: 6, color: "#FF4D00" }}>⚡</span>
                    )}
                    {generationState === "done" && (
                      <span
                        style={{
                          marginLeft: 6, display: "inline-block",
                          width: 7, height: 7, borderRadius: "50%",
                          background: "#4ADE80", verticalAlign: "middle",
                        }}
                      />
                    )}
                  </>
                )}
              </button>
            )
          })}
        </div>

        <div
          style={{
            flex: 1,
            overflowY: "auto",
            background: mobileTab === "config" ? "#0A0A0A" : "#0D0D0D",
          }}
        >
          {mobileTab === "config" ? (
            <GenerationPanel
              onGenerate={handleGenerate}
              credits={credits}
              generating={generationState === "generating"}
              isAdmin={isAdmin}
            />
          ) : (
            <OutputArea
              state={generationState}
              model={currentModel}
              type={currentType}
              prompt={currentPrompt}
              outputUrl={outputUrl}
              creditsUsed={currentCredits}
              errorMessage={errorMessage}
              onRegenerate={handleRegenerate}
            />
          )}
        </div>
      </div>
    )
  }

  // ── Desktop layout ─────────────────────────────────────────────────────────
  return (
    <div style={{ display: "flex", height: "100%", overflow: "hidden" }}>
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

      <div style={{ flex: 1, overflowY: "auto", background: "#0D0D0D" }}>
        <OutputArea
          state={generationState}
          model={currentModel}
          type={currentType}
          prompt={currentPrompt}
          outputUrl={outputUrl}
          creditsUsed={currentCredits}
          errorMessage={errorMessage}
          onRegenerate={handleRegenerate}
        />
      </div>
    </div>
  )
}
