import Link from "next/link"
import {
  AlertTriangle,
  HeartHandshake,
  ClipboardPlus,
  ArrowRight,
  type LucideIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"
import content from "@/data/home-content.json"

const { pathways } = content

const iconMap: Record<string, LucideIcon> = {
  AlertTriangle,
  HeartHandshake,
  ClipboardPlus,
}

const toneStyles = {
  destructive: {
    wrap: "bg-destructive/10",
    icon: "text-destructive",
  },
  primary: {
    wrap: "bg-primary-container/15",
    icon: "text-primary",
  },
  secondary: {
    wrap: "bg-secondary-container/30",
    icon: "text-secondary",
  },
} as const

export function Pathways() {
  return (
    <section id="caminhos" className="bg-surface-container-low py-24 px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16">
          <p className="text-secondary font-bold tracking-widest text-xs uppercase mb-2">
            {pathways.eyebrow}
          </p>
          <h2 className="text-4xl font-display font-extrabold text-primary tracking-tight">
            {pathways.title}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pathways.items.map((item) => {
            const Icon = iconMap[item.icon] ?? AlertTriangle
            const tone = toneStyles[item.iconTone as keyof typeof toneStyles] ?? toneStyles.primary
            return (
              <div
                key={item.title}
                className="group bg-surface-container-lowest p-10 rounded-xl transition-all duration-300 hover:-translate-y-2"
              >
                <div
                  className={cn(
                    "w-14 h-14 rounded-lg flex items-center justify-center mb-8",
                    tone.wrap
                  )}
                >
                  <Icon className={cn("w-7 h-7", tone.icon)} />
                </div>
                <h3 className="text-2xl font-display font-bold text-foreground mb-4">
                  {item.title}
                </h3>
                <p className="text-muted-foreground mb-8 leading-relaxed">
                  {item.description}
                </p>
                <Link
                  href={item.href}
                  className="inline-flex items-center gap-2 text-primary font-bold group-hover:gap-4 transition-all"
                >
                  {item.cta}
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <p className="mt-4 text-xs text-muted-foreground/80">{item.note}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
