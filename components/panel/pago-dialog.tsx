"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Loader2, CreditCard } from "lucide-react"
import { useState } from "react"

interface PagoDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  turno: {
    id: string
    servicios: {
      name: string
      price: number
    }
    comercios: {
      name: string
    }
  }
}

export function PagoDialog({ open, onOpenChange, turno }: PagoDialogProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [paymentType, setPaymentType] = useState<"sena" | "completo">("sena")

  const amount = paymentType === "sena" ? 3000 : turno.servicios.price
  const commission = paymentType === "sena" ? amount * 0.03 : amount * 0.05
  const netAmount = amount - commission

  const handlePagar = async () => {
    setLoading(true)
    setError(null)

    try {
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

      // En producción, redirigir a Mercado Pago
      // window.location.href = data.initPoint

      // Por ahora, simular pago exitoso
      alert("Redirigiendo a Mercado Pago...")
      onOpenChange(false)
    } catch (err) {
      setError("Error al procesar el pago. Por favor, intentá nuevamente.")
    } finally {
      setLoading(false)
    }
  }

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

          <div className="space-y-3">
            <Label>Tipo de Pago</Label>
            <RadioGroup value={paymentType} onValueChange={(v) => setPaymentType(v as "sena" | "completo")}>
              <div className="flex items-center space-x-2 p-3 border rounded-lg cursor-pointer hover:bg-muted">
                <RadioGroupItem value="sena" id="sena" />
                <Label htmlFor="sena" className="flex-1 cursor-pointer">
                  <div className="font-medium">Dejar Seña</div>
                  <div className="text-sm text-muted-foreground">$3.000 para asegurar tu turno</div>
                </Label>
              </div>
              <div className="flex items-center space-x-2 p-3 border rounded-lg cursor-pointer hover:bg-muted">
                <RadioGroupItem value="completo" id="completo" />
                <Label htmlFor="completo" className="flex-1 cursor-pointer">
                  <div className="font-medium">Pago Completo</div>
                  <div className="text-sm text-muted-foreground">
                    ${turno.servicios.price.toLocaleString("es-AR")} - Abonás todo ahora
                  </div>
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="border-t pt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span>Monto</span>
              <span className="font-medium">${amount.toLocaleString("es-AR")}</span>
            </div>
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Comisión plataforma ({paymentType === "sena" ? "3%" : "5%"})</span>
              <span>-${commission.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-semibold text-base pt-2 border-t">
              <span>Total a pagar</span>
              <span className="text-primary">${amount.toLocaleString("es-AR")}</span>
            </div>
            <p className="text-xs text-muted-foreground">El comercio recibirá: ${netAmount.toFixed(2)}</p>
          </div>

          <Button className="w-full" onClick={handlePagar} disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            <CreditCard className="mr-2 h-4 w-4" />
            Pagar con Mercado Pago
          </Button>

          <p className="text-xs text-muted-foreground text-center">
            Serás redirigido a Mercado Pago para completar el pago de forma segura
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
