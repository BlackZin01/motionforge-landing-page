"use client"

import { ScrollFillText } from "@/components/ui/scroll-fill-text"

export function Manifesto() {
  return (
    <section
      style={{
        background: "var(--color-forge-black)",
        paddingTop: "clamp(80px, 12vw, 140px)",
        paddingBottom: "clamp(80px, 12vw, 140px)",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          padding: "0 clamp(24px, 5vw, 48px)",
        }}
      >
        <ScrollFillText
          text="Enquanto a concorrência improvisa, você age com precisão. Produto certo. Prompt certo. Vídeo certo. Publicado antes de todo mundo. Isso é o que separa quem fatura de quem tenta."
          tag="h2"
          highlightWords={["precisão.", "certo.", "fatura"]}
          start="top 90%"
          end="bottom 10%"
          style={{
            fontFamily: "var(--font-bebas)",
            fontSize: "clamp(32px, 5.5vw, 64px)",
            lineHeight: 1.15,
            letterSpacing: "2px",
            margin: 0,
          }}
        />
      </div>
    </section>
  )
}
