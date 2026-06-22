"use client"

import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { UserCircle2, ChevronRight, ChevronLeft, Wand2, Copy, Check, RotateCcw, ExternalLink, Save, Trash2, FolderOpen } from "lucide-react"
import { useAuth } from "@/lib/auth-context"

// ─── Animação ─────────────────────────────────────────────────────────────────

const EASE = [0.22, 1, 0.36, 1] as const

// ─── Tipos ────────────────────────────────────────────────────────────────────

interface Identidade {
  nome: string
  genero: string
  idade: number
  tomPele: string
  rosto: string
}

interface Aparencia {
  corOlhos: string
  cilios: string
  sobrancelhas: string
  expressao: string
  corCabelo: string
  tipoCabelo: string
  comprimentoCabelo: string
  corpo: string
  beleza: string
  detalhes: string[]
}

interface Estilo {
  roupa: string
  oculos: string
  manchas: string
  sardas: string
  maquiagem: boolean
}

interface Ambiente {
  ambiente: string
  periodo: string
  tipoConteudo: string
  estilofoto: string
  posicao: string
}

// ─── Prompt client-side ───────────────────────────────────────────────────────

const SKIN_EN: Record<string, string> = {
  "Clara": "fair porcelain skin, light complexion",
  "Clara com bronze leve": "light tan skin with a subtle warm bronze glow",
  "Morena": "medium warm brown skin tone, natural Mediterranean complexion",
  "Morena escura": "deep warm brown skin, rich olive undertones",
  "Negra": "rich dark melanin-rich skin, deep ebony complexion",
}

const EYE_EN: Record<string, string> = {
  "Castanho": "warm deep brown", "Verde": "bright vivid green",
  "Azul": "intense electric blue", "Mel": "golden hazel honey",
  "Preto": "deep obsidian black",
}

const LASH_EN: Record<string, string> = {
  "Natural": "natural-length lashes, realistic", "Longos e levantados": "long lifted lashes, naturally curled",
  "Volume intenso": "full-volume dense lashes",
}

const BROW_EN: Record<string, string> = {
  "Natural": "natural soft brows", "Cheias e definidas": "full defined brows with clean arch",
  "Finas e arqueadas": "thin arched brows",
}

const EXPR_EN: Record<string, string> = {
  "Neutra": "neutral confident expression", "Leve sorriso": "subtle soft smile",
  "Confiante": "confident engaging gaze", "Sorriso com dentes": "warm genuine smile showing teeth",
  "Expressão simpática": "friendly approachable expression",
}

const BODY_EN: Record<string, string> = {
  "Magro": "slim lean frame", "Fitness": "athletic toned physique",
  "Curvilíneo": "hourglass curvy silhouette", "Plus size": "plus-size full-figured body",
}

const BEAUTY_EN: Record<string, string> = {
  "Natural": "natural everyday beauty", "Bonita padrão": "conventionally attractive, model-adjacent",
  "Muito atraente": "striking very high attractiveness, symmetrical features",
}

const LIGHT_EN: Record<string, string> = {
  "Dia": "natural soft daylight, window light, bright airy",
  "Noite": "warm indoor ambient lighting, cozy night atmosphere",
  "Golden hour": "golden hour sunlight, warm directional glow, cinematic",
}

function buildAvatarPrompt(id: Identidade, ap: Aparencia, es: Estilo, amb: Ambiente): string {
  const genderEn = id.genero === "Feminino" ? "woman" : "man"
  const skin = SKIN_EN[id.tomPele] || id.tomPele
  const eyes = EYE_EN[ap.corOlhos] || ap.corOlhos
  const lashes = LASH_EN[ap.cilios] || ap.cilios
  const brows = BROW_EN[ap.sobrancelhas] || ap.sobrancelhas
  const expr = EXPR_EN[ap.expressao] || ap.expressao
  const body = BODY_EN[ap.corpo] || ap.corpo
  const beauty = BEAUTY_EN[ap.beleza] || ap.beleza
  const lighting = LIGHT_EN[amb.periodo] || amb.periodo

  const makeupLine = es.maquiagem
    ? "– Subtle natural makeup: light foundation, defined brows, mascara, soft neutral lip"
    : "– No makeup, bare clean skin, natural complexion"

  const glassesLine = es.oculos !== "Nenhum"
    ? `– Glasses: ${es.oculos === "Óculos de Sol" ? "stylish sunglasses, realistic frame" : "thin clear-frame glasses, natural fit"}`
    : ""

  const sardaLine = es.sardas !== "Nenhum"
    ? `– Freckles: subtle natural freckles across nose and cheeks, ${es.sardas} intensity`
    : ""

  const manchaLine = es.manchas !== "Nenhum"
    ? `– Skin natural variation: minor blemishes, ${es.manchas} level`
    : ""

  const detalheLine = ap.detalhes.length
    ? `– Extra features: ${ap.detalhes.join(", ")}`
    : ""

  const clothingLine = es.roupa
    ? `– Clothing: ${es.roupa}`
    : "– Clothing appropriate for the scene and content type"

  return `A photorealistic portrait of a ${genderEn}, early ${id.idade}s, ${skin}, ${id.rosto} face shape, ${beauty}.

────────────────────────
APPEARANCE
────────────────────────
– Hair: ${ap.corCabelo} color, ${ap.tipoCabelo} texture, ${ap.comprimentoCabelo} length
– Eyes: ${eyes} eyes, natural moisture reflections, captivating gaze
– Eyelashes: ${lashes}
– Eyebrows: ${brows}
– Expression: ${expr}
– Body: ${body}
${makeupLine}
${glassesLine}
${sardaLine}
${manchaLine}
${detalheLine}
${clothingLine}

────────────────────────
SCENE & CAMERA
────────────────────────
– Location: ${amb.ambiente}
– Lighting: ${lighting}
– Content type: ${amb.tipoConteudo} style, social media optimized
– Shot style: ${amb.estilofoto}
– Pose: ${amb.posicao}

────────────────────────
TECHNICAL (MANDATORY)
────────────────────────
– Shot on iPhone 15 Pro, 24mm f/1.78 aperture, uncompressed HEIC
– Deep Fusion computational photography, natural smartphone lens
– Ultra-realistic skin: visible pores, micro-wrinkles, translucent skin effect
– Vellus hair (peach fuzz) subtly catching the light
– NO plastic smoothing, NO beauty filters, NO airbrushing
– NO CGI look, NO 3D render, NO cartoon aesthetic
– Authentic human imperfections preserved
– Photographic depth of field, natural shallow bokeh
– 50mm equivalent perspective, real camera dynamic range
– Photorealistic, 8K detail quality`.trim()
}

