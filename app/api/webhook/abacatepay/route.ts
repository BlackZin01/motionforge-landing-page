import { NextRequest, NextResponse } from "next/server"

const API = process.env.API_INTERNAL_URL ?? "http://2.25.196.231"

export async function POST(req: NextRequest) {
  const rawBody = await req.text()
  const secret  = req.headers.get("x-webhook-secret") ?? ""

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
