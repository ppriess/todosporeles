import Link from "next/link"
import { MapPin, ArrowRight, HeartHandshake } from "lucide-react"
import { Button } from "@/components/ui/button"
import content from "@/data/home-content.json"

const { ngoDirectory: ngo } = content

type Entidade = {
  id: string
  nome: string
  cidade: string
  atividades: string[]
  descricao: string
  tipo: string
  verificada: boolean
  website: string | null
  telefone: string | null
}

export function NGODirectory({ entidades, userCity }: { entidades: Entidade[]; userCity: string | null }) {
  if (entidades.length === 0) return null

  const hasLocalMatch = userCity && entidades.some((e) => e.cidade === userCity)

  return (
    <section id="ongs" className="py-24 px-6 lg:px-8 bg-surface">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <p className="text-secondary font-bold tracking-widest text-xs uppercase mb-2">
            {ngo.eyebrow}
          </p>
          <h2 className="text-4xl font-display font-extrabold text-primary tracking-tight">
            {ngo.title}
          </h2>
          <p className="mt-4 text-muted-foreground max-w-2xl leading-relaxed">
            {hasLocalMatch
              ? `Entidades próximas a ${userCity}, SC`
              : ngo.description}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {entidades.map((item) => (
            <article
              key={item.id}
              className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all"
            >
              <div className="h-32 bg-gradient-to-br from-primary-container/60 to-secondary-container/60 flex items-center justify-center">
                <HeartHandshake className="w-10 h-10 text-primary/40" />
              </div>

              <div className="p-6">
                {item.verificada && (
                  <span className="inline-block text-[10px] font-bold px-2 py-1 rounded bg-secondary-container text-on-secondary-container uppercase tracking-widest mb-3">
                    Verificada
                  </span>
                )}
                <h4 className="text-xl font-display font-bold text-primary mb-1 line-clamp-2">
                  {item.nome}
                </h4>
                <p className="text-xs text-muted-foreground mb-4 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  {item.cidade}, SC
                </p>
                <p className="text-sm text-muted-foreground mb-6 line-clamp-2">
                  {item.descricao}
                </p>
                <div className="flex justify-between items-center pt-4 border-t border-border/30">
                  <span className="text-xs font-bold text-secondary uppercase tracking-wider">
                    {item.atividades[0] ?? item.tipo}
                  </span>
                  {item.website ? (
                    <a
                      href={item.website.startsWith("http") ? item.website : `https://${item.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary font-bold text-sm hover:underline"
                    >
                      Ver site
                    </a>
                  ) : null}
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button asChild variant="outline" className="border-primary/30 hover:bg-primary/5">
            <Link href="/ongs">
              Ver todas as entidades
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
