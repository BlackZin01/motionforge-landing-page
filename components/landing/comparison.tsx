import { Check, Minus } from "lucide-react";

import { Reveal } from "@/components/landing/reveal";
import { SectionShell } from "@/components/landing/section-shell";
import { siteData } from "@/lib/site";

export function Comparison() {
  return (
    <SectionShell
      eyebrow="Manual vs MotionForge"
      title="Quando a produção depende de processo lento, a mídia paga o preço"
      description="A comparação precisa deixar óbvio que o gargalo está na velocidade de geração e não apenas no design do criativo."
    >
      <div className="grid gap-5 lg:grid-cols-2">
        <Reveal>
          <article className="panel panel-hover rounded-[2rem] p-7">
            <span className="text-xs font-semibold uppercase tracking-[0.26em] text-muted">
              Fluxo manual
            </span>
            <h3 className="mt-4 display-text text-3xl font-semibold tracking-[-0.05em] text-white">
              Menos testes, mais atraso
            </h3>
            <div className="mt-8 space-y-4">
              {siteData.comparison.manual.map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-3 rounded-2xl border border-white/8 bg-white/3 px-4 py-4"
                >
                  <Minus className="mt-1 h-4 w-4 text-muted" />
                  <p className="text-sm leading-6 text-muted">{item}</p>
                </div>
              ))}
            </div>
          </article>
        </Reveal>

        <Reveal delay={0.06}>
          <article className="gradient-border panel panel-hover rounded-[2rem] bg-[linear-gradient(180deg,rgba(159,51,255,0.12),rgba(14,12,27,0.75))] p-7">
            <span className="text-xs font-semibold uppercase tracking-[0.26em] text-primary">
              Com MotionForge
            </span>
            <h3 className="mt-4 display-text text-3xl font-semibold tracking-[-0.05em] text-white">
              Mais volume criativo sem ampliar o caos
            </h3>
            <div className="mt-8 space-y-4">
              {siteData.comparison.motionforge.map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-3 rounded-2xl border border-primary/16 bg-white/4 px-4 py-4"
                >
                  <Check className="mt-1 h-4 w-4 text-accent" />
                  <p className="text-sm leading-6 text-white/88">{item}</p>
                </div>
              ))}
            </div>
          </article>
        </Reveal>
      </div>
    </SectionShell>
  );
}
