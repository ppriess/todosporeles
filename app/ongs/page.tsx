import { cookies } from "next/headers"
import { createClient } from "@/supabase/utils/supabase/server"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { OngDirectoryFull } from "@/components/sections/ong-directory-full"

export const metadata = {
  title: "Diretório de Entidades | Todos por Eles",
  description:
    "Encontre ONGs, órgãos governamentais e grupos de proteção animal em Santa Catarina. Busque por cidade ou tipo de atuação.",
}

export default async function OngsPage() {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const { data: entidades } = await supabase
    .from("entidades")
    .select("id, nome, cidade, atividades, descricao, tipo, verificada, website, telefone")
    .eq("ativa", true)
    .order("nome", { ascending: true })

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 pt-20">
        <OngDirectoryFull entidades={entidades ?? []} />
      </main>
      <Footer />
    </div>
  )
}
