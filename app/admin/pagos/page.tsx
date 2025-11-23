import { getSupabaseServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp } from "lucide-react"

export default async function AdminPagosPage() {
  const supabase = await getSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { data: profile } = await supabase.from("profiles").select("user_type").eq("id", user.id).single()

  if (profile?.user_type !== "admin") {
    redirect("/panel")
  }

  const { data: pagos } = await supabase
    .from("pagos")
    .select(`
      *,
      comercios(name),
      turnos(
        client_name,
        appointment_date
      )
    `)
    .order("created_at", { ascending: false })

  const aprobados = pagos?.filter((p) => p.status === "approved").length || 0
  const pendientes = pagos?.filter((p) => p.status === "pending").length || 0

  const totalComisiones =
    pagos?.filter((p) => p.status === "approved").reduce((sum, p) => sum + Number(p.platform_commission_amount), 0) || 0

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Gestión de Pagos</h1>
          <p className="text-muted-foreground">Monitorea todas las transacciones de la plataforma</p>
        </div>

        {/* Estadísticas */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center justify-between">
                Aprobados
                <Badge variant="default">{aprobados}</Badge>
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center justify-between">
                Pendientes
                <Badge variant="outline">{pendientes}</Badge>
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Comisiones</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">${totalComisiones.toLocaleString("es-AR")}</div>
            </CardContent>
          </Card>
        </div>

        {/* Lista de pagos */}
        <Card>
          <CardHeader>
            <CardTitle>Transacciones Recientes</CardTitle>
          </CardHeader>
          <CardContent>
            {!pagos || pagos.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No hay pagos registrados</p>
            ) : (
              <div className="space-y-4">
                {pagos.slice(0, 20).map((pago) => (
                  <div key={pago.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <p className="font-medium">{pago.comercios?.name}</p>
                        <Badge variant={pago.status === "approved" ? "default" : "outline"}>
                          {pago.status === "approved" ? "Aprobado" : "Pendiente"}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Cliente: {pago.turnos?.client_name} • {pago.turnos?.appointment_date}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Tipo: {pago.payment_type === "sena" ? "Seña" : "Pago Completo"} • Método: {pago.payment_method}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-lg">${Number(pago.amount).toLocaleString("es-AR")}</p>
                      <p className="text-sm text-success">
                        Comisión: ${Number(pago.platform_commission_amount).toFixed(2)}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(pago.created_at).toLocaleDateString("es-AR")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}
