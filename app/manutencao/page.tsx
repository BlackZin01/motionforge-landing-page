import { Logo } from "@/components/ui/logo"

export const dynamic = "force-dynamic"

export default async function ManutencaoPage() {
  let message = "Sistema em manutenção. Voltamos em breve."
  try {
    const API = process.env.API_INTERNAL_URL ?? "http://2.25.196.231/api"
    const res = await fetch(`${API}/admin/seguranca/status`, { next: { revalidate: 0 } })
    if (res.ok) {
      const d = await res.json()
      message = d.config?.maintenance_message ?? message
    }
  } catch {}

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0D0D0D",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "40px 20px",
    }}>
      <Logo size="nav" />
      <div style={{ marginTop: "40px", textAlign: "center", maxWidth: "420px" }}>
        <div style={{ fontSize: "48px", marginBottom: "16px" }}>🔧</div>
        <h1 style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: "24px",
          fontWeight: 700,
          color: "#F5F5F5",
          marginBottom: "12px",
        }}>
          Em Manutenção
        </h1>
        <p style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: "15px",
          color: "rgba(245,245,245,0.45)",
          lineHeight: 1.6,
        }}>
          {message}
        </p>
        <p style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: "13px",
          color: "rgba(245,245,245,0.25)",
          marginTop: "24px",
        }}>
          Voltamos em breve.
        </p>
      </div>
    </div>
  )
}
