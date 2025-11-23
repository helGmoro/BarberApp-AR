import { getSupabaseServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { PanelLayout } from "@/components/panel/panel-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TurnosTable } from "@/components/panel/turnos-table"
import { Badge } from "@/components/ui/badge"

export default async function TurnosPage() {
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

  const { data: turnos } = await supabase
    .from("turnos")
    .select(`
      *,
      servicios (
        name,
        price,
        duration_minutes
      )
    `)
    .eq("comercio_id", comercio.id)
    .order("appointment_date", { ascending: false })
    .order("appointment_time", { ascending: false })

  const turnosPendientes = turnos?.filter((t) => t.status === "pending").length || 0
  const turnosConfirmados = turnos?.filter((t) => t.status === "confirmed").length || 0
  const turnosCompletados = turnos?.filter((t) => t.status === "completed").length || 0

  return (
    <PanelLayout userType="comercio">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Gestión de Turnos</h1>
          <p className="text-muted-foreground">Administrá las reservas de tus clientes</p>
        </div>

        {/* Resumen */}
        <div className="grid md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center justify-between">
                Pendientes
                <Badge variant="outline">{turnosPendientes}</Badge>
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center justify-between">
                Confirmados
                <Badge variant="outline">{turnosConfirmados}</Badge>
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center justify-between">
                Completados
                <Badge variant="outline">{turnosCompletados}</Badge>
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Tabla de turnos */}
        <Card>
          <CardHeader>
            <CardTitle>Todos los Turnos</CardTitle>
          </CardHeader>
          <CardContent>
            <TurnosTable turnos={turnos || []} />
          </CardContent>
        </Card>
      </div>
    </PanelLayout>
  )
}
