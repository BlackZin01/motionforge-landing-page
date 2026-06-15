import { NextRequest } from "next/server"
import { adminProxy } from "@/lib/admin"

export async function GET(req: NextRequest) {
  return adminProxy(req, "/admin/webhooks")
}
