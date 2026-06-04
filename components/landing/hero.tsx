"use client";

import {
  ArrowRight,
  BadgeCheck,
  Film,
  ImageIcon,
  Play,
  SlidersHorizontal,
  Upload,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";

import { siteData } from "@/lib/site";

export function Hero() {
  return (
    <section id="hero" className="relative pt-12 sm:pt-16">
      <div className="container-shell">
        <div className="grid min-h-[calc(100svh-6rem)] items-center gap-14 py-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:py-16">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="max-w-2xl"
          >
            <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.28em] text-primary">
              <Zap className="h-3.5 w-3.5" />
              {siteData.hero.eyebrow}
            </span>

            <h1 className="display-text max-w-4xl text-5xl font-semibold tracking-[-0.06em] text-white sm:text-6xl md:text-7xl">
              {siteData.hero.title}
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-muted sm:text-xl">
              {siteData.hero.subtitle}
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <a
                href={siteData.hero.primaryCta.href}
                className="btn-primary-mf group inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-black hover:bg-primary hover:text-white"
              >
                <span>{siteData.hero.primaryCta.label}</span>
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
              </a>
              <a
                href={siteData.hero.secondaryCta.href}
                className="btn-secondary-mf inline-flex items-center justify-center gap-2 rounded-full border border-white/12 bg-white/3 px-6 py-3.5 text-sm font-semibold text-white hover:border-white/24 hover:bg-white/6"
              >
                {siteData.hero.secondaryCta.label}
              </a>
            </div>

            <p className="mt-4 text-sm text-muted">{siteData.hero.microcopy}</p>

            <div className="mt-10 grid gap-4 border-t border-white/10 pt-6 sm:grid-cols-3">
              {siteData.hero.metrics.map((metric) => (
                <div key={metric.label}>
                  <div className="display-text text-2xl font-semibold text-white sm:text-3xl">
                    {metric.value}
                  </div>
                  <p className="mt-2 text-sm leading-6 text-muted">{metric.label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.12, ease: "easeOut" }}
            className="relative"
          >
            <div className="absolute -inset-12 rounded-full bg-primary/12 blur-[120px]" />
            <div className="panel gradient-border relative overflow-hidden rounded-[2rem] p-4 sm:p-5">
              <div className="mb-4 flex items-center justify-between rounded-[1.35rem] border border-white/8 bg-white/4 px-4 py-3">
                <div className="flex items-center gap-3">
                  <span className="flex gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-white/25" />
                    <span className="h-2.5 w-2.5 rounded-full bg-white/18" />
                    <span className="h-2.5 w-2.5 rounded-full bg-primary/70" />
                  </span>
                  <span className="text-sm font-medium text-white">MotionForge Studio</span>
                </div>
                <span className="inline-flex items-center gap-2 rounded-full border border-accent/25 bg-accent/10 px-3 py-1 text-xs text-accent">
                  <span className="h-2 w-2 rounded-full bg-accent" />
                  IA ativa
                </span>
              </div>

              <div className="grid gap-4 lg:grid-cols-[1.08fr_0.92fr]">
                <div className="rounded-[1.5rem] border border-white/8 bg-[#090712] p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.24em] text-muted">Input do produto</p>
                      <h2 className="mt-2 text-lg font-semibold text-white">Upload e prompt guiado</h2>
                    </div>
                    <span className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs text-primary">
                      MVP
                    </span>
                  </div>

                  <div className="mt-5 rounded-[1.35rem] border border-dashed border-primary/28 bg-primary/8 p-5">
                    <div className="flex items-center gap-3 text-sm font-medium text-white">
                      <Upload className="h-4 w-4 text-primary" />
                      Foto do produto pronta para gerar
                    </div>
                    <div className="mt-4 flex h-52 items-center justify-center rounded-[1.1rem] border border-white/6 bg-[linear-gradient(180deg,#1d1336_0%,#0f0c1e_100%)]">
                      <div className="flex h-28 w-28 items-center justify-center rounded-[1.75rem] border border-white/10 bg-white/6">
                        <div className="rounded-[1.2rem] border border-white/12 bg-white px-6 py-4 text-center text-[11px] font-semibold uppercase tracking-[0.24em] text-black">
                          Produto
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-[1.15rem] border border-white/8 bg-white/4 p-4">
                      <div className="flex items-center gap-2 text-sm font-medium text-white">
                        <SlidersHorizontal className="h-4 w-4 text-primary" />
                        Modelo
                      </div>
                      <p className="mt-3 text-sm text-muted">UGC Review High CTR</p>
                    </div>
                    <div className="rounded-[1.15rem] border border-white/8 bg-white/4 p-4">
                      <div className="flex items-center gap-2 text-sm font-medium text-white">
                        <BadgeCheck className="h-4 w-4 text-accent" />
                        Prompt
                      </div>
                      <p className="mt-3 text-sm text-muted">Gancho rapido, review e CTA final.</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="rounded-[1.5rem] border border-white/8 bg-white/4 p-4">
                    <div className="flex items-center justify-between text-sm text-muted">
                      <span>Geração</span>
                      <span>72%</span>
                    </div>
                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/8">
                      <motion.div
                        initial={{ width: "20%" }}
                        animate={{ width: "72%" }}
                        transition={{ duration: 2.4, repeat: Infinity, repeatType: "reverse" }}
                        className="h-full rounded-full bg-[linear-gradient(90deg,#9f33ff_0%,#00f0ff_100%)]"
                      />
                    </div>
                  </div>

                  <div className="rounded-[1.5rem] border border-white/8 bg-[#080611] p-4">
                    <div className="flex items-center gap-2 text-sm font-medium text-white">
                      <Play className="h-4 w-4 text-primary" />
                      Preview do criativo
                    </div>
                    <div className="mt-4 rounded-[1.2rem] border border-white/8 bg-[linear-gradient(180deg,rgba(159,51,255,0.15),rgba(14,12,27,0.7))] p-4">
                      <div className="flex items-center justify-between text-xs uppercase tracking-[0.22em] text-muted">
                        <span>Saída</span>
                        <span>UGC + imagem</span>
                      </div>
                      <div className="mt-4 space-y-3">
                        <div className="flex items-center gap-3 rounded-2xl border border-white/8 bg-white/5 p-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15">
                            <Film className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-white">Video curto para hook</p>
                            <p className="text-xs text-muted">Hook, prova e CTA em um fluxo</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 rounded-2xl border border-white/8 bg-white/5 p-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/12">
                            <ImageIcon className="h-5 w-5 text-accent" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-white">Imagem para criativo estático</p>
                            <p className="text-xs text-muted">Variação pronta para teste de thumb</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
