"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { MapPin, HeartHandshake, Search, ArrowLeft, Globe, Phone, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

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

const TIPO_LABEL: Record<string, string> = {
  ong: "ONG",
  orgao_governamental: "Órgão governamental",
  grupo_local: "Grupo local",
}

export function OngDirectoryFull({ entidades }: { entidades: Entidade[] }) {
  const [search, setSearch] = useState("")
  const [city, setCity] = useState("Todas")
  const [tipo, setTipo] = useState("Todos")

  const cities = useMemo(
    () => ["Todas", ...Array.from(new Set(entidades.map((e) => e.cidade))).sort()],
    [entidades]
  )

  const tipos = useMemo(
    () => ["Todos", ...Array.from(new Set(entidades.map((e) => e.tipo))).sort()],
    [entidades]
  )

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim()
    return entidades.filter((e) => {
      if (city !== "Todas" && e.cidade !== city) return false
      if (tipo !== "Todos" && e.tipo !== tipo) return false
      if (q && !e.nome.toLowerCase().includes(q) && !e.cidade.toLowerCase().includes(q)) return false
      return true
    })
  }, [entidades, city, tipo, search])

  const hasFilters = search !== "" || city !== "Todas" || tipo !== "Todos"

  function clearFilters() {
    setSearch("")
    setCity("Todas")
    setTipo("Todos")
  }

  return (
    <>
      {/* Hero banner */}
      <section className="bg-navy py-16 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-white/60 hover:text-white text-sm mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar ao início
          </Link>
          <p className="text-secondary font-bold tracking-widest text-xs uppercase mb-3">
            Rede de apoio
          </p>
          <h1 className="text-4xl lg:text-5xl font-display font-extrabold text-white tracking-tight mb-4">
            Diretório de entidades
          </h1>
          <p className="text-white/70 max-w-2xl leading-relaxed text-lg">
            {entidades.length} entidades de proteção animal em Santa Catarina. Busque por nome,
            cidade ou tipo de atuação.
          </p>
        </div>
      </section>

      {/* Filtros */}
      <section className="sticky top-[60px] z-30 bg-surface border-b border-border/40 px-6 lg:px-8 py-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome ou cidade…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-surface-container border-0"
            />
          </div>

          <Select value={city} onValueChange={setCity}>
            <SelectTrigger className="sm:w-52 bg-surface-container border-0">
              <SelectValue placeholder="Cidade" />
            </SelectTrigger>
            <SelectContent>
              {cities.map((c) => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={tipo} onValueChange={setTipo}>
            <SelectTrigger className="sm:w-52 bg-surface-container border-0">
              <SelectValue placeholder="Tipo de entidade" />
            </SelectTrigger>
            <SelectContent>
              {tipos.map((t) => (
                <SelectItem key={t} value={t}>{TIPO_LABEL[t] ?? t}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {hasFilters && (
            <Button
              variant="ghost"
              size="icon"
              onClick={clearFilters}
              className="shrink-0 text-muted-foreground hover:text-foreground"
              aria-label="Limpar filtros"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      </section>

      {/* Resultados */}
      <section className="py-12 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <p className="text-sm text-muted-foreground mb-8">
            {filtered.length === entidades.length
              ? `${entidades.length} entidades`
              : `${filtered.length} de ${entidades.length} entidades`}
            {hasFilters && " · "}
            {hasFilters && (
              <button onClick={clearFilters} className="underline hover:text-foreground transition-colors">
                limpar filtros
              </button>
            )}
          </p>

          {filtered.length === 0 ? (
            <div className="text-center py-24">
              <HeartHandshake className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground">Nenhuma entidade encontrada para esses filtros.</p>
              <button onClick={clearFilters} className="mt-3 text-primary text-sm underline">
                Limpar filtros
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((item) => (
                <article
                  key={item.id}
                  className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all flex flex-col"
                >
                  <div className="h-24 bg-gradient-to-br from-primary-container/60 to-secondary-container/60 flex items-center justify-center">
                    <HeartHandshake className="w-8 h-8 text-primary/40" />
                  </div>

                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h2 className="text-base font-display font-bold text-primary leading-snug line-clamp-2">
                        {item.nome}
                      </h2>
                      {item.verificada && (
                        <span className="shrink-0 text-[9px] font-bold px-1.5 py-0.5 rounded bg-secondary-container text-on-secondary-container uppercase tracking-widest mt-0.5">
                          ✓
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-muted-foreground mb-3 flex items-center gap-1">
                      <MapPin className="w-3 h-3 shrink-0" />
                      {item.cidade}, SC
                      <span className="ml-auto text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground font-medium">
                        {TIPO_LABEL[item.tipo] ?? item.tipo}
                      </span>
                    </p>

                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-1">
                      {item.descricao}
                    </p>

                    {item.atividades.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-4">
                        {item.atividades.slice(0, 3).map((a) => (
                          <span
                            key={a}
                            className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-primary-container/40 text-primary"
                          >
                            {a}
                          </span>
                        ))}
                        {item.atividades.length > 3 && (
                          <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                            +{item.atividades.length - 3}
                          </span>
                        )}
                      </div>
                    )}

                    <div className="flex gap-3 pt-3 border-t border-border/30">
                      {item.website && (
                        <a
                          href={item.website.startsWith("http") ? item.website : `https://${item.website}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-xs text-primary font-medium hover:underline"
                        >
                          <Globe className="w-3 h-3" />
                          Site
                        </a>
                      )}
                      {item.telefone && (
                        <a
                          href={`tel:${item.telefone.replace(/\D/g, "")}`}
                          className="flex items-center gap-1 text-xs text-muted-foreground font-medium hover:text-foreground transition-colors"
                        >
                          <Phone className="w-3 h-3" />
                          {item.telefone}
                        </a>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
