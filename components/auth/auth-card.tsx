"use client"

import { motion } from "framer-motion"

const EASE = [0.22, 1, 0.36, 1] as const

interface AuthCardProps {
  children: React.ReactNode
}

export function AuthCard({ children }: AuthCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [...EASE] }}
      className="w-full rounded-t-2xl rounded-b-none sm:rounded-2xl"
      style={{
        background: "#1A1A1A",
        border: "1px solid rgba(255,255,255,0.08)",
        padding: "40px",
      }}
    >
      {children}
    </motion.div>
  )
}
