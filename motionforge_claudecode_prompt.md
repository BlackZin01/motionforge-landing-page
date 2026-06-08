# MotionForge Claude Code Prompt

Cole aqui o prompt completo do arquivo anterior.

# MOTIONFORGE — LANDING PAGE
# Prompt para Claude Code · Versão definitiva

---

## MISSÃO

Desenvolva uma **landing page de alta conversão** para a MotionForge — plataforma SaaS de geração de UGC, imagens e vídeos com IA. O output é um projeto Next.js completo, pronto para deploy na Vercel.

---

## STACK OBRIGATÓRIA

```
Next.js 15        (App Router, TypeScript)
Tailwind CSS v4   (sem tailwind.config.ts — usar @theme inline)
shadcn/ui         (componentes base: Button, Badge, Card, Separator)
Framer Motion     (animações de scroll, reveal, counters)
GSAP + ScrollTrigger (animações de timeline e efeitos cinemáticos)
```

### Libs de componentes visuais (copiar e adaptar para o brandbook)
Usar como **referência de padrão de código e animação**, nunca como dependência:
- `ui.aceternity.com` — Background beams, Bento grid, Sparkles, Text reveal, Spotlight
- `magicui.design` — Marquee, Number ticker, Border beam, Animated gradient text
- `21st.dev` — Hero section dark, Pricing cards, Feature bento, Testimonial grid, Scroll morph hero

**Importante:** copiar apenas a lógica e adaptar 100% para o brandbook da MotionForge. Não importar pacotes Aceternity ou MagicUI — recriar os efeitos inline com Framer Motion/GSAP.

---

## ESTRUTURA DO PROJETO

```
motionforge-landing/
├── app/
│   ├── layout.tsx          (meta tags, pixels, fonts, globals)
│   ├── page.tsx            (composição de todas as seções)
│   └── globals.css         (tokens CSS do brandbook)
├── components/
│   ├── nav.tsx
│   ├── sections/
│   │   ├── hero.tsx
│   │   ├── para-quem.tsx
│   │   ├── problema.tsx
│   │   ├── mecanismo.tsx
│   │   ├── arsenal.tsx
│   │   ├── workflows.tsx
│   │   ├── prova-social.tsx
│   │   ├── objecao.tsx
│   │   ├── planos.tsx
│   │   └── cta-final.tsx
│   └── ui/
│       ├── logo.tsx         (SVG do logo como componente)
│       ├── cursor.tsx       (cursor laranja custom)
│       ├── number-ticker.tsx
│       ├── model-pill.tsx
│       └── workflow-card.tsx
├── lib/
│   ├── pixels.ts           (trackEvent unificado)
│   └── utils.ts
└── public/
    └── og-image.jpg
```

---

## BRANDBOOK — TOKENS CSS (globals.css)

```css
@import "tailwindcss";

@theme inline {
  --color-forge-black:   #0D0D0D;
  --color-forge-graphite:#1A1A1A;
  --color-forge-orange:  #FF4D00;
  --color-forge-white:   #F5F5F5;
  --color-forge-cyan:    #00E5FF;
  --color-forge-border:  rgba(255,255,255,0.06);
  --color-forge-muted:   rgba(245,245,245,0.4);

  --font-bebas:   'Bebas Neue', sans-serif;
  --font-sans:    'DM Sans', sans-serif;
  --font-mono:    'Space Grotesk', sans-serif;

  --ease-forge: cubic-bezier(0.22, 1, 0.36, 1);
  --duration-fast: 200ms;
  --duration-base: 300ms;
}

body {
  background: #0D0D0D;
  color: #F5F5F5;
  font-family: 'DM Sans', sans-serif;
}
```

### Regras de cor (NUNCA violar)
- Fundo sempre `#0D0D0D` ou `#1A1A1A`
- `#FF4D00` como acento — **máx 20% de área visível**
- Zero gradiente roxo/rosa, zero azul corporativo
- Métricas/números sempre em `Space Grotesk` + `#00E5FF`
- Bordas: `rgba(255,255,255,0.06)` padrão, `rgba(255,255,255,0.12)` hover
- Texto secundário: `rgba(245,245,245,0.4)`

