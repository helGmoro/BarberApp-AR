import { getSupabaseServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { PanelLayout } from "@/components/panel/panel-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { NuevoServicioForm } from "@/components/panel/nuevo-servicio-form"

export default async function NuevoServicioPage() {
  const supabase = await getSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { data: comercio } = await supabase.from("comercios").select("id").eq("owner_id", user.id).single()

  if (!comercio) {
    redirect("/panel/comercio/setup")
  }

  return (
    <PanelLayout userType="comercio">
      <div className="max-w-2xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Nuevo Servicio</h1>
          <p className="text-muted-foreground">Agregá un nuevo servicio a tu comercio</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Información del Servicio</CardTitle>
          </CardHeader>
          <CardContent>
            <NuevoServicioForm comercioId={comercio.id} />
          </CardContent>
        </Card>
      </div>
    </PanelLayout>
  )
}
