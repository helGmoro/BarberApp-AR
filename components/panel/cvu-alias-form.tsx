"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import { Loader2, CheckCircle2, Info } from "lucide-react"

interface CVUAliasFormProps {
  initialCVU?: string
  initialAlias?: string
}

export function CVUAliasForm({ initialCVU, initialAlias }: CVUAliasFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [cvu, setCVU] = useState(initialCVU || "")
  const [alias, setAlias] = useState(initialAlias || "")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validaciones
    if (!cvu && !alias) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Ingresá al menos tu CVU o Alias de Mercado Pago",
      })
      return
    }

    if (cvu && cvu.length !== 22) {
      toast({
        variant: "destructive",
        title: "CVU inválido",
        description: "El CVU debe tener exactamente 22 dígitos",
      })
      return
    }

    setLoading(true)

    try {
      const response = await fetch("/api/comercio/mp-cvu", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cvu, alias }),
      })

      if (!response.ok) {
        throw new Error("Error al guardar los datos")
      }

      toast({
        title: "¡Configuración guardada!",
        description: "Tu cuenta de Mercado Pago fue vinculada correctamente",
      })

      router.refresh()
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo guardar la configuración. Intentá de nuevo.",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Configurar Cuenta de Mercado Pago</CardTitle>
          <CardDescription>
            Ingresá tu CVU o Alias para recibir pagos. Podés encontrar estos datos en la app de Mercado Pago.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Información de ayuda */}
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              <strong>¿Dónde encuentro estos datos?</strong>
              <br />
              Abrí la app de Mercado Pago → Dinero → CVU o Alias
            </AlertDescription>
          </Alert>

          {/* Campo CVU */}
          <div className="space-y-2">
            <Label htmlFor="cvu">CVU (22 dígitos)</Label>
            <Input
              id="cvu"
              type="text"
              placeholder="0000003100012345678901"
              value={cvu}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "").slice(0, 22)
                setCVU(value)
              }}
              maxLength={22}
              disabled={loading}
            />
            <p className="text-sm text-muted-foreground">
              {cvu.length}/22 dígitos {cvu.length === 22 && <CheckCircle2 className="inline h-4 w-4 text-green-500" />}
            </p>
          </div>

          {/* Separador */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">O</span>
            </div>
          </div>

          {/* Campo Alias */}
          <div className="space-y-2">
            <Label htmlFor="alias">Alias de Mercado Pago</Label>
            <Input
              id="alias"
              type="text"
              placeholder="TU.ALIAS.MP"
              value={alias}
              onChange={(e) => setAlias(e.target.value.toLowerCase())}
              disabled={loading}
            />
            <p className="text-sm text-muted-foreground">
              Ejemplo: barberia.centro, peluqueria.norte, etc.
            </p>
          </div>

          {/* Nota importante */}
          <Alert>
            <AlertDescription className="text-sm">
              <strong>Importante:</strong> Las transferencias se realizan automáticamente cada vez que un cliente paga
              un turno. Recibirás el monto del servicio menos la comisión de la plataforma (3-5%).
            </AlertDescription>
          </Alert>

          {/* Botón */}
          <Button type="submit" className="w-full" disabled={loading || (!cvu && !alias)}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Guardando...
              </>
            ) : (
              "Guardar Configuración"
            )}
          </Button>
        </CardContent>
      </Card>
    </form>
  )
}
