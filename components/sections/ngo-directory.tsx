"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { MapPin, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import content from "@/data/home-content.json"

const { ngoDirectory: ngo } = content

export function NGODirectory() {
  const [city, setCity] = useState(ngo.cities[0])
  const [activity, setActivity] = useState(ngo.activityTypes[0])

  return (
    <section id="ongs" className="py-24 px-6 lg:px-8 bg-surface">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
          <div>
            <p className="text-secondary font-bold tracking-widest text-xs uppercase mb-2">
              {ngo.eyebrow}
            </p>
            <h2 className="text-4xl font-display font-extrabold text-primary tracking-tight">
              {ngo.title}
            </h2>
            <p className="mt-4 text-muted-foreground max-w-2xl leading-relaxed">
              {ngo.description}
            </p>
          </div>

          <div className="flex gap-4 w-full md:w-auto">
            <Select value={city} onValueChange={setCity}>
              <SelectTrigger className="bg-surface-container border-0 rounded-lg">
                <SelectValue placeholder="Cidade" />
              </SelectTrigger>
              <SelectContent>
                {ngo.cities.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={activity} onValueChange={setActivity}>
              <SelectTrigger className="bg-surface-container border-0 rounded-lg">
                <SelectValue placeholder="Tipo de atuação" />
              </SelectTrigger>
              <SelectContent>
                {ngo.activityTypes.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {ngo.sampleNGOs.map((item) => (
            <article
              key={item.acronym}
              className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all"
            >
              <div className="h-48 relative bg-surface-container">
                <Image
                  src={item.image}
                  alt={`Sede ou atividade da ${item.name}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover"
                />
                {item.verified && (
                  <div className="absolute top-4 left-4 bg-secondary-container text-on-secondary-container text-[10px] font-bold px-2 py-1 rounded uppercase tracking-widest">
                    Verificada
                  </div>
                )}
              </div>

              <div className="p-6">
                <h4 className="text-xl font-display font-bold text-primary mb-1">
                  {item.name}
                </h4>
                <p className="text-xs text-muted-foreground mb-4 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  {item.city}, SC
                </p>
                <p className="text-sm text-muted-foreground mb-6 line-clamp-2">
                  {item.shortDescription}
                </p>
                <div className="flex justify-between items-center pt-4 border-t border-border/30">
                  <span className="text-xs font-bold text-secondary uppercase tracking-wider">
                    {item.category}
                  </span>
                  <Link
                    href={`/ongs/${item.acronym.toLowerCase()}`}
                    className="text-primary font-bold text-sm hover:underline"
                  >
                    Ver detalhes
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button
            asChild
            variant="outline"
            className="border-primary/30 hover:bg-primary/5"
          >
            <Link href="/ongs">
              {ngo.ctaText}
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
