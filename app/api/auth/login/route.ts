import { NextRequest, NextResponse } from "next/server"

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

    const response = NextResponse.json(data, { status: res.status })

    // Define cookie server-side para garantir que o middleware leia corretamente
    if (res.ok && data.token) {
      response.cookies.set("mf_token", data.token, {
        httpOnly: false, // precisa ser false para o auth-context ler via document.cookie
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60,
        path: "/",
        secure: process.env.NODE_ENV === "production",
      })
    }

    return response
  } catch {
    return NextResponse.json({ error: "Erro ao conectar com o servidor" }, { status: 503 })
  }
}
