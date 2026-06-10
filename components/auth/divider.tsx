interface AuthDividerProps {
  text?: string
}

export function AuthDivider({ text = "ou continue com email" }: AuthDividerProps) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        margin: "20px 0",
      }}
    >
      <div
        style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.08)" }}
      />
      <span
        style={{
          fontSize: 12,
          color: "var(--color-forge-muted)",
          whiteSpace: "nowrap",
          fontFamily: "var(--font-sans)",
        }}
      >
        {text}
      </span>
      <div
        style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.08)" }}
      />
    </div>
  )
}
