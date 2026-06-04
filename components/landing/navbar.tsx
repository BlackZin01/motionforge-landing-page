import { ArrowRight } from "lucide-react";

import { siteData } from "@/lib/site";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/6 bg-background/70 backdrop-blur-xl">
      <div className="container-shell">
        <div className="flex min-h-20 items-center justify-between gap-4 py-4 lg:grid lg:h-20 lg:grid-cols-[1fr_auto_1fr] lg:py-0">
          <nav className="hidden items-center gap-6 text-sm text-muted lg:flex">
            {siteData.nav.map((item) => (
              <a key={item.href} href={item.href} className="hover:text-white">
                {item.label}
              </a>
            ))}
          </nav>

          <a href="#hero" className="inline-flex items-center gap-3 lg:justify-self-center">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-primary/30 bg-primary/12 display-text text-lg font-semibold text-white shadow-[0_0_30px_rgba(159,51,255,0.16)]">
              M
            </span>
            <span className="display-text text-lg font-semibold tracking-[-0.04em] text-white">
              Motion<span className="text-primary">Forge</span>
            </span>
          </a>

          <div className="flex items-center justify-end gap-3">
            <a
              href="#planos"
              className="hidden rounded-full border border-white/10 px-4 py-2 text-sm text-muted hover:border-white/20 hover:text-white md:inline-flex"
            >
              Ver planos
            </a>
            <a
              href="#planos"
              className="btn-primary-mf group hidden items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black hover:bg-primary hover:text-white md:inline-flex"
            >
              Começar teste grátis
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
