import { NextRequest, NextResponse } from "next/server"
import OpenAI from "openai"

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
const API = process.env.API_INTERNAL_URL ?? "http://2.25.196.231/api"
const STARTER_LIMIT = 30

// ─── POST /api/generate-copy ──────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const auth = req.headers.get("authorization") ?? ""

    if (!auth) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    // Valida token e obtém plano + contador de gerações
    const meRes = await fetch(`${API}/auth/me`, {
      headers: { Authorization: auth },
    }).catch(() => null)

    if (!meRes || !meRes.ok) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const userData = await meRes.json()
    const rawPlan = userData.plan
    const plan = typeof rawPlan === "string" ? rawPlan.toLowerCase() : "starter"
    const isAdmin = Boolean(userData.is_admin ?? userData.isAdmin ?? false)
    const geracoesUsadas = Number(userData.geracoes_usadas ?? 0)

    // Bloqueia Starter ao atingir o limite (admin nunca é bloqueado)
    if (plan === "starter" && !isAdmin && geracoesUsadas >= STARTER_LIMIT) {
      return NextResponse.json({
        error: "Você atingiu o limite de 30 gerações mensais do plano Starter.",
        limitReached: true,
        geracoes_usadas: geracoesUsadas,
        limite: STARTER_LIMIT,
      }, { status: 429 })
    }

    const { produto, nicho, diferencial, tom, imageBase64, imageMimeType } = await req.json()

    if (!produto || !nicho) {
      return NextResponse.json({ error: "produto e nicho são obrigatórios" }, { status: 400 })
    }

    const systemPrompt = `Você é um especialista em copywriting para TikTok Shop e redes sociais.
Gere copy de alta conversão em português brasileiro.
${imageBase64 ? "O usuário enviou uma foto do produto — use as características visuais (embalagem, cor, apresentação, público-alvo aparente) para enriquecer a copy." : ""}
Responda SEMPRE em JSON válido com a seguinte estrutura:
{
  "hooks": ["hook 1", "hook 2", "hook 3", "hook 4", "hook 5"],
  "ctas": ["CTA 1", "CTA 2", "CTA 3"],
  "script": "script completo de 30 segundos aqui"
}
Os hooks devem ser frases de abertura de vídeo impactantes (máx 10 palavras cada).
Os CTAs devem ser chamadas para ação diretas e urgentes.
O script deve ter entre 80-120 palavras, fluido e natural para falar em vídeo.`

    const userText = `Produto: ${produto}
Nicho: ${nicho}
${diferencial ? `Diferencial: ${diferencial}` : ""}
Tom: ${tom || "urgência e desejo"}

Gere os hooks, CTAs e script de vídeo.`

    type ContentBlock =
      | { type: "text"; text: string }
      | { type: "image_url"; image_url: { url: string; detail: "low" | "high" | "auto" } }

    const userContent: ContentBlock[] = [{ type: "text", text: userText }]

    if (imageBase64 && imageMimeType) {
      userContent.push({
        type: "image_url",
        image_url: {
          url: `data:${imageMimeType};base64,${imageBase64}`,
          detail: "low",
        },
      })
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userContent },
      ],
      temperature: 0.85,
      max_tokens: 800,
      response_format: { type: "json_object" },
    })

    const content = completion.choices[0]?.message?.content ?? "{}"
    const result = JSON.parse(content)

    // Incrementa contador no backend (fire & forget — silencia erro se endpoint não existir)
    fetch(`${API}/geracoes/copy`, {
      method: "POST",
      headers: { Authorization: auth, "Content-Type": "application/json" },
    }).catch(() => {})

    return NextResponse.json({
      ...result,
      geracoes_usadas: geracoesUsadas + 1,
      limite: plan === "starter" ? STARTER_LIMIT : null,
    })
  } catch (err) {
    console.error("[generate-copy]", err)
    return NextResponse.json({ error: "Erro ao gerar copy. Tente novamente." }, { status: 500 })
  }
}
