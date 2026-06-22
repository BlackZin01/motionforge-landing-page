import { Nav } from "@/components/nav"
import { Hero } from "@/components/sections/hero"
import { ParaQuem } from "@/components/sections/para-quem"
import { Problema } from "@/components/sections/problema"
import { Manifesto } from "@/components/sections/manifesto"
import { ProvaSocial } from "@/components/sections/prova-social"
import { Objecao } from "@/components/sections/objecao"
import { Planos } from "@/components/sections/planos"
import { FAQ } from "@/components/sections/faq"
import { CTAFinal } from "@/components/sections/cta-final"
import { Footer } from "@/components/footer"
import { SectionDivider } from "@/components/ui/section-divider"
import { StickyCta } from "@/components/ui/sticky-cta"
import { ScrollProgressBar } from "@/components/ui/scroll-progress-bar"

export default function Home() {
  return (
    <main style={{ background: "var(--color-forge-black)" }}>
      <ScrollProgressBar />
      <Nav />
      <Hero />
      <SectionDivider glow />
      <ParaQuem />
      <SectionDivider />
      <Problema />
      <Manifesto />
      <SectionDivider glow />
      <ProvaSocial />
      <SectionDivider />
      <Objecao />
      <SectionDivider />
      <Planos />
      <SectionDivider />
      <FAQ />
      <SectionDivider glow />
      <CTAFinal />
      <Footer />
      <StickyCta />
    </main>
  )
}
