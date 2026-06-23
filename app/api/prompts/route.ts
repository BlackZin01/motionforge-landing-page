import { NextRequest, NextResponse } from "next/server"
import { getBearerToken } from "@/lib/server-auth"

const API = process.env.API_INTERNAL_URL ?? "http://2.25.196.231/api"

export async function GET(req: NextRequest) {
  try {
    const auth = getBearerToken(req)
    const { searchParams } = req.nextUrl
    // Não enviar ?plano= — o backend usa o plano real do JWT
    const filtros = new URLSearchParams()
    if (searchParams.get("categoria")) filtros.set("categoria", searchParams.get("categoria")!)
    if (searchParams.get("modelo")) filtros.set("modelo", searchParams.get("modelo")!)
    const qs = filtros.toString()
    const res = await fetch(`${API}/prompts${qs ? "?" + qs : ""}`, {
      headers: { Authorization: auth },
    })
    const data = await res.json()
    return NextResponse.json(data, { status: res.status })
  } catch {
    return NextResponse.json({ error: "Erro ao conectar com o servidor" }, { status: 503 })
  }
}
