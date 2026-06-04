# MotionForge Landing Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the first production-quality `MotionForge.com.br` landing page in Next.js 15 with the approved premium-performance brand system and pricing flow.

**Architecture:** Create a fresh App Router project and implement the landing as a small set of focused sections backed by a shared token layer. Keep the page static-first, motion-enhanced, and ready for later analytics and checkout integrations.

**Tech Stack:** Next.js 15, TypeScript, Tailwind CSS v4, Motion, Lucide Icons

---

### Task 1: Scaffold the application shell

**Files:**
- Create: `package.json`
- Create: `app/layout.tsx`
- Create: `app/page.tsx`
- Create: `app/globals.css`
- Create: `tsconfig.json`
- Create: `next.config.ts`
- Create: `postcss.config.mjs`
- Create: `public/*`

- [ ] Step 1: Initialize a Next.js 15 + TypeScript project in `landing-page-next`
- [ ] Step 2: Install `motion` and `lucide-react`
- [ ] Step 3: Verify the default app runs locally

### Task 2: Define the brand token layer

**Files:**
- Modify: `landing-page-next/app/globals.css`
- Create: `landing-page-next/lib/site.ts`

- [ ] Step 1: Add CSS custom properties for MotionForge colors, spacing cues, shadows, and radii
- [ ] Step 2: Register type, CTA labels, nav items, pricing labels, and FAQs in a central data file
- [ ] Step 3: Verify the token layer is consumed by the page without hardcoded drift

### Task 3: Implement the page structure

**Files:**
- Modify: `landing-page-next/app/page.tsx`
- Create: `landing-page-next/components/landing/navbar.tsx`
- Create: `landing-page-next/components/landing/hero.tsx`
- Create: `landing-page-next/components/landing/credibility-strip.tsx`
- Create: `landing-page-next/components/landing/how-it-works.tsx`
- Create: `landing-page-next/components/landing/operator-benefits.tsx`
- Create: `landing-page-next/components/landing/audience-fit.tsx`
- Create: `landing-page-next/components/landing/comparison.tsx`
- Create: `landing-page-next/components/landing/pricing.tsx`
- Create: `landing-page-next/components/landing/extra-credits.tsx`
- Create: `landing-page-next/components/landing/faq.tsx`
- Create: `landing-page-next/components/landing/final-cta.tsx`
- Create: `landing-page-next/components/landing/footer.tsx`

- [ ] Step 1: Compose the landing page with one section component per responsibility
- [ ] Step 2: Keep the hero as the strongest visual anchor
- [ ] Step 3: Keep pricing and CTA hierarchy optimized for paid traffic

### Task 4: Add motion and responsive behavior

**Files:**
- Modify: `landing-page-next/components/landing/*.tsx`

- [ ] Step 1: Add a restrained hero entrance sequence
- [ ] Step 2: Add one scroll-linked depth or reveal effect
- [ ] Step 3: Ensure mobile layout preserves hierarchy before decoration

### Task 5: Add basic regression coverage

**Files:**
- Create: `landing-page-next/tests/smoke/site-data.test.ts`

- [ ] Step 1: Write a failing test for core site data invariants
- [ ] Step 2: Run the test and confirm it fails for the expected reason
- [ ] Step 3: Add the minimal code needed so the test passes
- [ ] Step 4: Re-run the test and confirm green

### Task 6: Validate production readiness

**Files:**
- Modify as needed based on validation output

- [ ] Step 1: Run lint or build validation for the whole app
- [ ] Step 2: Fix any type or build issues
- [ ] Step 3: Confirm the landing is ready for analytics and pixel wiring

