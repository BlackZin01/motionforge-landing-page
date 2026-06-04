# MotionForge Landing Page Design Spec

**Date:** 2026-06-04

## Goal

Design and build the launch landing page for `MotionForge.com.br` as a high-conversion sales page for TikTok Shop operators running volume, while keeping the brand premium, fast, and product-led.

## Product Context

`MotionForge` is an AI SaaS that turns product photos into UGC-style videos and images for TikTok Shop workflows. The initial landing page must sell the product before the app itself is fully mature.

## Primary Audience

- TikTok Shop operations with volume

## Secondary Audiences

- Agencies and creative operators
- E-commerce and infoproduct teams without a large in-house creative team

## Conversion Strategy

The primary CTA is `Começar teste grátis`.

The page must support a mixed monetization model:

- limited free trial
- recurring subscriptions based on credits
- monthly, quarterly, semiannual, and annual billing options
- extra credit top-ups as an add-on

The trial should be intentionally constrained by:

- limited credits
- premium models locked

## Brand Direction

The brand posture is `premium + performance`.

The page should feel:

- fast
- powerful
- cinematic
- conversion-oriented
- premium without becoming vague or overdesigned

## Core Promise

`Gere mais criativos em menos tempo.`

## Supporting Value Props

- increase creative testing volume
- reduce production bottlenecks
- shorten the path from product photo to live ad
- centralize creative generation in one interface

## Tone of Voice

- direct
- sharp
- operator-friendly
- ROI-aware
- avoids generic AI hype

Preferred vocabulary:

- criativos
- escala
- operação
- testes
- velocidade
- volume
- performance

## Visual Identity

### Palette

- Background: `#05030B`
- Surface: `#0E0C1B`
- Primary: `#9F33FF`
- Accent: `#00F0FF`
- Heading text: `#FFFFFF`
- Body text: `#A3A3C2`

### Typography

- Heading: `Outfit`
- Body/UI: `Inter`

### Composition Rules

- full-bleed hero feel
- large typography
- restrained glass surfaces
- one dominant visual idea per section
- no generic SaaS card overload
- pricing must be highly legible

## Reference Direction

Validated public references on 2026-06-04:

- [MotionSites](https://motionsites.ai/) for premium hero rhythm and motion-led product framing
- [Higgsfield](https://higgsfield.ai/) for AI-premium atmosphere and product intensity

The user also cited Ayla Systems as a desired reference family, but the exact public page was not validated during this pass.

## Landing Architecture

1. Sticky navbar
2. Hero with product mockup
3. Credibility/context strip
4. How it works in 3 steps
5. Product preview / forge studio section
6. Benefits for TikTok Shop operators
7. Secondary audience fit
8. Manual vs MotionForge comparison
9. Pricing section
10. Extra credits section
11. FAQ
12. Final CTA
13. Footer

## Hero Requirements

- Eyebrow: product category and market
- Headline centered on speed and output volume
- Subheadline explaining the core workflow
- Primary CTA: `Começar teste grátis`
- Secondary CTA: `Ver planos`
- Product mockup showing upload, model selection, prompt, and result preview

## Pricing Requirements

Pricing must communicate:

- low-friction trial entry
- accessible starting point
- better value on longer cycles
- extra credits without forced upgrade

Recommended emphasis:

- quarterly plan highlighted as recommended

## Tracking Requirements

The implementation must be prepared for:

- Meta Pixel
- TikTok Pixel
- GA4
- UTM capture
- CTA and pricing interaction events

Minimum events:

- `view_pricing`
- `start_trial_click`
- `plan_select`
- `checkout_start`
- `purchase`

## Technical Direction

- Next.js 15
- TypeScript
- Tailwind CSS v4
- Motion
- Lucide Icons
- shadcn/ui only for utility primitives where helpful

## Deliverable

A responsive, production-ready marketing landing page optimized for paid traffic, product clarity, and trial conversion, using the approved MotionForge brand direction.
