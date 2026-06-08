/* Logo SVG como componente React — dois tamanhos: "nav" e "hero"
   Regras do brandbook:
   - Nunca alterar a opacidade do "forge" (42%)
   - Não separar o anel (play icon) do wordmark
   - Não aplicar sombra, gradiente ou efeito 3D
*/

interface LogoProps {
  size?: "nav" | "hero"
  className?: string
}

export function Logo({ size = "nav", className }: LogoProps) {
  if (size === "nav") {
    return (
      <svg
        width="126"
        height="20"
        viewBox="0 0 520 76"
        preserveAspectRatio="xMinYMid meet"
        aria-label="MotionForge"
        role="img"
        className={className}
      >
        {/* "mot" */}
        <text
          fontFamily="'DM Sans'"
          fontSize="60"
          fontWeight="700"
          fill="#F5F5F5"
        >
          <tspan x="0" y="58" letterSpacing="-1">
            mot
          </tspan>
        </text>

        {/* "i" — antes do anel */}
        <text
          fontFamily="'DM Sans'"
          fontSize="60"
          fontWeight="700"
          fill="#F5F5F5"
        >
          <tspan x="106" y="58">
            i
          </tspan>
        </text>

        {/* Anel play — o "o" do "motion" */}
        <circle
          cx="143"
          cy="32"
          r="21"
          fill="none"
          stroke="#FF4D00"
          strokeWidth="3.5"
        />
        <polygon points="134,20 134,44 155,32" fill="#FF4D00" />

        {/* "n" */}
        <text
          fontFamily="'DM Sans'"
          fontSize="60"
          fontWeight="700"
          fill="#F5F5F5"
        >
          <tspan x="167" y="58" letterSpacing="-1">
            n
          </tspan>
        </text>

        {/* Ponto separador */}
        <circle cx="214" cy="58" r="4" fill="#FF4D00" />

        {/* "forge" — itálico, 42% de opacidade */}
        <text
          fontFamily="'DM Sans'"
          fontSize="60"
          fontWeight="700"
          fontStyle="italic"
          fill="rgba(245,245,245,0.42)"
        >
          <tspan x="224" y="58" letterSpacing="-1.5">
            forge
          </tspan>
        </text>
      </svg>
    )
  }

  /* ── Tamanho "hero" ───────────────────────────────────────── */
  return (
    <svg
      width="100%"
      height="96"
      viewBox="0 0 680 96"
      preserveAspectRatio="xMinYMid meet"
      aria-label="MotionForge"
      role="img"
      className={className}
    >
      {/* "mot" */}
      <text
        fontFamily="'DM Sans'"
        fontSize="80"
        fontWeight="700"
        fill="#F5F5F5"
      >
        <tspan x="0" y="76" letterSpacing="-1">
          mot
        </tspan>
      </text>

      {/* "i" */}
      <text
        fontFamily="'DM Sans'"
        fontSize="80"
        fontWeight="700"
        fill="#F5F5F5"
      >
        <tspan x="141" y="76">
          i
        </tspan>
      </text>

      {/* Anel play — hero */}
      <circle
        cx="191"
        cy="42"
        r="28"
        fill="none"
        stroke="#FF4D00"
        strokeWidth="4.5"
      />
      <polygon points="181,27 181,57 204,42" fill="#FF4D00" />

      {/* "n" */}
      <text
        fontFamily="'DM Sans'"
        fontSize="80"
        fontWeight="700"
        fill="#F5F5F5"
      >
        <tspan x="223" y="76" letterSpacing="-1">
          n
        </tspan>
      </text>

      {/* Ponto separador */}
      <circle cx="283" cy="76" r="5.5" fill="#FF4D00" />

      {/* "forge" — itálico, 42% de opacidade */}
      <text
        fontFamily="'DM Sans'"
        fontSize="80"
        fontWeight="700"
        fontStyle="italic"
        fill="rgba(245,245,245,0.42)"
      >
        <tspan x="294" y="76" letterSpacing="-2">
          forge
        </tspan>
      </text>
    </svg>
  )
}
