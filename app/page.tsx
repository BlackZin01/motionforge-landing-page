import { Nav } from "@/components/nav"
import { Hero } from "@/components/sections/hero"
import { ParaQuem } from "@/components/sections/para-quem"
import { Problema } from "@/components/sections/problema"
import { Mecanismo } from "@/components/sections/mecanismo"
import { Arsenal } from "@/components/sections/arsenal"
import { Workflows } from "@/components/sections/workflows"
import { ProvaSocial } from "@/components/sections/prova-social"
import { Objecao } from "@/components/sections/objecao"
import { Planos } from "@/components/sections/planos"
import { CTAFinal } from "@/components/sections/cta-final"
import { Footer } from "@/components/footer"
import { SectionDivider } from "@/components/ui/section-divider"

export default function Home() {
  return (
    <main style={{ background: "var(--color-forge-black)" }}>
      <Nav />
      <Hero />
      <SectionDivider glow />
      <ParaQuem />
      <SectionDivider />
      <Problema />
      <SectionDivider />
      <Mecanismo />
      <SectionDivider glow />
      <Arsenal />
      <SectionDivider />
      <Workflows />
      <SectionDivider glow />
      <ProvaSocial />
      <SectionDivider />
      <Objecao />
      <SectionDivider />
      <Planos />
      <SectionDivider glow />
      <CTAFinal />
      <Footer />
    </main>
  )
}
