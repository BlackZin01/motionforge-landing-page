import { NextRequest, NextResponse } from "next/server"

const API = process.env.API_INTERNAL_URL ?? "http://2.25.196.231"

export async function POST(req: NextRequest) {
  const auth = req.headers.get("authorization") ?? ""
  if (!auth) return NextResponse.json({ error: "Não autorizado" }, { status: 401 })

  const body = await req.json()
  const res = await fetch(`${API}/payment/checkout/pix`, {
    method: "POST",
    headers: { Authorization: auth, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  }).catch(() => null)

  if (!res) return NextResponse.json({ error: "Serviço indisponível" }, { status: 503 })
  const data = await res.json()
  return NextResponse.json(data, { status: res.status })
}
