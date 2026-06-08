"use client"

import { useState } from "react"

export type PillVariant = "default" | "vid" | "img"

interface ModelPillProps {
  name: string
  variant?: PillVariant
}

/* Cores base e hover por variante */
const STYLES: Record<
  PillVariant,
  { border: string; color: string; hoverBorder: string; hoverColor: string }
> = {
  default: {
    border: "rgba(255,255,255,0.12)",
    color: "rgba(245,245,245,0.5)",
    hoverBorder: "#FF4D00",
    hoverColor: "#FF4D00",
  },
  vid: {
    border: "rgba(0,229,255,0.25)",
    color: "rgba(0,229,255,0.7)",
    hoverBorder: "#00E5FF",
    hoverColor: "#00E5FF",
  },
  img: {
    border: "rgba(255,77,0,0.25)",
    color: "rgba(245,245,245,0.55)",
    hoverBorder: "#FF4D00",
    hoverColor: "#FF4D00",
  },
}

export function ModelPill({ name, variant = "default" }: ModelPillProps) {
  const [hovered, setHovered] = useState(false)
  const s = STYLES[variant]

  return (
    <span
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "5px 11px",
        fontFamily: "var(--font-sans)",
        fontSize: 12,
        fontWeight: 500,
        whiteSpace: "nowrap",
        cursor: "default",
        border: `1px solid ${hovered ? s.hoverBorder : s.border}`,
        color: hovered ? s.hoverColor : s.color,
        background: "transparent",
        transition: "border-color 200ms ease, color 200ms ease",
      }}
    >
      {name}
    </span>
  )
}
