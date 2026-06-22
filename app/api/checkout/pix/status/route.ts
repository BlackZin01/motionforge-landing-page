import { NextRequest, NextResponse } from "next/server"

const API = process.env.API_INTERNAL_URL ?? "http://2.25.196.231"

export async function GET(req: NextRequest) {
  const auth = req.headers.get("authorization") ?? ""
  if (!auth) return NextResponse.json({ error: "Não autorizado" }, { status: 401 })

  const pixId = req.nextUrl.searchParams.get("pixId") ?? ""
  if (!pixId) return NextResponse.json({ error: "pixId ausente" }, { status: 400 })

  const res = await fetch(`${API}/payment/checkout/pix/status?pixId=${pixId}`, {
    headers: { Authorization: auth },
  }).catch(() => null)

  if (!res) return NextResponse.json({ error: "Serviço indisponível" }, { status: 503 })
  const data = await res.json()
  return NextResponse.json(data, { status: res.status })
}
