"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Crown, Check, Lock } from "lucide-react"
import Link from "next/link"

interface UpgradePlanProps {
  feature: string
  benefits?: string[]
}

export function UpgradePlan({ feature, benefits }: UpgradePlanProps) {
  const defaultBenefits = [
    "Turnos ilimitados",
    "Dashboard con estadísticas",
    "Balance mensual detallado",
    "Gestión de promociones",
    "Integración Mercado Pago",
    "Soporte prioritario",
  ]

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Card className="max-w-2xl w-full border-primary/20">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
            <Lock className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">
            {feature} es una función Premium
          </CardTitle>
          <CardDescription className="text-base">
            Actualizá tu plan para acceder a esta y muchas más funcionalidades exclusivas
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-lg p-6 space-y-4">
            <div className="flex items-center gap-2">
              <Crown className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-lg">Plan Premium</h3>
              <span className="ml-auto text-2xl font-bold">$10.000<span className="text-sm text-muted-foreground font-normal">/mes</span></span>
            </div>
            <ul className="space-y-3">
              {(benefits || defaultBenefits).map((benefit, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" asChild>
              <Link href="/panel/comercio">Volver al Dashboard</Link>
            </Button>
            <Button className="flex-1" asChild>
              <Link href="/panel/comercio/suscripcion">
                <Crown className="mr-2 h-4 w-4" />
                Actualizar a Premium
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