### Tipografia
```
Headlines:  font-family Bebas Neue, letter-spacing 3px, line-height 1
Corpo/UI:   DM Sans 400 / 700
Métricas:   Space Grotesk 500 / 700
Labels:     DM Sans 700, 10px, uppercase, letter-spacing 2-4px
```

---

## LOGO SVG — COMPONENTE `logo.tsx`

```tsx
// Dois tamanhos: "nav" (126x20) e "hero" (full width)
export function Logo({ size = "nav" }: { size?: "nav" | "hero" }) {
  if (size === "nav") return (
    <svg width="126" height="20" viewBox="0 0 520 76" preserveAspectRatio="xMinYMid meet">
      <text fontFamily="'DM Sans'" fontSize="60" fontWeight="700" fill="#F5F5F5"><tspan x="0" y="58" letterSpacing="-1">mot</tspan></text>
      <text fontFamily="'DM Sans'" fontSize="60" fontWeight="700" fill="#F5F5F5"><tspan x="106" y="58">i</tspan></text>
      <circle cx="143" cy="32" r="21" fill="none" stroke="#FF4D00" strokeWidth="3.5"/>
      <polygon points="134,20 134,44 155,32" fill="#FF4D00"/>
      <text fontFamily="'DM Sans'" fontSize="60" fontWeight="700" fill="#F5F5F5"><tspan x="167" y="58" letterSpacing="-1">n</tspan></text>
      <circle cx="214" cy="58" r="4" fill="#FF4D00"/>
      <text fontFamily="'DM Sans'" fontSize="60" fontWeight="700" fontStyle="italic" fill="rgba(245,245,245,0.42)"><tspan x="224" y="58" letterSpacing="-1.5">forge</tspan></text>
    </svg>
  )
  return (
    <svg width="100%" height="96" viewBox="0 0 680 96" preserveAspectRatio="xMinYMid meet">
      <text fontFamily="'DM Sans'" fontSize="80" fontWeight="700" fill="#F5F5F5"><tspan x="0" y="76" letterSpacing="-1">mot</tspan></text>
      <text fontFamily="'DM Sans'" fontSize="80" fontWeight="700" fill="#F5F5F5"><tspan x="141" y="76">i</tspan></text>
      <circle cx="191" cy="42" r="28" fill="none" stroke="#FF4D00" strokeWidth="4.5"/>
      <polygon points="181,27 181,57 204,42" fill="#FF4D00"/>
      <text fontFamily="'DM Sans'" fontSize="80" fontWeight="700" fill="#F5F5F5"><tspan x="223" y="76" letterSpacing="-1">n</tspan></text>
      <circle cx="283" cy="76" r="5.5" fill="#FF4D00"/>
      <text fontFamily="'DM Sans'" fontSize="80" fontWeight="700" fontStyle="italic" fill="rgba(245,245,245,0.42)"><tspan x="294" y="76" letterSpacing="-2">forge</tspan></text>
    </svg>
  )
}
```

---

## PIXELS — `lib/pixels.ts` + `app/layout.tsx`

### `lib/pixels.ts`
```ts
export type PixelEvent =
  | "PageView"
  | "ViewContent"
  | "InitiateCheckout"
  | "Lead"

export interface TrackParams {
  value?: number
  currency?: string
  content_name?: string
}

export function trackEvent(event: PixelEvent, params: TrackParams = {}) {
  // Meta Pixel
  if (typeof window !== "undefined" && (window as any).fbq) {
    (window as any).fbq("track", event, params)
  }
  // TikTok Pixel
  if (typeof window !== "undefined" && (window as any).ttq) {
    (window as any).ttq.track(event, params)
  }
  // GA4
  if (typeof window !== "undefined" && (window as any).gtag) {
    (window as any).gtag("event", event, params)
  }
}
```

### Scripts no `app/layout.tsx` — dentro de `<head>`:

