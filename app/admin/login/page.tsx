"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/supabase/utils/supabase/client"
import { Loader2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError("E-mail ou senha inválidos.")
      setLoading(false)
      return
    }

    router.push("/admin/denuncias")
    router.refresh()
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <span className="font-display font-bold text-primary text-xl">Todos Por Eles</span>
          <p className="text-sm text-muted-foreground mt-1">Acesso administrativo</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-surface-container-low rounded-2xl p-8 space-y-5">
          <div>
            <label htmlFor="email" style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--foreground)" }}>
              E-mail
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
              className="mt-1.5"
              style={{
                color: "var(--foreground)",
                fontSize: "0.875rem",
                border: "1.5px solid var(--border)",
                borderRadius: "var(--radius)",
                padding: "10px 12px",
              } as React.CSSProperties}
            />
          </div>

          <div>
            <label htmlFor="password" style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--foreground)" }}>
              Senha
            </label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1.5"
              style={{
                color: "var(--foreground)",
                fontSize: "0.875rem",
                border: "1.5px solid var(--border)",
                borderRadius: "var(--radius)",
                padding: "10px 12px",
              } as React.CSSProperties}
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 bg-destructive/5 border border-destructive/20 rounded-lg p-3">
              <AlertCircle className="w-4 h-4 text-destructive shrink-0" />
              <p style={{ fontSize: "0.875rem", color: "var(--destructive)" }}>{error}</p>
            </div>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-b from-primary to-primary-container text-primary-foreground font-bold rounded-lg py-5"
          >
            {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Entrar
          </Button>
        </form>
      </div>
    </div>
  )
}
