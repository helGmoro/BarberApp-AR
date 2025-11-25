import { getSupabaseServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { PanelLayout } from "@/components/panel/panel-layout"
import { UpgradePlan } from "@/components/panel/upgrade-plan"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

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

  // TODO: Implementar listado y gestión de promociones
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
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nueva Promoción
          </Button>
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
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Crear Primera Promoción
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {promociones.map((promo: any) => (
              <Card key={promo.id}>
                <CardHeader>
                  <CardTitle>{promo.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{promo.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </PanelLayout>
  )
}
