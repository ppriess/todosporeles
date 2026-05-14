import { cookies, headers } from "next/headers"
import { createClient } from "@/supabase/utils/supabase/server"
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

export default async function Home() {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)
  const headersList = await headers()

  // Vercel injeta x-vercel-ip-city automaticamente em produção
  const rawCity = headersList.get("x-vercel-ip-city")
  const userCity = rawCity ? decodeURIComponent(rawCity) : null

  let featured = []

  try {
    const { data: all } = await supabase
      .from("entidades")
      .select("id, nome, cidade, atividades, descricao, tipo, verificada, website, telefone")
      .eq("ativa", true)
      .order("nome", { ascending: true })

    const sorted = [...(all ?? [])].sort((a, b) => {
      if (userCity) {
        const aMatch = a.cidade === userCity
        const bMatch = b.cidade === userCity
        if (aMatch && !bMatch) return -1
        if (bMatch && !aMatch) return 1
      }
      return 0
    })

    featured = sorted.slice(0, 3)
  } catch (error) {
    console.error("Failed to fetch entities:", error)
    // Continue with empty featured list if database is unavailable
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        <Hero />
        <Pathways />
        <ReportAbuse />
        <WhatIsAbuse />
        <Process />
        <NGODirectory entidades={featured} userCity={userCity} />
        <RegisterNGO />
        <Transparency />
        <FAQ />
      </main>
      <Footer />
    </div>
  )
}
