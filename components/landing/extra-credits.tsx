import { Plus } from "lucide-react";

import { Reveal } from "@/components/landing/reveal";
import { siteData } from "@/lib/site";

export function ExtraCredits() {
  return (
    <section className="pb-20 sm:pb-24">
      <div className="container-shell">
        <Reveal>
          <div className="gradient-border panel rounded-[2rem] p-8 sm:p-10">
            <div className="grid gap-6 lg:grid-cols-[0.8fr_1fr_auto] lg:items-center">
              <div>
                <span className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">
                  Recarga avulsa
                </span>
                <h2 className="mt-4 display-text text-3xl font-semibold tracking-[-0.05em] text-white">
                  {siteData.pricing.extraCredits.title}
                </h2>
              </div>
              <p className="max-w-2xl text-base leading-7 text-muted">
                {siteData.pricing.extraCredits.description}
              </p>
              <a
                href="#final-cta"
                className="btn-secondary-mf group inline-flex items-center justify-center gap-2 rounded-full border border-white/12 bg-white/5 px-5 py-3 text-sm font-semibold text-white hover:border-white/24 hover:bg-white/8"
              >
                Ver como funciona
                <Plus className="h-4 w-4 transition-transform duration-200 group-hover:rotate-90" />
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
