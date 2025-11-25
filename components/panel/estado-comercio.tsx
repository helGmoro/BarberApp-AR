"use client"

import { useState } from "react"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { AlertCircle, CheckCircle2, Loader2, Clock, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

export function EstadoComercio({
  comercio,
}: {
  comercio: {
    id: string
    name: string
    is_active: boolean
    is_verified: boolean
    verification_requested_at?: string | null
  }
}) {
  const supabase = getSupabaseBrowserClient()
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [active, setActive] = useState(comercio.is_active)
  const [verified] = useState(comercio.is_verified)
  const [verificationRequested, setVerificationRequested] = useState(!!comercio.verification_requested_at)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [deleteConfirmText, setDeleteConfirmText] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)

  const handleSwitchChange = () => {
    setShowConfirmDialog(true)
  }

  const toggleActive = async () => {
    setLoading(true)
    setError(null)
    setShowConfirmDialog(false)
    try {
      const { error: updateError } = await supabase
        .from("comercios")
        .update({ is_active: !active })
        .eq("id", comercio.id)
      if (updateError) {
        setError(updateError.message)
      } else {
        setActive(!active)
        toast({
          title: active ? "Visibilidad desactivada" : "Visibilidad activada",
          description: active 
            ? "Tu comercio ya no aparece en las búsquedas." 
            : "Tu comercio ahora es visible para los clientes.",
        })
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
      const response = await fetch("/api/comercio/verification", {
        method: "POST",
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Error al solicitar verificación")
      }

      setVerificationRequested(true)
      toast({
        title: "Solicitud enviada",
        description: "Un administrador revisará tu comercio pronto.",
      })
      router.refresh()
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : "Error al solicitar verificación"
      setError(errorMessage)
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteComercio = async () => {
    setIsDeleting(true)
    setError(null)
    try {
      const { error: deleteError } = await supabase
        .from("comercios")
        .delete()
        .eq("id", comercio.id)

      if (deleteError) {
        throw new Error(deleteError.message)
      }

      // Actualizar el perfil del usuario a tipo "cliente"
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ user_type: "cliente" })
        .eq("id", (await supabase.auth.getUser()).data.user?.id)

      if (updateError) {
        console.error("Error updating user type:", updateError)
      }

      toast({
        title: "Comercio eliminado",
        description: "Tu comercio ha sido eliminado exitosamente.",
      })

      // Redirigir al panel de cliente
      router.push("/panel")
      router.refresh()
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : "Error al eliminar el comercio"
      setError(errorMessage)
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
      })
      setShowDeleteDialog(false)
    } finally {
      setIsDeleting(false)
    }
  }

  const isDeleteConfirmValid = deleteConfirmText.toLowerCase() === comercio.name.toLowerCase()

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
          <Switch checked={active} onCheckedChange={handleSwitchChange} disabled={loading} />
        </div>
      </div>

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {active ? "¿Desactivar visibilidad pública?" : "¿Activar visibilidad pública?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {active
                ? "Tu comercio dejará de aparecer en las búsquedas y los clientes no podrán reservar turnos hasta que lo reactives."
                : "Tu comercio aparecerá en las búsquedas y los clientes podrán reservar turnos. Asegúrate de tener configurados tus servicios y horarios."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={loading}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={toggleActive} disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {active ? "Desactivar" : "Activar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>


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
            <div className="flex items-center gap-2 text-success">
              <CheckCircle2 className="h-5 w-5" />
              <span className="text-sm font-medium">Verificado</span>
            </div>
          ) : verificationRequested ? (
            <div className="flex items-center gap-2 text-orange-500">
              <Clock className="h-5 w-5" />
              <span className="text-sm font-medium">Pendiente</span>
            </div>
          ) : (
            <Button onClick={requestVerification} disabled={loading} variant="outline">
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Solicitar Verificación
            </Button>
          )}
        </div>
      </div>

      {/* Zona Peligrosa - Eliminar Comercio */}
      <div className="border border-destructive/50 rounded-lg p-4 space-y-3">
        <div>
          <p className="font-medium text-destructive">Zona Peligrosa</p>
          <p className="text-sm text-muted-foreground">
            Una vez que elimines tu comercio, no hay vuelta atrás. Todos los turnos, servicios y configuraciones se perderán permanentemente.
          </p>
        </div>
        <Button 
          variant="destructive" 
          onClick={() => setShowDeleteDialog(true)}
          className="w-full sm:w-auto"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Eliminar Comercio
        </Button>
      </div>

      {/* Diálogo de confirmación de eliminación */}
      <AlertDialog open={showDeleteDialog} onOpenChange={(open) => {
        setShowDeleteDialog(open)
        if (!open) setDeleteConfirmText("")
      }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-destructive">
              ¿Estás seguro de eliminar tu comercio?
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-3">
              <p>
                Esta acción es <strong>permanente</strong> y no se puede deshacer. 
                Se eliminarán todos los datos asociados:
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Todos los servicios</li>
                <li>Turnos agendados</li>
                <li>Configuración de pagos</li>
                <li>Horarios y disponibilidad</li>
                <li>Promociones activas</li>
              </ul>
              <div className="pt-3 space-y-2">
                <Label htmlFor="delete-confirm">
                  Para confirmar, escribe el nombre de tu comercio: <strong>{comercio.name}</strong>
                </Label>
                <Input
                  id="delete-confirm"
                  placeholder={comercio.name}
                  value={deleteConfirmText}
                  onChange={(e) => setDeleteConfirmText(e.target.value)}
                  disabled={isDeleting}
                  className="font-mono"
                />
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteComercio}
              disabled={!isDeleteConfirmValid || isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Eliminar Permanentemente
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
