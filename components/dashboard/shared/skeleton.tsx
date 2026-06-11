"use client"

export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded ${className}`}
      style={{ background: "rgba(255,255,255,0.05)" }}
    />
  )
}
