"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { AlertTriangle, CheckCircle, XCircle, ToggleLeft, ToggleRight, Save } from "lucide-react"

interface SystemConfig {
  maintenance_mode: boolean
  generations_enabled: boolean
  registrations_enabled: boolean
  payments_enabled: boolean
  emergency_mode: boolean
  maintenance_message: string
  max_generations_per_hour: number
  max_generations_per_day: number
  max_login_attempts_per_hour: number
}

interface SecurityLog {
  id: string
  type: string
  ip: string | null
  details: string
  created_at: string
  user_name: string | null
  user_email: string | null
}

type EmergencyStep = 1 | 2 | 3

const LOG_COLORS: Record<string, [string, string]> = {
  admin_action:   ["#00E5FF",   "rgba(0,229,255,0.08)"],
  failed_auth:    ["#FCD34D",   "rgba(252,211,77,0.08)"],
  rate_limit:     ["#FF4D00",   "rgba(255,77,0,0.08)"],
  suspicious_gen: ["#ef4444",   "rgba(239,68,68,0.08)"],
  emergency:      ["#ef4444",   "rgba(239,68,68,0.12)"],
}

function StatusDot({ ok }: { ok: boolean }) {
  return <span style={{ display: "inline-block", width: "8px", height: "8px", borderRadius: "50%", background: ok ? "#4ADE80" : "#ef4444", flexShrink: 0 }} />
}

function Toggle({ enabled, onChange, disabled }: { enabled: boolean; onChange: () => void; disabled?: boolean }) {
  return (
    <button onClick={onChange} disabled={disabled} style={{ background: "none", border: "none", cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.4 : 1, color: enabled ? "#4ADE80" : "rgba(245,245,245,0.2)", display: "flex", alignItems: "center" }}>
      {enabled ? <ToggleRight size={28} /> : <ToggleLeft size={28} />}
    </button>
  )
}

