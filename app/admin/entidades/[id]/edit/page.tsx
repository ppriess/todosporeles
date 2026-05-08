import { cookies } from "next/headers"
import { createClient } from "@/supabase/utils/supabase/server"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { EntidadeForm } from "../../_form"

export default async function EditEntidadePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const { data } = await supabase.from("entidades").select("*").eq("id", id).single()
  if (!data) notFound()

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <Link href="/admin/entidades" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Voltar
      </Link>
      <h1 className="text-2xl font-display font-bold text-primary mb-8">{data.nome}</h1>
      <EntidadeForm id={id} initial={data} mode="edit" />
    </div>
  )
}
