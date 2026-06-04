import { SlidersHorizontal, Sparkles, Upload } from "lucide-react";

import { Reveal } from "@/components/landing/reveal";
import { SectionShell } from "@/components/landing/section-shell";
import { siteData } from "@/lib/site";

const icons = [Upload, SlidersHorizontal, Sparkles];

export function HowItWorks() {
  return (
    <SectionShell
      id="como-funciona"
      eyebrow="Fluxo em 3 passos"
      title="Do produto parado ao criativo pronto para rodar"
      description="A página precisa explicar o mecanismo rápido. Aqui a promessa vira processo operacional simples."
    >
      <div className="grid gap-5 lg:grid-cols-3">
        {siteData.steps.map((step, index) => {
          const Icon = icons[index];

          return (
            <Reveal key={step.number} delay={index * 0.08}>
              <article className="panel panel-hover rounded-[1.8rem] p-6">
                <div className="flex items-center justify-between">
                  <span className="display-text text-3xl font-semibold tracking-[-0.06em] text-white/88">
                    {step.number}
                  </span>
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/12 text-primary">
                    <Icon className="h-5 w-5" />
                  </span>
                </div>
                <h3 className="mt-8 display-text text-2xl font-semibold tracking-[-0.04em] text-white">
                  {step.title}
                </h3>
                <p className="mt-4 text-base leading-7 text-muted">{step.description}</p>
              </article>
            </Reveal>
          );
        })}
      </div>
    </SectionShell>
  );
}
