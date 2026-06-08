/**
 * SectionDivider — linha gradiente suave entre seções
 * Estilo: glimmer horizontal transparente → branco 10% → transparente
 * Opcional: glow difuso abaixo da linha para seções de destaque
 */
export function SectionDivider({ glow = false }: { glow?: boolean }) {
  return (
    <div
      aria-hidden="true"
      style={{
        position: "relative",
        height: glow ? 64 : 1,
        flexShrink: 0,
        pointerEvents: "none",
      }}
    >
      {/* Linha gradiente */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 1,
          background:
            "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.10) 20%, rgba(255,255,255,0.10) 80%, transparent 100%)",
        }}
      />
      {/* Glow difuso opcional abaixo da linha */}
      {glow && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: "50%",
            transform: "translateX(-50%)",
            width: "70%",
            height: 64,
            background:
              "radial-gradient(ellipse 100% 100% at 50% 0%, rgba(255,255,255,0.04) 0%, transparent 100%)",
          }}
        />
      )}
    </div>
  )
}
