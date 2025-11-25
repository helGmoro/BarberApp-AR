"use client"

import { useState } from "react"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"

export function EstadoComercio({
  comercio,
}: {
  comercio: {
    id: string
    is_active: boolean
    is_verified: boolean
  }
}) {
  const supabase = getSupabaseBrowserClient()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [active, setActive] = useState(comercio.is_active)
  const [verified] = useState(comercio.is_verified)
  const [verificationRequested, setVerificationRequested] = useState(false)

  const toggleActive = async () => {
    setLoading(true)
    setError(null)
    try {
      const { error: updateError } = await supabase
        .from("comercios")
        .update({ is_active: !active })
        .eq("id", comercio.id)
      if (updateError) {
        setError(updateError.message)
      } else {
        setActive(!active)
        router.refresh()
      }
    } catch (e) {
      setError("Error al actualizar estado")
    } finally {
      setLoading(false)
    }
  }

  const requestVerification = async () => {
    setLoading(true)
    setError(null)
    try {
      setVerificationRequested(true)
    } catch (e) {
      setError("Error al solicitar verificación")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <div className="flex items-center justify-between p-4 border rounded-lg">
        <div>
          <p className="font-medium">Visibilidad Pública</p>
          <p className="text-sm text-muted-foreground">
            {active
              ? "Tu barbería se muestra en la búsqueda y puede recibir reservas."
              : "Inactiva. No aparece en la búsqueda ni puede recibir reservas."}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Switch checked={active} onCheckedChange={toggleActive} disabled={loading} />
        </div>
      </div>
      <div className="flex items-center justify-between p-4 border rounded-lg">
        <div>
          <p className="font-medium">Verificación</p>
          <p className="text-sm text-muted-foreground">
            {verified
              ? "Comercio verificado por la plataforma."
              : verificationRequested
                ? "Solicitud enviada. Un administrador revisará tu barbería."
                : "La verificación aumenta la confianza de los clientes."}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {verified ? (
            <CheckCircle2 className="h-5 w-5 text-success" />
          ) : (
            <Button onClick={requestVerification} disabled={loading || verificationRequested} variant="outline">
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {verificationRequested ? "Solicitud Enviada" : "Solicitar Verificación"}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
