"use client"

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react"
import { AnimatePresence, motion } from "framer-motion"

// ─── Tipos ───────────────────────────────────────────────────────────────────

interface Toast {
  id: string
  message: string
  type: "success" | "error" | "info"
}

interface ToastContextValue {
  toast: (options: { message: string; type: Toast["type"] }) => void
}

// ─── Context ─────────────────────────────────────────────────────────────────

const ToastContext = createContext<ToastContextValue | null>(null)

// ─── Estilos por tipo ────────────────────────────────────────────────────────

const TYPE_STYLES: Record<Toast["type"], { border: string; color: string }> = {
  success: { border: "#4ADE80", color: "#4ADE80" },
  error:   { border: "#F87171", color: "#F87171" },
  info:    { border: "#FF4D00", color: "#FF4D00" },
}

// ─── Item individual de toast ────────────────────────────────────────────────

function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: (id: string) => void }) {
  const styles = TYPE_STYLES[toast.type]

  // Auto-dismiss após 3s
  useEffect(() => {
    const timer = setTimeout(() => onDismiss(toast.id), 3000)
    return () => clearTimeout(timer)
  }, [toast.id, onDismiss])

  return (
    <motion.div
      key={toast.id}
      initial={{ x: 300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 300, opacity: 0 }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      onClick={() => onDismiss(toast.id)}
      style={{
        background: "#111111",
        border: `1px solid ${styles.border}`,
        borderRadius: "12px",
        padding: "12px",
        display: "flex",
        gap: "8px",
        alignItems: "flex-start",
        cursor: "pointer",
        userSelect: "none",
      }}
    >
      {/* Indicador de tipo */}
      <span
        style={{
          width: "6px",
          height: "6px",
          borderRadius: "50%",
          background: styles.color,
          flexShrink: 0,
          marginTop: "5px",
        }}
      />
      <span
        style={{
          fontSize: "13px",
          color: styles.color,
          lineHeight: "1.4",
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        {toast.message}
      </span>
    </motion.div>
  )
}

// ─── Container de toasts ─────────────────────────────────────────────────────

function ToastContainer({ toasts, onDismiss }: { toasts: Toast[]; onDismiss: (id: string) => void }) {
  return (
    <div
      style={{
        position: "fixed",
        bottom: "16px",
        right: "16px",
        zIndex: 50,
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        width: "320px",
      }}
    >
      <AnimatePresence mode="sync">
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onDismiss={onDismiss} />
        ))}
      </AnimatePresence>
    </div>
  )
}

// ─── Provider ────────────────────────────────────────────────────────────────

export default function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const toast = useCallback(({ message, type }: { message: string; type: Toast["type"] }) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2)}`
    setToasts((prev) => [...prev, { id, message, type }])
  }, [])

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  )
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext)
  if (!ctx) {
    throw new Error("useToast deve ser usado dentro de <ToastProvider>")
  }
  return ctx
}