function buildNegativePrompt(): string {
  return "deformed, ugly, bad anatomy, missing fingers, extra digits, blurry, low quality, jpeg artifacts, watermark, signature, text, plastic skin, airbrushed, smooth over-processed skin, overexposed, cartoon, anime, drawing, painting, illustration, 3d render, CGI, doll, mannequin, fake eyes, glass eyes, dead eyes, beauty filter, beauty mode"
}

// ─── Componentes visuais ──────────────────────────────────────────────────────

// Card de tom de pele com cor CSS real
function SkinCard({ color, label, active, onClick }: {
  color: string; label: string; active: boolean; onClick: () => void
}) {
  return (
    <button onClick={onClick} style={{
      display: "flex", flexDirection: "column", alignItems: "center", gap: "8px",
      background: "transparent", border: "none", cursor: "pointer", padding: "4px",
    }}>
      <div style={{
        width: "72px", height: "56px", borderRadius: "10px",
        background: color,
        border: `2px solid ${active ? "#FF4D00" : "rgba(255,255,255,0.06)"}`,
        boxShadow: active ? "0 0 14px rgba(255,77,0,0.35)" : "none",
        transition: "all 150ms ease",
      }} />
      <span style={{
        fontSize: "10px", fontFamily: "'DM Sans', sans-serif", fontWeight: active ? 700 : 500,
        color: active ? "#FF4D00" : "rgba(245,245,245,0.45)",
        textAlign: "center", maxWidth: "72px", lineHeight: 1.3,
        transition: "color 150ms ease",
      }}>
        {label}
      </span>
    </button>
  )
}

// Card visual genérico com foto real
function VisualCard({ bg, label, active, onClick, imgUrl }: {
  bg: string; label: string; active: boolean; onClick: () => void; imgUrl?: string
}) {
  const imgStyle: React.CSSProperties = imgUrl ? {
    backgroundImage: `url(${imgUrl})`,
    backgroundSize: "cover",
    backgroundPosition: "center top",
    backgroundRepeat: "no-repeat",
    backgroundColor: "#0D0D0D",
  } : { background: bg }

  return (
    <button onClick={onClick} style={{
      display: "flex", flexDirection: "column", alignItems: "center", gap: "8px",
      background: "transparent", border: "none", cursor: "pointer", padding: "4px",
      flexShrink: 0,
    }}>
      <div style={{
        width: "80px", height: "80px", borderRadius: "12px",
        ...imgStyle,
        border: `2px solid ${active ? "#FF4D00" : "rgba(255,255,255,0.06)"}`,
        boxShadow: active ? "0 0 16px rgba(255,77,0,0.35)" : "none",
        transition: "border-color 150ms ease, box-shadow 150ms ease",
        overflow: "hidden",
        flexShrink: 0,
      }} />
      <span style={{
        fontSize: "10px", fontFamily: "'DM Sans', sans-serif", fontWeight: active ? 700 : 500,
        color: active ? "#FF4D00" : "rgba(245,245,245,0.45)",
        textAlign: "center", maxWidth: "80px", lineHeight: 1.3,
        transition: "color 150ms ease",
      }}>
        {label}
      </span>
    </button>
  )
}

// Chip de texto simples (para opções sem representação visual forte)
function ChipGroup({ options, value, onChange, multi = false }: {
  options: string[]
  value: string | string[]
  onChange: (v: string) => void
  multi?: boolean
}) {
  return (
    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
      {options.map(opt => {
        const active = multi ? (value as string[]).includes(opt) : value === opt
        return (
          <button key={opt} onClick={() => onChange(opt)} style={{
            padding: "7px 14px", borderRadius: "8px", cursor: "pointer",
            fontFamily: "'DM Sans', sans-serif", fontSize: "12px", fontWeight: 600,
            border: "1px solid",
            background: active ? "rgba(255,77,0,0.12)" : "rgba(255,255,255,0.03)",
            borderColor: active ? "rgba(255,77,0,0.5)" : "rgba(255,255,255,0.08)",
            color: active ? "#FF4D00" : "rgba(245,245,245,0.5)",
            transition: "all 150ms ease",
          }}>
            {opt}
          </button>
        )
      })}
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      <span style={{
        fontSize: "10px", fontWeight: 700, color: "rgba(245,245,245,0.4)",
        textTransform: "uppercase", letterSpacing: "1.5px", fontFamily: "'DM Sans', sans-serif",
      }}>
        {label}
      </span>
      {children}
    </div>
  )
}

function SectionDivider({ label }: { label: string }) {
  return (
    <p style={{
      fontSize: "12px", color: "rgba(245,245,245,0.4)", fontFamily: "'DM Sans', sans-serif",
      margin: 0, borderLeft: "2px solid rgba(255,77,0,0.4)", paddingLeft: "10px",
    }}>
      {label}
    </p>
  )
}

// ─── Dados visuais ────────────────────────────────────────────────────────────

const CDN = "https://cdn.motionforge.com.br"

// Tom de pele — swatches de cor (consistente para todos os tons)
const SKIN_TONES = [
  { label: "Clara",                 color: "#FDDBB4" },
  { label: "Clara com bronze leve", color: "#E8B88A" },
  { label: "Morena",                color: "#C68642" },
  { label: "Morena escura",         color: "#8D5524" },
  { label: "Negra",                 color: "#3B1F0A" },
]

