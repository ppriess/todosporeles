"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/supabase/utils/supabase/client"
import { Loader2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { SC_MUNICIPALITIES } from "@/lib/sc-municipalities"

const TIPOS = [
  { value: "ong", label: "ONG" },
  { value: "orgao_governamental", label: "Órgão governamental" },
  { value: "grupo_local", label: "Grupo local de trabalho" },
]

const ATIVIDADES = [
  "Resgate e adoção",
  "Castração",
  "Proteção legal",
  "Educação e conscientização",
  "Saúde animal",
  "Fiscalização",
  "Manejo de fauna silvestre",
]

export type EntidadeFormData = {
  nome: string
  cnpj: string
  cidade: string
  tipo: string
  atividades: string[]
  descricao: string
  contato_nome: string
  email: string
  telefone: string
  website: string
  verificada: boolean
  ativa: boolean
}

type Props = {
  id?: string
  initial?: Partial<EntidadeFormData>
  mode: "create" | "edit"
}

const inputStyle: React.CSSProperties = {
  color: "var(--foreground)",
  fontSize: "0.875rem",
  fontWeight: 400,
  border: "1.5px solid var(--border)",
  borderRadius: "var(--radius)",
  padding: "10px 12px",
}

export function EntidadeForm({ id, initial, mode }: Props) {
  const router = useRouter()
  const [form, setForm] = useState<EntidadeFormData>({
    nome: initial?.nome ?? "",
    cnpj: initial?.cnpj ?? "",
    cidade: initial?.cidade ?? "",
    tipo: initial?.tipo ?? "",
    atividades: initial?.atividades ?? [],
    descricao: initial?.descricao ?? "",
    contato_nome: initial?.contato_nome ?? "",
    email: initial?.email ?? "",
    telefone: initial?.telefone ?? "",
    website: initial?.website ?? "",
    verificada: initial?.verificada ?? false,
    ativa: initial?.ativa ?? true,
  })
  const [loading, setLoading] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const set = (key: keyof EntidadeFormData) => (val: unknown) =>
    setForm((f) => ({ ...f, [key]: val }))

  const toggleAtividade = (v: string) =>
    setForm((f) => ({
      ...f,
      atividades: f.atividades.includes(v)
        ? f.atividades.filter((a) => a !== v)
        : [...f.atividades, v],
    }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const supabase = createClient()

    const payload = { ...form }
    let err
    if (mode === "create") {
      ;({ error: err } = await supabase.from("entidades").insert(payload))
    } else {
      ;({ error: err } = await supabase.from("entidades").update(payload).eq("id", id!))
    }

    if (err) {
      setError("Erro ao salvar. Tente novamente.")
      setLoading(false)
      return
    }
    router.push("/admin/entidades")
    router.refresh()
  }

  const handleDelete = async () => {
    if (!confirm("Deseja realmente excluir esta entidade?")) return
    setDeleting(true)
    const supabase = createClient()
    await supabase.from("entidades").delete().eq("id", id!)
    router.push("/admin/entidades")
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Dados principais */}
      <section className="bg-surface-container-low rounded-xl p-6 space-y-4">
        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Dados da entidade</h2>

        <div>
          <label style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--foreground)" }}>
            Nome <span style={{ color: "var(--destructive)" }}>*</span>
          </label>
          <Input value={form.nome} onChange={(e) => set("nome")(e.target.value)} required className="mt-1.5" style={inputStyle} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--foreground)" }}>CNPJ</label>
            <Input value={form.cnpj} onChange={(e) => set("cnpj")(e.target.value)} placeholder="00.000.000/0001-00" className="mt-1.5" style={inputStyle} />
          </div>
          <div>
            <label style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--foreground)", display: "block" }}>
              Tipo <span style={{ color: "var(--destructive)" }}>*</span>
            </label>
            <Select value={form.tipo} onValueChange={set("tipo")} required>
              <SelectTrigger className="mt-1.5" style={{ ...inputStyle, padding: "10px 12px" } as React.CSSProperties}>
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                {TIPOS.map((t) => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <label style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--foreground)", display: "block" }}>
            Cidade <span style={{ color: "var(--destructive)" }}>*</span>
          </label>
          <Select value={form.cidade} onValueChange={set("cidade")} required>
            <SelectTrigger className="mt-1.5" style={{ ...inputStyle, padding: "10px 12px" } as React.CSSProperties}>
              <SelectValue placeholder="Selecione a cidade" />
            </SelectTrigger>
            <SelectContent>
              {SC_MUNICIPALITIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--foreground)", display: "block" }}>
            Áreas de atuação <span style={{ color: "var(--destructive)" }}>*</span>
          </label>
          <div className="flex flex-wrap gap-2 mt-2">
            {ATIVIDADES.map((a) => {
              const active = form.atividades.includes(a)
              return (
                <button key={a} type="button" onClick={() => toggleAtividade(a)}
                  style={{
                    background: active ? "var(--primary)" : "var(--muted)",
                    color: active ? "var(--primary-foreground)" : "var(--foreground)",
                    border: `1.5px solid ${active ? "var(--primary)" : "var(--border)"}`,
                    borderRadius: "999px", padding: "6px 14px", fontSize: "0.8125rem", fontWeight: 500, cursor: "pointer",
                  }}>
                  {active && "✓ "}{a}
                </button>
              )
            })}
          </div>
        </div>

        <div>
          <label style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--foreground)" }}>
            Descrição <span style={{ color: "var(--destructive)" }}>*</span>
          </label>
          <Textarea value={form.descricao} onChange={(e) => set("descricao")(e.target.value)} required rows={3}
            className="mt-1.5" style={{ ...inputStyle, minHeight: "80px" } as React.CSSProperties} />
        </div>
      </section>

      {/* Contato */}
      <section className="bg-surface-container-low rounded-xl p-6 space-y-4">
        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Contato</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--foreground)" }}>Responsável</label>
            <Input value={form.contato_nome} onChange={(e) => set("contato_nome")(e.target.value)} className="mt-1.5" style={inputStyle} />
          </div>
          <div>
            <label style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--foreground)" }}>E-mail</label>
            <Input type="email" value={form.email} onChange={(e) => set("email")(e.target.value)} className="mt-1.5" style={inputStyle} />
          </div>
          <div>
            <label style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--foreground)" }}>Telefone</label>
            <Input value={form.telefone} onChange={(e) => set("telefone")(e.target.value)} className="mt-1.5" style={inputStyle} />
          </div>
          <div>
            <label style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--foreground)" }}>Website</label>
            <Input value={form.website} onChange={(e) => set("website")(e.target.value)} placeholder="https://" className="mt-1.5" style={inputStyle} />
          </div>
        </div>
      </section>

      {/* Flags */}
      <section className="bg-surface-container-low rounded-xl p-6 space-y-3">
        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Configurações</h2>
        <label className="flex items-center gap-3 cursor-pointer">
          <Checkbox checked={form.verificada} onCheckedChange={(v) => set("verificada")(v === true)}
            style={{ width: 18, height: 18, border: "2px solid var(--primary)", borderRadius: 4 }} />
          <span style={{ fontSize: "0.875rem", color: "var(--foreground)" }}>Entidade verificada</span>
        </label>
        <label className="flex items-center gap-3 cursor-pointer">
          <Checkbox checked={form.ativa} onCheckedChange={(v) => set("ativa")(v === true)}
            style={{ width: 18, height: 18, border: "2px solid var(--primary)", borderRadius: 4 }} />
          <span style={{ fontSize: "0.875rem", color: "var(--foreground)" }}>Visível no diretório público</span>
        </label>
      </section>

      {error && (
        <div className="flex items-center gap-2 bg-destructive/5 border border-destructive/20 rounded-lg p-3">
          <AlertCircle className="w-4 h-4 text-destructive" />
          <p style={{ fontSize: "0.875rem", color: "var(--destructive)" }}>{error}</p>
        </div>
      )}

      <div className="flex gap-3">
        <Button type="submit" disabled={loading}
          className="bg-gradient-to-b from-primary to-primary-container text-primary-foreground font-bold rounded-lg px-6">
          {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          {mode === "create" ? "Criar entidade" : "Salvar alterações"}
        </Button>
        {mode === "edit" && (
          <Button type="button" onClick={handleDelete} disabled={deleting} variant="destructive" className="rounded-lg px-6">
            {deleting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Excluir
          </Button>
        )}
      </div>
    </form>
  )
}
