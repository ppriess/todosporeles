import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { EntidadeForm } from "../_form"

export default function NewEntidadePage() {
  return (
    <div className="p-8 max-w-3xl mx-auto">
      <Link href="/admin/entidades" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Voltar
      </Link>
      <h1 className="text-2xl font-display font-bold text-primary mb-8">Nova entidade</h1>
      <EntidadeForm mode="create" />
    </div>
  )
}