// Cílios — apenas opções com foto
const LASH_OPTIONS = [
  { label: "Natural",             imgUrl: `${CDN}/avatar/lash/natural.jpg` },
  { label: "Longos e levantados", imgUrl: `${CDN}/avatar/lash/longos.jpg` },
]

// Sobrancelhas — apenas opções com foto
const BROW_OPTIONS = [
  { label: "Natural",            imgUrl: `${CDN}/avatar/brow/natural.jpg` },
  { label: "Cheias e definidas", imgUrl: `${CDN}/avatar/brow/cheias.jpg` },
]

// Estilo do cabelo — apenas opções com foto
const HAIR_STYLE_OPTIONS = [
  { label: "Liso",     imgUrl: `${CDN}/avatar/hair-style/liso.jpg` },
  { label: "Ondulado", imgUrl: `${CDN}/avatar/hair-style/ondulado.jpg` },
]

// Rosto — fotos reais do CDN
const FACE_OPTIONS = [
  { label: "Oval",    bg: "#1a1a2a", imgUrl: `${CDN}/avatar/face/oval.jpg` },
  { label: "Fino",    bg: "#1e2a3e", imgUrl: `${CDN}/avatar/face/fino.jpg` },
  { label: "Marcado", bg: "#2e1e3e", imgUrl: `${CDN}/avatar/face/marcado.jpg` },
]

// Olhos — apenas opções com foto
const EYE_OPTIONS = [
  { label: "Castanho", imgUrl: `${CDN}/avatar/eyes/castanho.jpg` },
  { label: "Verde",    imgUrl: `${CDN}/avatar/eyes/verde.jpg` },
  { label: "Azul",     imgUrl: `${CDN}/avatar/eyes/azul.jpg` },
]

// Cabelo cor — apenas opções com foto
const HAIR_COLOR_OPTIONS = [
  { label: "Loiro",           imgUrl: `${CDN}/avatar/hair/loiro.jpg` },
  { label: "Castanho claro",  imgUrl: `${CDN}/avatar/hair/castanho-claro.jpg` },
  { label: "Castanho escuro", imgUrl: `${CDN}/avatar/hair/castanho-escuro.jpg` },
  { label: "Preto",           imgUrl: `${CDN}/avatar/hair/preto.jpg` },
  { label: "Ruivo",           imgUrl: `${CDN}/avatar/hair/ruivo.jpg` },
]

// Corpo — apenas opções com foto
const BODY_OPTIONS = [
  { label: "Magro",      imgUrl: `${CDN}/avatar/body/magro.jpg` },
  { label: "Fitness",    imgUrl: `${CDN}/avatar/body/fitness.jpg` },
  { label: "Curvilíneo", imgUrl: `${CDN}/avatar/body/violao.jpg` },
]

// Óculos — apenas opções com foto
const GLASSES_OPTIONS = [
  { label: "Nenhum",               imgUrl: `${CDN}/avatar/glasses/nenhum.jpg` },
  { label: "Óculos de Sol",        imgUrl: `${CDN}/avatar/glasses/sol.jpg` },
  { label: "Óculos Transparentes", imgUrl: `${CDN}/avatar/glasses/transparente.jpg` },
]

// ─── Tipos de avatar salvo ────────────────────────────────────────────────────

interface SavedAvatar {
  id: string
  nome: string
  prompt: string
  negative: string
  config: { identidade: Identidade; aparencia: Aparencia; estilo: Estilo; ambiente: Ambiente }
  savedAt: string
}

const MF_AVATARES_KEY = "mf_avatares"

function loadAvatares(): SavedAvatar[] {
  try {
    return JSON.parse(localStorage.getItem(MF_AVATARES_KEY) ?? "[]")
  } catch { return [] }
}

function saveAvatares(list: SavedAvatar[]) {
  localStorage.setItem(MF_AVATARES_KEY, JSON.stringify(list))
}

// ─── Etapas ───────────────────────────────────────────────────────────────────

const STEPS = ["Identidade", "Aparência", "Estilo", "Ambiente", "Gerar"]

// ─── Página ───────────────────────────────────────────────────────────────────

