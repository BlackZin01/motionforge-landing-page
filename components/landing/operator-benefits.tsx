import { Clock3, Target, Users, Zap } from "lucide-react";

import { Reveal } from "@/components/landing/reveal";
import { SectionShell } from "@/components/landing/section-shell";
import { siteData } from "@/lib/site";

const icons = [Users, Clock3, Zap, Target];

export function OperatorBenefits() {
  return (
    <SectionShell
      id="vantagens"
      eyebrow="Pensado para operação"
      title="O ganho não é só visual. É operacional."
      description="A landing precisa mostrar que o MotionForge mexe no ritmo da operação, não apenas na estética do criativo."
    >
      <div className="grid gap-5 lg:grid-cols-12">
        {siteData.benefits.map((benefit, index) => {
          const Icon = icons[index];
          const span =
            index === 0
              ? "lg:col-span-7"
              : index === 3
                ? "lg:col-span-7"
                : "lg:col-span-5";

          return (
            <Reveal key={benefit.title} className={span} delay={index * 0.06}>
              <article className="panel panel-hover h-full rounded-[1.9rem] p-7">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/12 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-10 display-text text-2xl font-semibold tracking-[-0.04em] text-white">
                  {benefit.title}
                </h3>
                <p className="mt-4 max-w-xl text-base leading-7 text-muted">
                  {benefit.description}
                </p>
              </article>
            </Reveal>
          );
        })}
      </div>
    </SectionShell>
  );
}