export default function AdminSegurancaPage() {
  const [cfg, setCfg] = useState<SystemConfig | null>(null)
  const [services, setServices] = useState({ fal: "loading", r2: "loading" })
  const [logs, setLogs] = useState<SecurityLog[]>([])
  const [logType, setLogType] = useState("")
  const [saving, setSaving] = useState(false)
  const [emergencyModal, setEmergencyModal] = useState(false)
  const [emergencyStep, setEmergencyStep] = useState<EmergencyStep>(1)
  const [emergencyInput, setEmergencyInput] = useState("")
  const [rateValues, setRateValues] = useState({ max_generations_per_hour: 20, max_generations_per_day: 100, max_login_attempts_per_hour: 10 })
  const [msgValue, setMsgValue] = useState("")

  const token = typeof window !== "undefined" ? localStorage.getItem("mf_token") ?? "" : ""
  const headers = { "Content-Type": "application/json", Authorization: `Bearer ${token}` }

  const loadStatus = useCallback(async () => {
    const res = await fetch("/api/admin/seguranca/status", { headers })
    if (!res.ok) return
    const d = await res.json()
    setCfg(d.config)
    setServices(d.services)
    setRateValues({
      max_generations_per_hour: d.config?.max_generations_per_hour ?? 20,
      max_generations_per_day: d.config?.max_generations_per_day ?? 100,
      max_login_attempts_per_hour: d.config?.max_login_attempts_per_hour ?? 10,
    })
    setMsgValue(d.config?.maintenance_message ?? "")
  }, [])

  const loadLogs = useCallback(async () => {
    const q = logType ? `?type=${logType}` : ""
    const res = await fetch(`/api/admin/seguranca/logs${q}`, { headers })
    if (!res.ok) return
    const d = await res.json()
    setLogs(d.logs ?? [])
  }, [logType])

  useEffect(() => {
    loadStatus()
    loadLogs()
    const interval = setInterval(loadStatus, 30000)
    return () => clearInterval(interval)
  }, [loadStatus, loadLogs])

  useEffect(() => { loadLogs() }, [loadLogs])

  async function toggle(key: keyof SystemConfig) {
    if (!cfg) return
    setSaving(true)
    try {
      const res = await fetch("/api/admin/seguranca/config", { method: "PATCH", headers, body: JSON.stringify({ [key]: !cfg[key] }) })
      if (res.ok) await loadStatus()
    } finally { setSaving(false) }
  }

  async function saveRateLimits() {
    setSaving(true)
    try {
      await fetch("/api/admin/seguranca/config", { method: "PATCH", headers, body: JSON.stringify(rateValues) })
      await loadStatus()
    } finally { setSaving(false) }
  }

  async function saveMessage() {
    setSaving(true)
    try {
      await fetch("/api/admin/seguranca/config", { method: "PATCH", headers, body: JSON.stringify({ maintenance_message: msgValue }) })
      await loadStatus()
    } finally { setSaving(false) }
  }

  async function activateEmergency(activate: boolean) {
    setSaving(true)
    try {
      await fetch("/api/admin/seguranca/config", {
        method: "PATCH", headers,
        body: JSON.stringify({
          emergency_mode: activate,
          ...(activate ? { maintenance_mode: true, generations_enabled: false, registrations_enabled: false, payments_enabled: false } : {})
        })
      })
      setEmergencyModal(false)
      setEmergencyStep(1)
      setEmergencyInput("")
      await loadStatus()
      await loadLogs()
    } finally { setSaving(false) }
  }

  if (!cfg) return <div style={{ padding: "24px", color: "rgba(245,245,245,0.4)", fontFamily: "'DM Sans', sans-serif" }}>Carregando...</div>

  const emergency = cfg.emergency_mode
  const cardStyle: React.CSSProperties = { background: "#111111", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "12px", padding: "20px 24px", marginBottom: "16px" }
  const sectionTitle: React.CSSProperties = { fontSize: "11px", fontWeight: 700, color: "rgba(245,245,245,0.35)", fontFamily: "'DM Sans', sans-serif", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "16px" }

  return (
    <div style={{ padding: "24px", maxWidth: "700px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
        <h1 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "20px", fontWeight: 700, color: "#F5F5F5" }}>Segurança</h1>
        {emergency && (
          <motion.span animate={{ opacity: [1, 0.4, 1] }} transition={{ repeat: Infinity, duration: 1.5 }}
            style={{ background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.4)", color: "#ef4444", fontSize: "11px", fontWeight: 700, padding: "3px 10px", borderRadius: "9999px", fontFamily: "'DM Sans', sans-serif" }}>
            ⚠️ EMERGÊNCIA ATIVA
          </motion.span>
        )}
      </div>

      {/* Seção 1 — Status */}
      <div style={cardStyle}>
        <div style={sectionTitle}>Status do Sistema</div>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {[
            ["Plataforma", !cfg.maintenance_mode && !emergency],
            ["Gerações",   cfg.generations_enabled && !emergency],
            ["Cadastros",  cfg.registrations_enabled && !emergency],
            ["Pagamentos", cfg.payments_enabled && !emergency],
            ["fal.ai",     services.fal === "connected"],
            ["R2 Storage", services.r2 === "connected"],
          ].map(([label, ok]) => (
            <div key={label as string} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <StatusDot ok={ok as boolean} />
              <span style={{ fontSize: "13px", color: "#F5F5F5", fontFamily: "'DM Sans', sans-serif", flex: 1 }}>{label as string}</span>
              <span style={{ fontSize: "12px", color: (ok as boolean) ? "#4ADE80" : "#ef4444", fontFamily: "'DM Sans', sans-serif" }}>{(ok as boolean) ? "Online" : "Offline"}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Seção 2 — Controles */}
      <div style={cardStyle}>
        <div style={sectionTitle}>Controles do Sistema</div>
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          {[
            { key: "maintenance_mode"      as const, label: "Modo Manutenção",   desc: "Redireciona usuários para página de manutenção" },
            { key: "generations_enabled"   as const, label: "Gerações",           desc: "Pausar desabilita todas as novas gerações" },
            { key: "registrations_enabled" as const, label: "Novos Cadastros",    desc: "Bloquear impede criação de novas contas" },
            { key: "payments_enabled"      as const, label: "Pagamentos",         desc: "Pausar ignora webhooks de pagamento" },
          ].map(({ key, label, desc }) => (
            <div key={key} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <Toggle enabled={cfg[key] as boolean} onChange={() => toggle(key)} disabled={emergency || saving} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "13px", fontWeight: 600, color: "#F5F5F5", fontFamily: "'DM Sans', sans-serif" }}>{label}</div>
                <div style={{ fontSize: "11px", color: "rgba(245,245,245,0.4)", fontFamily: "'DM Sans', sans-serif" }}>{desc}</div>
              </div>
              <span style={{ fontSize: "11px", color: (cfg[key] as boolean) ? "#4ADE80" : "rgba(245,245,245,0.3)", fontFamily: "'DM Sans', sans-serif" }}>{(cfg[key] as boolean) ? "Ativo" : "Inativo"}</span>
            </div>
          ))}
        </div>
        {cfg.maintenance_mode && (
          <div style={{ marginTop: "16px", paddingTop: "16px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
            <div style={{ fontSize: "11px", fontWeight: 700, color: "rgba(245,245,245,0.35)", fontFamily: "'DM Sans', sans-serif", marginBottom: "8px", letterSpacing: "1px", textTransform: "uppercase" }}>Mensagem de manutenção</div>
            <div style={{ display: "flex", gap: "8px" }}>
              <input value={msgValue} onChange={e => setMsgValue(e.target.value)}
                style={{ flex: 1, background: "#0D0D0D", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "8px", padding: "8px 12px", color: "#F5F5F5", fontSize: "13px", fontFamily: "'DM Sans', sans-serif", outline: "none" }} />
              <button onClick={saveMessage} disabled={saving} style={{ background: "#FF4D00", color: "white", border: "none", borderRadius: "8px", padding: "8px 14px", fontSize: "12px", fontWeight: 700, fontFamily: "'DM Sans', sans-serif", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px" }}>
                <Save size={12} /> Salvar
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Seção 3 — Emergência */}
      <motion.div
        animate={emergency ? { borderColor: ["rgba(239,68,68,0.3)", "rgba(239,68,68,0.7)", "rgba(239,68,68,0.3)"] } : {}}
        transition={{ repeat: Infinity, duration: 2 }}
        style={{ background: "rgba(239,68,68,0.05)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: "12px", padding: "24px", marginBottom: "16px", textAlign: "center" }}
      >
        <div style={{ fontSize: "16px", fontWeight: 700, color: "#ef4444", fontFamily: "'DM Sans', sans-serif", marginBottom: "8px" }}>🚨 MODO EMERGÊNCIA</div>
        <p style={{ fontSize: "12px", color: "rgba(245,245,245,0.4)", fontFamily: "'DM Sans', sans-serif", marginBottom: "20px", lineHeight: 1.6 }}>
          Desliga tudo simultaneamente: gerações, cadastros, pagamentos e ativa manutenção.<br />Use apenas em situações críticas.
        </p>
        <button onClick={() => { setEmergencyModal(true); setEmergencyStep(emergency ? 1 : 1) }}
          style={{
            background: emergency ? "#4ADE80" : "#ef4444",
            color: "white",
            border: "none",
            borderRadius: "8px",
            padding: "12px 28px",
            fontSize: "14px",
            fontWeight: 700,
            fontFamily: "'DM Sans', sans-serif",
            cursor: "pointer",
            letterSpacing: "1px",
            textTransform: "uppercase",
          }}>
          {emergency ? "✅ DESATIVAR EMERGÊNCIA" : "🚨 ATIVAR EMERGÊNCIA"}
        </button>
      </motion.div>

      {/* Seção 4 — Logs */}
      <div style={cardStyle}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
          <div style={sectionTitle}>Atividade Suspeita</div>
          <select value={logType} onChange={e => setLogType(e.target.value)}
            style={{ background: "#0D0D0D", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "6px", padding: "5px 10px", color: "#F5F5F5", fontSize: "12px", fontFamily: "'DM Sans', sans-serif", outline: "none", cursor: "pointer" }}>
            <option value="">Todos</option>
            <option value="admin_action">Admin Action</option>
            <option value="failed_auth">Failed Auth</option>
            <option value="rate_limit">Rate Limit</option>
            <option value="emergency">Emergência</option>
          </select>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "6px", maxHeight: "340px", overflowY: "auto", scrollbarWidth: "none" }}>
          {logs.slice(0, 50).map(l => {
            const [color, bg] = LOG_COLORS[l.type] ?? ["rgba(245,245,245,0.4)", "rgba(255,255,255,0.05)"]
            return (
              <div key={l.id} style={{ display: "flex", alignItems: "flex-start", gap: "10px", padding: "8px 10px", borderRadius: "6px", background: bg }}>
                <span style={{ background: bg, color, fontSize: "10px", fontWeight: 700, padding: "2px 7px", borderRadius: "9999px", fontFamily: "'DM Sans', sans-serif", whiteSpace: "nowrap" }}>{l.type}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: "12px", color: "#F5F5F5", fontFamily: "'DM Sans', sans-serif", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{l.details}</div>
                  <div style={{ fontSize: "10px", color: "rgba(245,245,245,0.35)", fontFamily: "'DM Sans', sans-serif", marginTop: "2px" }}>
                    {l.user_name ?? "—"} · {l.ip ?? "—"} · {new Date(l.created_at).toLocaleString("pt-BR")}
                  </div>
                </div>
              </div>
            )
          })}
          {logs.length === 0 && <div style={{ color: "rgba(245,245,245,0.3)", fontSize: "12px", fontFamily: "'DM Sans', sans-serif" }}>Nenhum log ainda.</div>}
        </div>
      </div>

      {/* Seção 6 — Rate Limiting */}
      <div style={cardStyle}>
        <div style={sectionTitle}>Rate Limiting</div>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {[
            { key: "max_generations_per_hour" as const, label: "Gerações por usuário / hora" },
            { key: "max_generations_per_day"  as const, label: "Gerações por usuário / dia"  },
            { key: "max_login_attempts_per_hour" as const, label: "Tentativas de login / hora" },
          ].map(({ key, label }) => (
            <div key={key} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <span style={{ flex: 1, fontSize: "13px", color: "#F5F5F5", fontFamily: "'DM Sans', sans-serif" }}>{label}</span>
              <input type="number" value={rateValues[key]} onChange={e => setRateValues(v => ({ ...v, [key]: Number(e.target.value) }))}
                style={{ width: "80px", background: "#0D0D0D", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "6px", padding: "6px 10px", color: "#00E5FF", fontSize: "13px", fontFamily: "'Space Grotesk', sans-serif", outline: "none", textAlign: "center" }} />
            </div>
          ))}
          <button onClick={saveRateLimits} disabled={saving}
            style={{ marginTop: "4px", alignSelf: "flex-end", background: "#FF4D00", color: "white", border: "none", borderRadius: "8px", padding: "8px 16px", fontSize: "12px", fontWeight: 700, fontFamily: "'DM Sans', sans-serif", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}>
            <Save size={12} /> Salvar configurações
          </button>
        </div>
      </div>

      {/* Modal de emergência */}
      <AnimatePresence>
        {emergencyModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}
            onClick={() => { setEmergencyModal(false); setEmergencyStep(1); setEmergencyInput("") }}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              style={{ background: "#111111", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "12px", padding: "28px", width: "400px", maxWidth: "92vw" }}
              onClick={e => e.stopPropagation()}>

              {emergency ? (
                <>
                  <div style={{ fontSize: "16px", fontWeight: 700, color: "#4ADE80", fontFamily: "'DM Sans', sans-serif", marginBottom: "12px" }}>Desativar Emergência?</div>
                  <p style={{ fontSize: "13px", color: "rgba(245,245,245,0.5)", fontFamily: "'DM Sans', sans-serif", marginBottom: "20px" }}>Isso irá reativar gerações, cadastros e pagamentos.</p>
                  <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
                    <button onClick={() => { setEmergencyModal(false) }} style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(245,245,245,0.6)", borderRadius: "6px", padding: "8px 14px", fontSize: "12px", fontFamily: "'DM Sans', sans-serif", cursor: "pointer" }}>Cancelar</button>
                    <button onClick={() => activateEmergency(false)} disabled={saving} style={{ background: "#4ADE80", color: "#0D0D0D", border: "none", borderRadius: "6px", padding: "8px 16px", fontSize: "12px", fontWeight: 700, fontFamily: "'DM Sans', sans-serif", cursor: "pointer" }}>Desativar</button>
                  </div>
                </>
              ) : (
                <>
                  <div style={{ fontSize: "16px", fontWeight: 700, color: "#ef4444", fontFamily: "'DM Sans', sans-serif", marginBottom: "8px" }}>
                    🚨 Ativar Emergência — Etapa {emergencyStep}/3
                  </div>

                  {emergencyStep === 1 && (
                    <>
                      <p style={{ fontSize: "13px", color: "rgba(245,245,245,0.5)", fontFamily: "'DM Sans', sans-serif", marginBottom: "20px" }}>Você está prestes a desligar toda a plataforma.</p>
                      <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
                        <button onClick={() => setEmergencyModal(false)} style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(245,245,245,0.6)", borderRadius: "6px", padding: "8px 14px", fontSize: "12px", fontFamily: "'DM Sans', sans-serif", cursor: "pointer" }}>Cancelar</button>
                        <button onClick={() => setEmergencyStep(2)} style={{ background: "#ef4444", color: "white", border: "none", borderRadius: "6px", padding: "8px 16px", fontSize: "12px", fontWeight: 700, fontFamily: "'DM Sans', sans-serif", cursor: "pointer" }}>Continuar →</button>
                      </div>
                    </>
                  )}

                  {emergencyStep === 2 && (
                    <>
                      <p style={{ fontSize: "13px", color: "rgba(245,245,245,0.5)", fontFamily: "'DM Sans', sans-serif", marginBottom: "20px" }}>Esta ação vai pausar gerações, cadastros e pagamentos simultaneamente.</p>
                      <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
                        <button onClick={() => setEmergencyStep(1)} style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(245,245,245,0.6)", borderRadius: "6px", padding: "8px 14px", fontSize: "12px", fontFamily: "'DM Sans', sans-serif", cursor: "pointer" }}>← Voltar</button>
                        <button onClick={() => setEmergencyStep(3)} style={{ background: "#ef4444", color: "white", border: "none", borderRadius: "6px", padding: "8px 16px", fontSize: "12px", fontWeight: 700, fontFamily: "'DM Sans', sans-serif", cursor: "pointer" }}>Continuar →</button>
                      </div>
                    </>
                  )}

                  {emergencyStep === 3 && (
                    <>
                      <p style={{ fontSize: "13px", color: "rgba(245,245,245,0.5)", fontFamily: "'DM Sans', sans-serif", marginBottom: "12px" }}>Digite <strong style={{ color: "#ef4444" }}>EMERGENCIA</strong> para confirmar:</p>
                      <input value={emergencyInput} onChange={e => setEmergencyInput(e.target.value)}
                        style={{ width: "100%", boxSizing: "border-box", background: "#0D0D0D", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "8px", padding: "10px 12px", color: "#F5F5F5", fontSize: "13px", fontFamily: "'DM Sans', sans-serif", outline: "none", marginBottom: "16px" }}
                        placeholder="EMERGENCIA" />
                      <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
                        <button onClick={() => setEmergencyStep(2)} style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(245,245,245,0.6)", borderRadius: "6px", padding: "8px 14px", fontSize: "12px", fontFamily: "'DM Sans', sans-serif", cursor: "pointer" }}>← Voltar</button>
                        <button disabled={emergencyInput !== "EMERGENCIA" || saving} onClick={() => activateEmergency(true)}
                          style={{ background: "#ef4444", color: "white", border: "none", borderRadius: "6px", padding: "8px 16px", fontSize: "12px", fontWeight: 700, fontFamily: "'DM Sans', sans-serif", cursor: "pointer", opacity: emergencyInput === "EMERGENCIA" ? 1 : 0.4, letterSpacing: "1px" }}>
                          🚨 CONFIRMAR EMERGÊNCIA
                        </button>
                      </div>
                    </>
                  )}
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