```tsx
{/* ═══ META PIXEL ═══ */}
<Script id="meta-pixel" strategy="afterInteractive">{`
  !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
  n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
  n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
  t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
  document,'script','https://connect.facebook.net/en_US/fbevents.js');
  fbq('init', 'META_PIXEL_ID_AQUI'); /* SUBSTITUIR */
  fbq('track', 'PageView');
`}</Script>
<noscript><img height="1" width="1" style={{display:"none"}}
  src="https://www.facebook.com/tr?id=META_PIXEL_ID_AQUI&ev=PageView&noscript=1"/></noscript>

{/* ═══ TIKTOK PIXEL ═══ */}
<Script id="tiktok-pixel" strategy="afterInteractive">{`
  !function(w,d,t){w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];
  ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"],
  ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};
  for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);
  ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},
  ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";
  ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=i,ttq._t=ttq._t||{},ttq._t[e]=+new Date,
  ttq._o=ttq._o||{},ttq._o[e]=n||{};var o=document.createElement("script");
  o.type="text/javascript",o.async=!0,o.src=i+"?sdkid="+e+"&lib="+t;
  var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(o,a)};
  ttq.load('TIKTOK_PIXEL_ID_AQUI'); /* SUBSTITUIR */
  ttq.page();
}(window,document,'ttq');
`}</Script>

{/* ═══ GA4 ═══ */}
<Script src="https://www.googletagmanager.com/gtag/js?id=GA4_ID_AQUI" strategy="afterInteractive"/>
<Script id="ga4-init" strategy="afterInteractive">{`
  window.dataLayer=window.dataLayer||[];
  function gtag(){dataLayer.push(arguments);}
  gtag('js',new Date());
  gtag('config','GA4_ID_AQUI'); /* SUBSTITUIR */
`}</Script>

{/* ═══ GTM ═══ */}
<Script id="gtm-head" strategy="afterInteractive">{`
  (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});
  var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';
  j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
  })(window,document,'script','dataLayer','GTM_ID_AQUI'); /* SUBSTITUIR */
`}</Script>
```

### Eventos por CTA
```ts
// Nav CTA
onClick={() => trackEvent("ViewContent", { content_name: "CTA Nav" })}

// Hero → VER PLANOS
onClick={() => trackEvent("InitiateCheckout", { content_name: "CTA Hero" })}

// Planos
onClick={() => trackEvent("InitiateCheckout", { value: 97,  currency: "BRL", content_name: "Starter" })}
onClick={() => trackEvent("InitiateCheckout", { value: 297, currency: "BRL", content_name: "Pro" })}
onClick={() => trackEvent("InitiateCheckout", { value: 797, currency: "BRL", content_name: "Agency" })}

// CTA final
onClick={() => trackEvent("Lead", { content_name: "CTA Final" })}
```

---

## ANIMAÇÕES — REGRAS FRAMER MOTION + GSAP

```ts
// Easing padrão
const EASE_FORGE = [0.22, 1, 0.36, 1]

// Scroll reveal — padrão para todas as seções
const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE_FORGE } }
}

// Stagger para listas de pills, steps, cards
const stagger = {
  visible: { transition: { staggerChildren: 0.07 } }
}

// Scale de entrada — headlines hero (estilo "forjado")
const forgeIn = {
  hidden: { opacity: 0, scale: 1.08 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: EASE_FORGE } }
}

// Number ticker — métricas animam de 0 ao valor
// Usar useMotionValue + useTransform + animate() do Framer Motion

// GSAP ScrollTrigger — timeline do Forge Engine (seção mecanismo)
// 4 steps entram sequencialmente com scrub leve conforme scroll

// Sempre respeitar:
@media (prefers-reduced-motion: reduce) {
  // desabilitar todas as animações
}
```

---

## SEÇÕES — CONTEÚDO E COMPORTAMENTO

