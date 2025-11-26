"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Trash2, AlertTriangle, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"

export function DeleteAccountButton() {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [confirmation, setConfirmation] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleDelete = async () => {
    if (confirmation !== "ELIMINAR") {
      setError('Debes escribir "ELIMINAR" para confirmar')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/auth/delete-account", {
        method: "DELETE",
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Error al eliminar la cuenta")
        return
      }

      // Redirigir al login después de eliminar
      router.push("/login?deleted=true")
    } catch (err) {
      setError("Error al procesar la solicitud. Intentá nuevamente.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="border-destructive">
      <CardHeader>
        <CardTitle className="text-destructive flex items-center gap-2">
          <Trash2 className="h-5 w-5" />
          Zona Peligrosa
        </CardTitle>
        <CardDescription>
          Acciones irreversibles que afectan permanentemente tu cuenta
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Advertencia:</strong> Esta acción no se puede deshacer. Se eliminarán todos tus datos, turnos y configuraciones de forma permanente.
          </AlertDescription>
        </Alert>

        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" className="w-full">
              <Trash2 className="h-4 w-4 mr-2" />
              Eliminar Mi Cuenta
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>¿Estás absolutamente seguro?</AlertDialogTitle>
              <AlertDialogDescription className="space-y-3">
                <p>
                  Esta acción <strong className="text-destructive">NO SE PUEDE DESHACER</strong>. Esto eliminará permanentemente tu cuenta y todos los datos asociados:
                </p>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Información de perfil</li>
                  <li>Historial de turnos</li>
                  <li>Datos de contacto</li>
                  <li>Configuraciones guardadas</li>
                </ul>
              </AlertDialogDescription>
            </AlertDialogHeader>

            <div className="space-y-4 py-4">
              {error && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="confirmation">
                  Para confirmar, escribí <strong>ELIMINAR</strong> en el campo de abajo:
                </Label>
                <Input
                  id="confirmation"
                  value={confirmation}
                  onChange={(e) => setConfirmation(e.target.value)}
                  placeholder="Escribí ELIMINAR"
                  disabled={loading}
                />
              </div>
            </div>

            <AlertDialogFooter>
              <AlertDialogCancel disabled={loading}>Cancelar</AlertDialogCancel>
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={confirmation !== "ELIMINAR" || loading}
              >
                {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Eliminar Permanentemente
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  )
}
