"use client"

import { useEffect, useRef } from "react"
import { animate, useInView } from "framer-motion"

interface NumberTickerProps {
  value: number
  duration?: number
  className?: string
  style?: React.CSSProperties
}

export function NumberTicker({
  value,
  duration = 1.8,
  className,
  style,
}: NumberTickerProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    if (!isInView || !ref.current) return

    /* Respeitar prefers-reduced-motion */
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches

    if (prefersReduced) {
      ref.current.textContent = value.toLocaleString("pt-BR")
      return
    }

    const controls = animate(0, value, {
      duration,
      ease: [0.22, 1, 0.36, 1],
      onUpdate(latest) {
        if (ref.current) {
          ref.current.textContent = Math.round(latest).toLocaleString("pt-BR")
        }
      },
    })

    return () => controls.stop()
  }, [isInView, value, duration])

  return (
    <span
      ref={ref}
      className={className}
      style={style}
      aria-label={value.toLocaleString("pt-BR")}
    >
      0
    </span>
  )
}