### NAV `nav.tsx`
- Logo esquerda, links centro, CTA direita
- `position: sticky, top: 0, backdrop-filter: blur(16px)`, bg `rgba(13,13,13,0.97)`
- Links: `Para quem é` `Como funciona` `Arsenal` `Planos`
- Active state via IntersectionObserver: `border-bottom: 2px solid #FF4D00`
- Mobile: hamburger → menu overlay fullscreen `#0D0D0D`, links em Bebas Neue grande
- CTA: `COMEÇAR AGORA` — btn primário → `trackEvent("ViewContent", {content_name:"CTA Nav"})`

---

### HERO `hero.tsx`
**Efeito de fundo:** grid de linhas finas `rgba(255,255,255,0.03)` + spotlight laranja difuso no canto superior direito (CSS radial-gradient, sem lib)

```
[label 10px orange uppercase tracking-widest]
PARA TIKTOK SHOP E AGÊNCIAS DE CONTEÚDO

[Logo SVG tamanho hero — anima com forgeIn]

[headline Bebas Neue 64–96px responsive, forgeIn com delay 0.1s]
SEU PRODUTO. VÍDEO PRONTO. 60 SEGUNDOS.

[subtítulo DM Sans 18px muted, fadeUp delay 0.2s]
Da imagem ao UGC publicável — sem briefing, sem stack, sem espera.
Você escolhe o modelo. A MotionForge monta o workflow.

[linha 14px muted, fadeUp delay 0.3s]
Nano Banana Pro. Veo 3.1. Seedance. Kling. GPT Image 2. Tudo no mesmo lugar.

[CTAs lado a lado, fadeUp delay 0.4s]
→ [btn-primary] VER PLANOS
→ [btn-secondary] Ver como funciona

[social proof, fadeUp delay 0.5s]
Amado por 1.240 lojas e 87 agências de TikTok Shop.

[barra de métricas — border-top forge-border, 3 colunas]
[número animado Space Grotesk cyan] 4.800   label muted: vídeos gerados essa semana
[número animado Space Grotesk cyan] 1.240   label muted: lojas ativas
[número animado Space Grotesk cyan] 87      label muted: agências escalando
```

---

### PARA QUEM É `para-quem.tsx`
- 2 colunas desktop (gap border entre elas), stack mobile
- Col 1 — border-left 3px orange
- Col 2 — border-left 3px cyan
- Cada item de lista com ícone `—` em orange/cyan

```
Col 1:
[label orange] PARA DONOS DE LOJA
[headline Bebas Neue 40px] VOCÊ NÃO PRECISA DE EQUIPE.
[corpo 15px muted]
Sobs o produto, escolhe o modelo, define o workflow uma vez.
A MotionForge produz o volume que sua loja precisa.
• 50 variações de UGC por SKU
• Do produto ao vídeo em menos de 60s
• Sem editor. Sem briefing. Sem fila.

Col 2:
[label cyan] PARA AGÊNCIAS
[headline Bebas Neue 40px] ESCALE 20 CLIENTES SEM CONTRATAR.
[corpo 15px muted]
Workflows customizáveis por conta. Cada cliente, cada nicho, cada modelo.
• Workspaces separados por cliente
• Workflows reutilizáveis por conta
• Controle de modelo por projeto
```

---

### PROBLEMA `problema.tsx`
- Fundo `#1A1A1A`
- Card central com `border-left: 4px solid #FF4D00`, bg `rgba(255,77,0,0.05)`

```
[label orange] O PROBLEMA
[headline Bebas Neue 52px]
SEU STACK DE IA CRIOU UM GARGALO NOVO.

[corpo]
Gemini pro roteiro. Veo pro vídeo. HeyGen pro avatar. Canva pra thumbnail.
4 abas, 4 exports, 4 logins — e no final, 3 vídeos por semana.
A IA deveria acelerar. Virou trabalho.

[card destaque]
TikTok Shop pede 20 variações por SKU.
Você produz 3 por semana com o stack atual.

[blockquote — Bebas Neue 28px white, centralizado]
"E se cada produto que você sobe já saísse como vídeo pronto pra publicar
— com o modelo que você escolheu, no workflow que você montou?"

Não é mais uma ferramenta no seu stack. É o fim dele.
```

