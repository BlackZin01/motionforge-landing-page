# Brandbook — Tokens e Regras Visuais

Aplicar estas regras em QUALQUER arquivo do projeto.
Violações de cor ou tipografia devem ser corrigidas antes de commitar.

## Paleta de cores

| Token CSS                  | Hex                       | Uso                               |
|----------------------------|---------------------------|-----------------------------------|
| `--color-forge-black`      | `#0D0D0D`                 | Fundo primário                    |
| `--color-forge-graphite`   | `#1A1A1A`                 | Fundo secundário, cards           |
| `--color-forge-orange`     | `#FF4D00`                 | CTA, acentos — máx 20% de área   |
| `--color-forge-white`      | `#F5F5F5`                 | Texto primário                    |
| `--color-forge-cyan`       | `#00E5FF`                 | Métricas, destaques de dados      |
| `--color-forge-border`     | `rgba(255,255,255,0.06)`  | Bordas padrão                     |
| `--color-forge-muted`      | `rgba(245,245,245,0.4)`   | Texto secundário                  |

Regras absolutas:
- Fundo SEMPRE escuro: `#0D0D0D` ou `#1A1A1A`
- ZERO gradiente roxo/rosa ou azul corporativo
- Orange como acento — nunca dominante
- Métricas/números em Space Grotesk + cyan

## Tipografia

| Uso              | Font          | Weight  | Observação                          |
|------------------|---------------|---------|-------------------------------------|
| Headlines        | Bebas Neue    | 400     | letter-spacing: 3px, line-height: 1 |
| Corpo / UI       | DM Sans       | 400/700 | —                                   |
| Métricas / mono  | Space Grotesk | 500/700 | sempre com cyan                     |
| Labels uppercase | DM Sans       | 700     | 10px, uppercase, tracking: 2-4px    |

## Logo SVG

Usar sempre o componente `components/ui/logo.tsx`. Nunca:
- Aplicar sombra, gradiente ou efeito 3D no logo
- Separar o anel (play icon) do wordmark
- Alterar a opacidade do "forge" (42% dark)
- Usar versão rasterizada (.png/.jpg)

## Botões

```tsx
// Primário — Combustion
<button className="bg-forge-orange text-white font-bold text-sm uppercase
  tracking-wide px-7 py-3.5 transition-opacity duration-200 hover:opacity-88">

// Secundário — outline
<button className="bg-transparent text-forge-white border border-white/22
  font-bold text-sm uppercase tracking-wide px-7 py-3.5
  transition-colors duration-200 hover:border-white/60">
```

## Animações

```ts
const EASE_FORGE = [0.22, 1, 0.36, 1]

// Scroll reveal padrão — usar em todas as seções
const fadeUp = {
  hidden:  { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE_FORGE } }
}

// Entrada impactante — headlines hero
const forgeIn = {
  hidden:  { opacity: 0, scale: 1.08 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: EASE_FORGE } }
}
```

Sempre incluir reduced motion:
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```