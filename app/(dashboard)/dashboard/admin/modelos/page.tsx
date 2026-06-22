"use client"
import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function AdminModelosPage() {
  const router = useRouter()
  useEffect(() => { router.replace("/dashboard/admin/usuarios") }, [router])
  return null
}
