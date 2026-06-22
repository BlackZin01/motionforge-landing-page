"use client"

import { useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

interface ScrollFillTextProps {
  text: string
  tag?: "h2" | "h3" | "p" | "span"
  highlightWords?: string[]   // palavras que ficam laranja no final
  style?: React.CSSProperties
  className?: string
  start?: string
  end?: string
}

export function ScrollFillText({
  text,
  tag: Tag = "p",
  highlightWords = [],
  style,
  className,
  start = "top 85%",
  end = "bottom 30%",
}: ScrollFillTextProps) {
  const containerRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const words = el.querySelectorAll<HTMLSpanElement>("[data-word]")

    const ctx = gsap.context(() => {
      words.forEach((word, i) => {
        const isHighlight = word.dataset.highlight === "true"
        gsap.fromTo(
          word,
          { color: "rgba(245,245,245,0.12)" },
          {
            color: isHighlight ? "#FF4D00" : "#F5F5F5",
            ease: "none",
            scrollTrigger: {
              trigger: el,
              start,
              end,
              scrub: 1.2,
              // cada palavra começa e termina em momentos ligeiramente diferentes
              onUpdate(self) {
                const progress = Math.max(0, Math.min(1, (self.progress - i / words.length * 0.8) / (1 / words.length * 1.6)))
                const color = isHighlight
                  ? lerpColor("rgba(245,245,245,0.12)", "#FF4D00", progress)
                  : lerpColor("rgba(245,245,245,0.12)", "#F5F5F5", progress)
                ;(word as HTMLSpanElement).style.color = color
              },
            },
          }
        )
      })
    }, el)

    return () => ctx.revert()
  }, [start, end])

  const highlightSet = new Set(highlightWords.map(w => w.toLowerCase()))

  return (
    <Tag
      ref={containerRef as React.RefObject<HTMLHeadingElement & HTMLParagraphElement>}
      style={style}
      className={className}
    >
      {text.split(" ").map((word, i) => {
        const clean = word.replace(/[.,!?;:]/g, "").toLowerCase()
        const isHL = highlightSet.has(clean)
        return (
          <span
            key={i}
            data-word
            data-highlight={isHL ? "true" : "false"}
            style={{
              display: "inline-block",
              marginRight: "0.28em",
              color: "rgba(245,245,245,0.12)",
              willChange: "color",
            }}
          >
            {word}
          </span>
        )
      })}
    </Tag>
  )
}

// interpola entre duas cores simples
function lerpColor(from: string, to: string, t: number): string {
  // from é sempre rgba(245,245,245,0.12), to é #F5F5F5 ou #FF4D00
  t = Math.max(0, Math.min(1, t))
  if (to === "#FF4D00") {
    const r = Math.round(lerp(245, 255, t))
    const g = Math.round(lerp(245, 77, t))
    const b = Math.round(lerp(245, 0, t))
    const a = lerp(0.12, 1, t)
    return `rgba(${r},${g},${b},${a})`
  }
  // para branco
  const a = lerp(0.12, 1, t)
  return `rgba(245,245,245,${a.toFixed(2)})`
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t
}
