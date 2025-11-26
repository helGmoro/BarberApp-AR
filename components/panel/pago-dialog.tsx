"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Loader2, CreditCard, CheckCircle } from "lucide-react"
import { useState, useEffect } from "react"
import { calculatePaymentOptions } from "@/lib/payment-utils"

interface PagoDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  turno: {
    id: string
    instant_discount_applied: boolean
    sena_paid: boolean
    full_payment_paid: boolean
    servicios: {
      name: string
      price: number
    }
    comercios: {
      name: string
      sena_percentage?: number
      instant_payment_discount?: number
    }
  }
}

export function PagoDialog({ open, onOpenChange, turno }: PagoDialogProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [paymentCalculation, setPaymentCalculation] = useState<any>(null)

  useEffect(() => {
    // Calcular montos según configuración del comercio
    const senaPercentage = turno.comercios.sena_percentage || 30
    const instantDiscount = turno.instant_discount_applied 
      ? (turno.comercios.instant_payment_discount || 0) 
      : 0

    const calculation = calculatePaymentOptions(
      turno.servicios.price,
      senaPercentage,
      instantDiscount
    )

    setPaymentCalculation(calculation)
  }, [turno])

  const handlePagar = async () => {
    setLoading(true)
    setError(null)

    try {
      // Determinar qué tipo de pago hacer
      let paymentType: 'sena' | 'completo' | 'resto'
      let amount: number

      if (turno.instant_discount_applied && !turno.sena_paid) {
        // Pago instantáneo con descuento
        paymentType = 'completo'
        amount = paymentCalculation.instant.totalAmount
      } else if (!turno.sena_paid) {
        // Primera vez: pagar seña
        paymentType = 'sena'
        amount = paymentCalculation.deposit.senaAmount
      } else {
        // Ya pagó seña, pagar resto
        paymentType = 'resto'
        amount = paymentCalculation.deposit.remainingAmount
      }

      const response = await fetch("/api/pagos/create-preference", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          turnoId: turno.id,
          paymentType,
          amount,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Error al procesar el pago")
        return
      }

      // Redirigir a Mercado Pago
      if (data.initPoint) {
        window.location.href = data.initPoint
      } else {
        setError("No se pudo generar el enlace de pago")
      }
    } catch (err) {
      setError("Error al procesar el pago. Por favor, intentá nuevamente.")
    } finally {
      setLoading(false)
    }
  }

  if (!paymentCalculation) {
    return null
  }

  // Determinar qué mostrar según el estado del turno
  const showInstant = turno.instant_discount_applied && !turno.sena_paid
  const showDeposit = !turno.instant_discount_applied && !turno.sena_paid
  const showRemaining = turno.sena_paid && !turno.full_payment_paid

  const currentAmount = showInstant 
    ? paymentCalculation.instant.totalAmount 
    : showDeposit 
    ? paymentCalculation.deposit.senaAmount 
    : paymentCalculation.deposit.remainingAmount

  const currentLabel = showInstant 
    ? 'Pago Completo con Descuento' 
    : showDeposit 
    ? 'Seña para Reservar' 
    : 'Resto del Servicio'

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Realizar Pago</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">Servicio</p>
            <p className="font-semibold">{turno.servicios.name}</p>
            <p className="text-sm text-muted-foreground">{turno.comercios.name}</p>
          </div>

          {/* Mostrar resumen del pago */}
          <div className="p-4 border rounded-lg space-y-2">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">{currentLabel}</h3>
            </div>
            
            {showInstant && (
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Precio original:</span>
                  <span className="line-through">${turno.servicios.price.toLocaleString('es-AR')}</span>
                </div>
                <div className="flex justify-between text-green-600">
                  <span>Descuento ({paymentCalculation.instant.discountPercent}%):</span>
                  <span>-${paymentCalculation.instant.discountAmount.toLocaleString('es-AR')}</span>
                </div>
                <div className="flex justify-between font-semibold text-lg pt-2 border-t">
                  <span>Total a pagar:</span>
                  <span className="text-primary">${paymentCalculation.instant.totalAmount.toLocaleString('es-AR')}</span>
                </div>
              </div>
            )}

            {showDeposit && (
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Precio total:</span>
                  <span>${turno.servicios.price.toLocaleString('es-AR')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Seña ({paymentCalculation.deposit.senaPercent}%):</span>
                  <span className="font-semibold">${paymentCalculation.deposit.senaAmount.toLocaleString('es-AR')}</span>
                </div>
                <div className="flex justify-between font-semibold text-lg pt-2 border-t">
                  <span>A pagar ahora:</span>
                  <span className="text-primary">${paymentCalculation.deposit.senaAmount.toLocaleString('es-AR')}</span>
                </div>
                <p className="text-xs text-muted-foreground pt-1">
                  Resto (${paymentCalculation.deposit.remainingAmount.toLocaleString('es-AR')}) se paga en el local
                </p>
              </div>
            )}

            {showRemaining && (
              <div className="space-y-1 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>Ya pagaste (seña):</span>
                  <span>${paymentCalculation.deposit.senaAmount.toLocaleString('es-AR')}</span>
                </div>
                <div className="flex justify-between font-semibold text-lg pt-2 border-t">
                  <span>Resto a pagar:</span>
                  <span className="text-primary">${paymentCalculation.deposit.remainingAmount.toLocaleString('es-AR')}</span>
                </div>
              </div>
            )}
          </div>

          <Button className="w-full" onClick={handlePagar} disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            <CreditCard className="mr-2 h-4 w-4" />
            Pagar ${currentAmount.toLocaleString('es-AR')} con Mercado Pago
          </Button>

          <p className="text-xs text-muted-foreground text-center">
            Serás redirigido a Mercado Pago para completar el pago de forma segura
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
