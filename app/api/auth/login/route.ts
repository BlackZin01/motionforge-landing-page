import { NextRequest, NextResponse } from "next/server"
import { COOKIE_OPTIONS } from "@/lib/server-auth"

const API = process.env.API_INTERNAL_URL ?? "http://2.25.196.231/api"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const res = await fetch(`${API}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
    const data = await res.json()

    if (!res.ok) {
      return NextResponse.json(data, { status: res.status })
    }

    // Token armazenado apenas em cookie httpOnly — JavaScript não consegue lê-lo
    const { token, ...userWithoutToken } = data
    const response = NextResponse.json(userWithoutToken, { status: 200 })
    response.cookies.set("mf_token", token, COOKIE_OPTIONS)
    return response
  } catch {
    return NextResponse.json({ error: "Erro ao conectar com o servidor" }, { status: 503 })
  }
}