---

### MECANISMO `mecanismo.tsx`
- **GSAP ScrollTrigger:** conforme o usuário scrolla, cada step (01→04) acende — opacity 0.2→1, border-left inativa→orange
- Linha conectora vertical entre os steps anima de cima pra baixo (height 0→100%)

```
[label orange] O MECANISMO
[headline Bebas Neue] O FORGE ENGINE.

[corpo muted]
A MotionForge não usa um modelo de IA. Usa os melhores.
O Forge Engine conecta Nano Banana Pro, Veo 3.1, Seedance, Kling, GPT Image 2, Omni
em workflows que você monta uma vez e executa em escala.

[4 steps em coluna com linha conectora]
01 → Sobe o produto        — imagem, URL ou ficha. sem briefing.
02 → Escolhe o modelo      — Veo pra cinemático. Nano Banana pra imagem. Kling pra motion.
03 → Monta o workflow      — uma vez. reutilizável. por cliente, por SKU, por formato.
04 → Conteúdo pronto       — UGC, imagem e vídeo. 60 segundos. pronto pra publicar.
```

---

### ARSENAL `arsenal.tsx`
- **Bento grid** inspirado em Aceternity: cards de tamanhos variados em grid CSS
- Pills de modelos com hover orange
- Marquee horizontal infinito (estilo MagicUI) com logos/nomes dos modelos

```
[label orange] ARSENAL DE MODELOS
[headline Bebas Neue]
OS MELHORES MODELOS DO MERCADO.
UM ÚNICO LUGAR. VOCÊ NO CONTROLE.

[subtítulo]
Não escolhemos um modelo pra você e chamamos de "IA".
Você acessa e decide qual usar em cada etapa do workflow.

[bento grid — 3 categorias em cards graphite]

Card grande — VÍDEO (border-top 2px cyan)
Pills: Veo 3.1 Lite · Seedance 2.0 · Kling v3.0 Pro · Kling O1 · Hailuo 2.3 · Wan 2.7

Card médio — IMAGEM (border-top 2px orange)
Pills: Nano Banana Pro 4K · Nano Banana 2 · FLUX 2 Pro · Ideogram v3 · Imagen 4 Fast

Card pequeno — MULTIMODAL (border-top 2px muted)
Pills: GPT Image 2 · Omni

[nota inferior muted]
Novo modelo lançado? Disponível na plataforma. Seu workflow continua o mesmo.

[marquee infinito abaixo — todos os nomes de modelos em loop]
```

---

### WORKFLOWS `workflows.tsx`

```
[label orange] WORKFLOWS
[headline Bebas Neue]
VOCÊ MONTA. A MOTIONFORGE EXECUTA.
QUANTAS VEZES PRECISAR.

[corpo]
Configure o workflow uma vez — modelo, formato, estilo, saída.
Salve. Aplique para qualquer produto, qualquer cliente, qualquer volume.

[2 cards graphite com seta de fluxo animada — Framer Motion path draw]

Card 1 — LOJA DE MODA
Produto → Nano Banana Pro → Seedance → Omni (copy) → Publicar

Card 2 — AGÊNCIA MULTI-CLIENTE
Workspace do cliente → Veo 3.1 → Kling → Nano Banana Pro → Entrega

[linha destaque orange no final]
Seu concorrente está montando o briefing. Você já exportou.
```

---

### PROVA SOCIAL `prova-social.tsx`
- **4 métricas** em grid 2x2 com number ticker animado
- **2 depoimentos** em cards graphite, border-left orange
- Fundo `#0D0D0D` com grid de pontos `rgba(255,255,255,0.03)`

