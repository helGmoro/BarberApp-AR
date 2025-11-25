"use client"

import Link from "next/link"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { AlertCircle, Loader2, CheckCircle2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function RegisterForm() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    userType: "cliente" as "cliente" | "comercio",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    // Validaciones
    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden")
      setLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres")
      setLoading(false)
      return
    }

    try {
      const supabase = getSupabaseBrowserClient()

      const redirectUrl = process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${window.location.origin}/panel/perfil`

        const { data, error: signUpError } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            emailRedirectTo: redirectUrl,
            data: {
              user_type: formData.userType,
            },
          },
        })

      if (signUpError) {
        setError(signUpError.message)
        return
      }

      if (data.user) {
        setSuccess(true)
        // Para cuentas de comercio mostramos mensaje especial
        setTimeout(() => {
          router.push("/login")
        }, 2000)
      }
    } catch (err) {
      setError("Error al crear la cuenta. Por favor, intentá nuevamente.")
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

      {success && (
        <Alert className="border-success bg-success/10">
          <CheckCircle2 className="h-4 w-4 text-success" />
          <AlertDescription className="text-success-foreground">
            {formData.userType === "comercio"
              ? "Cuenta de comercio creada. Verificá tu email e iniciá sesión para configurar tu barbería."
              : "Cuenta creada exitosamente. Verificá tu email para confirmar tu cuenta."}
          </AlertDescription>
        </Alert>
      )}
      <div className="space-y-2">
        <Label>Tipo de Cuenta</Label>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setFormData({ ...formData, userType: "cliente" })}
            disabled={loading}
            className={`h-10 rounded-md border text-sm font-medium transition-colors ${
              formData.userType === "cliente" ? "bg-primary text-primary-foreground" : "bg-background hover:bg-muted"
            }`}
          >
            Cliente
          </button>
          <button
            type="button"
            onClick={() => setFormData({ ...formData, userType: "comercio" })}
            disabled={loading}
            className={`h-10 rounded-md border text-sm font-medium transition-colors ${
              formData.userType === "comercio" ? "bg-primary text-primary-foreground" : "bg-background hover:bg-muted"
            }`}
          >
            Comercio
          </button>
        </div>
        <p className="text-xs text-muted-foreground">
          {formData.userType === "cliente"
            ? "Cuenta para pedir turnos y dejar reseñas."
            : "Cuenta para gestionar tu barbería y recibir reservas."}
        </p>
      </div>
      

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="tu@email.com"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          required
          disabled={loading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
        <Input
          id="confirmPassword"
          type="password"
          placeholder="••••••••"
          value={formData.confirmPassword}
          onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
          required
          disabled={loading}
        />
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Crear Cuenta
      </Button>

      <p className="text-xs text-muted-foreground text-center">
        Al registrarte, aceptás nuestros{" "}
        <Link href="/terminos" className="text-primary hover:underline">
          Términos y Condiciones
        </Link>
      </p>
    </form>
  )
}