export default function AvatarPage() {
  const { user } = useAuth()
  const [step, setStep] = useState(0)
  const [stepError, setStepError] = useState("")
  const [prompt, setPrompt] = useState<{ prompt: string; negative: string } | null>(null)
  const [copied, setCopied] = useState<"main" | "neg" | null>(null)
  const [savedAvatares, setSavedAvatares] = useState<SavedAvatar[]>([])
  const [saveMsg, setSaveMsg] = useState<"saved" | "limit" | null>(null)
  const [showSaved, setShowSaved] = useState(false)

  const isStarter = user?.plan === "Starter"

  useEffect(() => {
    setSavedAvatares(loadAvatares())
  }, [])

  function handleSaveAvatar() {
    if (!prompt) return
    const current = loadAvatares()

    if (isStarter && current.length >= 1) {
      setSaveMsg("limit")
      setTimeout(() => setSaveMsg(null), 3000)
      return
    }

    const novo: SavedAvatar = {
      id: Date.now().toString(),
      nome: identidade.nome || `Avatar ${current.length + 1}`,
      prompt: prompt.prompt,
      negative: prompt.negative,
      config: { identidade, aparencia, estilo, ambiente },
      savedAt: new Date().toISOString(),
    }

    const updated = [...current, novo]
    saveAvatares(updated)
    setSavedAvatares(updated)
    setSaveMsg("saved")
    setTimeout(() => setSaveMsg(null), 2000)
  }

  function handleDeleteAvatar(id: string) {
    const updated = loadAvatares().filter(a => a.id !== id)
    saveAvatares(updated)
    setSavedAvatares(updated)
  }

  function handleLoadAvatar(av: SavedAvatar) {
    setId(av.config.identidade)
    setAp(av.config.aparencia)
    setEs(av.config.estilo)
    setAmb(av.config.ambiente)
    setPrompt({ prompt: av.prompt, negative: av.negative })
    setStep(4)
    setShowSaved(false)
  }

  const [identidade, setId] = useState<Identidade>({
    nome: "", genero: "", idade: 22,
    tomPele: "", rosto: "",
  })

  const [aparencia, setAp] = useState<Aparencia>({
    corOlhos: "", cilios: "Natural", sobrancelhas: "Natural",
    expressao: "Leve sorriso", corCabelo: "",
    tipoCabelo: "Liso", comprimentoCabelo: "Médio",
    corpo: "", beleza: "Bonita padrão", detalhes: [],
  })

  const [estilo, setEs] = useState<Estilo>({
    roupa: "", oculos: "Nenhum", manchas: "Nenhum",
    sardas: "Nenhum", maquiagem: true,
  })

  const [ambiente, setAmb] = useState<Ambiente>({
    ambiente: "Quarto", periodo: "Dia",
    tipoConteudo: "Lifestyle", estilofoto: "Natural (Corpo Inteiro)",
    posicao: "De pé",
  })

  function updId(k: keyof Identidade, v: string | number) { setId(p => ({ ...p, [k]: v })); setStepError("") }
  function updAp(k: keyof Aparencia, v: string | string[]) { setAp(p => ({ ...p, [k]: v })); setStepError("") }
  function toggleDetalhe(d: string) {
    setAp(p => ({
      ...p,
      detalhes: p.detalhes.includes(d) ? p.detalhes.filter(x => x !== d) : [...p.detalhes, d],
    }))
  }
  function updEs(k: keyof Estilo, v: string | boolean) { setEs(p => ({ ...p, [k]: v })); setStepError("") }
  function updAmb(k: keyof Ambiente, v: string) { setAmb(p => ({ ...p, [k]: v })); setStepError("") }

  function validateStep(): string {
    if (step === 0) {
      if (!identidade.genero) return "Selecione o gênero"
      if (!identidade.tomPele) return "Selecione o tom de pele"
      if (!identidade.rosto) return "Selecione o formato do rosto"
    }
    if (step === 1) {
      if (!aparencia.corOlhos) return "Selecione a cor dos olhos"
      if (!aparencia.corCabelo) return "Selecione a cor do cabelo"
      if (!aparencia.corpo) return "Selecione o tipo de corpo"
    }
    return ""
  }

  function handleNext() {
    const err = validateStep()
    if (err) { setStepError(err); return }
    setStepError("")
    setStep(s => Math.min(4, s + 1))
  }

  // Geração do prompt é 100% client-side — sem API call
  function handleGenerate() {
    const mainPrompt = buildAvatarPrompt(identidade, aparencia, estilo, ambiente)
    const negPrompt = buildNegativePrompt()
    setPrompt({ prompt: mainPrompt, negative: negPrompt })
  }

  async function handleCopy(text: string, key: "main" | "neg") {
    await navigator.clipboard.writeText(text)
    setCopied(key)
    setTimeout(() => setCopied(null), 2000)
  }

  function handleReset() {
    setStep(0)
    setStepError("")
    setPrompt(null)
    setId({ nome: "", genero: "", idade: 22, tomPele: "", rosto: "" })
    setAp({ corOlhos: "", cilios: "Natural", sobrancelhas: "Natural", expressao: "Leve sorriso", corCabelo: "", tipoCabelo: "Liso", comprimentoCabelo: "Médio", corpo: "", beleza: "Bonita padrão", detalhes: [] })
    setEs({ roupa: "", oculos: "Nenhum", manchas: "Nenhum", sardas: "Nenhum", maquiagem: true })
    setAmb({ ambiente: "Quarto", periodo: "Dia", tipoConteudo: "Lifestyle", estilofoto: "Natural (Corpo Inteiro)", posicao: "De pé" })
  }

  function renderStep() {
    switch (step) {

      // ── Etapa 1: Identidade ─────────────────────────────────────────────────
      case 0: return (
        <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
          <Field label="Nome do avatar (opcional)">
            <input
              placeholder="ex: Bia, Luna, Sofia..."
              value={identidade.nome}
              onChange={e => updId("nome", e.target.value)}
              style={{
                background: "#0D0D0D", border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "8px", padding: "10px 14px", fontSize: "13px",
                color: "#F5F5F5", fontFamily: "'DM Sans', sans-serif", outline: "none",
              }}
            />
          </Field>

          <Field label="Gênero">
            <ChipGroup options={["Feminino", "Masculino"]} value={identidade.genero} onChange={v => updId("genero", v)} />
          </Field>

          <Field label={`Idade · ${identidade.idade} anos`}>
            <input
              type="range" min={18} max={45} value={identidade.idade}
              onChange={e => updId("idade", Number(e.target.value))}
              style={{ accentColor: "#FF4D00", width: "100%", cursor: "pointer" }}
            />
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "10px", color: "rgba(245,245,245,0.3)", fontFamily: "'DM Sans', sans-serif" }}>
              <span>18</span><span>45</span>
            </div>
          </Field>

          <Field label="Tom de pele">
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              {SKIN_TONES.map(s => (
                <SkinCard
                  key={s.label}
                  color={s.color}
                  label={s.label}
                  active={identidade.tomPele === s.label}
                  onClick={() => updId("tomPele", s.label)}
                />
              ))}
            </div>
          </Field>

          <Field label="Formato do rosto">
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              {FACE_OPTIONS.map(f => (
                <VisualCard
                  key={f.label}
                  bg={f.bg}
                  imgUrl={f.imgUrl}
                  label={f.label}
                  active={identidade.rosto === f.label}
                  onClick={() => updId("rosto", f.label)}
                />
              ))}
            </div>
          </Field>
        </div>
      )

      // ── Etapa 2: Aparência ──────────────────────────────────────────────────
      case 1: return (
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <SectionDivider label="Olhos & Expressão" />

          <Field label="Cor dos olhos">
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              {EYE_OPTIONS.map(e => (
                <VisualCard key={e.label} bg="#0D0D0D" imgUrl={e.imgUrl}
                  label={e.label} active={aparencia.corOlhos === e.label}
                  onClick={() => updAp("corOlhos", e.label)} />
              ))}
            </div>
          </Field>

          <Field label="Cílios">
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              {LASH_OPTIONS.map(l => (
                <VisualCard key={l.label} bg="#0D0D0D" imgUrl={l.imgUrl}
                  label={l.label} active={aparencia.cilios === l.label}
                  onClick={() => updAp("cilios", l.label)} />
              ))}
            </div>
          </Field>

          <Field label="Sobrancelhas">
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              {BROW_OPTIONS.map(b => (
                <VisualCard key={b.label} bg="#0D0D0D" imgUrl={b.imgUrl}
                  label={b.label} active={aparencia.sobrancelhas === b.label}
                  onClick={() => updAp("sobrancelhas", b.label)} />
              ))}
            </div>
          </Field>

          <Field label="Expressão">
            <ChipGroup options={["Neutra", "Leve sorriso", "Confiante", "Sorriso com dentes", "Expressão simpática"]} value={aparencia.expressao} onChange={v => updAp("expressao", v)} />
          </Field>

          <div style={{ height: "1px", background: "rgba(255,255,255,0.05)" }} />
          <SectionDivider label="Cabelo" />

          <Field label="Cor do cabelo">
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              {HAIR_COLOR_OPTIONS.map(h => (
                <VisualCard key={h.label} bg="#0D0D0D" imgUrl={h.imgUrl}
                  label={h.label} active={aparencia.corCabelo === h.label}
                  onClick={() => updAp("corCabelo", h.label)} />
              ))}
            </div>
          </Field>

          <Field label="Tipo">
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              {HAIR_STYLE_OPTIONS.map(h => (
                <VisualCard key={h.label} bg="#0D0D0D" imgUrl={h.imgUrl}
                  label={h.label} active={aparencia.tipoCabelo === h.label}
                  onClick={() => updAp("tipoCabelo", h.label)} />
              ))}
            </div>
          </Field>

          <Field label="Comprimento">
            <ChipGroup options={["Curto", "Médio", "Longo", "Muito longo"]} value={aparencia.comprimentoCabelo} onChange={v => updAp("comprimentoCabelo", v)} />
          </Field>

          <div style={{ height: "1px", background: "rgba(255,255,255,0.05)" }} />
          <SectionDivider label="Corpo & Estética" />

          <Field label="Corpo">
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              {BODY_OPTIONS.map(b => (
                <VisualCard key={b.label} bg="#0D0D0D" imgUrl={b.imgUrl}
                  label={b.label} active={aparencia.corpo === b.label}
                  onClick={() => updAp("corpo", b.label)} />
              ))}
            </div>
          </Field>

          <Field label="Nível de beleza">
            <ChipGroup options={["Natural", "Bonita padrão", "Muito atraente"]} value={aparencia.beleza} onChange={v => updAp("beleza", v)} />
          </Field>

          <Field label="Detalhes extras (múltiplos)">
            <ChipGroup options={["Maxilar definido", "Pele lisa", "Traços harmonizados", "Sardas sutis", "Piercing no nariz"]} value={aparencia.detalhes} onChange={toggleDetalhe} multi />
          </Field>
        </div>
      )

      // ── Etapa 3: Estilo ─────────────────────────────────────────────────────
      case 2: return (
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <Field label="Descrição da roupa (opcional)">
            <input
              placeholder="ex: camiseta branca, calça jeans, tênis branco..."
              value={estilo.roupa}
              onChange={e => updEs("roupa", e.target.value)}
              style={{
                background: "#0D0D0D", border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "8px", padding: "10px 14px", fontSize: "13px",
                color: "#F5F5F5", fontFamily: "'DM Sans', sans-serif", outline: "none",
              }}
            />
          </Field>

          <Field label="Óculos">
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              {GLASSES_OPTIONS.map(g => (
                <VisualCard key={g.label} bg="#0D0D0D" imgUrl={g.imgUrl}
                  label={g.label} active={estilo.oculos === g.label}
                  onClick={() => updEs("oculos", g.label)} />
              ))}
            </div>
          </Field>

          <Field label="Manchas na pele">
            <ChipGroup options={["Nenhum", "Leve", "Médio"]} value={estilo.manchas} onChange={v => updEs("manchas", v)} />
          </Field>

          <Field label="Sardas">
            <ChipGroup options={["Nenhum", "Leve", "Médio"]} value={estilo.sardas} onChange={v => updEs("sardas", v)} />
          </Field>

          <Field label="Maquiagem">
            <div style={{ display: "flex", gap: "8px" }}>
              {["Com maquiagem", "Sem maquiagem"].map(opt => {
                const active = opt === "Com maquiagem" ? estilo.maquiagem : !estilo.maquiagem
                return (
                  <button key={opt} onClick={() => updEs("maquiagem", opt === "Com maquiagem")} style={{
                    padding: "7px 14px", borderRadius: "8px", cursor: "pointer",
                    fontFamily: "'DM Sans', sans-serif", fontSize: "12px", fontWeight: 600,
                    border: "1px solid",
                    background: active ? "rgba(255,77,0,0.12)" : "rgba(255,255,255,0.03)",
                    borderColor: active ? "rgba(255,77,0,0.5)" : "rgba(255,255,255,0.08)",
                    color: active ? "#FF4D00" : "rgba(245,245,245,0.5)",
                    transition: "all 150ms ease",
                  }}>
                    {opt}
                  </button>
                )
              })}
            </div>
          </Field>
        </div>
      )

      // ── Etapa 4: Ambiente ───────────────────────────────────────────────────
      case 3: return (
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <Field label="Ambiente">
            <ChipGroup options={["Quarto", "Banheiro", "Sala", "Academia", "Rua", "Estúdio", "Fundo neutro"]} value={ambiente.ambiente} onChange={v => updAmb("ambiente", v)} />
          </Field>
          <Field label="Período">
            <ChipGroup options={["Dia", "Noite", "Golden hour"]} value={ambiente.periodo} onChange={v => updAmb("periodo", v)} />
          </Field>
          <Field label="Tipo de conteúdo">
            <ChipGroup options={["Lifestyle", "Venda de produto", "Story", "Review", "Tutorial"]} value={ambiente.tipoConteudo} onChange={v => updAmb("tipoConteudo", v)} />
          </Field>
          <Field label="Estilo de foto">
            <ChipGroup options={["Natural (Corpo Inteiro)", "Espelho (iPhone)", "Selfie", "Close-up rosto", "Meia figura"]} value={ambiente.estilofoto} onChange={v => updAmb("estilofoto", v)} />
          </Field>
          <Field label="Posição do corpo">
            <ChipGroup options={["De pé", "Sentado", "Encostado na parede"]} value={ambiente.posicao} onChange={v => updAmb("posicao", v)} />
          </Field>
        </div>
      )

      // ── Etapa 5: Gerar ──────────────────────────────────────────────────────
      case 4: return (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* Resumo */}
          <div style={{
            background: "#0D0D0D", border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: "12px", padding: "16px", display: "flex", flexDirection: "column", gap: "8px",
          }}>
            <div style={{ fontSize: "10px", fontWeight: 700, color: "rgba(245,245,245,0.35)", textTransform: "uppercase", letterSpacing: "1.5px", fontFamily: "'DM Sans', sans-serif", marginBottom: "4px" }}>
              Resumo do avatar
            </div>
            {[
              ["Identidade", `${identidade.genero}, ${identidade.idade} anos, pele ${identidade.tomPele}, rosto ${identidade.rosto}`],
              ["Aparência",  `Cabelo ${aparencia.corCabelo} ${aparencia.tipoCabelo} ${aparencia.comprimentoCabelo}, olhos ${aparencia.corOlhos}`],
              ["Estilo",     `${estilo.oculos !== "Nenhum" ? estilo.oculos + ", " : ""}${estilo.maquiagem ? "com maquiagem" : "sem maquiagem"}`],
              ["Ambiente",   `${ambiente.ambiente}, ${ambiente.periodo}, ${ambiente.tipoConteudo}`],
            ].map(([k, v]) => (
              <div key={k} style={{ display: "flex", gap: "8px", fontSize: "12px", fontFamily: "'DM Sans', sans-serif" }}>
                <span style={{ color: "#FF4D00", fontWeight: 700, flexShrink: 0 }}>{k}:</span>
                <span style={{ color: "rgba(245,245,245,0.6)" }}>{v}</span>
              </div>
            ))}
          </div>

          {/* Botão gerar — sem loading, é instantâneo */}
          <button
            onClick={handleGenerate}
            style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: "10px",
              background: "#FF4D00", color: "#fff", border: "none", borderRadius: "10px",
              padding: "14px 24px", fontSize: "14px", fontWeight: 700,
              fontFamily: "'DM Sans', sans-serif", cursor: "pointer",
              boxShadow: "0 0 24px rgba(255,77,0,0.3)",
              transition: "all 150ms ease",
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.opacity = "0.88" }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.opacity = "1" }}
          >
            <Wand2 size={16} />
            Gerar Prompt do Avatar
          </button>

          {/* Resultado */}
          {prompt && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: EASE }}
              style={{ display: "flex", flexDirection: "column", gap: "12px" }}
            >
              {/* Prompt principal */}
              <div style={{
                background: "#111111", border: "1px solid rgba(0,229,255,0.15)",
                borderRadius: "12px", padding: "18px",
              }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
                  <span style={{ fontSize: "10px", fontWeight: 700, color: "#00E5FF", textTransform: "uppercase", letterSpacing: "1.5px", fontFamily: "'DM Sans', sans-serif" }}>
                    ✨ Prompt principal
                  </span>
                  <button
                    onClick={() => handleCopy(prompt.prompt, "main")}
                    style={{
                      display: "flex", alignItems: "center", gap: "6px",
                      background: copied === "main" ? "rgba(16,163,127,0.1)" : "rgba(0,229,255,0.08)",
                      border: `1px solid ${copied === "main" ? "rgba(16,163,127,0.3)" : "rgba(0,229,255,0.2)"}`,
                      color: copied === "main" ? "#10A37F" : "#00E5FF",
                      fontFamily: "'DM Sans', sans-serif", fontSize: "11px", fontWeight: 600,
                      padding: "5px 10px", borderRadius: "6px", cursor: "pointer", transition: "all 150ms ease",
                    }}
                  >
                    {copied === "main" ? <Check size={12} /> : <Copy size={12} />}
                    {copied === "main" ? "Copiado!" : "Copiar"}
                  </button>
                </div>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "12px", color: "rgba(245,245,245,0.8)", lineHeight: "1.8", margin: 0, whiteSpace: "pre-line" }}>
                  {prompt.prompt}
                </p>
              </div>

              {/* Negative prompt */}
              <div style={{
                background: "#111111", border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: "12px", padding: "16px",
              }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
                  <span style={{ fontSize: "10px", fontWeight: 700, color: "rgba(245,245,245,0.4)", textTransform: "uppercase", letterSpacing: "1.5px", fontFamily: "'DM Sans', sans-serif" }}>
                    ⛔ Negative prompt (Midjourney / SD)
                  </span>
                  <button
                    onClick={() => handleCopy(prompt.negative, "neg")}
                    style={{
                      display: "flex", alignItems: "center", gap: "6px",
                      background: "transparent", border: "1px solid rgba(255,255,255,0.08)",
                      color: "rgba(245,245,245,0.4)", fontFamily: "'DM Sans', sans-serif",
                      fontSize: "11px", fontWeight: 600, padding: "5px 10px", borderRadius: "6px",
                      cursor: "pointer", transition: "all 150ms ease",
                    }}
                  >
                    {copied === "neg" ? <Check size={12} /> : <Copy size={12} />}
                    {copied === "neg" ? "Copiado!" : "Copiar"}
                  </button>
                </div>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", color: "rgba(245,245,245,0.45)", lineHeight: "1.6", margin: 0 }}>
                  {prompt.negative}
                </p>
              </div>

              {/* Links para ferramentas */}
              <div style={{
                background: "#0D0D0D", border: "1px solid rgba(255,255,255,0.05)",
                borderRadius: "10px", padding: "14px",
              }}>
                <div style={{ fontSize: "10px", fontWeight: 700, color: "rgba(245,245,245,0.35)", textTransform: "uppercase", letterSpacing: "1.5px", fontFamily: "'DM Sans', sans-serif", marginBottom: "10px" }}>
                  Cole o prompt em uma dessas ferramentas:
                </div>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  {[
                    { label: "Google Imagen", url: "https://labs.google/" },
                    { label: "DALL-E (ChatGPT)", url: "https://chatgpt.com" },
                    { label: "Midjourney", url: "https://www.midjourney.com" },
                  ].map(({ label, url }) => (
                    <a key={label} href={url} target="_blank" rel="noopener noreferrer"
                      style={{
                        display: "flex", alignItems: "center", gap: "5px",
                        padding: "6px 12px", borderRadius: "6px",
                        border: "1px solid rgba(255,255,255,0.08)",
                        color: "rgba(245,245,245,0.5)",
                        fontFamily: "'DM Sans', sans-serif", fontSize: "11px", fontWeight: 600,
                        textDecoration: "none", transition: "all 150ms ease",
                      }}
                      onMouseEnter={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.borderColor = "rgba(255,77,0,0.4)"; el.style.color = "#FF4D00" }}
                      onMouseLeave={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.borderColor = "rgba(255,255,255,0.08)"; el.style.color = "rgba(245,245,245,0.5)" }}
                    >
                      <ExternalLink size={11} /> {label}
                    </a>
                  ))}
                </div>
              </div>

              {/* Ações: salvar + criar novo */}
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                <button
                  onClick={handleSaveAvatar}
                  style={{
                    display: "flex", alignItems: "center", gap: "6px",
                    background: saveMsg === "saved" ? "rgba(16,163,127,0.12)" : "rgba(255,77,0,0.1)",
                    border: `1px solid ${saveMsg === "saved" ? "rgba(16,163,127,0.3)" : "rgba(255,77,0,0.3)"}`,
                    color: saveMsg === "saved" ? "#10A37F" : "#FF4D00",
                    fontFamily: "'DM Sans', sans-serif", fontSize: "12px", fontWeight: 700,
                    padding: "8px 16px", borderRadius: "8px", cursor: "pointer", transition: "all 150ms ease",
                  }}
                >
                  {saveMsg === "saved" ? <Check size={12} /> : <Save size={12} />}
                  {saveMsg === "saved" ? "Salvo!" : saveMsg === "limit" ? "Limite atingido (Pro)" : "Salvar avatar"}
                </button>

                <button
                  onClick={handleReset}
                  style={{
                    display: "flex", alignItems: "center", gap: "6px",
                    background: "transparent", border: "1px solid rgba(255,255,255,0.1)",
                    color: "rgba(245,245,245,0.45)", fontFamily: "'DM Sans', sans-serif",
                    fontSize: "12px", fontWeight: 600, padding: "8px 16px",
                    borderRadius: "8px", cursor: "pointer", transition: "all 150ms ease",
                  }}
                  onMouseEnter={e => { const el = e.currentTarget as HTMLButtonElement; el.style.borderColor = "rgba(255,77,0,0.4)"; el.style.color = "#FF4D00" }}
                  onMouseLeave={e => { const el = e.currentTarget as HTMLButtonElement; el.style.borderColor = "rgba(255,255,255,0.1)"; el.style.color = "rgba(245,245,245,0.45)" }}
                >
                  <RotateCcw size={12} /> Criar novo avatar
                </button>
              </div>

              {saveMsg === "limit" && (
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "12px", color: "#ef4444", margin: 0 }}>
                  O plano Starter permite apenas 1 avatar salvo. Faça upgrade para Pro para salvar ilimitados.
                </p>
              )}
            </motion.div>
          )}
        </div>
      )
    }
  }

  // ── Layout ───────────────────────────────────────────────────────────────────

  return (
    <div style={{ padding: "24px", maxWidth: "720px", margin: "0 auto" }}>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: EASE }} style={{ marginBottom: "24px" }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", flexWrap: "wrap", marginBottom: "6px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{
              width: "40px", height: "40px", borderRadius: "12px",
              background: "rgba(255,77,0,0.12)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <UserCircle2 size={20} style={{ color: "#FF4D00" }} />
            </div>
            <h1 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "20px", fontWeight: 700, color: "#F5F5F5", margin: 0 }}>
              Criador de Avatar IA
            </h1>
          </div>

          {savedAvatares.length > 0 && (
            <button
              onClick={() => setShowSaved(s => !s)}
              style={{
                display: "flex", alignItems: "center", gap: "6px",
                padding: "8px 14px", borderRadius: "8px", cursor: "pointer",
                background: showSaved ? "rgba(255,77,0,0.1)" : "transparent",
                border: `1px solid ${showSaved ? "rgba(255,77,0,0.3)" : "rgba(255,255,255,0.08)"}`,
                color: showSaved ? "#FF4D00" : "rgba(245,245,245,0.45)",
                fontFamily: "'DM Sans', sans-serif", fontSize: "12px", fontWeight: 600,
                transition: "all 150ms ease",
              }}
            >
              <FolderOpen size={13} />
              Meus avatares ({savedAvatares.length}{isStarter ? "/1" : ""})
            </button>
          )}
        </div>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", color: "rgba(245,245,245,0.4)", margin: 0 }}>
          Configure seu avatar e receba um prompt fotorrealista pronto para Google Imagen, Midjourney ou DALL-E.
        </p>
      </motion.div>

      {/* Painel de avatares salvos */}
      {showSaved && savedAvatares.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          style={{
            marginBottom: "24px", background: "#111111",
            border: "1px solid rgba(255,255,255,0.06)", borderRadius: "12px", padding: "16px",
          }}
        >
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", fontWeight: 700, color: "rgba(245,245,245,0.35)", textTransform: "uppercase", letterSpacing: "1.5px", margin: "0 0 12px" }}>
            Avatares salvos
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {savedAvatares.map(av => (
              <div key={av.id} style={{
                display: "flex", alignItems: "center", gap: "10px",
                background: "#0D0D0D", border: "1px solid rgba(255,255,255,0.05)",
                borderRadius: "8px", padding: "10px 12px",
              }}>
                <UserCircle2 size={16} style={{ color: "#FF4D00", flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", fontWeight: 700, color: "#F5F5F5", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {av.nome}
                  </p>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "10px", color: "rgba(245,245,245,0.3)", margin: 0 }}>
                    {new Date(av.savedAt).toLocaleDateString("pt-BR")}
                  </p>
                </div>
                <button
                  onClick={() => handleLoadAvatar(av)}
                  style={{
                    padding: "5px 10px", borderRadius: "6px", cursor: "pointer",
                    background: "rgba(255,77,0,0.08)", border: "1px solid rgba(255,77,0,0.2)",
                    color: "#FF4D00", fontFamily: "'DM Sans', sans-serif", fontSize: "11px", fontWeight: 700,
                  }}
                >
                  Carregar
                </button>
                <button
                  onClick={() => handleDeleteAvatar(av.id)}
                  style={{
                    width: "28px", height: "28px", borderRadius: "6px", cursor: "pointer",
                    background: "transparent", border: "1px solid rgba(255,255,255,0.08)",
                    color: "rgba(245,245,245,0.35)", display: "flex", alignItems: "center", justifyContent: "center",
                  }}
                >
                  <Trash2 size={12} />
                </button>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Stepper */}
      <div style={{ display: "flex", alignItems: "flex-start", marginBottom: "24px" }}>
        {STEPS.map((s, i) => (
          <React.Fragment key={s}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", flexShrink: 0 }}>
              <div
                onClick={() => { if (i < step) { setStepError(""); setStep(i) } }}
                style={{
                  width: "28px", height: "28px", borderRadius: "50%",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  background: i < step ? "#FF4D00" : i === step ? "rgba(255,77,0,0.15)" : "rgba(255,255,255,0.05)",
                  border: `1px solid ${i <= step ? "#FF4D00" : "rgba(255,255,255,0.08)"}`,
                  fontSize: "11px", fontWeight: 700,
                  color: i < step ? "#fff" : i === step ? "#FF4D00" : "rgba(245,245,245,0.3)",
                  fontFamily: "'DM Sans', sans-serif", cursor: i < step ? "pointer" : "default",
                  transition: "all 200ms ease",
                }}
              >
                {i < step ? "✓" : i + 1}
              </div>
              <span style={{
                fontSize: "8px", fontWeight: i === step ? 700 : 400,
                color: i === step ? "#FF4D00" : "rgba(245,245,245,0.25)",
                fontFamily: "'DM Sans', sans-serif", textTransform: "uppercase",
                letterSpacing: "0.5px", whiteSpace: "nowrap",
              }}>
                {s}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div style={{
                flex: 1, height: "1px", marginTop: "14px",
                background: i < step ? "#FF4D00" : "rgba(255,255,255,0.08)",
                transition: "background 300ms ease",
              }} />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Card da etapa */}
      <div style={{
        background: "#111111", border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: "16px", padding: "24px", marginBottom: "20px",
      }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.25, ease: EASE }}
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navegação entre etapas */}
      {step < 4 && (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {stepError && (
            <div style={{
              background: "rgba(255,77,0,0.08)", border: "1px solid rgba(255,77,0,0.3)",
              borderRadius: "8px", padding: "10px 14px",
              fontSize: "12px", fontFamily: "'DM Sans', sans-serif",
              color: "#FF4D00", fontWeight: 600, textAlign: "center",
            }}>
              {stepError}
            </div>
          )}
          <div style={{ display: "flex", justifyContent: "space-between", gap: "12px" }}>
            <button
              onClick={() => { setStepError(""); setStep(s => Math.max(0, s - 1)) }}
              disabled={step === 0}
              style={{
                display: "flex", alignItems: "center", gap: "6px",
                background: "transparent", border: "1px solid rgba(255,255,255,0.1)",
                color: step === 0 ? "rgba(245,245,245,0.2)" : "rgba(245,245,245,0.5)",
                fontFamily: "'DM Sans', sans-serif", fontSize: "13px", fontWeight: 600,
                padding: "11px 20px", borderRadius: "8px",
                cursor: step === 0 ? "not-allowed" : "pointer", transition: "all 150ms ease",
              }}
            >
              <ChevronLeft size={15} /> Voltar
            </button>
            <button
              onClick={handleNext}
              style={{
                display: "flex", alignItems: "center", gap: "6px",
                background: "rgba(255,77,0,0.1)", border: "1px solid rgba(255,77,0,0.3)",
                color: "#FF4D00", fontFamily: "'DM Sans', sans-serif",
                fontSize: "13px", fontWeight: 700, padding: "11px 24px",
                borderRadius: "8px", cursor: "pointer", transition: "all 150ms ease",
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,77,0,0.18)" }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,77,0,0.1)" }}
            >
              {step === 3 ? "Ver resumo e gerar" : "Continuar"} <ChevronRight size={15} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
