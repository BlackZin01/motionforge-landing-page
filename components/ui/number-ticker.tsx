"use client"

import { useEffect, useRef } from "react"
import { useInView } from "framer-motion"

interface NumberTickerProps {
  value: number
  duration?: number
  prefix?: string
  suffix?: string
  className?: string
  style?: React.CSSProperties
}

export function NumberTicker({
  value,
  duration = 2,
  prefix = "",
  suffix = "",
  className,
  style,
}: NumberTickerProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true, margin: "0px 0px -50px 0px" })

  useEffect(() => {
    if (!isInView || !ref.current) return

    /* Respeitar prefers-reduced-motion */
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      ref.current.textContent = prefix + value.toLocaleString("pt-BR") + suffix
      return
    }

    const durationMs = duration * 1000
    const startTime = performance.now()
    let raf: number

    const tick = (now: number) => {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / durationMs, 1)
      /* easeOutCubic */
      const eased = 1 - Math.pow(1 - progress, 3)
      const current = Math.round(eased * value)
      if (ref.current) {
        ref.current.textContent = prefix + current.toLocaleString("pt-BR") + suffix
      }
      if (progress < 1) raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [isInView, value, duration, prefix, suffix])

  return (
    <span
      ref={ref}
      className={className}
      style={style}
      aria-label={prefix + value.toLocaleString("pt-BR") + suffix}
    >
      {prefix}0{suffix}
    </span>
  )
}
