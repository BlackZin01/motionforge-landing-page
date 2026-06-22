import { NextRequest, NextResponse } from "next/server"

const API = process.env.API_INTERNAL_URL ?? "http://2.25.196.231"

export async function GET(req: NextRequest) {
  const auth = req.headers.get("authorization") ?? ""
  const expected = `Bearer ${process.env.CRON_SECRET ?? ""}`

  if (!process.env.CRON_SECRET || auth !== expected) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
  }

  const res = await fetch(`${API}/cron/check-expirations`, {
    headers: { Authorization: auth },
  }).catch(() => null)

  if (!res) return NextResponse.json({ error: "VPS indisponível" }, { status: 503 })
  const data = await res.json()
  return NextResponse.json(data, { status: res.status })
}
