import { NextRequest, NextResponse } from "next/server"
import { getBearerToken } from "@/lib/server-auth"

const API = process.env.API_INTERNAL_URL ?? "http://2.25.196.231/api"

export async function GET(req: NextRequest) {
  const auth = getBearerToken(req)
  if (!auth) return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
  try {
    const res = await fetch(`${API}/avatares`, { headers: { Authorization: auth } })
    const data = await res.json()
    return NextResponse.json(data, { status: res.status })
  } catch {
    return NextResponse.json({ error: "Erro ao conectar" }, { status: 503 })
  }
}

export async function POST(req: NextRequest) {
  const auth = getBearerToken(req)
  if (!auth) return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
  try {
    const body = await req.json()
    const res = await fetch(`${API}/avatares`, {
      method: "POST",
      headers: { Authorization: auth, "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
    const data = await res.json()
    return NextResponse.json(data, { status: res.status })
  } catch {
    return NextResponse.json({ error: "Erro ao conectar" }, { status: 503 })
  }
}
