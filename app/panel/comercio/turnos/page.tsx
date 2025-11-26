import { getSupabaseServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { PanelLayoutWrapper as PanelLayout } from "@/components/panel/panel-layout-wrapper"
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

  const { data: profile } = await supabase.from("profiles").select("user_type").eq("id", user.id).single()
  if (profile?.user_type !== "comercio") {
    redirect("/panel")
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
      ),
      pagos (
        id,
        amount,
        payment_type,
        status,
        is_instant_payment
      )
    `)
    .eq("comercio_id", comercio.id)
    .order("appointment_date", { ascending: false })
    .order("appointment_time", { ascending: false })

  const turnosPendientesPago = turnos?.filter((t) => t.status === "pending_sena" && !t.sena_paid).length || 0
  const turnosPendientes = turnos?.filter((t) => t.status === "pending").length || 0
  const turnosConfirmados = turnos?.filter((t) => t.status === "confirmed").length || 0
  const turnosCompletados = turnos?.filter((t) => t.status === "completed").length || 0

  // Filtrar turnos con pago pendiente para dashboard especial
  const turnosPendientesPagoList = turnos?.filter((t) => 
    t.status === "pending_sena" && 
    !t.sena_paid &&
    t.sena_deadline &&
    new Date(t.sena_deadline) > new Date()
  ) || []

  return (
    <PanelLayout userType="comercio">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Gestión de Turnos</h1>
          <p className="text-muted-foreground">Administrá las reservas de tus clientes</p>
        </div>

        {/* Resumen */}
        <div className="grid md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center justify-between">
                Pago Pendiente
                <Badge variant="destructive">{turnosPendientesPago}</Badge>
              </CardTitle>
            </CardHeader>
          </Card>
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
                <Badge variant="default">{turnosConfirmados}</Badge>
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center justify-between">
                Completados
                <Badge variant="secondary">{turnosCompletados}</Badge>
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Turnos con pago pendiente - Dashboard especial */}
        {turnosPendientesPagoList.length > 0 && (
          <Card className="border-destructive">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                ⚠️ Turnos Esperando Pago
                <Badge variant="destructive">{turnosPendientesPagoList.length}</Badge>
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Estos turnos se cancelarán automáticamente si el cliente no paga antes del límite
              </p>
            </CardHeader>
            <CardContent>
              <TurnosTable turnos={turnosPendientesPagoList} showPaymentInfo />
            </CardContent>
          </Card>
        )}

        {/* Tabla de turnos */}
        <Card>
          <CardHeader>
            <CardTitle>Todos los Turnos</CardTitle>
          </CardHeader>
          <CardContent>
            <TurnosTable turnos={turnos || []} showPaymentInfo />
          </CardContent>
        </Card>
      </div>
    </PanelLayout>
  )
}
