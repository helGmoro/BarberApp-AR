"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { AlertCircle, Loader2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function LoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    // Validaciones en español
    if (!email || !email.trim()) {
      setError("Por favor ingresá tu email")
      setLoading(false)
      return
    }

    if (!email.includes('@')) {
      setError("Por favor ingresá un email válido")
      setLoading(false)
      return
    }

    if (!password || password.length < 6) {
      setError("Por favor ingresá tu contraseña")
      setLoading(false)
      return
    }

    try {
      const supabase = getSupabaseBrowserClient()
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      })

      if (signInError) {
        console.error('[BarberApp] Login error:', signInError)
        
        // Mensajes de error en español
        if (signInError.message.includes('Invalid login credentials')) {
          setError("Email o contraseña incorrectos. Por favor verificá tus datos.")
        } else if (signInError.message.includes('Email not confirmed')) {
          setError("Tu email aún no fue confirmado. Revisá tu casilla de correo.")
        } else if (signInError.message.includes('User not found')) {
          setError("No existe una cuenta con este email. ¿Querés registrarte?")
        } else {
          setError("Error al iniciar sesión. Por favor intentá nuevamente.")
        }
        return
      }

      if (data.user) {
        // Obtener el tipo de usuario desde la tabla profiles (más confiable que metadata sola)
        const { data: profile } = await supabase
          .from("profiles")
          .select("user_type")
          .eq("id", data.user.id)
          .single()

        const userType = profile?.user_type || data.user.user_metadata?.user_type || "cliente"

        if (userType === "admin") {
          router.push("/admin")
        } else if (userType === "comercio") {
          router.push("/panel/comercio")
        } else {
          router.push("/panel/cliente")
        }
        router.refresh()
      }
    } catch (err: any) {
      console.error('[BarberApp] Login exception:', err)
      
      if (err?.message?.includes('network') || err?.message?.includes('fetch')) {
        setError("Error de conexión. Verificá tu internet e intentá nuevamente.")
      } else {
        setError("Ocurrió un error inesperado. Por favor intentá nuevamente.")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="tu@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={loading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Contraseña</Label>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={loading}
        />
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Iniciar Sesión
      </Button>
    </form>
  )
}
