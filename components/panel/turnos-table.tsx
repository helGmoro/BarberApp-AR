"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { Check, X, Phone, Clock, AlertCircle } from "lucide-react"
import { isSenaExpired, formatTimeRemaining } from "@/lib/payment-utils"

interface Turno {
  id: string
  appointment_date: string
  appointment_time: string
  client_name: string
  client_phone: string
  status: string
  notes: string | null
  payment_method: string | null
  sena_paid: boolean
  full_payment_paid: boolean
  sena_deadline: string | null
  instant_discount_applied: boolean
  servicios: {
    name: string
    price: number
    duration_minutes: number
  }
  pagos?: Array<{
    id: string
    amount: number
    payment_type: string
    status: string
    is_instant_payment: boolean
  }>
}

interface TurnosTableProps {
  turnos: Turno[]
  showPaymentInfo?: boolean
}

export function TurnosTable({ turnos, showPaymentInfo = false }: TurnosTableProps) {
  const [now, setNow] = useState(new Date())

  // Actualizar reloj cada minuto para countdown
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date())
    }, 60000)
    return () => clearInterval(interval)
  }, [])
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)

  const handleUpdateStatus = async (turnoId: string, newStatus: string) => {
    setLoading(turnoId)
    try {
      const supabase = getSupabaseBrowserClient()
      await supabase.from("turnos").update({ status: newStatus }).eq("id", turnoId)

      router.refresh()
    } catch (error) {
      console.error("[BarberApp] Error updating turno:", error)
    } finally {
      setLoading(null)
    }
  }

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

  const getPaymentBadge = (turno: Turno) => {
    if (turno.payment_method === 'local') {
      return <Badge variant="secondary">Pago en Local</Badge>
    }
    if (turno.full_payment_paid) {
      return <Badge variant="default">Pago Completo</Badge>
    }
    if (turno.sena_paid) {
      return <Badge variant="default">Seña Pagada</Badge>
    }
    return null
  }

  if (turnos.length === 0) {
    return <p className="text-muted-foreground text-center py-8">No hay turnos registrados aún</p>
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="text-left py-3 px-4 font-medium">Fecha</th>
            <th className="text-left py-3 px-4 font-medium">Hora</th>
            <th className="text-left py-3 px-4 font-medium">Cliente</th>
            <th className="text-left py-3 px-4 font-medium">Servicio</th>
            <th className="text-left py-3 px-4 font-medium">Estado</th>
            {showPaymentInfo && <th className="text-left py-3 px-4 font-medium">Pago</th>}
            <th className="text-left py-3 px-4 font-medium">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {turnos.map((turno) => {
            const needsPayment = turno.status === 'pending_sena' && !turno.sena_paid
            const isExpired = turno.sena_deadline ? isSenaExpired(turno.sena_deadline) : false
            const timeRemaining = turno.sena_deadline && !isExpired ? formatTimeRemaining(turno.sena_deadline) : null
            
            return (
            <tr key={turno.id} className={`border-b hover:bg-muted/50 ${needsPayment && !isExpired ? 'bg-destructive/5' : ''}`}>
              <td className="py-3 px-4">{turno.appointment_date}</td>
              <td className="py-3 px-4">{turno.appointment_time}</td>
              <td className="py-3 px-4">
                <div>
                  <p className="font-medium">{turno.client_name}</p>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <Phone className="h-3 w-3" />
                    {turno.client_phone}
                  </p>
                </div>
              </td>
              <td className="py-3 px-4">
                <div>
                  <p className="font-medium">{turno.servicios.name}</p>
                  <p className="text-sm text-muted-foreground">
                    ${turno.servicios.price.toLocaleString("es-AR")} • {turno.servicios.duration_minutes} min
                  </p>
                </div>
              </td>
              <td className="py-3 px-4">{getStatusBadge(turno.status)}</td>
              {showPaymentInfo && (
                <td className="py-3 px-4">
                  <div className="space-y-1">
                    {getPaymentBadge(turno)}
                    {needsPayment && !isExpired && timeRemaining && (
                      <div className="flex items-center gap-1 text-xs text-destructive">
                        <Clock className="h-3 w-3" />
                        {timeRemaining}
                      </div>
                    )}
                    {needsPayment && isExpired && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <AlertCircle className="h-3 w-3" />
                        Expirado
                      </div>
                    )}
                  </div>
                </td>
              )}
              <td className="py-3 px-4">
                <div className="flex items-center gap-2">
                  {turno.status === "pending" && (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleUpdateStatus(turno.id, "confirmed")}
                        disabled={loading === turno.id}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleUpdateStatus(turno.id, "cancelled")}
                        disabled={loading === turno.id}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                  {turno.status === "confirmed" && (
                    <Button
                      size="sm"
                      onClick={() => handleUpdateStatus(turno.id, "completed")}
                      disabled={loading === turno.id}
                    >
                      Completar
                    </Button>
                  )}
                </div>
              </td>
            </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
