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
          width: 200,
          height: 40,
        }}
      >
        {/* Anel play */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 28,
            height: 28,
            borderRadius: "50%",
            border: "2px solid #FF4D00",
            position: "relative",
          }}
        >
          <div
            style={{
              width: 0,
              height: 0,
              borderTop: "6px solid transparent",
              borderBottom: "6px solid transparent",
              borderLeft: "10px solid #FF4D00",
              marginLeft: 3,
            }}
          />
        </div>
        {/* Wordmark */}
        <span
          style={{
            fontFamily: "sans-serif",
            fontSize: 20,
            fontWeight: 700,
            color: "#F5F5F5",
            letterSpacing: "-0.5px",
          }}
        >
          motion
          <span style={{ color: "rgba(245,245,245,0.42)", fontStyle: "italic" }}>
            forge
          </span>
        </span>
      </div>
    ),
    {
      width: 200,
      height: 40,
      headers: {
        "Cache-Control": "public, max-age=86400",
      },
    }
  )
}
