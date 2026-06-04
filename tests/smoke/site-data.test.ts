import { describe, expect, it } from "vitest";

import { siteData } from "@/lib/site";

describe("siteData", () => {
  it("keeps the hero and pricing model aligned with the approved offer", () => {
    expect(siteData.hero.primaryCta.label).toBe("Começar teste grátis");
    expect(siteData.pricing.highlightedPlan).toBe("Trimestral");
    expect(siteData.pricing.plans).toHaveLength(5);
    expect(siteData.pricing.extraCredits.title).toContain("Créditos");
  });
});
