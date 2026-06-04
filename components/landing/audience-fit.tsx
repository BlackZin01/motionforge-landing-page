import { Boxes, Store, Users } from "lucide-react";

import { Reveal } from "@/components/landing/reveal";
import { SectionShell } from "@/components/landing/section-shell";
import { siteData } from "@/lib/site";

const icons = [Store, Users, Boxes];

export function AudienceFit() {
  return (
    <SectionShell
      eyebrow="Mercados atendidos"
      title="Primeiro para TikTok Shop, pronto para quem vive de criativo"
      description="O foco comercial principal continua em operações com volume, enquanto agência e marca entram como expansão natural."
    >
      <div className="grid gap-5 lg:grid-cols-3">
        {siteData.audiences.map((audience, index) => {
          const Icon = icons[index];
          const featured = index === 0;

          return (
            <Reveal key={audience.title} delay={index * 0.06}>
              <article
                className={`rounded-[1.8rem] p-6 ${
                  featured
                    ? "gradient-border panel panel-hover border-primary/20 bg-[linear-gradient(180deg,rgba(159,51,255,0.14),rgba(14,12,27,0.75))]"
                    : "panel panel-hover"
                }`}
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/7 text-white">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-8 display-text text-2xl font-semibold tracking-[-0.04em] text-white">
                  {audience.title}
                </h3>
                <p className="mt-4 text-base leading-7 text-muted">{audience.description}</p>
              </article>
            </Reveal>
          );
        })}
      </div>
    </SectionShell>
  );
}
