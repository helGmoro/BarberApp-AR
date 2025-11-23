import { getSupabaseServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { PanelLayout } from "@/components/panel/panel-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { ServiciosList } from "@/components/panel/servicios-list"
import Link from "next/link"

export default async function ServiciosPage() {
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

  const { data: servicios } = await supabase
    .from("servicios")
    .select("*")
    .eq("comercio_id", comercio.id)
    .order("created_at", { ascending: false })

  return (
    <PanelLayout userType="comercio">
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Servicios</h1>
            <p className="text-muted-foreground">Gestioná los servicios que ofrecés</p>
          </div>
          <Button asChild>
            <Link href="/panel/comercio/servicios/nuevo">
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Servicio
            </Link>
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Todos los Servicios</CardTitle>
          </CardHeader>
          <CardContent>
            <ServiciosList servicios={servicios || []} comercioId={comercio.id} />
          </CardContent>
        </Card>
      </div>
    </PanelLayout>
  )
}
