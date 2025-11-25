"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { CreditCard, Store, Zap, Clock, Info } from "lucide-react"
import { calculatePaymentOptions, calculateSenaDeadline } from "@/lib/payment-utils"

interface PaymentOptionsSelectorProps {
  servicePrice: number
  senaPercentage: number
  instantDiscountPercentage: number
  senaExpirationHours: number
  selectedOption: "instant" | "sena_local" | null
  onSelectOption: (option: "instant" | "sena_local") => void
  acceptsOnlinePayment: boolean
}

export function PaymentOptionsSelector({
  servicePrice,
  senaPercentage,
  instantDiscountPercentage,
  senaExpirationHours,
  selectedOption,
  onSelectOption,
  acceptsOnlinePayment,
}: PaymentOptionsSelectorProps) {
  const paymentCalc = calculatePaymentOptions(servicePrice, senaPercentage, instantDiscountPercentage)
  const senaDeadline = calculateSenaDeadline(senaExpirationHours)

  if (!acceptsOnlinePayment) {
    return (
      <Alert>
        <Store className="h-4 w-4" />
        <AlertDescription>
          <strong>Pago en el local</strong>
          <br />
          Este comercio solo acepta pagos presenciales. Confirmá tu turno y pagá cuando llegues.
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Selecciona cómo pagar</h3>
        <p className="text-sm text-muted-foreground">
          La seña es obligatoria para asegurar tu turno. Elegí si querés pagar todo ahora o el resto en el local.
        </p>
      </div>

      <RadioGroup
        value={selectedOption || ""}
        onValueChange={(value) => onSelectOption(value as "instant" | "sena_local")}
      >
        {/* Opción: Pago Instantáneo Completo */}
        {instantDiscountPercentage > 0 && (
          <Card
            className={`cursor-pointer transition ${selectedOption === "instant" ? "border-primary ring-2 ring-primary" : ""}`}
            onClick={() => onSelectOption("instant")}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <RadioGroupItem value="instant" id="instant" />
                  <div>
                    <Label htmlFor="instant" className="cursor-pointer flex items-center gap-2 text-base">
                      <Zap className="h-5 w-5 text-yellow-500" />
                      Pagar Todo Ahora
                      <Badge className="bg-yellow-500">¡Ahorrás {instantDiscountPercentage}%!</Badge>
                    </Label>
                    <CardDescription className="mt-1">Pago completo con descuento</CardDescription>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between py-2 border-t">
                <span className="text-sm text-muted-foreground">Precio original:</span>
                <span className="text-sm line-through">${paymentCalc.servicePriceOriginal.toLocaleString("es-AR")}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Descuento ({instantDiscountPercentage}%):</span>
                <span className="text-sm text-green-600">
                  -${paymentCalc.instantDiscountAmount.toLocaleString("es-AR")}
                </span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t">
                <span className="font-semibold">Total a pagar ahora:</span>
                <span className="text-2xl font-bold text-primary">
                  ${paymentCalc.instantPaymentTotal.toLocaleString("es-AR")}
                </span>
              </div>
              <Alert className="bg-green-500/10 border-green-500/50">
                <Zap className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-sm">
                  <strong>Beneficio:</strong> Pagás todo ahora y ahorrás $
                  {paymentCalc.instantDiscountAmount.toLocaleString("es-AR")}. No tenés que pagar nada en el local.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        )}

        {/* Opción: Seña + Pago en Local */}
        <Card
          className={`cursor-pointer transition ${selectedOption === "sena_local" ? "border-primary ring-2 ring-primary" : ""}`}
          onClick={() => onSelectOption("sena_local")}
        >
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <RadioGroupItem value="sena_local" id="sena_local" />
                <div>
                  <Label htmlFor="sena_local" className="cursor-pointer flex items-center gap-2 text-base">
                    <CreditCard className="h-5 w-5" />
                    Seña Ahora + Resto en el Local
                  </Label>
                  <CardDescription className="mt-1">Pago dividido</CardDescription>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between py-2 border-t">
              <span className="text-sm text-muted-foreground">Precio del servicio:</span>
              <span className="text-sm font-medium">${paymentCalc.servicePriceOriginal.toLocaleString("es-AR")}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Seña ({senaPercentage}%):</span>
              <span className="text-lg font-bold text-primary">${paymentCalc.senaAmount.toLocaleString("es-AR")}</span>
            </div>
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-sm">Resto (en el local):</span>
              <span className="text-sm">${paymentCalc.remainingAmount.toLocaleString("es-AR")}</span>
            </div>
            <Alert className="bg-blue-500/10 border-blue-500/50">
              <Clock className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-sm">
                <strong>Importante:</strong> Tenés hasta el{" "}
                {senaDeadline.toLocaleDateString("es-AR", {
                  day: "2-digit",
                  month: "long",
                  hour: "2-digit",
                  minute: "2-digit",
                })}{" "}
                ({senaExpirationHours}h) para pagar la seña. Si no, se cancela el turno.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {/* Sin descuento - Mostrar opción sin beneficio */}
        {instantDiscountPercentage === 0 && (
          <Card
            className={`cursor-pointer transition ${selectedOption === "instant" ? "border-primary ring-2 ring-primary" : ""}`}
            onClick={() => onSelectOption("instant")}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <RadioGroupItem value="instant" id="instant" />
                  <div>
                    <Label htmlFor="instant" className="cursor-pointer flex items-center gap-2 text-base">
                      <CreditCard className="h-5 w-5" />
                      Pagar Todo Ahora
                    </Label>
                    <CardDescription className="mt-1">Pago completo por la plataforma</CardDescription>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between pt-2 border-t">
                <span className="font-semibold">Total a pagar ahora:</span>
                <span className="text-2xl font-bold text-primary">
                  ${paymentCalc.servicePriceOriginal.toLocaleString("es-AR")}
                </span>
              </div>
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription className="text-sm">
                  Pagás el servicio completo ahora. No tendrás que pagar nada en el local.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        )}
      </RadioGroup>

      {/* Nota sobre la seña */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription className="text-sm">
          <strong>¿Por qué se paga seña?</strong>
          <br />
          La seña asegura tu turno y evita que otra persona lo tome. Se paga siempre por la plataforma para garantizar
          tu reserva.
        </AlertDescription>
      </Alert>
    </div>
  )
}
