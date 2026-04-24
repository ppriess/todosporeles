import { Header } from "@/components/header"
import { Hero } from "@/components/sections/hero"
import { Pathways } from "@/components/sections/pathways"
import { ReportAbuse } from "@/components/sections/report-abuse"
import { WhatIsAbuse } from "@/components/sections/what-is-abuse"
import { Process } from "@/components/sections/process"
import { NGODirectory } from "@/components/sections/ngo-directory"
import { RegisterNGO } from "@/components/sections/register-ngo"
import { Transparency } from "@/components/sections/transparency"
import { FAQ } from "@/components/sections/faq"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        <Hero />
        <Pathways />
        <ReportAbuse />
        <WhatIsAbuse />
        <Process />
        <NGODirectory />
        <RegisterNGO />
        <Transparency />
        <FAQ />
      </main>
      <Footer />
    </div>
  )
}
