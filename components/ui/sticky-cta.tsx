"use client"

import { useState, useEffect } from "react"
import { trackEvent } from "@/lib/pixels"

export function StickyCta() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const threshold = window.innerHeight * 0.5
    const onScroll = () => setVisible(window.scrollY > threshold)
    window.addEventListener("scroll", onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <div
      className="fixed bottom-0 left-0 right-0 md:hidden z-50"
      style={{
        transform: visible ? "translateY(0)" : "translateY(100%)",
        transition: "transform 320ms cubic-bezier(0.22,1,0.36,1)",
        background: "var(--color-forge-black)",
        borderTop: "1px solid rgba(255,77,0,0.25)",
        padding: "10px 16px",
        paddingBottom: "calc(10px + env(safe-area-inset-bottom))",
        boxShadow: "0 -12px 40px rgba(0,0,0,0.7)",
      }}
    >
      <a
        href="#planos"
        onClick={() => trackEvent("InitiateCheckout", { content_name: "Sticky CTA Mobile" })}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          background: "var(--color-forge-orange)",
          color: "#fff",
          fontFamily: "var(--font-sans)",
          fontWeight: 700,
          fontSize: 13,
          letterSpacing: "0.10em",
          textTransform: "uppercase",
          textDecoration: "none",
          padding: "14px 20px",
          boxShadow: "0 0 24px rgba(255,77,0,0.45)",
          width: "100%",
          justifySelf: "stretch",
        }}
      >
        Começar Agora
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontWeight: 500,
            fontSize: 11,
            opacity: 0.75,
          }}
        >
          · a partir de R$ 97/mês
        </span>
      </a>
    </div>
  )
}
