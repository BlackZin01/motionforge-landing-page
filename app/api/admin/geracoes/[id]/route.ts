import { NextRequest } from "next/server"
import { adminProxy } from "@/lib/admin"

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return adminProxy(req, `/admin/geracoes/${id}`, "DELETE")
}
