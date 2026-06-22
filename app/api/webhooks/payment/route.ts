import { NextRequest, NextResponse } from "next/server"

const API = process.env.API_INTERNAL_URL ?? "http://2.25.196.231"

// Recebe o webhook da AbacatePay via HTTPS e repassa ao VPS
// O body é lido como texto puro para preservar os bytes exatos usados na verificação HMAC
export async function POST(req: NextRequest) {
  const rawBody = await req.text()
  const sig     = req.headers.get("x-webhook-signature") ?? ""

  const res = await fetch(`${API}/events/payment`, {
    method: "POST",
    headers: {
      "Content-Type":        "application/json",
      "X-Webhook-Signature": sig,
    },
    body: rawBody,
  }).catch(() => null)

  if (!res) return NextResponse.json({ error: "VPS indisponível" }, { status: 503 })

  const data = await res.json().catch(() => ({}))
  return NextResponse.json(data, { status: res.status })
}
