import { NextRequest, NextResponse } from "next/server"
import { getBearerToken } from "@/lib/server-auth"

const API = process.env.API_INTERNAL_URL ?? "http://2.25.196.231/api"

export async function POST(req: NextRequest) {
  try {
    const auth = getBearerToken(req)
    if (!auth) return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    const body = await req.json()
    const res = await fetch(`${API}/generate`, {
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
