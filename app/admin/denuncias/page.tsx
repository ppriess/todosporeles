import { cookies } from "next/headers"
import { createClient } from "@/supabase/utils/supabase/server"
import Link from "next/link"
import { AlertTriangle, ChevronRight } from "lucide-react"

const STATUS_LABELS: Record<string, string> = {
  recebida: "Recebida",
  em_analise: "Em análise",
  encaminhada: "Encaminhada",
  arquivada: "Arquivada",
}

const STATUS_COLORS: Record<string, string> = {
  recebida: "bg-blue-100 text-blue-800",
  em_analise: "bg-yellow-100 text-yellow-800",
  encaminhada: "bg-green-100 text-green-800",
  arquivada: "bg-gray-100 text-gray-600",
}

export default async function DenunciasPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; risco?: string }>
}) {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)
  const params = await searchParams

  let query = supabase
    .from("denuncias")
    .select("id, created_at, tipo_denuncia, local_ocorrencia, risco_iminente, status, denuncia_anonima, denunciante_nome")
    .order("created_at", { ascending: false })

  if (params.status) query = query.eq("status", params.status)
  if (params.risco === "1") query = query.eq("risco_iminente", true)

  const { data: denuncias } = await query

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-display font-bold text-primary">Denúncias</h1>
        <p className="text-sm text-muted-foreground mt-1">{denuncias?.length ?? 0} registro(s)</p>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-2 mb-6">
        {[
          { label: "Todas", href: "/admin/denuncias" },
          { label: "Recebidas", href: "/admin/denuncias?status=recebida" },
          { label: "Em análise", href: "/admin/denuncias?status=em_analise" },
          { label: "Encaminhadas", href: "/admin/denuncias?status=encaminhada" },
          { label: "Arquivadas", href: "/admin/denuncias?status=arquivada" },
          { label: "🚨 Risco iminente", href: "/admin/denuncias?risco=1" },
        ].map(({ label, href }) => (
          <Link
            key={href}
            href={href}
            className="px-3 py-1.5 rounded-full text-xs font-medium border border-border/40 hover:bg-surface-container transition-colors"
          >
            {label}
          </Link>
        ))}
      </div>

      {/* Lista */}
      <div className="space-y-2">
        {denuncias?.length === 0 && (
          <p className="text-sm text-muted-foreground py-8 text-center">Nenhuma denúncia encontrada.</p>
        )}
        {denuncias?.map((d) => (
          <Link
            key={d.id}
            href={`/admin/denuncias/${d.id}`}
            className="flex items-center gap-4 bg-surface-container-low rounded-xl px-5 py-4 hover:bg-surface-container transition-colors"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                {d.risco_iminente && <AlertTriangle className="w-4 h-4 text-destructive shrink-0" />}
                <span className="font-medium text-sm text-foreground truncate">{d.tipo_denuncia}</span>
              </div>
              <p className="text-xs text-muted-foreground truncate">{d.local_ocorrencia}</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {new Date(d.created_at).toLocaleDateString("pt-BR")}
                {" · "}
                {d.denuncia_anonima ? "Anônima" : d.denunciante_nome || "—"}
              </p>
            </div>
            <span className={`text-xs font-medium px-2.5 py-1 rounded-full shrink-0 ${STATUS_COLORS[d.status] ?? "bg-gray-100 text-gray-600"}`}>
              {STATUS_LABELS[d.status] ?? d.status}
            </span>
            <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
          </Link>
        ))}
      </div>
    </div>
  )
}
