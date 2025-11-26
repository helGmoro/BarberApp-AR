import { getSupabaseServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { PanelLayoutWrapper as PanelLayout } from "@/components/panel/panel-layout-wrapper"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, Crown } from "lucide-react"
import { CheckoutButton } from "@/components/panel/checkout-button"

export default async function SuscripcionPage() {
  const supabase = await getSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { data: profile } = await supabase.from("profiles").select("user_type").eq("id", user.id).single()
  if (profile?.user_type !== "comercio") {
    redirect("/panel")
  }

  const { data: comercio } = await supabase.from("comercios").select("*").eq("owner_id", user.id).single()

  if (!comercio) {
    redirect("/panel/comercio/setup")
  }

  const isPremium = comercio.subscription_plan === "premium"

  return (
    <PanelLayout userType="comercio">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Suscripción</h1>
          <p className="text-muted-foreground">Gestioná tu plan y facturación</p>
        </div>

        {/* Plan Actual */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Plan Actual</CardTitle>
                <CardDescription>{isPremium ? "Plan Premium Activo" : "Plan Gratuito"}</CardDescription>
              </div>
              {isPremium ? (
                <Badge className="bg-primary">
                  <Crown className="h-3 w-3 mr-1" />
                  Premium
                </Badge>
              ) : (
                <Badge variant="outline">Gratis</Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {isPremium ? (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Tenés acceso a todas las funciones premium de BarberApp AR
                </p>
                {comercio.subscription_expires_at && (
                  <p className="text-sm">
                    Próximo pago: {new Date(comercio.subscription_expires_at).toLocaleDateString("es-AR")}
                  </p>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Actualizá a Premium para desbloquear todas las funciones
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Planes Disponibles */}
        {!isPremium && (
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Plan Gratuito</CardTitle>
                <CardDescription>Para comenzar</CardDescription>
                <div className="text-3xl font-bold mt-4">
                  $0<span className="text-sm font-normal">/mes</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-primary" />
                    Hasta 20 turnos mensuales
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-primary" />
                    Perfil público básico
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-primary" />
                    Gestión de servicios
                  </li>
                </ul>
                <Button variant="outline" className="w-full mt-6 bg-transparent" disabled>
                  Plan Actual
                </Button>
              </CardContent>
            </Card>

            <Card className="border-primary shadow-lg relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge className="bg-primary">
                  <Crown className="h-3 w-3 mr-1" />
                  Recomendado
                </Badge>
              </div>
              <CardHeader>
                <CardTitle>Plan Premium</CardTitle>
                <CardDescription>Para profesionales</CardDescription>
                <div className="text-3xl font-bold mt-4">
                  $10.000<span className="text-sm font-normal">/mes</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center gap-2 text-sm font-medium">
                    <Check className="h-4 w-4 text-primary" />
                    Turnos ilimitados
                  </li>
                  <li className="flex items-center gap-2 text-sm font-medium">
                    <Check className="h-4 w-4 text-primary" />
                    Dashboard con estadísticas
                  </li>
                  <li className="flex items-center gap-2 text-sm font-medium">
                    <Check className="h-4 w-4 text-primary" />
                    Balance mensual detallado
                  </li>
                  <li className="flex items-center gap-2 text-sm font-medium">
                    <Check className="h-4 w-4 text-primary" />
                    Gestión de promociones
                  </li>
                  <li className="flex items-center gap-2 text-sm font-medium">
                    <Check className="h-4 w-4 text-primary" />
                    Integración Mercado Pago
                  </li>
                  <li className="flex items-center gap-2 text-sm font-medium">
                    <Check className="h-4 w-4 text-primary" />
                    Soporte prioritario
                  </li>
                </ul>
                <CheckoutButton />
              </CardContent>
            </Card>
          </div>
        )}

        {/* Historial de Pagos */}
        {isPremium && (
          <Card>
            <CardHeader>
              <CardTitle>Historial de Pagos</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground text-center py-8">
                No hay pagos de suscripción registrados aún
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </PanelLayout>
  )
}
