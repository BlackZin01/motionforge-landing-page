"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import type { ReactNode } from "react"

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && (!user || !user.isAdmin)) {
      router.replace("/dashboard")
    }
  }, [user, loading, router])

  if (loading || !user?.isAdmin) return null

  return <>{children}</>
}
