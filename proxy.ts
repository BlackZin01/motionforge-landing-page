import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const API = process.env.API_INTERNAL_URL ?? "http://2.25.196.231/api"

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Verificar modo manutenção (exceto /manutencao e rotas admin)
  if (!pathname.startsWith("/dashboard/admin") && !pathname.startsWith("/api/")) {
    try {
      const res = await fetch(`${API}/admin/seguranca/status`, {
        signal: AbortSignal.timeout(2000),
      })
      if (res.ok) {
        const d = await res.json()
        const cfg = d.config
        if (cfg?.maintenance_mode || cfg?.emergency_mode) {
          // Admins não são bloqueados
          const token = request.cookies.get("mf_token")?.value
          if (token) {
            try {
              const me = await fetch(`${API}/auth/me`, {
                headers: { Authorization: `Bearer ${token}` },
                signal: AbortSignal.timeout(2000),
              })
              if (me.ok) {
                const user = await me.json()
                if (user.is_admin) {
                  // Admin passa — continua abaixo para verificar auth normal
                }
              }
            } catch {}
          }
          if (pathname !== "/manutencao") {
            return NextResponse.redirect(new URL("/manutencao", request.url))
          }
        }
      }
    } catch {
      // API indisponível — não bloquear
    }
  }

  // Proteger dashboard: exige token
  if (pathname.startsWith("/dashboard")) {
    const token = request.cookies.get("mf_token")?.value
    if (!token) {
      const url = new URL("/login", request.url)
      url.searchParams.set("next", pathname)
      return NextResponse.redirect(url)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*", "/manutencao"],
}
