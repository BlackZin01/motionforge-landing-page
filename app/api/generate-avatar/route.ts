import { NextRequest, NextResponse } from "next/server"
import OpenAI from "openai"
import { getBearerToken } from "@/lib/server-auth"

// ─── POST /api/generate-avatar ────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  try {
    const auth = getBearerToken(req)
    if (!auth) return NextResponse.json({ error: "Não autorizado" }, { status: 401 })

    const API = process.env.API_INTERNAL_URL ?? "http://2.25.196.231/api"
    const meRes = await fetch(`${API}/auth/me`, { headers: { Authorization: auth } }).catch(() => null)
    if (!meRes || !meRes.ok) return NextResponse.json({ error: "Não autorizado" }, { status: 401 })

    const { identidade, aparencia, estilo, ambiente } = await req.json()

    const system = `You are an expert at writing ultra-realistic, photographic AI image generation prompts.
Given avatar characteristics, generate a single, detailed English prompt optimized for Google Imagen, Midjourney, or DALL-E 3.
The prompt must be highly specific, photorealistic, and suitable for TikTok Shop content creators.
Respond ONLY with a JSON object: { "prompt": "...", "negative": "..." }
The "prompt" field is the main generation prompt.
The "negative" field lists what to avoid (for tools that support negative prompts).`

    const { genero, idade, tomPele, rosto, nome } = identidade
    const { corOlhos, cilios, sobrancelhas, expressao, corCabelo, tipoCabelo, comprimentoCabelo, corpo, beleza, detalhes } = aparencia
    const { oculos, manchas, sardas, maquiagem, roupa } = estilo
    const { ambiente: amb, periodo, tipoConteudo, estilofoto, posicao } = ambiente

    const userMsg = `Avatar name: ${nome || "Sem nome"}
Gender: ${genero}
Age: ${idade}
Skin tone: ${tomPele}
Face shape: ${rosto}
Eyes: ${corOlhos} eyes, ${cilios} lashes, ${sobrancelhas} eyebrows
Expression: ${expressao}
Hair: ${corCabelo}, ${tipoCabelo}, ${comprimentoCabelo}
Body: ${corpo} physique, beauty level: ${beleza}${detalhes?.length ? `, extras: ${detalhes.join(", ")}` : ""}
Clothing style: ${roupa || "casual"}
Glasses: ${oculos}${manchas !== "Nenhum" ? `, skin marks: ${manchas}` : ""}${sardas !== "Nenhum" ? `, freckles: ${sardas}` : ""}
Makeup: ${maquiagem ? "yes" : "no"}
Setting: ${amb}, ${periodo}, ${tipoConteudo} content
Photo style: ${estilofoto}, ${posicao}

Generate the ultra-realistic prompt optimized for TikTok Shop content.`

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: system },
        { role: "user", content: userMsg },
      ],
      temperature: 0.7,
      max_tokens: 600,
      response_format: { type: "json_object" },
    })

    const result = JSON.parse(completion.choices[0]?.message?.content ?? "{}")
    return NextResponse.json(result)
  } catch (err) {
    console.error("[generate-avatar]", err)
    return NextResponse.json({ error: "Erro ao gerar prompt. Tente novamente." }, { status: 500 })
  }
}
