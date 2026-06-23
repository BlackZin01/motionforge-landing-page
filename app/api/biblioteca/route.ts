import { NextRequest, NextResponse } from "next/server"
import { getBearerToken } from "@/lib/server-auth"

const API = process.env.API_INTERNAL_URL ?? "http://2.25.196.231/api"

const PLAN_LIMITS: Record<string, number> = {
  starter: 50,
  pro: 200,
  agency: 200,
}

export async function GET(req: NextRequest) {
  try {
    const auth = getBearerToken(req)
    const { searchParams } = req.nextUrl

    // Obtém plano do usuário para aplicar limite de produtos
    let limit = PLAN_LIMITS.starter // padrão conservador
    if (auth) {
      const meRes = await fetch(`${API}/auth/me`, {
        headers: { Authorization: auth },
      }).catch(() => null)
      if (meRes?.ok) {
        const userData = await meRes.json()
        const rawPlan = userData.plan
        const plan = typeof rawPlan === "string" ? rawPlan.toLowerCase() : "starter"
        limit = PLAN_LIMITS[plan] ?? PLAN_LIMITS.starter
      }
    }

    const qs = searchParams.toString()
    const res = await fetch(`${API}/biblioteca${qs ? "?" + qs : ""}`, {
      headers: { Authorization: auth },
    })
    const data = await res.json()

    // Aplica limite por plano na lista de produtos
    if (data.produtos && Array.isArray(data.produtos)) {
      data.produtos = data.produtos.slice(0, limit)
      data.limite_plano = limit
    }

    return NextResponse.json(data, { status: res.status })
  } catch {
    return NextResponse.json({ error: "Erro ao conectar com o servidor" }, { status: 503 })
  }
}
