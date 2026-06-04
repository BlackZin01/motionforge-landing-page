import { ArrowRight } from "lucide-react";

import { Reveal } from "@/components/landing/reveal";
import { siteData } from "@/lib/site";

export function FinalCta() {
  return (
    <section id="final-cta" className="pb-24">
      <div className="container-shell">
        <Reveal>
          <div className="gradient-border panel overflow-hidden rounded-[2.35rem] px-7 py-10 sm:px-10 sm:py-14">
            <div className="grid gap-8 lg:grid-cols-[1.1fr_auto] lg:items-end">
              <div>
                <span className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">
                  Pronto para lançar
                </span>
                <h2 className="mt-4 display-text max-w-4xl text-4xl font-semibold tracking-[-0.05em] text-white sm:text-5xl">
                  {siteData.finalCta.title}
                </h2>
                <p className="mt-5 max-w-2xl text-lg leading-8 text-muted">
                  {siteData.finalCta.description}
                </p>
              </div>

              <a
                href={siteData.finalCta.primaryCta.href}
                className="btn-primary-mf group inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-black hover:bg-primary hover:text-white"
              >
                {siteData.finalCta.primaryCta.label}
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
