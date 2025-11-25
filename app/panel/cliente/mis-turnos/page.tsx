import { getSupabaseServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { PanelLayout } from "@/components/panel/panel-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MisTurnosTable } from "@/components/panel/mis-turnos-table"

export default async function MisTurnosPage() {
  const supabase = await getSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { data: profile } = await supabase.from("profiles").select("user_type").eq("id", user.id).single()
  if (profile?.user_type !== "cliente") {
    redirect("/panel")
  }

  const { data: turnos } = await supabase
    .from("turnos")
    .select(`
      *,
      comercios (
        name,
        address,
        city,
        phone
      ),
      servicios (
        name,
        price,
        duration_minutes
      ),
      pagos (
        id,
        amount,
        payment_type,
        status
      )
    `)
    .eq("cliente_id", user.id)
    .order("appointment_date", { ascending: false })
    .order("appointment_time", { ascending: false })

  return (
    <PanelLayout userType="cliente">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Mis Turnos</h1>
          <p className="text-muted-foreground">Historial completo de tus reservas</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Todos los Turnos</CardTitle>
          </CardHeader>
          <CardContent>
            <MisTurnosTable turnos={turnos || []} />
          </CardContent>
        </Card>
      </div>
    </PanelLayout>
  )
}
