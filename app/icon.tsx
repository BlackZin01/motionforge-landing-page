import { ImageResponse } from "next/og"

export const size = { width: 32, height: 32 }
export const contentType = "image/png"

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          background: "#0D0D0D",
          borderRadius: 7,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
        {/* Anel laranja */}
        <div
          style={{
            position: "absolute",
            width: 24,
            height: 24,
            borderRadius: "50%",
            border: "2.2px solid #FF4D00",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* Triângulo play — usando borda CSS */}
          <div
            style={{
              width: 0,
              height: 0,
              borderTop: "5px solid transparent",
              borderBottom: "5px solid transparent",
              borderLeft: "9px solid #FF4D00",
              marginLeft: 2,
            }}
          />
        </div>
      </div>
    ),
    { ...size }
  )
}
