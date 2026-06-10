/* Dispara para Meta Pixel, TikTok Pixel e GA4 simultaneamente */

export type PixelEvent =
  | "PageView"
  | "ViewContent"
  | "InitiateCheckout"
  | "Lead"
  | "Login"
  | "CompleteRegistration"

export interface TrackParams {
  value?: number
  currency?: string
  content_name?: string
  method?: string
}

export function trackEvent(event: PixelEvent, params: TrackParams = {}): void {
  if (typeof window === "undefined") return

  const win = window as Window &
    typeof globalThis & {
      fbq?: (...args: unknown[]) => void
      ttq?: { track: (...args: unknown[]) => void }
      gtag?: (...args: unknown[]) => void
    }

  if (win.fbq) win.fbq("track", event, params)
  if (win.ttq) win.ttq.track(event, params)
  if (win.gtag) win.gtag("event", event, params)
}
