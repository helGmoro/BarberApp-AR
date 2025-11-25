"use client"

import { useState } from "react"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Loader2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function ConvertToComercio() {
  const supabase = getSupabaseBrowserClient()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleConvert = async () => {
    setLoading(true)
    setError(null)
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) {
        setError("Necesitás iniciar sesión")
        return
      }
      const { error: authError } = await supabase.auth.updateUser({
        data: { user_type: "comercio" },
      })
      if (authError) {
        setError(authError.message)
        return
      }
      const { error: profileError } = await supabase
        .from("profiles")
        .update({ user_type: "comercio" })
        .eq("id", user.id)
      if (profileError) {
        setError(profileError.message)
        return
      }
      router.push("/panel/comercio/setup")
      router.refresh()
    } catch (e) {
      setError("Error al convertir la cuenta")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Convertir a Cuenta de Comercio</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Si ofrecés servicios (barbería, peluquería, estética) podés convertir tu cuenta y crear tu comercio para
          recibir reservas y pagos.
        </p>
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <Button onClick={handleConvert} disabled={loading} className="w-full">
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Convertir a Comercio
        </Button>
      </CardContent>
    </Card>
  )
}
