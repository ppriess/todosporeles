import { cookies } from "next/headers"
import { createClient } from "@/supabase/utils/supabase/server"
import Link from "next/link"
import { ChevronRight, Plus } from "lucide-react"

const TIPO_LABELS: Record<string, string> = {
  ong: "ONG",
  orgao_governamental: "Órgão governamental",
  grupo_local: "Grupo local",
}

export default async function EntidadesPage() {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const { data: entidades } = await supabase
    .from("entidades")
    .select("id, nome, cidade, tipo, verificada, ativa")
    .order("nome")

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-display font-bold text-primary">Entidades</h1>
          <p className="text-sm text-muted-foreground mt-1">{entidades?.length ?? 0} entidade(s)</p>
        </div>
        <Link
          href="/admin/entidades/new"
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-b from-primary to-primary-container text-primary-foreground font-bold text-sm rounded-lg"
        >
          <Plus className="w-4 h-4" />
          Nova entidade
        </Link>
      </div>

      <div className="space-y-2">
        {entidades?.length === 0 && (
          <p className="text-sm text-muted-foreground py-8 text-center">Nenhuma entidade cadastrada.</p>
        )}
        {entidades?.map((e) => (
          <Link
            key={e.id}
            href={`/admin/entidades/${e.id}/edit`}
            className="flex items-center gap-4 bg-surface-container-low rounded-xl px-5 py-4 hover:bg-surface-container transition-colors"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm text-foreground truncate">{e.nome}</span>
                {e.verificada && (
                  <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full font-medium">Verificada</span>
                )}
                {!e.ativa && (
                  <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-medium">Inativa</span>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                {TIPO_LABELS[e.tipo] ?? e.tipo} · {e.cidade}
              </p>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
          </Link>
        ))}
      </div>
    </div>
  )
}
