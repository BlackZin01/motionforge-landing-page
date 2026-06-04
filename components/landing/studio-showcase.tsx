import { BadgeCheck, Layers3, Rocket } from "lucide-react";

import { Reveal } from "@/components/landing/reveal";
import { SectionShell } from "@/components/landing/section-shell";

const rails = [
  "Entrada do produto",
  "Prompt guiado por objetivo",
  "Modelos por caso de uso",
  "Saídas pensadas para teste",
];

export function StudioShowcase() {
  return (
    <SectionShell
      eyebrow="Forge Studio"
      title="Uma interface pensada para quem precisa rodar volume"
      description="O produto não pode parecer um playground de IA. Ele precisa parecer uma estação de produção que acelera a operação."
      align="left"
    >
      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <Reveal className="space-y-6">
          <div className="panel panel-hover rounded-[2rem] p-7">
            <div className="flex items-center gap-3 text-sm font-medium text-white">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/12 text-primary">
                <Layers3 className="h-5 w-5" />
              </span>
              Fluxo organizado para time, operador e gestor
            </div>
            <div className="mt-8 space-y-4">
              {rails.map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-4 rounded-2xl border border-white/8 bg-white/3 px-4 py-4"
                >
                  <span className="h-2 w-2 rounded-full bg-accent" />
                  <span className="text-sm text-white">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="panel panel-hover rounded-[2rem] p-5">
            <div className="grid gap-4 md:grid-cols-[1.05fr_0.95fr]">
              <div className="rounded-[1.65rem] border border-white/8 bg-[#090711] p-5">
                <p className="text-xs uppercase tracking-[0.25em] text-muted">Workspace</p>
                <h3 className="mt-3 display-text text-3xl font-semibold tracking-[-0.04em] text-white">
                  Mais saídas por briefing
                </h3>
                <p className="mt-4 max-w-md text-base leading-7 text-muted">
                  O valor não está apenas na geração. Está no quanto a operação consegue testar sem travar o time.
                </p>
              </div>

              <div className="space-y-4">
                <div className="rounded-[1.65rem] border border-white/8 bg-primary/10 p-5">
                  <div className="flex items-center gap-3 text-sm font-medium text-white">
                    <BadgeCheck className="h-4 w-4 text-accent" />
                    Prompt com objetivo
                  </div>
                  <p className="mt-3 text-sm leading-6 text-muted">
                    Hook, review, prova e CTA em uma única direção criativa.
                  </p>
                </div>
                <div className="rounded-[1.65rem] border border-white/8 bg-white/4 p-5">
                  <div className="flex items-center gap-3 text-sm font-medium text-white">
                    <Rocket className="h-4 w-4 text-primary" />
                    Output pronto para subir
                  </div>
                  <p className="mt-3 text-sm leading-6 text-muted">
                    Menos retrabalho visual e mais tempo para encontrar o criativo vencedor.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </SectionShell>
  );
}
