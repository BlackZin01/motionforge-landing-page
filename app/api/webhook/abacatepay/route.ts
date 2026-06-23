import { NextRequest, NextResponse } from "next/server"

const API = process.env.API_INTERNAL_URL ?? "http://2.25.196.231"

export async function POST(req: NextRequest) {
  const rawBody = await req.text()
  const secret  = req.headers.get("x-webhook-secret") ?? ""

  // Valida o secret na camada Vercel antes de encaminhar ao VPS
  const expectedSecret = process.env.ABACATEPAY_WEBHOOK_SECRET ?? ""
  if (!expectedSecret || secret !== expectedSecret) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
  }

  const res = await fetch(`${API}/events/pix`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-webhook-secret": secret,
    },
    body: rawBody,
  }).catch(() => null)

  if (!res) return NextResponse.json({ error: "VPS indisponível" }, { status: 503 })
  const data = await res.json().catch(() => ({}))
  return NextResponse.json(data, { status: res.status })
}
