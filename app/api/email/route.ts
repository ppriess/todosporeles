import { NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"
import { cookies } from "next/headers"
import { createClient } from "@/supabase/utils/supabase/server"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Não autorizado" }, { status: 401 })

  const { denunciaId, destinatario } = await req.json()
  if (!denunciaId || !destinatario) {
    return NextResponse.json({ error: "Parâmetros inválidos" }, { status: 400 })
  }

  const { data: d, error } = await supabase
    .from("denuncias")
    .select("*")
    .eq("id", denunciaId)
    .single()

  if (error || !d) return NextResponse.json({ error: "Denúncia não encontrada" }, { status: 404 })

  const dataOcorrencia = new Date(d.data_ocorrencia).toLocaleDateString("pt-BR")
  const dataCriacao = new Date(d.created_at).toLocaleDateString("pt-BR", { dateStyle: "full" })

  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #1a1a1a;">
      <div style="background: #004293; padding: 24px 32px; border-radius: 8px 8px 0 0;">
        <h1 style="color: white; font-size: 18px; margin: 0;">Denúncia de Maus-tratos — Todos Por Eles</h1>
      </div>
      <div style="background: #fff8f1; padding: 32px; border-radius: 0 0 8px 8px; border: 1px solid #e5e0d8;">
        ${d.risco_iminente ? `<div style="background: #fee2e2; border: 1px solid #fca5a5; border-radius: 8px; padding: 12px 16px; margin-bottom: 24px;">
          <strong style="color: #b91c1c;">⚠️ RISCO IMINENTE</strong> — Animal em situação de perigo grave.
        </div>` : ""}

        <h2 style="font-size: 14px; color: #666; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 4px;">Tipo de denúncia</h2>
        <p style="font-size: 16px; font-weight: 600; margin: 0 0 24px;">${d.tipo_denuncia}</p>

        <h2 style="font-size: 14px; color: #666; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 4px;">Data da ocorrência</h2>
        <p style="margin: 0 0 24px;">${dataOcorrencia}</p>

        <h2 style="font-size: 14px; color: #666; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 4px;">Local</h2>
        <p style="margin: 0 0 24px;">${d.local_ocorrencia}</p>

        <h2 style="font-size: 14px; color: #666; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 4px;">Descrição do fato</h2>
        <p style="margin: 0 0 24px; white-space: pre-wrap;">${d.descricao_fato}</p>

        ${d.evidencias_urls?.length ? `<h2 style="font-size: 14px; color: #666; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 4px;">Evidências</h2>
        <p style="margin: 0 0 24px;">${d.evidencias_urls.join("<br>")} (acesso via painel Supabase)</p>` : ""}

        <hr style="border: none; border-top: 1px solid #e5e0d8; margin: 24px 0;">

        <h2 style="font-size: 14px; color: #666; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 8px;">Denunciante</h2>
        ${d.denuncia_anonima
          ? `<p style="margin: 0 0 24px;">Anônimo</p>`
          : `<p style="margin: 0 0 4px;">${d.denunciante_nome ?? "—"}</p>
             <p style="margin: 0 0 4px;">${d.denunciante_email ?? "—"}</p>
             <p style="margin: 0 0 24px;">${d.denunciante_telefone ?? "—"}</p>`
        }

        <p style="font-size: 12px; color: #999; margin: 0;">Encaminhada em ${dataCriacao} via plataforma Todos Por Eles.</p>
      </div>
    </div>
  `

  const { error: emailError } = await resend.emails.send({
    from: "Todos Por Eles <noreply@todosporeles.com.br>",
    to: destinatario,
    subject: `[Denúncia] ${d.tipo_denuncia} — ${d.local_ocorrencia}`,
    html,
  })

  if (emailError) {
    return NextResponse.json({ error: emailError.message }, { status: 500 })
  }

  await supabase.from("denuncias").update({ status: "encaminhada" }).eq("id", denunciaId)

  return NextResponse.json({ ok: true })
}
