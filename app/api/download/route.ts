import { NextRequest, NextResponse } from "next/server"
import { getBearerToken } from "@/lib/server-auth"

// Apenas domínios do CDN próprio são permitidos — bloqueia SSRF
const ALLOWED_HOSTNAMES = [
  "cdn.motionforge.com.br",
  "pub-",  // prefixo de buckets públicos Cloudflare R2
]

function isAllowedUrl(raw: string): boolean {
  try {
    const { protocol, hostname } = new URL(raw)
    if (protocol !== "https:") return false
    return ALLOWED_HOSTNAMES.some(
      (h) => hostname === h || hostname.endsWith("." + h) || hostname.startsWith(h)
    )
  } catch {
    return false
  }
}

export async function GET(req: NextRequest) {
  const auth = getBearerToken(req)
  if (!auth) return NextResponse.json({ error: "Não autorizado" }, { status: 401 })

  const url = req.nextUrl.searchParams.get("url")
  const filename = req.nextUrl.searchParams.get("filename") ?? "motionforge-download"

  if (!url) {
    return NextResponse.json({ error: "url obrigatória" }, { status: 400 })
  }

  if (!isAllowedUrl(url)) {
    return NextResponse.json({ error: "URL não permitida" }, { status: 403 })
  }

  try {
    const res = await fetch(url)
    if (!res.ok) {
      return NextResponse.json({ error: "Falha ao buscar arquivo" }, { status: 502 })
    }
    const contentType = res.headers.get("content-type") ?? "application/octet-stream"
    const buffer = await res.arrayBuffer()
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Content-Length": buffer.byteLength.toString(),
      },
    })
  } catch {
    return NextResponse.json({ error: "Erro ao baixar arquivo" }, { status: 500 })
  }
}
