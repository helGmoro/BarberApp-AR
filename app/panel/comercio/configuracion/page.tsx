import { getSupabaseServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { PanelLayout } from "@/components/panel/panel-layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { EstadoComercio } from "@/components/panel/estado-comercio"
import { HorariosForm } from "@/components/panel/horarios-form"
import { PaymentConfigForm } from "@/components/panel/payment-config-form"
import { Suspense } from "react"

export default async function ConfiguracionComercioPage() {
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
    .select("*")
    .eq("owner_id", user.id)
    .single()

  if (!comercio) {
    redirect("/panel/comercio/setup")
  }

  return (
    <PanelLayout userType="comercio">
      <div className="space-y-8 max-w-3xl">
        <div>
          <h1 className="text-3xl font-bold mb-2">Configuración del Comercio</h1>
          <p className="text-muted-foreground">Administrá la visibilidad y verificación de tu barbería.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Estado</CardTitle>
          </CardHeader>
          <CardContent>
            <Suspense>
              <EstadoComercio comercio={comercio} />
            </Suspense>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Información Básica</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2 text-sm">
            <div>
              <p className="text-muted-foreground">Nombre</p>
              <p className="font-medium">{comercio.name}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Ciudad</p>
              <p className="font-medium">{comercio.city}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Dirección</p>
              <p className="font-medium">{comercio.address}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Teléfono</p>
              <p className="font-medium">{comercio.phone}</p>
            </div>
            {comercio.email && (
              <div>
                <p className="text-muted-foreground">Email</p>
                <p className="font-medium">{comercio.email}</p>
              </div>
            )}
            <div>
              <p className="text-muted-foreground">Plan</p>
              <Badge className={comercio.subscription_plan === "premium" ? "bg-primary" : ""}>
                {comercio.subscription_plan}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Separator />

        {/* Configuración de Pagos */}
        <div>
          <h2 className="text-2xl font-bold mb-2">Configuración de Pagos</h2>
          <p className="text-muted-foreground mb-6">
            Define cómo tus clientes pueden pagar los servicios
          </p>
          <PaymentConfigForm
            initialConfig={{
              acceptsOnlinePayment: comercio.accepts_online_payment || false,
              senaPercentage: comercio.sena_percentage || 30,
              instantPaymentDiscount: comercio.instant_payment_discount || 0,
              senaExpirationHours: comercio.sena_expiration_hours || 24,
            }}
          />
        </div>

        <Separator />

        <HorariosForm comercioId={comercio.id} businessHours={comercio.business_hours || {}} />
      </div>
    </PanelLayout>
  )
}

 
