import { getSupabaseServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { PanelLayout } from "@/components/panel/panel-layout"
import { UpgradePlan } from "@/components/panel/upgrade-plan"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { NuevaPromocionButton } from "@/components/panel/nueva-promocion-button"
import { PromocionesList } from "@/components/panel/promociones-list"

export default async function PromocionesPage() {
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
    .select("id, subscription_plan")
    .eq("owner_id", user.id)
    .single()

  if (!comercio) {
    redirect("/panel/comercio/setup")
  }

  // Verificar si tiene plan premium
  const isPremium = comercio.subscription_plan === "premium"

  if (!isPremium) {
    return (
      <PanelLayout userType="comercio">
        <UpgradePlan feature="Promociones" />
      </PanelLayout>
    )
  }

  // Obtener servicios y promociones
  const { data: servicios } = await supabase
    .from("servicios")
    .select("id, name")
    .eq("comercio_id", comercio.id)
    .eq("is_active", true)
    .order("name")

  const { data: promociones } = await supabase
    .from("promociones")
    .select("*")
    .eq("comercio_id", comercio.id)
    .order("created_at", { ascending: false })

  return (
    <PanelLayout userType="comercio">
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Promociones</h1>
            <p className="text-muted-foreground">Creá ofertas especiales para atraer más clientes</p>
          </div>
          <NuevaPromocionButton comercioId={comercio.id} servicios={servicios || []} />
        </div>

        {!promociones || promociones.length === 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>No hay promociones activas</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Creá tu primera promoción para atraer más clientes a tu barbería.
              </p>
              <NuevaPromocionButton comercioId={comercio.id} servicios={servicios || []} />
            </CardContent>
          </Card>
        ) : (
          <PromocionesList promociones={promociones} comercioId={comercio.id} servicios={servicios || []} />
        )}
      </div>
    </PanelLayout>
  )
}
