# Pixels de Rastreamento — Eventos por CTA

Todos os CTAs DEVEM chamar `trackEvent()` de `@/lib/pixels.ts`.
Nunca remover ou comentar estas chamadas.

## IDs dos pixels (substituir antes do go-live)

```
META_PIXEL_ID_AQUI    → ID do Meta Pixel (Facebook/Instagram Ads)
TIKTOK_PIXEL_ID_AQUI  → ID do TikTok Pixel
GA4_ID_AQUI           → Measurement ID do Google Analytics 4 (ex: G-XXXXXXXXXX)
GTM_ID_AQUI           → Container ID do Google Tag Manager (ex: GTM-XXXXXXX)
```

## Mapeamento de eventos

| CTA                     | Evento             | Params                                                     |
|-------------------------|--------------------|------------------------------------------------------------|
| Nav "COMEÇAR AGORA"     | `ViewContent`      | `{ content_name: "CTA Nav" }`                              |
| Hero "VER PLANOS"       | `InitiateCheckout` | `{ content_name: "CTA Hero" }`                             |
| Hero "Ver como funciona"| `ViewContent`      | `{ content_name: "Como funciona" }`                        |
| Plano Starter           | `InitiateCheckout` | `{ value: 97,  currency: "BRL", content_name: "Starter" }`|
| Plano Pro               | `InitiateCheckout` | `{ value: 297, currency: "BRL", content_name: "Pro" }`    |
| Plano Agency            | `InitiateCheckout` | `{ value: 797, currency: "BRL", content_name: "Agency" }` |
| CTA Final "VER PLANOS"  | `Lead`             | `{ content_name: "CTA Final" }`                            |

## Função trackEvent

```ts
// lib/pixels.ts — dispara para TODOS os pixels simultaneamente
export function trackEvent(event: string, params: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return
  if ((window as any).fbq) (window as any).fbq("track", event, params)
  if ((window as any).ttq) (window as any).ttq.track(event, params)
  if ((window as any).gtag) (window as any).gtag("event", event, params)
}
```