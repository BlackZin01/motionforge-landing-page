import { ArrowRight, Check } from "lucide-react";

import { Reveal } from "@/components/landing/reveal";
import { SectionShell } from "@/components/landing/section-shell";
import { siteData } from "@/lib/site";

export function Pricing() {
  return (
    <SectionShell
      id="planos"
      eyebrow="Oferta inicial"
      title="Teste grátis para provar valor. Planos por créditos para escalar."
      description="Sem inventar preço nesta etapa, a landing já estrutura o raciocínio comercial correto: baixa fricção para começar, mais valor em ciclos longos e recarga avulsa quando o volume apertar."
    >
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-5">
        {siteData.pricing.plans.map((plan, index) => {
          const highlighted = plan.name === siteData.pricing.highlightedPlan;

          return (
            <Reveal key={plan.name} delay={index * 0.04}>
              <article
                className={`panel-hover h-full rounded-[1.9rem] p-6 ${
                  highlighted
                    ? "gradient-border panel bg-[linear-gradient(180deg,rgba(159,51,255,0.16),rgba(14,12,27,0.88))]"
                    : "panel"
                }`}
              >
                <div className="min-h-12">
                  {plan.badge ? (
                    <span
                      className={`mb-4 inline-flex rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] ${
                        highlighted
                          ? "bg-white text-black"
                          : "border border-white/12 bg-white/6 text-white"
                      }`}
                    >
                      {plan.badge}
                    </span>
                  ) : (
                    <div className="mb-4 h-6" />
                  )}
                  <div>
                    <h3 className="display-text text-2xl font-semibold tracking-[-0.04em] text-white">
                      {plan.name}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-muted">{plan.description}</p>
                  </div>
                </div>

                <div className="mt-10">
                  <div className="display-text text-3xl font-semibold tracking-[-0.05em] text-white">
                    {plan.price}
                  </div>
                  <p className="mt-2 text-sm text-muted">{plan.detail}</p>
                </div>

                <div className="mt-8 space-y-3">
                  {plan.features.map((feature) => (
                    <div key={feature} className="flex items-start gap-3">
                      <Check className="mt-1 h-4 w-4 shrink-0 text-accent" />
                      <p className="text-sm leading-6 text-white/82">{feature}</p>
                    </div>
                  ))}
                </div>

                <a
                  href="#final-cta"
                  className={`group mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold ${
                    highlighted
                      ? "btn-primary-mf bg-white text-black hover:bg-accent hover:text-black"
                      : "btn-secondary-mf border border-white/12 bg-white/4 text-white hover:border-white/24 hover:bg-white/8"
                  }`}
                >
                  Escolher
                  <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                </a>
              </article>
            </Reveal>
          );
        })}
      </div>
    </SectionShell>
  );
}
