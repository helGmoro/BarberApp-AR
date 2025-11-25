"use client"

import type React from "react"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useState, useEffect } from "react"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react"
import { PaymentOptionsSelector } from "./payment-options-selector"

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
  paymentConfig: {
    acceptsOnlinePayment: boolean
    senaPercentage: number
    instantPaymentDiscount: number
    senaExpirationHours: number
  }
}

const DIAS_MAP: { [key: number]: string } = {
  0: "domingo",
  1: "lunes",
  2: "martes",
  3: "miercoles",
  4: "jueves",
  5: "viernes",
  6: "sabado",
}

export function ReservarTurnoDialog({ open, onOpenChange, comercioId, servicios, businessHours, paymentConfig }: ReservarTurnoDialogProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [availableSlots, setAvailableSlots] = useState<string[]>([])
  const [loadingSlots, setLoadingSlots] = useState(false)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'instant' | 'deposit' | 'local' | null>(null)

  const [formData, setFormData] = useState({
    servicioId: servicios[0]?.id || "",
    fecha: "",
    hora: "",
    nombre: "",
    telefono: "",
    email: "",
    notas: "",
  })

  // Generar slots disponibles cuando cambia la fecha o servicio
  useEffect(() => {
    if (formData.fecha && formData.servicioId) {
      generateAvailableSlots()
    } else {
      setAvailableSlots([])
    }
  }, [formData.fecha, formData.servicioId])

  const generateAvailableSlots = async () => {
    setLoadingSlots(true)
    try {
      const selectedDate = new Date(formData.fecha + "T00:00:00")
      const dayOfWeek = selectedDate.getDay()
      const dayName = DIAS_MAP[dayOfWeek]
      const dayConfig = businessHours?.[dayName]

      if (!dayConfig || dayConfig.closed) {
        setAvailableSlots([])
        setLoadingSlots(false)
        return
      }

      const servicio = servicios.find((s) => s.id === formData.servicioId)
      if (!servicio) {
        setAvailableSlots([])
        setLoadingSlots(false)
        return
      }

      // Obtener turnos ya reservados para esa fecha
      const supabase = getSupabaseBrowserClient()
      const { data: existingTurnos } = await supabase
        .from("turnos")
        .select("appointment_time, end_time")
        .eq("comercio_id", comercioId)
        .eq("appointment_date", formData.fecha)
        .in("status", ["pending", "confirmed", "in_progress"])

      // Generar todos los slots posibles
      const slots: string[] = []
      const [openHour, openMin] = dayConfig.open.split(":").map(Number)
      const [closeHour, closeMin] = dayConfig.close.split(":").map(Number)

      let currentTime = openHour * 60 + openMin
      const endTime = closeHour * 60 + closeMin
      const duration = servicio.duration_minutes

      while (currentTime + duration <= endTime) {
        const hour = Math.floor(currentTime / 60)
        const min = currentTime % 60
        const timeStr = `${hour.toString().padStart(2, "0")}:${min.toString().padStart(2, "0")}`

        // Verificar si está en algún descanso
        const isInBreak = dayConfig.breaks?.some((breakItem: any) => {
          const [breakStartH, breakStartM] = breakItem.start.split(":").map(Number)
          const [breakEndH, breakEndM] = breakItem.end.split(":").map(Number)
          const breakStart = breakStartH * 60 + breakStartM
          const breakEnd = breakEndH * 60 + breakEndM
          return currentTime >= breakStart && currentTime < breakEnd
        })

        if (!isInBreak) {
          // Verificar si se superpone con algún turno existente
          const endCurrentTime = currentTime + duration
          const isOccupied = existingTurnos?.some((turno: any) => {
            const [tStartH, tStartM] = turno.appointment_time.split(":").map(Number)
            const [tEndH, tEndM] = turno.end_time.split(":").map(Number)
            const tStart = tStartH * 60 + tStartM
            const tEnd = tEndH * 60 + tEndM
            return (currentTime < tEnd && endCurrentTime > tStart)
          })

          if (!isOccupied) {
            slots.push(timeStr)
          }
        }

        currentTime += 15 // Incrementar en intervalos de 15 minutos
      }

      setAvailableSlots(slots)
    } catch (e) {
      setError("Error al calcular horarios disponibles")
    } finally {
      setLoadingSlots(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validar que se seleccionó método de pago si acepta pagos online
    if (paymentConfig.acceptsOnlinePayment && !selectedPaymentMethod) {
      setError("Debes seleccionar una opción de pago")
      return
    }
    
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

      // Calcular deadline para seña (si aplica)
      let senaDeadline = null
      let status = "pending"
      let paymentMethod = null

      if (paymentConfig.acceptsOnlinePayment) {
        if (selectedPaymentMethod === 'instant' || selectedPaymentMethod === 'deposit') {
          paymentMethod = 'platform'
          status = 'pending_sena' // Ambos requieren pago inicial
          
          // Deadline: ahora + horas configuradas
          const deadline = new Date()
          deadline.setHours(deadline.getHours() + paymentConfig.senaExpirationHours)
          senaDeadline = deadline.toISOString()
        } else if (selectedPaymentMethod === 'local') {
          paymentMethod = 'local'
          status = 'confirmed' // Confirmado pero paga en el local
        }
      }

      const { data: turno, error: insertError } = await supabase.from("turnos").insert({
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
        status: status,
        payment_method: paymentMethod,
        sena_deadline: senaDeadline,
        sena_paid: false,
        full_payment_paid: false,
        instant_discount_applied: selectedPaymentMethod === 'instant',
      }).select().single()

      if (insertError) {
        setError(insertError.message)
        return
      }

      // Si es pago online, redirigir a página de pago
      if (paymentMethod === 'platform' && turno) {
        setSuccess(true)
        setTimeout(() => {
          onOpenChange(false)
          router.push(`/panel/mis-turnos?pagar=${turno.id}`)
        }, 1500)
      } else {
        // Si es pago local, ir directo a mis turnos
        setSuccess(true)
        setTimeout(() => {
          onOpenChange(false)
          router.push("/panel/mis-turnos")
        }, 2000)
      }
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
              {loadingSlots ? (
                <div className="h-10 flex items-center justify-center border rounded-md">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              ) : availableSlots.length > 0 ? (
                <select
                  id="hora"
                  value={formData.hora}
                  onChange={(e) => setFormData({ ...formData, hora: e.target.value })}
                  className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                  required
                >
                  <option value="">Seleccionar hora</option>
                  {availableSlots.map((slot) => (
                    <option key={slot} value={slot}>
                      {slot}
                    </option>
                  ))}
                </select>
              ) : formData.fecha ? (
                <div className="h-10 flex items-center justify-center border rounded-md text-sm text-muted-foreground">
                  Sin horarios disponibles
                </div>
              ) : (
                <Input
                  id="hora"
                  type="time"
                  value={formData.hora}
                  onChange={(e) => setFormData({ ...formData, hora: e.target.value })}
                  disabled
                  placeholder="Seleccione fecha"
                />
              )}
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

          {/* Selector de método de pago - solo si el comercio acepta pagos online */}
          {paymentConfig.acceptsOnlinePayment && formData.servicioId && (
            <div className="space-y-2 border-t pt-4">
              <PaymentOptionsSelector
                servicePrice={servicios.find(s => s.id === formData.servicioId)?.price || 0}
                senaPercentage={paymentConfig.senaPercentage}
                instantDiscount={paymentConfig.instantPaymentDiscount}
                expirationHours={paymentConfig.senaExpirationHours}
                onSelect={setSelectedPaymentMethod}
              />
            </div>
          )}

          <Button 
            type="submit" 
            className="w-full" 
            disabled={loading || success || (paymentConfig.acceptsOnlinePayment && !selectedPaymentMethod)}
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {selectedPaymentMethod === 'instant' || selectedPaymentMethod === 'deposit' 
              ? 'Continuar al Pago' 
              : 'Confirmar Reserva'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
