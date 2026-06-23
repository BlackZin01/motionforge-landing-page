"use client"

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react"
import { useRouter } from "next/navigation"

// ─── Tipos ────────────────────────────────────────────────────────────────────

export interface AuthUser {
  id: string
  name: string
  email: string
  plan: "Free" | "Starter" | "Pro" | "Agency"
  plan_status?: string
  isAdmin: boolean
  geracoes_usadas?: number
  active_profile_id?: string | null
}

interface AuthContextValue {
  user: AuthUser | null
  loading: boolean
  logout: () => void
  refreshUser: () => Promise<void>
}

// ─── Contexto ─────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: true,
  logout: () => {},
  refreshUser: async () => {},
})

export function useAuth() {
  return useContext(AuthContext)
}

// ─── Normalizar user da API ───────────────────────────────────────────────────

const VALID_PLANS: AuthUser["plan"][] = ["Free", "Starter", "Pro", "Agency"]

function normalizePlan(raw: unknown): AuthUser["plan"] {
  if (typeof raw !== "string") return "Free"
  const lower = raw.toLowerCase()
  if (lower === "pro")     return "Pro"
  if (lower === "agency")  return "Agency"
  if (lower === "starter") return "Starter"
  return "Free" // free, unknown → Free
}

function normalizeUser(data: Record<string, unknown>): AuthUser {
  const name =
    (data.name as string) ||
    (data.username as string) ||
    ((data.email as string)?.split("@")[0]) ||
    "Usuário"

  return {
    id: String(data.id ?? ""),
    name,
    email: String(data.email ?? ""),
    plan: normalizePlan(data.plan),
    plan_status: typeof data.plan_status === "string" ? data.plan_status : "active",
    isAdmin: Boolean(data.isAdmin ?? data.is_admin ?? false),
    geracoes_usadas: typeof data.geracoes_usadas === "number" ? data.geracoes_usadas : undefined,
    active_profile_id: (data.active_profile_id as string | null | undefined) ?? null,
  }
}

// ─── Fetch com timeout ────────────────────────────────────────────────────────

async function fetchWithTimeout(
  url: string,
  options: RequestInit,
  ms = 8000
): Promise<Response> {
  const controller = new AbortController()
  const id = setTimeout(() => controller.abort(), ms)
  try {
    return await fetch(url, { ...options, signal: controller.signal })
  } finally {
    clearTimeout(id)
  }
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  const logout = useCallback(async () => {
    // Apaga cookie httpOnly via API route (JS não consegue apagar cookie httpOnly diretamente)
    try { await fetch("/api/auth/logout", { method: "POST" }) } catch { /* ignora */ }
    localStorage.removeItem("mf_user")
    setUser(null)
    router.replace("/login")
  }, [router])

  const refreshUser = useCallback(async () => {
    try {
      // Cookie httpOnly é enviado automaticamente pelo browser
      const res = await fetch("/api/auth/me")
      if (!res.ok) return
      const data = await res.json()
      const userData = normalizeUser(data)
      setUser(userData)
      localStorage.setItem("mf_user", JSON.stringify(userData))
    } catch {}
  }, [])

  useEffect(() => {
    // Carrega cache imediatamente — evita spinner se já passou pelo login antes
    const cached = localStorage.getItem("mf_user")
    if (cached) {
      try {
        setUser(normalizeUser(JSON.parse(cached)))
        setLoading(false) // mostra dashboard com dados cached, valida em background
      } catch {
        localStorage.removeItem("mf_user")
      }
    }

    // Valida sessão via cookie httpOnly (enviado automaticamente pelo browser)
    fetchWithTimeout("/api/auth/me", {}, 8000)
      .then((r) => {
        // 401 = cookie ausente ou expirado → logout
        if (r.status === 401) {
          logout()
          return null
        }
        if (!r.ok) return null // outro erro de servidor → mantém sessão
        return r.json()
      })
      .then((data: Record<string, unknown> | null) => {
        if (!data) return
        const userData = normalizeUser(data)
        setUser(userData)
        localStorage.setItem("mf_user", JSON.stringify(userData))
      })
      .catch(() => {
        // Timeout ou erro de rede → se tem cache, mantém logado
        if (!cached) logout()
      })
      .finally(() => {
        setLoading(false)
      })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}
