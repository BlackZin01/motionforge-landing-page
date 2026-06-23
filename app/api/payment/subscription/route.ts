import { NextRequest, NextResponse } from "next/server"
import { getBearerToken } from "@/lib/server-auth"

const API = process.env.API_INTERNAL_URL ?? "http://2.25.196.231"

export async function GET(req: NextRequest) {
  const auth = getBearerToken(req)
  if (!auth) return NextResponse.json({ error: "Não autorizado" }, { status: 401 })

  const res = await fetch(`${API}/payment/subscription`, {
    headers: { Authorization: auth },
  }).catch(() => null)

  if (!res) return NextResponse.json({ error: "Serviço indisponível" }, { status: 503 })
  const data = await res.json()
  return NextResponse.json(data, { status: res.status })
}
