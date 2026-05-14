"use client"

import Image from "next/image"
import Link from "next/link"
import { Shield, MapPin, Lock, PawPrint } from "lucide-react"
import { Button } from "@/components/ui/button"
import content from "@/data/home-content.json"

const { hero } = content

const iconMap = {
  Shield,
  MapPin,
  Lock,
} as const

export function Hero() {
  return (
    <section
      id="inicio"
      className="relative px-6 lg:px-8 pt-32 pb-24 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center"
    >
      <div className="lg:col-span-7 space-y-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-secondary-container/30 text-on-secondary-container rounded-full">
          <Shield className="w-4 h-4" />
          <span className="text-[10px] font-bold tracking-widest uppercase">
            {hero.badge}
          </span>
        </div>

        <h1 className="text-4xl lg:text-6xl font-display font-extrabold tracking-tighter text-primary leading-[1.05]">
          {hero.headline.part1}
          <br />
          <span className="text-secondary">{hero.headline.part2}</span>
          <br />
          {hero.headline.part3}
        </h1>

        <p className="text-xl text-muted-foreground max-w-2xl leading-relaxed">
          Uma iniciativa da ONG{" "}
          <span className="highlight-brand">Todos Por Eles</span> que conecta cidadãos, entidades e
          autoridades para{" "}
          <span className="highlight-phrase">
            fortalecer a proteção animal em Santa Catarina
          </span>
          . Faça denúncias com triagem responsável e encontre organizações de proteção em todo o
          estado.
        </p>

        <div className="flex flex-wrap gap-4 pt-4">
          <Button
            asChild
            size="lg"
            className="bg-gradient-to-b from-primary to-primary-container text-primary-foreground px-8 py-6 rounded-lg font-bold text-base shadow-md hover:scale-[0.98] transition-transform"
          >
            <Link href="#denuncia">{hero.cta_denuncia}</Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="secondary"
            className="bg-surface-container-high text-primary px-8 py-6 rounded-lg font-bold text-base hover:bg-surface-container-highest transition-all"
          >
            <Link href="#ongs">{hero.cta_busca}</Link>
          </Button>
          <Link
            href="#cadastrar"
            className="self-center text-sm font-semibold text-muted-foreground hover:text-primary transition-colors underline underline-offset-4 decoration-2"
          >
            {hero.cta_cadastro}
          </Link>
        </div>

        <div className="flex flex-wrap gap-8 pt-6 border-t border-border/40">
          {hero.trustPoints.map((point) => {
            const Icon = iconMap[point.icon as keyof typeof iconMap] ?? Shield
            return (
              <div key={point.title} className="flex items-center gap-3">
                <Icon className="w-5 h-5 text-secondary" />
                <div>
                  <p className="text-sm font-semibold text-foreground/80">{point.title}</p>
                  <p className="text-xs text-muted-foreground">{point.description}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="lg:col-span-5 relative">
        <div className="aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl bg-surface-container">
          <Image
            src={hero.image.src}
            alt={hero.image.alt}
            width={800}
            height={1000}
            className="w-full h-full object-cover"
            priority
          />
        </div>
        <div className="absolute -bottom-6 -left-6 bg-card p-6 rounded-xl shadow-xl flex items-center gap-4 max-w-xs">
          <div className="bg-secondary-container p-3 rounded-lg shrink-0">
            <PawPrint className="w-6 h-6 text-on-secondary-container" />
          </div>
          <div>
            <p className="text-2xl font-display font-bold text-primary">
              {hero.statBadge.value}
            </p>
            <p className="text-xs text-muted-foreground font-medium leading-tight">
              {hero.statBadge.label}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
