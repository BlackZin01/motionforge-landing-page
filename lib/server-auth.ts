import { NextRequest } from "next/server"

/**
 * Lê o JWT do cookie httpOnly `mf_token` e retorna como "Bearer <token>".
 * Retorna string vazia se o cookie não existir.
 */
export function getBearerToken(req: NextRequest): string {
  const token = req.cookies.get("mf_token")?.value ?? ""
  return token ? `Bearer ${token}` : ""
}

/** Opções padrão de cookie seguro para reutilizar em login/register/logout */
export const COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: "lax" as const,
  maxAge: 7 * 24 * 60 * 60,
  path: "/",
  secure: process.env.NODE_ENV === "production",
}
