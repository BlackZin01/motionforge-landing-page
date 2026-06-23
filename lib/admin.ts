import { NextRequest, NextResponse } from "next/server"
import { getBearerToken } from "@/lib/server-auth"

const API = process.env.API_INTERNAL_URL ?? "http://2.25.196.231/api"

export async function requireAdmin(req: NextRequest): Promise<{ userId: string } | NextResponse> {
  const auth = getBearerToken(req)
  if (!auth) return NextResponse.json({ error: "Não autorizado" }, { status: 401 })

  try {
    const res = await fetch(`${API}/auth/me`, { headers: { Authorization: auth } })
    if (!res.ok) return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    const user = await res.json()
    if (!user.is_admin) return NextResponse.json({ error: "Acesso negado" }, { status: 403 })
    return { userId: user.id }
  } catch {
    return NextResponse.json({ error: "Erro ao verificar permissões" }, { status: 503 })
  }
}

export async function adminProxy(
  req: NextRequest,
  path: string,
  method = "GET",
  body?: unknown
): Promise<NextResponse> {
  const auth = getBearerToken(req)
  const url = new URL(req.url)
  const query = url.search
  try {
    const res = await fetch(`${API}${path}${query}`, {
      method,
      headers: { "Content-Type": "application/json", Authorization: auth },
      body: body ? JSON.stringify(body) : undefined,
    })
    const data = await res.json()
    return NextResponse.json(data, { status: res.status })
  } catch {
    return NextResponse.json({ error: "Erro ao conectar com o servidor" }, { status: 503 })
  }
}
