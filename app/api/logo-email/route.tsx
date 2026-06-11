import { ImageResponse } from "next/og"

export const runtime = "edge"

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
          background: "#0D0D0D",
          width: 240,
          height: 48,
        }}
      >
        {/* Ícone: círculo laranja com ▶ */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 32,
            height: 32,
            borderRadius: "50%",
            border: "2px solid #FF4D00",
          }}
        >
          <span style={{ color: "#FF4D00", fontSize: 14, marginLeft: 2 }}>▶</span>
        </div>

        {/* motion em branco */}
        <span
          style={{
            fontSize: 26,
            fontWeight: 700,
            color: "#F5F5F5",
            fontFamily: "sans-serif",
            letterSpacing: "-0.5px",
          }}
        >
          motion
        </span>

        {/* ponto separador laranja */}
        <span style={{ color: "#FF4D00", fontSize: 26, lineHeight: 1, marginTop: 4 }}>·</span>

        {/* forge em italic muted */}
        <span
          style={{
            fontSize: 26,
            fontWeight: 700,
            fontStyle: "italic",
            color: "rgba(245,245,245,0.4)",
            fontFamily: "sans-serif",
            letterSpacing: "-0.5px",
          }}
        >
          forge
        </span>
      </div>
    ),
    {
      width: 240,
      height: 48,
      headers: { "Cache-Control": "public, max-age=3600" },
    }
  )
}
