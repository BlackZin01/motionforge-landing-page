import { NextRequest, NextResponse } from "next/server"
import OpenAI from "openai"

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

// ─── POST /api/generate-copy ──────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const { produto, nicho, diferencial, tom } = await req.json()

    if (!produto || !nicho) {
      return NextResponse.json({ error: "produto e nicho são obrigatórios" }, { status: 400 })
    }

    const systemPrompt = `Você é um especialista em copywriting para TikTok Shop e redes sociais.
Gere copy de alta conversão em português brasileiro.
Responda SEMPRE em JSON válido com a seguinte estrutura:
{
  "hooks": ["hook 1", "hook 2", "hook 3", "hook 4", "hook 5"],
  "ctas": ["CTA 1", "CTA 2", "CTA 3"],
  "script": "script completo de 30 segundos aqui"
}
Os hooks devem ser frases de abertura de vídeo impactantes (máx 10 palavras cada).
Os CTAs devem ser chamadas para ação diretas e urgentes.
O script deve ter entre 80-120 palavras, fluido e natural para falar em vídeo.`

    const userPrompt = `Produto: ${produto}
Nicho: ${nicho}
${diferencial ? `Diferencial: ${diferencial}` : ""}
Tom: ${tom || "urgência e desejo"}

Gere os hooks, CTAs e script de vídeo.`

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.85,
      max_tokens: 800,
      response_format: { type: "json_object" },
    })

    const content = completion.choices[0]?.message?.content ?? "{}"
    const result = JSON.parse(content)

    return NextResponse.json(result)
  } catch (err) {
    console.error("[generate-copy]", err)
    return NextResponse.json({ error: "Erro ao gerar copy. Tente novamente." }, { status: 500 })
  }
}
