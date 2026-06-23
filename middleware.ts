import { NextRequest, NextResponse } from "next/server"

export function middleware(req: NextRequest) {
  const token = req.cookies.get("mf_token")?.value
  const path = req.nextUrl.pathname

  // Protege todas as rotas do dashboard exceto /dashboard/upgrade
  const isProtectedPage =
    path.startsWith("/dashboard") && !path.startsWith("/dashboard/upgrade")

  if (isProtectedPage && !token) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*"],
}
