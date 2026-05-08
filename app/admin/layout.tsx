"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { createClient } from "@/supabase/utils/supabase/client"
import { FileText, Building2, LogOut } from "lucide-react"

const nav = [
  { href: "/admin/denuncias", label: "Denúncias", icon: FileText },
  { href: "/admin/entidades", label: "Entidades", icon: Building2 },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/admin/login")
    router.refresh()
  }

  return (
    <div className="min-h-screen flex bg-surface">
      <aside className="w-56 flex flex-col bg-surface-container-low border-r border-border/30 shrink-0">
        <div className="px-5 py-6 border-b border-border/30">
          <span className="font-display font-bold text-primary text-sm tracking-wide uppercase">
            Admin
          </span>
          <p className="text-xs text-muted-foreground mt-0.5">Todos Por Eles</p>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {nav.map(({ href, label, icon: Icon }) => {
            const active = pathname.startsWith(href)
            return (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                style={{
                  background: active ? "var(--primary)" : "transparent",
                  color: active ? "var(--primary-foreground)" : "var(--foreground)",
                }}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {label}
              </Link>
            )
          })}
        </nav>

        <div className="px-3 py-4 border-t border-border/30">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium w-full text-left text-muted-foreground hover:text-foreground hover:bg-surface-container transition-colors"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            Sair
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}
