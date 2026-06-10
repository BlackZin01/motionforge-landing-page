"use client"

import { useState } from "react"
import type { Variants } from "framer-motion"
import { motion, AnimatePresence } from "framer-motion"

/* ── Variantes ──────────────────────────────────────────────── */
const EASE = [0.22, 1, 0.36, 1] as const

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [...EASE] } },
}

const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
}

/* ── Dados ──────────────────────────────────────────────────── */
const FAQS = [
  {
    q: "Preciso saber editar vídeo ou usar CapCut?",
    a: "Não. Você só sobe o produto e monta o workflow uma vez. A MotionForge gera o vídeo completo — corte, transição, música e legenda inclusos. Sem timeline, sem camadas pra arrastar.",
  },
  {
    q: "Funciona para produto físico de TikTok Shop?",
    a: "É exatamente pra isso que foi construída. Cole a URL do produto, sobe a foto ou a ficha técnica — a plataforma extrai os ângulos, cria o roteiro e gera o UGC pronto pra postar. Direto.",
  },
  {
    q: "Qual a diferença para CapCut, Canva ou outras ferramentas de IA?",
    a: "Essas ferramentas exigem que você edite. A MotionForge gera do zero — você monta o workflow uma vez, executa em um clique e recebe o vídeo final. Sem template pra preencher, sem timeline pra montar.",
  },
  {
    q: "Quantos vídeos posso gerar por mês?",
    a: "Depende do plano. O Starter entrega dezenas de vídeos mensais. Pro e Agency têm volume maior com top-up disponível se precisar escalar mais. Os créditos ficam visíveis no painel em tempo real.",
  },
  {
    q: "Qual modelo de IA é melhor para o meu produto?",
    a: "Dentro da plataforma você testa todos. Veo 3.1 é melhor para vídeos cinemáticos, Kling para motion de produto, Nano Banana Pro para imagem 4K. Você decide por produto — e muda quando quiser, sem trocar de plataforma.",
  },
  {
    q: "Posso gerenciar múltiplos clientes como agência?",
    a: "Sim — no plano Agency você cria workspaces separados por cliente, cada um com seus modelos, workflows e histórico de conteúdo. Uma plataforma, todos os clientes, dois na equipe.",
  },
  {
    q: "Posso cancelar quando quiser?",
    a: "Sim. Assinatura mensal, sem fidelidade, sem multa. Você cancela em um clique pelo painel. Não existe contrato de 12 meses aqui.",
  },
] as const

/* ── Item de accordion ──────────────────────────────────────── */
function FAQItem({ q, a, isOpen, onToggle }: {
  q: string
  a: string
  isOpen: boolean
  onToggle: () => void
}) {
  return (
    <motion.div
      variants={fadeUp}
      style={{
        borderBottom: "1px solid var(--color-forge-border)",
      }}
    >
      <button
        onClick={onToggle}
        style={{
          width: "100%",
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: "20px 0",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
          textAlign: "left",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "clamp(14px, 1.2vw, 16px)",
            fontWeight: 700,
            color: isOpen ? "var(--color-forge-white)" : "rgba(245,245,245,0.75)",
            lineHeight: 1.4,
            transition: "color 200ms ease",
          }}
        >
          {q}
        </span>
        <motion.span
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.25, ease: [...EASE] }}
          style={{
            flexShrink: 0,
            width: 24,
            height: 24,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "1px solid",
            borderColor: isOpen ? "var(--color-forge-orange)" : "rgba(255,255,255,0.15)",
            color: isOpen ? "var(--color-forge-orange)" : "rgba(255,255,255,0.4)",
            fontSize: 18,
            lineHeight: 1,
            fontWeight: 300,
            transition: "border-color 200ms ease, color 200ms ease",
          }}
        >
          +
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.32, ease: [...EASE] }}
            style={{ overflow: "hidden" }}
          >
            <p
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: 15,
                lineHeight: 1.7,
                color: "var(--color-forge-muted)",
                paddingBottom: 20,
                margin: 0,
              }}
            >
              {a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

/* ── Seção ──────────────────────────────────────────────────── */
export function FAQ() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <section
      id="faq"
      style={{ background: "var(--color-forge-black)" }}
    >
      <div className="mx-auto max-w-7xl px-6 py-24 lg:py-32">

        {/* Header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={stagger}
          className="mb-14 max-w-2xl"
        >
          <motion.p
            variants={fadeUp}
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "var(--color-forge-orange)",
              marginBottom: 16,
            }}
          >
            Dúvidas Frequentes
          </motion.p>

          <motion.h2
            variants={fadeUp}
            style={{
              fontFamily: "var(--font-bebas)",
              fontSize: "clamp(36px, 5.5vw, 56px)",
              lineHeight: 1,
              letterSpacing: "3px",
              color: "var(--color-forge-white)",
            }}
          >
            Antes de assinar,
            <br />
            leia isso.
          </motion.h2>
        </motion.div>

        {/* Accordion */}
        <div className="grid lg:grid-cols-2 lg:gap-x-16">
          {/* Coluna esquerda */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={stagger}
          >
            {FAQS.slice(0, 4).map((item, i) => (
              <FAQItem
                key={i}
                q={item.q}
                a={item.a}
                isOpen={open === i}
                onToggle={() => setOpen(open === i ? null : i)}
              />
            ))}
          </motion.div>

          {/* Coluna direita */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={stagger}
          >
            {FAQS.slice(4).map((item, i) => (
              <FAQItem
                key={i + 4}
                q={item.q}
                a={item.a}
                isOpen={open === i + 4}
                onToggle={() => setOpen(open === i + 4 ? null : i + 4)}
              />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
