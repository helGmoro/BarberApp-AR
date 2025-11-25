"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Info, Percent, Clock, Zap, CheckCircle2, Pencil } from "lucide-react"

interface PaymentConfigFormProps {
  initialConfig: {
    acceptsOnlinePayment: boolean
    senaPercentage: number
    instantPaymentDiscount: number
    senaExpirationHours: number
  }
}

export function PaymentConfigForm({ initialConfig }: PaymentConfigFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [savedSuccessfully, setSavedSuccessfully] = useState(false)

  const [acceptsOnline, setAcceptsOnline] = useState(initialConfig.acceptsOnlinePayment)
  const [senaPercentage, setSenaPercentage] = useState(initialConfig.senaPercentage)
  const [instantDiscount, setInstantDiscount] = useState(initialConfig.instantPaymentDiscount)
  const [expirationHours, setExpirationHours] = useState(initialConfig.senaExpirationHours)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (senaPercentage < 10 || senaPercentage > 100) {
      toast({
        variant: "destructive",
        title: "Porcentaje inválido",
        description: "La seña debe ser entre 10% y 100%",
      })
      return
    }

    if (instantDiscount < 0 || instantDiscount > 50) {
      toast({
        variant: "destructive",
        title: "Descuento inválido",
        description: "El descuento debe ser entre 0% y 50%",
      })
      return
    }

    setLoading(true)

    try {
      const response = await fetch("/api/comercio/payment-config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          acceptsOnlinePayment: acceptsOnline,
          senaPercentage,
          instantPaymentDiscount: instantDiscount,
          senaExpirationHours: expirationHours,
        }),
      })

      if (!response.ok) {
        throw new Error("Error al guardar configuración")
      }

      toast({
        title: "Configuración guardada",
        description: "Los cambios se aplicarán a las nuevas reservas",
      })

      setSavedSuccessfully(true)
      setIsEditing(false)
      router.refresh()
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo guardar la configuración",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {savedSuccessfully && !isEditing && (
        <Alert className="border-success bg-success/10">
          <CheckCircle2 className="h-4 w-4 text-success" />
          <AlertDescription className="text-success-foreground">
            Configuración guardada exitosamente
          </AlertDescription>
        </Alert>
      )}

      {/* Activar pagos online */}
      <Card>
        <CardHeader>
          <CardTitle>Pagos Online</CardTitle>
          <CardDescription>
            Permite que los clientes paguen a través de la plataforma con Mercado Pago
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Aceptar pagos online</Label>
              <p className="text-sm text-muted-foreground">
                Los clientes podrán pagar servicios directamente en la app
              </p>
            </div>
            <Switch checked={acceptsOnline} onCheckedChange={setAcceptsOnline} disabled={!isEditing} />
          </div>

          {acceptsOnline && (
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                Asegurate de haber configurado tu CVU/Alias de Mercado Pago en Integración MP
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {acceptsOnline && (
        <>
          {/* Configuración de Seña */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Percent className="h-5 w-5" />
                Porcentaje de Seña
              </CardTitle>
              <CardDescription>
                La seña se paga <strong>siempre por la plataforma</strong> para asegurar el turno
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="sena">Porcentaje de seña (%)</Label>
                <Input
                  id="sena"
                  type="number"
                  min="10"
                  max="100"
                  value={senaPercentage}
                  onChange={(e) => setSenaPercentage(Number(e.target.value))}
                  disabled={loading || !isEditing}
                />
                <p className="text-sm text-muted-foreground">
                  Ejemplo: Si un servicio cuesta $10.000 y la seña es {senaPercentage}%, el cliente paga $
                  {((10000 * senaPercentage) / 100).toLocaleString("es-AR")} para confirmar
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="expiration" className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Tiempo para pagar la seña (horas)
                </Label>
                <Input
                  id="expiration"
                  type="number"
                  min="1"
                  max="72"
                  value={expirationHours}
                  onChange={(e) => setExpirationHours(Number(e.target.value))}
                  disabled={loading || !isEditing}
                />
                <p className="text-sm text-muted-foreground">
                  El turno se cancela automáticamente si no se paga la seña en {expirationHours} horas
                </p>
              </div>

              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  <strong>Importante:</strong> La seña es <u>obligatoria</u> y se paga por la plataforma para evitar
                  turnos fantasma. El cliente decide cómo pagar el resto.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          {/* Descuento por pago instantáneo */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-yellow-500" />
                Descuento por Pago Instantáneo
              </CardTitle>
              <CardDescription>
                Incentiva a tus clientes a pagar el servicio completo al reservar
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="discount">Descuento por pago completo instantáneo (%)</Label>
                <Input
                  id="discount"
                  type="number"
                  min="0"
                  max="50"
                  step="0.5"
                  value={instantDiscount}
                  onChange={(e) => setInstantDiscount(Number(e.target.value))}
                  disabled={loading || !isEditing}
                />
                <p className="text-sm text-muted-foreground">
                  {instantDiscount > 0 ? (
                    <>
                      Ejemplo: Servicio de $10.000 con {instantDiscount}% descuento = $
                      {(10000 - (10000 * instantDiscount) / 100).toLocaleString("es-AR")} (ahorra $
                      {((10000 * instantDiscount) / 100).toLocaleString("es-AR")})
                    </>
                  ) : (
                    "Sin descuento por pago instantáneo"
                  )}
                </p>
              </div>

              <Alert className="bg-yellow-500/10 border-yellow-500/50">
                <Zap className="h-4 w-4 text-yellow-500" />
                <AlertDescription>
                  <strong>Beneficios:</strong> Recibirás el dinero de inmediato y evitás pagos en el local. El cliente
                  ahorra dinero.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          {/* Resumen */}
          <Card className="border-primary">
            <CardHeader>
              <CardTitle>Resumen de Configuración</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Pagos online:</span>
                <span className="font-medium">{acceptsOnline ? "Activado ✅" : "Desactivado"}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Seña requerida:</span>
                <span className="font-medium">{senaPercentage}% del servicio</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tiempo para pagar seña:</span>
                <span className="font-medium">{expirationHours} horas</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Descuento pago instantáneo:</span>
                <span className="font-medium text-yellow-600">{instantDiscount}%</span>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* Botones */}
      {isEditing ? (
        <div className="flex gap-3">
          <Button 
            type="button" 
            variant="outline" 
            className="flex-1" 
            onClick={() => {
              setIsEditing(false)
              setAcceptsOnline(initialConfig.acceptsOnlinePayment)
              setSenaPercentage(initialConfig.senaPercentage)
              setInstantDiscount(initialConfig.instantPaymentDiscount)
              setExpirationHours(initialConfig.senaExpirationHours)
            }}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button type="submit" className="flex-1" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Guardando...
              </>
            ) : (
              "Guardar Configuración"
            )}
          </Button>
        </div>
      ) : (
        <Button 
          type="button" 
          variant="outline" 
          className="w-full" 
          onClick={() => {
            setIsEditing(true)
            setSavedSuccessfully(false)
          }}
        >
          <Pencil className="mr-2 h-4 w-4" />
          Editar Configuración
        </Button>
      )}
    </form>
  )
}