```
[grid 2x2 métricas]
[Space Grotesk cyan 52px] 4.800   vídeos gerados essa semana
[Space Grotesk cyan 52px] 1.240   lojas ativas
[Space Grotesk cyan 52px] 87      agências escalando
[Space Grotesk cyan 52px] 47      variações por SKU por sessão (média)

[depoimento 1 — card graphite, border-left 3px orange]
"Primeiro mês com a MotionForge: saímos de 8 para 61 vídeos por semana.
Mesmo time, mesmo orçamento."
— Carla Mendes · Head de Conteúdo · Agência Konversa · Moda feminina

[depoimento 2 — card graphite, border-left 3px orange]
"Montei o workflow em 20 minutos. Agora rodo 50 variações por produto
sem abrir outra ferramenta."
— Bruno Tavares · Dono de loja · NutriFit Shop · Suplementos · TikTok Shop BR
```

---

### OBJEÇÃO `objecao.tsx`
- Fundo `#1A1A1A`
- Comparação visual: 2 colunas `Outros vs MotionForge`

```
[label orange] JÁ OUVIU ISSO ANTES. A GENTE SABE.

[corpo]
"IA que gera vídeo em segundos" — você já testou 4 ferramentas com essa promessa.
A diferença aqui não é o modelo. É o workflow.

[comparação 2 colunas]
Col Outros (opacity 0.4, riscado):     Um modelo. Você se adapta a ele.
Col MotionForge (orange, bold):        Vários modelos. Você escolhe.
                                       Quando o mercado avança, você já estava lá.
```

---

### PLANOS `planos.tsx` — âncora `#planos`
- 3 cards em grid — card Pro tem `border: 2px solid #FF4D00`
- **Tabela de top-up** abaixo dos cards
- Toggle anual/mensal opcional (desconto 20%)

```
[label orange] PLANOS
[headline Bebas Neue] ESCOLHA O PLANO. ASSINOU, JÁ GERA.

[subtítulo muted]
Créditos não expiram enquanto a assinatura estiver ativa.
O que não usar esse mês, acumula pro próximo.

— STARTER — R$ 97/mês
1.000 créditos/mês · rollover até 2×
~500 imagens ou ~40 vídeos de 5s por mês
Para criadores solo testando UGC com IA
Modelos: Nano Banana 2 · FLUX 2 Dev · Ideogram v3 · Seedance 2.0 Fast · Wan 2.7
[btn-secondary] ASSINAR STARTER → trackEvent InitiateCheckout value:97

— PRO ★ — R$ 297/mês  [border orange 2px, badge "Mais popular"]
4.000 créditos/mês · rollover até 2×
~2.000 imagens ou ~110 vídeos de 5s por mês
Para afiliados e marcas que precisam de qualidade e volume
Modelos: Nano Banana Pro 4K · FLUX 2 Pro · Seedance 2.0 · Kling v3.0 Std · Hailuo 2.3 · Wan 2.7 · e mais
Inclui: first-frame / last-frame control · download em lote
[btn-primary] ASSINAR PRO → trackEvent InitiateCheckout value:297

— AGENCY — R$ 797/mês
14.000 créditos/mês · rollover até 3×
~7.000 imagens ou ~400 vídeos de 5s por mês
Para agências e operações de UGC em escala
Modelos: todos do Pro + Imagen 4 Fast · Kling O1 · Kling v3.0 Pro · Veo 3.1 Lite · e mais
Inclui: batch paralelo · Veo 3.1 + Kling O1 desbloqueados · suporte prioritário
[btn-secondary] ASSINAR AGENCY → trackEvent InitiateCheckout value:797

[tabela top-up]
TOP-UP DE CRÉDITOS — compra avulsa · top-up nunca expira
R$ 19  → 200 cr   R$ 0,095/cr
R$ 47  → 600 cr   R$ 0,078/cr
R$ 97  → 1.400 cr R$ 0,069/cr
R$ 197 → 3.200 cr R$ 0,061/cr  [badge Popular]
R$ 397 → 7.500 cr R$ 0,052/cr  [badge Melhor valor]
```

---

### CTA FINAL `cta-final.tsx`
- Fundo com beam de luz laranja vindo de cima (CSS + Framer Motion opacity pulse)

