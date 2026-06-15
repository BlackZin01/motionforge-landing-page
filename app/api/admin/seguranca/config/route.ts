import { NextRequest } from "next/server"
import { adminProxy } from "@/lib/admin"

export async function PATCH(req: NextRequest) {
  const body = await req.json()
  return adminProxy(req, "/admin/seguranca/config", "PATCH", body)
}
