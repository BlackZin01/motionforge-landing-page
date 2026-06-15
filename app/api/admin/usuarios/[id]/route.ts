import { NextRequest } from "next/server"
import { adminProxy } from "@/lib/admin"

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await req.json()
  return adminProxy(req, `/admin/usuarios/${id}`, "PATCH", body)
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return adminProxy(req, `/admin/usuarios/${id}`, "DELETE")
}