```
[headline Bebas Neue 80px+ centralizado]
FORGE YOUR CONTENT

[subtítulo]
Você escolhe o modelo. Você monta o workflow. Você controla o volume.
Assinou, já gera.

[CTAs centralizados]
[btn-primary] VER PLANOS → scroll para #planos + trackEvent Lead
[btn-secondary] Ver como funciona

[2 linhas contexto muted]
Para donos de loja: Assina o Starter, sobe o primeiro produto, vê o resultado em 60 segundos.
Para agências: Assina o Agency, cria os workspaces dos seus clientes, entrega essa semana.
```

---

### FOOTER
```
Logo nav · © 2025 MotionForge. Todos os direitos reservados.
Links: Termos · Privacidade · Contato
```

---

## COMPONENTES EXTRAS

### Cursor custom `cursor.tsx` (desktop only)
```tsx
// Círculo 16px border #FF4D00, background transparent
// Segue mouse com lerp suave (Framer Motion useMotionValue + useSpring)
// Hover em <a> e <button>: scale para 2.5x, bg rgba(255,77,0,0.12)
// Desativado em touch devices: useEffect com matchMedia pointer:coarse
```

### Model pill `model-pill.tsx`
```tsx
// pill com hover: border-color #FF4D00, color #FF4D00
// Variante "img" (border/text teal) e "vid" (border/text azul escuro)
// transition 200ms ease
```

---

## SEO — `app/layout.tsx`

```tsx
export const metadata: Metadata = {
  title: "MotionForge — Seu produto. Vídeo pronto. 60 segundos.",
  description: "De produto a UGC publicável em 60 segundos. Nano Banana Pro, Veo 3.1, Seedance, Kling — os melhores modelos de IA em um único workflow. Planos a partir de R$ 97/mês.",
  openGraph: {
    title: "MotionForge — Conteúdo que vende.",
    description: "Gere UGC, imagens 4K e vídeos com os melhores modelos de IA. Um workflow. Escala real.",
    images: ["/og-image.jpg"],
    type: "website",
  },
  twitter: { card: "summary_large_image" },
}
```

---

## RESPONSIVIDADE

```
Mobile-first. Breakpoints Tailwind:
sm:  640px  — ajustes menores
md:  768px  — 2 colunas em para-quem, planos stack → 3 colunas
lg: 1024px  — desktop completo, max-w-7xl mx-auto px-6
xl: 1280px  — headlines maiores, mais espaço generoso

Mobile específico:
- Nav: logo + hamburger, menu overlay z-50 bg-forge-black
- Hero: headline 48px, CTAs 100% width empilhados
- Arsenal: pills em flex-wrap normal
- Planos: stack vertical, sem carousel
- Cursor custom: desativado
- Métricas hero: 2 colunas
```

---

## DEPLOY — `vercel.json`

```json
{
  "buildCommand": "next build",
  "devCommand": "next dev",
  "installCommand": "npm install",
  "framework": "nextjs"
}
```

---

## CHECKLIST FINAL (verificar antes de commitar)

- [ ] Tokens CSS do brandbook aplicados — zero hardcode de cor fora das variáveis
- [ ] Logo SVG com especificações exatas (gaps, raio do anel, opacidade "forge")
- [ ] Meta Pixel, TikTok Pixel, GA4 e GTM inicializados no layout
- [ ] `trackEvent()` disparando para todos os pixels nos 5+ CTAs
- [ ] Placeholders marcados com `/* SUBSTITUIR */` ou `_AQUI`
- [ ] Framer Motion scroll reveal em todas as seções
- [ ] GSAP ScrollTrigger no Forge Engine (mecanismo)
- [ ] Number ticker nos 3 contadores do hero e 4 métricas de prova social
- [ ] Cursor laranja custom desativado em touch
- [ ] Marquee de modelos no Arsenal
- [ ] Hamburger menu funcional e acessível no mobile
- [ ] `prefers-reduced-motion` implementado globalmente
- [ ] Responsive testado em 375px, 768px e 1280px
- [ ] `vercel.json` presente na raiz
