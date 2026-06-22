import { NextRequest, NextResponse } from "next/server"

const API = process.env.API_INTERNAL_URL ?? "http://2.25.196.231/api"

export async function GET(req: NextRequest) {
  const auth = req.headers.get("authorization") ?? ""
  if (!auth) return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
  try {
    const { searchParams } = req.nextUrl
    const qs = searchParams.get("nicho") ? `?nicho=${encodeURIComponent(searchParams.get("nicho")!)}` : ""
    const res = await fetch(`${API}/viral${qs}`, { headers: { Authorization: auth } })
    const data = await res.json()
    return NextResponse.json(data, { status: res.status })
  } catch {
    return NextResponse.json({ error: "Erro ao conectar" }, { status: 503 })
  }
}
