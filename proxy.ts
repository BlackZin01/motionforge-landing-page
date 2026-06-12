import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Rotas protegidas — exigem token válido
const PROTECTED = ["/dashboard"]

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const isDashboard = PROTECTED.some((p) => pathname.startsWith(p))

  if (isDashboard) {
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
  matcher: ["/dashboard/:path*"],
}
