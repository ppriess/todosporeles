import { Gavel, ArrowRight } from "lucide-react"
import content from "@/data/home-content.json"

const { transparency } = content

export function Transparency() {
  return (
    <section id="transparencia" className="py-24 px-6 lg:px-8 max-w-7xl mx-auto border-t border-border/30">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        <div>
          <p className="text-secondary font-bold tracking-widest text-xs uppercase mb-2">
            {transparency.eyebrow}
          </p>
          <h2 className="text-3xl lg:text-4xl font-display font-extrabold text-primary tracking-tight mb-6 leading-tight">
            {transparency.title}
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-8">
            {transparency.description}
          </p>

          <div className="flex items-center gap-6">
            {transparency.pillars.map((pillar, i) => (
              <div key={pillar.label} className="flex items-center gap-6">
                {i > 0 && <div className="h-10 w-px bg-border/60" />}
                <div className="text-center">
                  <p className="text-3xl font-display font-bold text-secondary">
                    {pillar.value}
                  </p>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    {pillar.label}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <p className="mt-8 text-xs text-muted-foreground/80">
            {transparency.lastUpdate}
          </p>
        </div>

        <div className="bg-surface-container-low p-8 rounded-2xl border border-border/20">
          <h4 className="font-display font-bold text-primary mb-4 flex items-center gap-2">
            <Gavel className="w-5 h-5" />
            {transparency.criteria.title}
          </h4>
          <p className="text-sm text-muted-foreground mb-4">
            {transparency.criteria.description}
          </p>
          <ul className="space-y-3">
            {transparency.criteria.items.map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm font-medium text-foreground/80">
                <ArrowRight className="w-4 h-4 text-secondary mt-0.5 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
