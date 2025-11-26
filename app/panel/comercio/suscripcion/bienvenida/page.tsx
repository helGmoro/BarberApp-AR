import { getSupabaseServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { PanelLayoutWrapper as PanelLayout } from "@/components/panel/panel-layout-wrapper"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Crown, Check, Sparkles, ChevronRight } from "lucide-react"
import Link from "next/link"

export default async function BienvenidaPremiumPage() {
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

  const { data: comercio } = await supabase
    .from("comercios")
    .select("name, subscription_plan")
    .eq("owner_id", user.id)
    .single()

  if (!comercio) {
    redirect("/panel/comercio/setup")
  }

  const isPremium = comercio.subscription_plan === "premium"

  return (
    <PanelLayout userType="comercio">
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="max-w-2xl w-full space-y-8">
          {/* Header con animación */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-4">
              <Crown className="h-10 w-10 text-primary" />
            </div>
            <h1 className="text-4xl font-bold">
              {isPremium ? "¡Bienvenido a Premium!" : "Procesando tu suscripción..."}
            </h1>
            <p className="text-xl text-muted-foreground">
              {isPremium
                ? "Gracias por confiar en BarberApp AR"
                : "Tu pago está siendo procesado. En breve activaremos tu plan Premium."}
            </p>
          </div>

          {isPremium ? (
            <>
              {/* Tarjeta de agradecimiento */}
              <Card className="border-primary shadow-lg">
                <CardHeader className="text-center">
                  <div className="inline-flex items-center justify-center gap-2 mb-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    <CardTitle className="text-2xl">Tu plan está activo</CardTitle>
                    <Sparkles className="h-5 w-5 text-primary" />
                  </div>
                  <CardDescription>
                    Ahora tenés acceso completo a todas las funciones profesionales de BarberApp AR
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Beneficios */}
                  <div className="grid gap-3">
                    <div className="flex items-start gap-3">
                      <div className="rounded-full bg-primary/10 p-1.5 mt-0.5">
                        <Check className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">Turnos ilimitados</p>
                        <p className="text-sm text-muted-foreground">
                          Gestioná tantos turnos como necesites sin restricciones
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="rounded-full bg-primary/10 p-1.5 mt-0.5">
                        <Check className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">Estadísticas detalladas</p>
                        <p className="text-sm text-muted-foreground">
                          Visualizá el rendimiento de tu negocio mes a mes
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="rounded-full bg-primary/10 p-1.5 mt-0.5">
                        <Check className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">Cobros online</p>
                        <p className="text-sm text-muted-foreground">
                          Integrá Mercado Pago y cobrá directamente desde la app
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="rounded-full bg-primary/10 p-1.5 mt-0.5">
                        <Check className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">Promociones especiales</p>
                        <p className="text-sm text-muted-foreground">
                          Creá y gestioná descuentos para atraer más clientes
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="rounded-full bg-primary/10 p-1.5 mt-0.5">
                        <Check className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">Soporte prioritario</p>
                        <p className="text-sm text-muted-foreground">
                          Resolvé tus consultas más rápido con atención preferencial
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Mensaje de agradecimiento */}
                  <div className="bg-muted/50 rounded-lg p-4 border">
                    <p className="text-center text-sm">
                      <span className="font-semibold">¡Gracias por elegirnos!</span>
                      <br />
                      Tu confianza nos motiva a seguir mejorando cada día para ofrecerte la mejor experiencia.
                    </p>
                  </div>

                  {/* Acciones */}
                  <div className="grid gap-3 pt-2">
                    <Button asChild size="lg">
                      <Link href="/panel/comercio">
                        Ir al Panel
                        <ChevronRight className="h-4 w-4 ml-2" />
                      </Link>
                    </Button>
                    <Button asChild variant="outline">
                      <Link href="/panel/comercio/integracion-mp">Configurar Mercado Pago</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Próximos pasos */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Próximos pasos recomendados</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button asChild variant="ghost" className="w-full justify-start">
                    <Link href="/panel/comercio/integracion-mp">
                      <span className="flex-1 text-left">1. Configurá Mercado Pago para cobrar online</span>
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild variant="ghost" className="w-full justify-start">
                    <Link href="/panel/comercio/promociones">
                      <span className="flex-1 text-left">2. Creá tu primera promoción</span>
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild variant="ghost" className="w-full justify-start">
                    <Link href="/panel/comercio/balances">
                      <span className="flex-1 text-left">3. Explorá tus estadísticas de ventas</span>
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center space-y-4">
                  <p className="text-muted-foreground">
                    Una vez confirmado el pago, tu plan Premium se activará automáticamente.
                  </p>
                  <Button asChild>
                    <Link href="/panel/comercio/suscripcion">Volver a Suscripción</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </PanelLayout>
  )
}
