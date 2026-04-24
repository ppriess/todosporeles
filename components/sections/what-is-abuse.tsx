import {
  Ban,
  Hand,
  Droplets,
  Home,
  Stethoscope,
  Skull,
  type LucideIcon,
} from "lucide-react"
import content from "@/data/home-content.json"

const { whatIsAbuse } = content

const iconMap: Record<string, LucideIcon> = {
  Ban,
  Hand,
  Droplets,
  Home,
  Stethoscope,
  Skull,
}

export function WhatIsAbuse() {
  return (
    <section id="maus-tratos" className="py-24 px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
        <div className="lg:col-span-4 lg:sticky lg:top-28">
          <p className="text-secondary font-bold tracking-widest text-xs uppercase mb-2">
            {whatIsAbuse.eyebrow}
          </p>
          <h2 className="text-4xl font-display font-extrabold text-primary tracking-tight mb-6 leading-tight">
            {whatIsAbuse.title}
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            {whatIsAbuse.description}
          </p>

          <div className="mt-10 p-6 bg-surface-container border-l-4 border-secondary rounded-r-lg">
            <p className="text-sm italic text-muted-foreground">
              &ldquo;{whatIsAbuse.quote}&rdquo;
            </p>
          </div>

          <div className="mt-6 p-5 rounded-lg bg-destructive/5 border-l-4 border-destructive">
            <p className="text-sm text-foreground/80 leading-relaxed">
              <strong className="text-destructive">{whatIsAbuse.disclaimer.strong}</strong>{" "}
              {whatIsAbuse.disclaimer.text}
            </p>
          </div>
        </div>

        <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {whatIsAbuse.items.map((item) => {
            const Icon = iconMap[item.icon] ?? Ban
            return (
              <div
                key={item.title}
                className="p-8 bg-surface rounded-xl border border-border/30 hover:border-secondary/40 hover:shadow-sm transition-all"
              >
                <div className="flex items-center gap-3 mb-3">
                  <Icon className="w-6 h-6 text-secondary" />
                  <h4 className="font-display font-bold text-xl text-primary">
                    {item.title}
                  </h4>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
