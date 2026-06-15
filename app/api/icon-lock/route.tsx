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
          width: 64,
          height: 64,
          borderRadius: "50%",
          background: "rgba(139,90,43,0.3)",
          border: "1.5px solid rgba(255,77,0,0.4)",
        }}
      >
        {/* Corpo do cadeado */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 0,
          }}
        >
          {/* Arco */}
          <div
            style={{
              width: 16,
              height: 9,
              borderTop: "2.5px solid #FF4D00",
              borderLeft: "2.5px solid #FF4D00",
              borderRight: "2.5px solid #FF4D00",
              borderRadius: "8px 8px 0 0",
              marginBottom: 0,
            }}
          />
          {/* Corpo */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 22,
              height: 16,
              background: "#FF4D00",
              borderRadius: 4,
            }}
          >
            {/* Buraco da chave */}
            <div
              style={{
                width: 5,
                height: 7,
                background: "rgba(139,90,43,0.6)",
                borderRadius: 3,
              }}
            />
          </div>
        </div>
      </div>
    ),
    {
      width: 64,
      height: 64,
      headers: { "Cache-Control": "public, max-age=86400" },
    }
  )
}
