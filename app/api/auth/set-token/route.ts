import { NextRequest, NextResponse } from "next/server"
import { COOKIE_OPTIONS } from "@/lib/server-auth"

const API = process.env.API_INTERNAL_URL ?? "http://2.25.196.231/api"

// Rota usada pelo OAuth callback para setar o cookie httpOnly no servidor
// (JS não pode setar cookies httpOnly diretamente)
// SEGURANÇA: valida o token com o VPS antes de confiar nele
export async function POST(req: NextRequest) {
  const { token } = await req.json()
  if (!token || typeof token !== "string") {
    return NextResponse.json({ error: "Token inválido" }, { status: 400 })
  }

  // Verifica com o VPS se o token é legítimo antes de setá-lo como cookie
  const verify = await fetch(`${API}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  }).catch(() => null)

  if (!verify?.ok) {
    return NextResponse.json({ error: "Token inválido ou expirado" }, { status: 401 })
  }

  const response = NextResponse.json({ ok: true })
  response.cookies.set("mf_token", token, COOKIE_OPTIONS)
  return response
}
