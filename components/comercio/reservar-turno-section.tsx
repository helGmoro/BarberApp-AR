"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar } from "lucide-react"
import { useState } from "react"
import { ReservarTurnoDialog } from "./reservar-turno-dialog"

interface ReservarTurnoSectionProps {
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

export function ReservarTurnoSection({ comercioId, servicios, businessHours, paymentConfig }: ReservarTurnoSectionProps) {
  const [dialogOpen, setDialogOpen] = useState(false)

  return (
    <>
      <Card className="sticky top-20">
        <CardHeader>
          <CardTitle>Reservá tu Turno</CardTitle>
        </CardHeader>
        <CardContent>
          <Button className="w-full" size="lg" onClick={() => setDialogOpen(true)}>
            <Calendar className="mr-2 h-5 w-5" />
            Reservar Ahora
          </Button>
          <p className="text-xs text-muted-foreground text-center mt-4">Elegí tu servicio, fecha y horario preferido</p>
        </CardContent>
      </Card>

      <ReservarTurnoDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        comercioId={comercioId}
        servicios={servicios}
        businessHours={businessHours}
        paymentConfig={paymentConfig}
      />
    </>
  )
}
