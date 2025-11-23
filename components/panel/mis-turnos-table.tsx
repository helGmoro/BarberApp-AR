"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, MapPin, DollarSign } from "lucide-react"
import { useState } from "react"
import { PagoDialog } from "./pago-dialog"

interface Turno {
  id: string
  appointment_date: string
  appointment_time: string
  status: string
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
  const [pagoDialogOpen, setPagoDialogOpen] = useState(false)
  const [selectedTurno, setSelectedTurno] = useState<Turno | null>(null)

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { label: string; variant: "default" | "secondary" | "outline" | "destructive" }> = {
      pending: { label: "Pendiente", variant: "outline" },
      confirmed: { label: "Confirmado", variant: "default" },
      in_progress: { label: "En Progreso", variant: "secondary" },
      completed: { label: "Completado", variant: "secondary" },
      cancelled: { label: "Cancelado", variant: "destructive" },
      no_show: { label: "No Asistió", variant: "destructive" },
    }
    const config = variants[status] || variants.pending
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  const hasPagado = (turno: Turno) => {
    return turno.pagos.some((p) => p.status === "approved")
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
        {turnos.map((turno) => (
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

            {!hasPagado(turno) && turno.status !== "cancelled" && (
              <div className="flex gap-2 pt-4 border-t">
                <Button size="sm" variant="outline" onClick={() => handlePagar(turno)}>
                  <DollarSign className="h-4 w-4 mr-1" />
                  Dejar Seña ($3.000)
                </Button>
                <Button size="sm" onClick={() => handlePagar(turno)}>
                  <DollarSign className="h-4 w-4 mr-1" />
                  Pagar Completo
                </Button>
              </div>
            )}

            {hasPagado(turno) && (
              <div className="pt-4 border-t">
                <Badge variant="default">Pago Confirmado</Badge>
              </div>
            )}
          </div>
        ))}
      </div>

      {selectedTurno && <PagoDialog open={pagoDialogOpen} onOpenChange={setPagoDialogOpen} turno={selectedTurno} />}
    </>
  )
}
