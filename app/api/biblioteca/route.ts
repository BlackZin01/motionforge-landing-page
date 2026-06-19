import { NextRequest, NextResponse } from "next/server"

const API = process.env.API_INTERNAL_URL ?? "http://2.25.196.231/api"

export async function GET(req: NextRequest) {
  try {
    const auth = req.headers.get("authorization") ?? ""
    const { searchParams } = req.nextUrl
    const qs = searchParams.toString()
    const res = await fetch(`${API}/biblioteca${qs ? "?" + qs : ""}`, {
      headers: { Authorization: auth },
    })
    const data = await res.json()
    return NextResponse.json(data, { status: res.status })
  } catch {
    return NextResponse.json({ error: "Erro ao conectar com o servidor" }, { status: 503 })
  }
}
