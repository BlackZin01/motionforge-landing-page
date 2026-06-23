import { NextRequest, NextResponse } from "next/server"
import { getBearerToken } from "@/lib/server-auth"

const API = process.env.API_INTERNAL_URL ?? "http://2.25.196.231/api"

export async function GET(req: NextRequest) {
  const auth = getBearerToken(req)
  if (!auth) return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
  try {
    const { searchParams } = req.nextUrl
    const qs = searchParams.toString()
    const res = await fetch(`${API}/admin/prompts${qs ? "?" + qs : ""}`, {
      headers: { Authorization: auth },
    })
    const data = await res.json()
    return NextResponse.json(data, { status: res.status })
  } catch {
    return NextResponse.json({ error: "Erro ao conectar com o servidor" }, { status: 503 })
  }
}

export async function POST(req: NextRequest) {
  const auth = getBearerToken(req)
  if (!auth) return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
  try {
    const body = await req.json()
    const res = await fetch(`${API}/admin/prompts`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: auth },
      body: JSON.stringify(body),
    })
    const data = await res.json()
    return NextResponse.json(data, { status: res.status })
  } catch {
    return NextResponse.json({ error: "Erro ao conectar com o servidor" }, { status: 503 })
  }
}
