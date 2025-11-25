"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, MapPin, DollarSign, AlertCircle } from "lucide-react"
import { useState, useEffect } from "react"
import { PagoDialog } from "./pago-dialog"
import { useSearchParams } from "next/navigation"
import { isSenaExpired, formatTimeRemaining } from "@/lib/payment-utils"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface Turno {
  id: string
  appointment_date: string
  appointment_time: string
  status: string
  payment_method: string | null
  sena_paid: boolean
  full_payment_paid: boolean
  sena_deadline: string | null
  instant_discount_applied: boolean
  comercios: {
    name: string
    address: string
    city: string
    phone: string
  }
  servicios: {
    name: string
    price: number
    duration_minutes: number
  }
  pagos: Array<{
    id: string
    amount: number
    payment_type: string
    status: string
  }>
}

export function MisTurnosTable({ turnos }: { turnos: Turno[] }) {
  const searchParams = useSearchParams()
  const pagarTurnoId = searchParams?.get('pagar')
  
  const [pagoDialogOpen, setPagoDialogOpen] = useState(false)
  const [selectedTurno, setSelectedTurno] = useState<Turno | null>(null)
  const [now, setNow] = useState(new Date())

  // Actualizar reloj cada minuto para countdown
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date())
    }, 60000)
    return () => clearInterval(interval)
  }, [])

  // Auto-abrir diálogo si viene de reserva
  useEffect(() => {
    if (pagarTurnoId && turnos) {
      const turno = turnos.find(t => t.id === pagarTurnoId)
      if (turno && turno.status === 'pending_sena') {
        setSelectedTurno(turno)
        setPagoDialogOpen(true)
      }
    }
  }, [pagarTurnoId, turnos])

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { label: string; variant: "default" | "secondary" | "outline" | "destructive" }> = {
      pending: { label: "Pendiente", variant: "outline" },
      pending_sena: { label: "Pago Pendiente", variant: "outline" },
      confirmed: { label: "Confirmado", variant: "default" },
      in_progress: { label: "En Progreso", variant: "secondary" },
      completed: { label: "Completado", variant: "secondary" },
      cancelled: { label: "Cancelado", variant: "destructive" },
      expired: { label: "Expirado", variant: "destructive" },
      no_show: { label: "No Asistió", variant: "destructive" },
    }
    const config = variants[status] || variants.pending
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  const handlePagar = (turno: Turno) => {
    setSelectedTurno(turno)
    setPagoDialogOpen(true)
  }

  if (turnos.length === 0) {
    return <p className="text-muted-foreground text-center py-8">No tenés turnos registrados aún</p>
  }

  return (
    <>
      <div className="space-y-4">
        {turnos.map((turno) => {
          const needsPayment = turno.status === 'pending_sena' && !turno.sena_paid
          const isExpired = turno.sena_deadline ? isSenaExpired(turno.sena_deadline) : false
          const timeRemaining = turno.sena_deadline && !isExpired ? formatTimeRemaining(turno.sena_deadline) : null

          return (
            <div key={turno.id} className="border rounded-lg p-4">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="font-semibold text-lg mb-1">{turno.comercios.name}</h4>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {turno.comercios.address}, {turno.comercios.city}
                  </p>
                </div>
                {getStatusBadge(turno.status)}
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm font-medium mb-2">Servicio</p>
                  <p className="text-sm text-muted-foreground">{turno.servicios.name}</p>
                  <p className="text-sm font-semibold text-primary">${turno.servicios.price.toLocaleString("es-AR")}</p>
                </div>
                <div>
                  <p className="text-sm font-medium mb-2">Fecha y Hora</p>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {turno.appointment_date}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {turno.appointment_time}
                    </div>
                  </div>
                </div>
              </div>

              {/* Alerta de pago pendiente */}
              {needsPayment && !isExpired && timeRemaining && (
                <Alert className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Pago pendiente:</strong> Tenés {timeRemaining} para completar el pago.
                  </AlertDescription>
                </Alert>
              )}

              {/* Botones de pago */}
              {needsPayment && !isExpired && (
                <div className="flex gap-2 pt-4 border-t">
                  <Button size="sm" variant="default" onClick={() => handlePagar(turno)}>
                    <DollarSign className="h-4 w-4 mr-1" />
                    Pagar Ahora
                  </Button>
                </div>
              )}

              {/* Info de pago completado */}
              {turno.sena_paid && (
                <div className="pt-4 border-t">
                  <Badge variant="default">
                    {turno.full_payment_paid ? 'Pago Completo' : 'Seña Pagada'}
                  </Badge>
                  {!turno.full_payment_paid && turno.payment_method === 'platform' && (
                    <p className="text-xs text-muted-foreground mt-2">
                      Resto a pagar en el local
                    </p>
                  )}
                </div>
              )}

              {/* Pago local */}
              {turno.payment_method === 'local' && turno.status === 'confirmed' && (
                <div className="pt-4 border-t">
                  <Badge variant="secondary">Pago en el Local</Badge>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {selectedTurno && <PagoDialog open={pagoDialogOpen} onOpenChange={setPagoDialogOpen} turno={selectedTurno} />}
    </>
  )
}
