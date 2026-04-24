import { Info } from "lucide-react"
import content from "@/data/home-content.json"

const { process: processData } = content

export function Process() {
  return (
    <section id="denuncia" className="bg-primary text-primary-foreground py-24 px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-display font-extrabold tracking-tight mb-4">
            {processData.title}
          </h2>
          <p className="text-primary-foreground/70 max-w-2xl mx-auto leading-relaxed">
            {processData.description}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
          <div
            aria-hidden
            className="hidden md:block absolute top-6 left-0 w-full h-0.5 bg-primary-foreground/15 -translate-y-1/2"
          />
          {processData.steps.map((step) => (
            <div key={step.step} className="relative z-10 bg-primary p-6 text-center">
              <div className="w-12 h-12 bg-primary-foreground text-primary font-display font-black rounded-full flex items-center justify-center mx-auto mb-6">
                {parseInt(step.step, 10)}
              </div>
              <h4 className="font-display font-bold mb-2 text-primary-foreground">
                {step.title}
              </h4>
              <p className="text-xs text-primary-foreground/70 leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-16 max-w-3xl mx-auto flex items-start gap-4 p-6 rounded-xl bg-primary-foreground/5 border border-primary-foreground/10">
          <div className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center flex-shrink-0">
            <Info className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h4 className="font-display font-semibold text-primary-foreground mb-1">
              {processData.disclaimer.title}
            </h4>
            <p className="text-sm text-primary-foreground/80 leading-relaxed">
              {processData.disclaimer.text}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
