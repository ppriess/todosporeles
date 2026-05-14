"use client"

import { useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import content from "@/data/home-content.json"

const { registerNGO, ngoDirectory } = content
const { form: formCopy, benefits, title, description, entityTypes } = registerNGO
const activityTypes = ngoDirectory.activityTypes.filter((t) => t !== "Todos os tipos")

const schema = z.object({
  ngoName: z.string().min(3, "Informe o nome da organização"),
  tipo: z.string().min(1, "Selecione o tipo de entidade"),
  cnpj: z
    .string()
    .min(14, "Informe um CNPJ válido")
    .regex(/^[\d./-]+$/, "CNPJ deve conter apenas números e pontuação"),
  city: z.string().min(1, "Selecione uma cidade"),
  contactName: z.string().min(3, "Informe o nome do responsável"),
  email: z.string().email("E-mail inválido"),
  phone: z.string().min(10, "Informe um telefone válido"),
  activities: z.array(z.string()).min(1, "Selecione ao menos uma área"),
  about: z.string().min(20, "Descreva brevemente (mínimo 20 caracteres)"),
  terms: z.literal(true, {
    errorMap: () => ({ message: "Você precisa aceitar os termos" }),
  }),
})

type FormValues = z.infer<typeof schema>

export function RegisterNGO() {
  const [submitted, setSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

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
      ngoName: "",
      tipo: "",
      cnpj: "",
      city: "",
      contactName: "",
      email: "",
      phone: "",
      activities: [],
      about: "",
      terms: false as unknown as true,
    },
  })

  const selectedActivities = watch("activities") ?? []

  const toggleActivity = (value: string) => {
    const next = selectedActivities.includes(value)
      ? selectedActivities.filter((a) => a !== value)
      : [...selectedActivities, value]
    setValue("activities", next, { shouldValidate: true })
  }

  const onSubmit = async (data: FormValues) => {
    setSubmitError(null)
    try {
      const { error } = await supabase.from("ngo_registrations").insert({
        ngo_name: data.ngoName,
        tipo: data.tipo,
        cnpj: data.cnpj,
        city: data.city,
        contact_name: data.contactName,
        email: data.email,
        phone: data.phone,
        activities: data.activities,
        about: data.about,
      })
      if (error) throw error
      setSubmitted(true)
    } catch (err) {
      console.error("Erro ao enviar cadastro:", err)
      setSubmitError("Ocorreu um erro ao enviar o cadastro. Por favor, tente novamente.")
    }
  }

  return (
    <section id="cadastrar" className="py-24 px-6 lg:px-8">
      <div className="max-w-7xl mx-auto bg-surface-container-high rounded-3xl overflow-hidden grid grid-cols-1 lg:grid-cols-2">
        <div className="p-10 lg:p-16 flex flex-col justify-start">
          <h2 className="text-4xl font-display font-extrabold text-primary tracking-tight mb-6 leading-tight">
            {title}
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-8">
            {description}
          </p>

          <ul className="space-y-3">
            {benefits.map((benefit) => (
              <li key={benefit} className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                <span className="font-medium text-foreground">{benefit}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="p-8 lg:p-12 bg-surface-container-lowest">
          {submitted ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 rounded-full bg-secondary-container/40 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-secondary" />
              </div>
              <h3 className="font-display font-bold text-xl text-primary mb-2">
                Cadastro enviado!
              </h3>
              <p className="text-sm text-muted-foreground">
                Recebemos seus dados e entraremos em contato para concluir a verificação.
              </p>
            </div>
          ) : (
            <>
              <h3 className="font-display font-bold text-lg text-primary mb-1">
                {formCopy.heading}
              </h3>
              <p className="text-sm text-muted-foreground mb-6">
                {formCopy.subheading}
              </p>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div>
                  <label htmlFor="ngoName" style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--foreground)' }}>
                    {formCopy.fields.ngoName.label}
                    <span style={{ color: 'var(--destructive)', marginLeft: '3px' }}>*</span>
                  </label>
                  <Input
                    id="ngoName"
                    placeholder={formCopy.fields.ngoName.placeholder}
                    {...register("ngoName")}
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
                  {errors.ngoName && (
                    <p style={{ fontSize: '0.75rem', color: 'var(--destructive)' }} className="mt-1">{errors.ngoName.message}</p>
                  )}
                </div>

                <div>
                  <label style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--foreground)', display: 'block' }}>
                    {formCopy.fields.tipo.label}
                    <span style={{ color: 'var(--destructive)', marginLeft: '3px' }}>*</span>
                  </label>
                  <Controller
                    name="tipo"
                    control={control}
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger
                          className="mt-1.5"
                          style={{
                            color: 'var(--foreground)',
                            fontSize: '0.875rem',
                            border: '1.5px solid var(--border)',
                            borderRadius: 'var(--radius)',
                            padding: '10px 12px',
                          } as React.CSSProperties}
                        >
                          <SelectValue placeholder={formCopy.fields.tipo.placeholder} />
                        </SelectTrigger>
                        <SelectContent>
                          {entityTypes.map((t) => (
                            <SelectItem key={t} value={t}>{t}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.tipo && (
                    <p style={{ fontSize: '0.75rem', color: 'var(--destructive)' }} className="mt-1">{errors.tipo.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="cnpj" style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--foreground)' }}>
                      {formCopy.fields.cnpj.label}
                      <span style={{ color: 'var(--destructive)', marginLeft: '3px' }}>*</span>
                    </label>
                    <Input
                      id="cnpj"
                      placeholder={formCopy.fields.cnpj.placeholder}
                      {...register("cnpj")}
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
                    {errors.cnpj && (
                      <p style={{ fontSize: '0.75rem', color: 'var(--destructive)' }} className="mt-1">{errors.cnpj.message}</p>
                    )}
                  </div>
                  <div>
                    <label style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--foreground)', display: 'block' }}>
                      {formCopy.fields.city.label}
                      <span style={{ color: 'var(--destructive)', marginLeft: '3px' }}>*</span>
                    </label>
                    <Controller
                      name="city"
                      control={control}
                      render={({ field }) => (
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger
                            id="city"
                            className="mt-1.5"
                            style={{
                              color: 'var(--foreground)',
                              fontSize: '0.875rem',
                              border: '1.5px solid var(--border)',
                              borderRadius: 'var(--radius)',
                              padding: '10px 12px',
                            } as React.CSSProperties}
                          >
                            <SelectValue placeholder={formCopy.fields.city.placeholder} />
                          </SelectTrigger>
                          <SelectContent>
                            {SC_MUNICIPALITIES.map((c) => (
                              <SelectItem key={c} value={c}>
                                {c}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.city && (
                      <p style={{ fontSize: '0.75rem', color: 'var(--destructive)' }} className="mt-1">{errors.city.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="contactName" style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--foreground)' }}>
                    {formCopy.fields.contactName.label}
                    <span style={{ color: 'var(--destructive)', marginLeft: '3px' }}>*</span>
                  </label>
                  <Input
                    id="contactName"
                    placeholder={formCopy.fields.contactName.placeholder}
                    {...register("contactName")}
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
                  {errors.contactName && (
                    <p style={{ fontSize: '0.75rem', color: 'var(--destructive)' }} className="mt-1">{errors.contactName.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="email" style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--foreground)' }}>
                      {formCopy.fields.email.label}
                      <span style={{ color: 'var(--destructive)', marginLeft: '3px' }}>*</span>
                    </label>
                    <Input
                      id="email"
                      type="email"
                      placeholder={formCopy.fields.email.placeholder}
                      {...register("email")}
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
                    {errors.email && (
                      <p style={{ fontSize: '0.75rem', color: 'var(--destructive)' }} className="mt-1">{errors.email.message}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="phone" style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--foreground)' }}>
                      {formCopy.fields.phone.label}
                      <span style={{ color: 'var(--destructive)', marginLeft: '3px' }}>*</span>
                    </label>
                    <Input
                      id="phone"
                      placeholder={formCopy.fields.phone.placeholder}
                      {...register("phone")}
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
                    {errors.phone && (
                      <p style={{ fontSize: '0.75rem', color: 'var(--destructive)' }} className="mt-1">{errors.phone.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--foreground)', display: 'block' }}>
                    {formCopy.fields.activities.label}
                    <span style={{ color: 'var(--destructive)', marginLeft: '3px' }}>*</span>
                  </label>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {activityTypes.map((activity) => {
                      const active = selectedActivities.includes(activity)
                      return (
                        <button
                          key={activity}
                          type="button"
                          onClick={() => toggleActivity(activity)}
                          style={{
                            background: active ? 'var(--primary)' : 'var(--muted)',
                            color: active ? 'var(--primary-foreground)' : 'var(--foreground)',
                            border: `1.5px solid ${active ? 'var(--primary)' : 'var(--chip-border)'}`,
                            borderRadius: '999px',
                            padding: '6px 14px',
                            fontSize: '0.8125rem',
                            fontWeight: 500,
                            transition: 'background 150ms ease, color 150ms ease',
                            cursor: 'pointer',
                          }}
                        >
                          {active && '✓ '}{activity}
                        </button>
                      )
                    })}
                  </div>
                  {errors.activities && (
                    <p style={{ fontSize: '0.75rem', color: 'var(--destructive)' }} className="mt-1">{errors.activities.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="about" style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--foreground)' }}>
                    {formCopy.fields.about.label}
                    <span style={{ color: 'var(--destructive)', marginLeft: '3px' }}>*</span>
                  </label>
                  <Textarea
                    id="about"
                    placeholder={formCopy.fields.about.placeholder}
                    rows={4}
                    {...register("about")}
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
                  {errors.about && (
                    <p style={{ fontSize: '0.75rem', color: 'var(--destructive)' }} className="mt-1">{errors.about.message}</p>
                  )}
                </div>

                <div className="flex items-start gap-3">
                  <Controller
                    name="terms"
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
                        <span style={{ fontSize: '0.875rem', color: 'var(--foreground)', fontWeight: 400, lineHeight: '1.5' }}>
                          {formCopy.fields.terms.label}
                        </span>
                      </label>
                    )}
                  />
                </div>
                {errors.terms && (
                  <p style={{ fontSize: '0.75rem', color: 'var(--destructive)' }}>{errors.terms.message}</p>
                )}

                {submitError && (
                  <div className="flex items-start gap-3 bg-destructive/5 border border-destructive/20 rounded-lg p-4">
                    <AlertCircle className="w-4 h-4 text-destructive mt-0.5 shrink-0" />
                    <p style={{ fontSize: '0.875rem', color: 'var(--destructive)' }}>{submitError}</p>
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-b from-primary to-primary-container text-primary-foreground font-bold text-base py-6 rounded-lg shadow-md hover:scale-[0.99] transition-transform"
                >
                  {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  {formCopy.submit}
                </Button>

                <p className="text-[11px] text-muted-foreground/80 leading-relaxed">
                  {formCopy.note}
                </p>
              </form>
            </>
          )}
        </div>
      </div>
    </section>
  )
}
