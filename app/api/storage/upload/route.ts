import { NextRequest, NextResponse } from "next/server"

const API = process.env.API_INTERNAL_URL ?? "http://2.25.196.231/api"

export const maxDuration = 30

export async function POST(req: NextRequest) {
  try {
    const auth = req.headers.get("authorization") ?? ""
    const formData = await req.formData()
    const file = formData.get("file") as File | null

    if (!file) {
      return NextResponse.json({ error: "Nenhum arquivo enviado" }, { status: 400 })
    }

    // 1. Pede URL pré-assinada ao backend
    const presignRes = await fetch(`${API}/storage/presign`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: auth },
      body: JSON.stringify({ filename: file.name, contentType: file.type || "image/png" }),
    })

    if (!presignRes.ok) {
      const err = await presignRes.json().catch(() => ({}))
      return NextResponse.json({ error: err.error ?? "Erro ao obter URL de upload" }, { status: presignRes.status })
    }

    const { presignedUrl, publicUrl } = await presignRes.json()

    // 2. Faz upload para o R2 server-side (sem CORS)
    const uploadRes = await fetch(presignedUrl, {
      method: "PUT",
      headers: { "Content-Type": file.type || "image/png" },
      body: await file.arrayBuffer(),
    })

    if (!uploadRes.ok) {
      return NextResponse.json({ error: "Erro ao enviar para o CDN" }, { status: 502 })
    }

    return NextResponse.json({ url: publicUrl })
  } catch (err) {
    console.error("[upload]", err)
    return NextResponse.json({ error: "Erro interno no upload" }, { status: 500 })
  }
}
