import { ChevronRight } from "lucide-react";

import { Reveal } from "@/components/landing/reveal";
import { SectionShell } from "@/components/landing/section-shell";
import { siteData } from "@/lib/site";

export function Faq() {
  return (
    <SectionShell
      id="faq"
      eyebrow="Objeções de compra"
      title="Perguntas que precisam estar respondidas antes do clique"
      description="A FAQ ajuda a limpar as dúvidas de trial, créditos, upgrade e adequação de uso sem poluir a hero."
    >
      <Reveal className="mx-auto max-w-4xl">
        <div className="space-y-4">
          {siteData.faq.map((item) => (
            <details
              key={item.question}
              className="panel panel-hover group rounded-[1.6rem] p-0"
            >
              <summary className="flex cursor-pointer items-center justify-between gap-6 px-6 py-5">
                <span className="display-text text-xl font-medium tracking-[-0.03em] text-white">
                  {item.question}
                </span>
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
                  <ChevronRight className="h-5 w-5 text-muted transition-transform group-open:rotate-90" />
                </span>
              </summary>
              <div className="border-t border-white/8 px-6 pb-6 pt-5">
                <p className="max-w-3xl text-base leading-7 text-muted">{item.answer}</p>
              </div>
            </details>
          ))}
        </div>
      </Reveal>
    </SectionShell>
  );
}
