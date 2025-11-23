"use client"

import type React from "react"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react"

interface ReservarTurnoDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  comercioId: string
  servicios: Array<{
    id: string
    name: string
    price: number
    duration_minutes: number
  }>
  businessHours: any
}

export function ReservarTurnoDialog({ open, onOpenChange, comercioId, servicios }: ReservarTurnoDialogProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const [formData, setFormData] = useState({
    servicioId: servicios[0]?.id || "",
    fecha: "",
    hora: "",
    nombre: "",
    telefono: "",
    email: "",
    notas: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const supabase = getSupabaseBrowserClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        setError("Debes iniciar sesión para reservar un turno")
        setLoading(false)
        return
      }

      // Calcular hora de fin basado en la duración del servicio
      const servicio = servicios.find((s) => s.id === formData.servicioId)
      const [hours, minutes] = formData.hora.split(":").map(Number)
      const endTime = new Date()
      endTime.setHours(hours, minutes + (servicio?.duration_minutes || 30))
      const endTimeStr = endTime.toTimeString().slice(0, 5)

      const { error: insertError } = await supabase.from("turnos").insert({
        comercio_id: comercioId,
        cliente_id: user.id,
        servicio_id: formData.servicioId,
        appointment_date: formData.fecha,
        appointment_time: formData.hora,
        end_time: endTimeStr,
        client_name: formData.nombre,
        client_phone: formData.telefono,
        client_email: formData.email,
        notes: formData.notas || null,
        status: "pending",
      })

      if (insertError) {
        setError(insertError.message)
        return
      }

      setSuccess(true)
      setTimeout(() => {
        onOpenChange(false)
        router.push("/panel/mis-turnos")
      }, 2000)
    } catch (err) {
      setError("Error al crear el turno. Por favor, intentá nuevamente.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Reservar Turno</DialogTitle>
        </DialogHeader>

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
                Turno reservado exitosamente. Redirigiendo...
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="servicio">Servicio</Label>
            <select
              id="servicio"
              value={formData.servicioId}
              onChange={(e) => setFormData({ ...formData, servicioId: e.target.value })}
              className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
              required
            >
              {servicios.map((servicio) => (
                <option key={servicio.id} value={servicio.id}>
                  {servicio.name} - ${servicio.price.toLocaleString("es-AR")} ({servicio.duration_minutes} min)
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fecha">Fecha</Label>
              <Input
                id="fecha"
                type="date"
                value={formData.fecha}
                onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
                min={new Date().toISOString().split("T")[0]}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="hora">Hora</Label>
              <Input
                id="hora"
                type="time"
                value={formData.hora}
                onChange={(e) => setFormData({ ...formData, hora: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="nombre">Nombre Completo</Label>
            <Input
              id="nombre"
              type="text"
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="telefono">Teléfono</Label>
            <Input
              id="telefono"
              type="tel"
              value={formData.telefono}
              onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
              placeholder="11 1234-5678"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notas">Notas (opcional)</Label>
            <Textarea
              id="notas"
              value={formData.notas}
              onChange={(e) => setFormData({ ...formData, notas: e.target.value })}
              placeholder="Alguna preferencia especial..."
              rows={3}
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading || success}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Confirmar Reserva
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
