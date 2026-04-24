"use client"

import { useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { CheckCircle2, Loader2, Upload, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"

const reportTypes = [
  "Maus-tratos",
  "Abandono",
  "Negligência",
  "Animal ferido",
  "Animal preso / sem liberdade",
  "Falta de água ou comida",
  "Falta de abrigo",
  "Agressão física",
  "Outro",
]

const ACCEPTED_FILE_TYPES = ["jpg", "jpeg", "png", "pdf", "mp4", "mov", "webm"]

const schema = z.object({
  denunciante_nome: z.string().optional(),
  denunciante_email: z.string().email("E-mail inválido").optional().or(z.literal("")),
  denunciante_telefone: z.string().optional(),
  denuncia_anonima: z.boolean().default(false),
  tipo_denuncia: z.string().min(1, "Selecione o tipo de denúncia"),
  data_ocorrencia: z.string().min(1, "Informe a data da ocorrência"),
  local_ocorrencia: z.string().min(5, "Informe o local com mais detalhes"),
  descricao_fato: z.string().min(20, "Descreva com pelo menos 20 caracteres"),
  risco_iminente: z.boolean().default(false),
  termos_aceite: z.literal(true, {
    errorMap: () => ({ message: "Você precisa aceitar os termos" }),
  }),
})

type FormValues = z.infer<typeof schema>

interface UploadedFile {
  name: string
  size: number
  id: string
}

export function ReportAbuse() {
  const [submitted, setSubmitted] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      denunciante_nome: "",
      denunciante_email: "",
      denunciante_telefone: "",
      denuncia_anonima: false,
      tipo_denuncia: "",
      data_ocorrencia: "",
      local_ocorrencia: "",
      descricao_fato: "",
      risco_iminente: false,
      termos_aceite: false as unknown as true,
    },
  })

  const denuncia_anonima = watch("denuncia_anonima")
  const selectedReportType = watch("tipo_denuncia")

  const onSubmit = async (_data: FormValues) => {
    // TODO: integrar com Supabase para enviar denúncia
    await new Promise((r) => setTimeout(r, 600))
    setSubmitted(true)
    setUploadedFiles([])
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    const newFiles: UploadedFile[] = []
    for (let i = 0; i < Math.min(files.length, 10 - uploadedFiles.length); i++) {
      const file = files[i]
      const ext = file.name.split(".").pop()?.toLowerCase()

      if (!ext || !ACCEPTED_FILE_TYPES.includes(ext)) {
        alert(`Arquivo "${file.name}" não é aceito. Tipos aceitos: ${ACCEPTED_FILE_TYPES.join(", ")}`)
        continue
      }

      newFiles.push({
        name: file.name,
        size: file.size,
        id: `${Date.now()}-${i}`,
      })
    }

    setUploadedFiles((prev) => [...prev, ...newFiles])
    e.target.value = ""
  }

  const removeFile = (id: string) => {
    setUploadedFiles((prev) => prev.filter((f) => f.id !== id))
  }

  return (
    <section id="denuncia" className="py-24 px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-12">
          <h2 className="text-4xl font-display font-extrabold text-primary tracking-tight mb-4 leading-tight">
            Denúncia de Maus-tratos ou Abandono de Animais
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Formulário para envio de denúncias com evidências sobre maus-tratos, abandono ou negligência contra animais.
          </p>
        </div>

        <div className="bg-surface-container-low rounded-3xl overflow-hidden p-8 lg:p-12">
          {submitted ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 rounded-full bg-secondary-container/40 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-secondary" />
              </div>
              <h3 className="font-display font-bold text-xl text-primary mb-2">
                Denúncia enviada com sucesso!
              </h3>
              <p className="text-sm text-muted-foreground mb-6">
                Sua denúncia foi recebida e será analisada por nossa equipe de triagem. Você receberá atualizações por {uploadedFiles.length > 0 ? "e-mail ou WhatsApp." : "e-mail ou WhatsApp."}
              </p>
              <Button
                onClick={() => {
                  setSubmitted(false)
                  setUploadedFiles([])
                }}
                className="bg-gradient-to-b from-primary to-primary-container text-primary-foreground font-bold rounded-lg"
              >
                Fazer outra denúncia
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Dados do denunciante */}
              <div className="space-y-4 pb-6 border-b border-border/40">
                <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--primary)' }} className="font-display">Dados do denunciante (opcional)</h3>

                <div>
                  <label htmlFor="denunciante_nome" style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--foreground)' }}>Nome completo do denunciante</label>
                  <Input
                    id="denunciante_nome"
                    placeholder="Opcional se a denúncia for anônima"
                    disabled={denuncia_anonima}
                    {...register("denunciante_nome")}
                    className="mt-1.5"
                    style={{
                      color: 'var(--foreground)',
                      fontSize: '0.875rem',
                      fontWeight: 400,
                      border: '1.5px solid var(--border)',
                      borderRadius: 'var(--radius)',
                      padding: '10px 12px',
                    } as React.CSSProperties}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="denunciante_email" style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--foreground)' }}>E-mail</label>
                    <Input
                      id="denunciante_email"
                      type="email"
                      placeholder="exemplo@dominio.com"
                      disabled={denuncia_anonima}
                      {...register("denunciante_email")}
                      className="mt-1.5"
                      style={{
                        color: 'var(--foreground)',
                        fontSize: '0.875rem',
                        fontWeight: 400,
                        border: '1.5px solid var(--border)',
                        borderRadius: 'var(--radius)',
                        padding: '10px 12px',
                      } as React.CSSProperties}
                    />
                    {errors.denunciante_email && (
                      <p style={{ fontSize: '0.75rem', color: 'var(--destructive)' }} className="mt-1">{errors.denunciante_email.message}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="denunciante_telefone" style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--foreground)' }}>Telefone / WhatsApp</label>
                    <Input
                      id="denunciante_telefone"
                      placeholder="(47) 99999-9999"
                      disabled={denuncia_anonima}
                      {...register("denunciante_telefone")}
                      className="mt-1.5"
                      style={{
                        color: 'var(--foreground)',
                        fontSize: '0.875rem',
                        fontWeight: 400,
                        border: '1.5px solid var(--border)',
                        borderRadius: 'var(--radius)',
                        padding: '10px 12px',
                      } as React.CSSProperties}
                    />
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Controller
                    name="denuncia_anonima"
                    control={control}
                    render={({ field }) => (
                      <label style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '13px', cursor: 'pointer', marginLeft: '-13px', marginTop: '-13px' }}>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={(v) => field.onChange(v === true)}
                          style={{
                            width: '18px',
                            height: '18px',
                            minWidth: '18px',
                            minHeight: '18px',
                            border: '2px solid var(--primary)',
                            borderRadius: '4px',
                          }}
                        />
                        <span style={{ fontSize: '0.875rem', color: 'var(--foreground)', fontWeight: 400, lineHeight: '1.5' }}>
                          Quero fazer esta denúncia de forma anônima
                        </span>
                      </label>
                    )}
                  />
                </div>
              </div>

              {/* Dados da denúncia */}
              <div className="space-y-4 pb-6 border-b border-border/40">
                <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--primary)' }} className="font-display">Detalhes da denúncia</h3>

                <div>
                  <label style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--foreground)', display: 'block' }}>
                    Tipo de denúncia
                    <span style={{ color: 'var(--destructive)', marginLeft: '3px' }}>*</span>
                  </label>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {reportTypes.map((type) => {
                      const isSelected = selectedReportType === type
                      return (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setValue("tipo_denuncia", type, { shouldValidate: true })}
                          style={{
                            background: isSelected ? 'var(--primary)' : 'var(--muted)',
                            color: isSelected ? 'var(--primary-foreground)' : 'var(--foreground)',
                            border: `1.5px solid ${isSelected ? 'var(--primary)' : 'var(--chip-border)'}`,
                            borderRadius: '999px',
                            padding: '6px 14px',
                            fontSize: '0.8125rem',
                            fontWeight: 500,
                            transition: 'background 150ms ease, color 150ms ease',
                            cursor: 'pointer',
                          }}
                        >
                          {isSelected && '✓ '}{type}
                        </button>
                      )
                    })}
                  </div>
                  {errors.tipo_denuncia && (
                    <p style={{ fontSize: '0.75rem', color: 'var(--destructive)' }} className="mt-1">{errors.tipo_denuncia.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="data_ocorrencia" style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--foreground)' }}>
                    Data da ocorrência
                    <span style={{ color: 'var(--destructive)', marginLeft: '3px' }}>*</span>
                  </label>
                  <Input
                    id="data_ocorrencia"
                    type="date"
                    {...register("data_ocorrencia")}
                    className="mt-1.5"
                    style={{
                      color: 'var(--foreground)',
                      fontSize: '0.875rem',
                      fontWeight: 400,
                      border: '1.5px solid var(--border)',
                      borderRadius: 'var(--radius)',
                      padding: '10px 12px',
                    } as React.CSSProperties}
                  />
                  {errors.data_ocorrencia && (
                    <p style={{ fontSize: '0.75rem', color: 'var(--destructive)' }} className="mt-1">{errors.data_ocorrencia.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="local_ocorrencia" style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--foreground)' }}>
                    Local da ocorrência
                    <span style={{ color: 'var(--destructive)', marginLeft: '3px' }}>*</span>
                  </label>
                  <Input
                    id="local_ocorrencia"
                    placeholder="Rua, número, bairro, cidade"
                    {...register("local_ocorrencia")}
                    className="mt-1.5"
                    style={{
                      color: 'var(--foreground)',
                      fontSize: '0.875rem',
                      fontWeight: 400,
                      border: '1.5px solid var(--border)',
                      borderRadius: 'var(--radius)',
                      padding: '10px 12px',
                    } as React.CSSProperties}
                  />
                  {errors.local_ocorrencia && (
                    <p style={{ fontSize: '0.75rem', color: 'var(--destructive)' }} className="mt-1">{errors.local_ocorrencia.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="descricao_fato" style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--foreground)' }}>
                    Descrição do fato
                    <span style={{ color: 'var(--destructive)', marginLeft: '3px' }}>*</span>
                  </label>
                  <Textarea
                    id="descricao_fato"
                    placeholder="Relate em um único campo tudo o que aconteceu: o que foi observado, como o animal estava, quem pode estar envolvido, há quanto tempo ocorre e qualquer detalhe importante."
                    rows={5}
                    {...register("descricao_fato")}
                    className="mt-1.5"
                    style={{
                      color: 'var(--foreground)',
                      fontSize: '0.875rem',
                      fontWeight: 400,
                      border: '1.5px solid var(--border)',
                      borderRadius: 'var(--radius)',
                      padding: '10px 12px',
                      minHeight: '120px',
                    } as React.CSSProperties}
                  />
                  {errors.descricao_fato && (
                    <p style={{ fontSize: '0.75rem', color: 'var(--destructive)' }} className="mt-1">{errors.descricao_fato.message}</p>
                  )}
                </div>
              </div>

              {/* Evidências */}
              <div className="space-y-4 pb-6 border-b border-border/40">
                <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--primary)' }} className="font-display">Anexar provas</h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)' }}>
                  Envie fotos, vídeos, áudios ou documentos que ajudem na apuração.
                </p>

                <div className="border-2 border-dashed border-border/40 rounded-lg p-6 text-center">
                  <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
                  <label className="cursor-pointer">
                    <span className="font-medium text-primary hover:underline">Clique para enviar</span>
                    {" "}ou arraste arquivos aqui
                    <input
                      type="file"
                      multiple
                      accept={ACCEPTED_FILE_TYPES.map((t) => `.${t}`).join(",")}
                      onChange={handleFileUpload}
                      disabled={uploadedFiles.length >= 10}
                      className="hidden"
                    />
                  </label>
                  <p style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)' }} className="mt-2">
                    Até 10 arquivos — JPG, PNG, PDF, MP4, MOV, WEBM
                  </p>
                </div>

                {uploadedFiles.length > 0 && (
                  <div className="space-y-2">
                    <p style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--foreground)' }}>
                      {uploadedFiles.length} arquivo{uploadedFiles.length !== 1 ? "s" : ""} anexado{uploadedFiles.length !== 1 ? "s" : ""}
                    </p>
                    <div className="space-y-2">
                      {uploadedFiles.map((file) => (
                        <div key={file.id} className="flex items-center justify-between bg-surface-container p-3 rounded-lg">
                          <div className="flex-1 min-w-0">
                            <p style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--foreground)' }} className="truncate">{file.name}</p>
                            <p style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>
                              {(file.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeFile(file.id)}
                            className="ml-2 text-destructive hover:bg-destructive/10 p-1 rounded"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Risco e Termos */}
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Controller
                    name="risco_iminente"
                    control={control}
                    render={({ field }) => (
                      <label style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '13px', cursor: 'pointer', marginLeft: '-13px', marginTop: '-13px' }}>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={(v) => field.onChange(v === true)}
                          style={{
                            width: '18px',
                            height: '18px',
                            minWidth: '18px',
                            minHeight: '18px',
                            border: '2px solid var(--primary)',
                            borderRadius: '4px',
                          }}
                        />
                        <span style={{ fontSize: '0.875rem', color: 'var(--foreground)', fontWeight: 400, lineHeight: '1.5' }}>
                          O animal está em risco iminente ou grave
                        </span>
                      </label>
                    )}
                  />
                </div>

                <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-4">
                  <p style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', lineHeight: '1.5' }}>
                    <strong>Se marcou essa opção:</strong> Além desta denúncia, acione imediatamente a Polícia Militar (190) ou Polícia Ambiental (IBAMA).
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <Controller
                    name="termos_aceite"
                    control={control}
                    render={({ field }) => (
                      <label style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '13px', cursor: 'pointer', marginLeft: '-13px', marginTop: '-13px' }}>
                        <Checkbox
                          checked={field.value === true}
                          onCheckedChange={(v) => field.onChange(v === true)}
                          style={{
                            width: '18px',
                            height: '18px',
                            minWidth: '18px',
                            minHeight: '18px',
                            border: '2px solid var(--primary)',
                            borderRadius: '4px',
                          }}
                        />
                        <span style={{ fontSize: '0.75rem', color: 'var(--foreground)', fontWeight: 400, lineHeight: '1.5' }}>
                          Li e concordo com os Termos de Uso e a Política de Privacidade deste site. Declaro, sob minha responsabilidade, que as informações prestadas nesta denúncia são verdadeiras e correspondem ao que presenciei ou constatei, ciente de que posso ser responsabilizado por informações falsas ou de má-fé.
                        </span>
                      </label>
                    )}
                  />
                </div>
                {errors.termos_aceite && (
                  <p style={{ fontSize: '0.75rem', color: 'var(--destructive)' }}>{errors.termos_aceite.message}</p>
                )}
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-b from-primary to-primary-container text-primary-foreground font-bold text-base py-6 rounded-lg shadow-md hover:scale-[0.99] transition-transform"
              >
                {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Enviar denúncia
              </Button>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
