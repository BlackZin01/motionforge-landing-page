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
  plan: "Starter" | "Pro" | "Agency"
  credits: number
  totalCredits: number
  renewDays: number
}

interface AuthContextValue {
  user: AuthUser | null
  loading: boolean
  logout: () => void
}

// ─── Contexto ─────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: true,
  logout: () => {},
})

export function useAuth() {
  return useContext(AuthContext)
}

// ─── Helpers de cookie ────────────────────────────────────────────────────────

function setCookie(name: string, value: string, days = 7) {
  const maxAge = days * 24 * 60 * 60
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAge}; SameSite=Lax`
}

function deleteCookie(name: string) {
  document.cookie = `${name}=; path=/; max-age=0; SameSite=Lax`
}

// ─── Normalizar user da API ───────────────────────────────────────────────────

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
    plan: (data.plan as AuthUser["plan"]) ?? "Starter",
    credits: Number(data.credits ?? 0),
    totalCredits: Number(data.totalCredits ?? data.total_credits ?? 5000),
    renewDays: Number(data.renewDays ?? data.renew_days ?? 30),
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

  const logout = useCallback(() => {
    localStorage.removeItem("mf_token")
    localStorage.removeItem("mf_user")
    deleteCookie("mf_token")
    setUser(null)
    router.replace("/login")
  }, [router])

  useEffect(() => {
    const token = localStorage.getItem("mf_token")

    if (!token) {
      setLoading(false)
      router.replace("/login")
      return
    }

    // Sincroniza cookie para o proxy server-side conseguir ler
    setCookie("mf_token", token)

    // Carrega cache imediatamente — evita spinner se já passou pelo login antes
    const cached = localStorage.getItem("mf_user")
    if (cached) {
      try {
        setUser(JSON.parse(cached))
        setLoading(false) // mostra dashboard com dados cached, valida em background
      } catch {
        localStorage.removeItem("mf_user")
      }
    }

    // Valida token e atualiza dados em background (timeout de 8s)
    fetchWithTimeout(
      "/api/auth/me",
      { headers: { Authorization: `Bearer ${token}` } },
      8000
    )
      .then((r) => {
        // Apenas 401 = token definitivamente inválido → logout
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
        // Se não tem cache, mostra tela de erro mas não força logout
        if (!cached) {
          // Sem cache e sem API: força logout para evitar tela vazia
          logout()
        }
      })
      .finally(() => {
        setLoading(false)
      })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
