"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { createClient } from "@/supabase/utils/supabase/client"
import { AlertTriangle, ArrowLeft, Loader2, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const STATUS_OPTIONS = [
  { value: "recebida", label: "Recebida" },
  { value: "em_analise", label: "Em análise" },
  { value: "encaminhada", label: "Encaminhada" },
  { value: "arquivada", label: "Arquivada" },
]

type Denuncia = {
  id: string
  created_at: string
  denunciante_nome: string | null
  denunciante_email: string | null
  denunciante_telefone: string | null
  denuncia_anonima: boolean
  tipo_denuncia: string
  data_ocorrencia: string
  local_ocorrencia: string
  descricao_fato: string
  risco_iminente: boolean
  evidencias_urls: string[]
  status: string
}

export default function DenunciaDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [denuncia, setDenuncia] = useState<Denuncia | null>(null)
  const [loading, setLoading] = useState(true)
  const [savingStatus, setSavingStatus] = useState(false)
  const [emailDest, setEmailDest] = useState("")
  const [sendingEmail, setSendingEmail] = useState(false)
  const [emailFeedback, setEmailFeedback] = useState<{ ok: boolean; msg: string } | null>(null)

  useEffect(() => {
    const supabase = createClient()
    supabase.from("denuncias").select("*").eq("id", id).single().then(({ data }) => {
      setDenuncia(data)
      setLoading(false)
    })
  }, [id])

  const handleStatusChange = async (newStatus: string) => {
    if (!denuncia) return
    setSavingStatus(true)
    const supabase = createClient()
    await supabase.from("denuncias").update({ status: newStatus }).eq("id", id)
    setDenuncia((d) => d ? { ...d, status: newStatus } : d)
    setSavingStatus(false)
  }

  const handleSendEmail = async () => {
    if (!emailDest) return
    setSendingEmail(true)
    setEmailFeedback(null)
    const res = await fetch("/api/email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ denunciaId: id, destinatario: emailDest }),
    })
    const json = await res.json()
    setEmailFeedback({ ok: res.ok, msg: res.ok ? "Email enviado com sucesso!" : (json.error ?? "Erro ao enviar.") })
    setSendingEmail(false)
  }

  if (loading) return <div className="p-8 text-sm text-muted-foreground">Carregando...</div>
  if (!denuncia) return <div className="p-8 text-sm text-destructive">Denúncia não encontrada.</div>

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Voltar
      </button>

      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-2">
            {denuncia.risco_iminente && <AlertTriangle className="w-5 h-5 text-destructive" />}
            <h1 className="text-xl font-display font-bold text-primary">{denuncia.tipo_denuncia}</h1>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Recebida em {new Date(denuncia.created_at).toLocaleDateString("pt-BR", { dateStyle: "full" })}
          </p>
        </div>
      </div>

      {/* Status */}
      <section className="bg-surface-container-low rounded-xl p-5 mb-4">
        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Status</h2>
        <div className="flex flex-wrap gap-2">
          {STATUS_OPTIONS.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => handleStatusChange(value)}
              disabled={savingStatus}
              className="px-3 py-1.5 rounded-full text-xs font-medium border transition-colors"
              style={{
                background: denuncia.status === value ? "var(--primary)" : "transparent",
                color: denuncia.status === value ? "var(--primary-foreground)" : "var(--foreground)",
                borderColor: denuncia.status === value ? "var(--primary)" : "var(--border)",
              }}
            >
              {label}
            </button>
          ))}
          {savingStatus && <Loader2 className="w-4 h-4 animate-spin text-muted-foreground self-center" />}
        </div>
      </section>

      {/* Dados da denúncia */}
      <section className="bg-surface-container-low rounded-xl p-5 mb-4 space-y-3">
        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Detalhes</h2>
        <Row label="Data da ocorrência" value={new Date(denuncia.data_ocorrencia).toLocaleDateString("pt-BR")} />
        <Row label="Local" value={denuncia.local_ocorrencia} />
        <Row label="Descrição" value={denuncia.descricao_fato} multiline />
        {denuncia.evidencias_urls.length > 0 && (
          <div>
            <span className="text-xs font-semibold text-muted-foreground">Evidências</span>
            <ul className="mt-1 space-y-1">
              {denuncia.evidencias_urls.map((url) => (
                <li key={url} className="text-xs text-primary underline truncate">{url}</li>
              ))}
            </ul>
          </div>
        )}
      </section>

      {/* Denunciante */}
      <section className="bg-surface-container-low rounded-xl p-5 mb-4 space-y-3">
        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Denunciante</h2>
        {denuncia.denuncia_anonima
          ? <p className="text-sm text-muted-foreground">Anônimo</p>
          : <>
              <Row label="Nome" value={denuncia.denunciante_nome ?? "—"} />
              <Row label="E-mail" value={denuncia.denunciante_email ?? "—"} />
              <Row label="Telefone" value={denuncia.denunciante_telefone ?? "—"} />
            </>
        }
      </section>

      {/* Encaminhar por email */}
      <section className="bg-surface-container-low rounded-xl p-5">
        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Encaminhar por e-mail</h2>
        <div className="flex gap-2">
          <Input
            type="email"
            placeholder="destinatario@orgao.gov.br"
            value={emailDest}
            onChange={(e) => setEmailDest(e.target.value)}
            style={{
              fontSize: "0.875rem",
              border: "1.5px solid var(--border)",
              borderRadius: "var(--radius)",
              padding: "8px 12px",
              color: "var(--foreground)",
            } as React.CSSProperties}
          />
          <Button
            onClick={handleSendEmail}
            disabled={sendingEmail || !emailDest}
            className="bg-gradient-to-b from-primary to-primary-container text-primary-foreground font-bold rounded-lg shrink-0"
          >
            {sendingEmail ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
            <span className="ml-2">Enviar</span>
          </Button>
        </div>
        {emailFeedback && (
          <p className="text-xs mt-2" style={{ color: emailFeedback.ok ? "var(--secondary)" : "var(--destructive)" }}>
            {emailFeedback.msg}
          </p>
        )}
      </section>
    </div>
  )
}

function Row({ label, value, multiline }: { label: string; value: string; multiline?: boolean }) {
  return (
    <div>
      <span className="text-xs font-semibold text-muted-foreground">{label}</span>
      {multiline
        ? <p className="text-sm text-foreground mt-0.5 whitespace-pre-wrap">{value}</p>
        : <p className="text-sm text-foreground mt-0.5">{value}</p>
      }
    </div>
  )
}
