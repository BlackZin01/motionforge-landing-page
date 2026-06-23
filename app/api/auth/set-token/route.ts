import { NextRequest, NextResponse } from "next/server"
import { COOKIE_OPTIONS } from "@/lib/server-auth"

// Rota usada pelo OAuth callback para setar o cookie httpOnly no servidor
// (JS não pode setar cookies httpOnly diretamente)
export async function POST(req: NextRequest) {
  const { token } = await req.json()
  if (!token || typeof token !== "string") {
    return NextResponse.json({ error: "Token inválido" }, { status: 400 })
  }
  const response = NextResponse.json({ ok: true })
  response.cookies.set("mf_token", token, COOKIE_OPTIONS)
  return response
}
