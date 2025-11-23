import { getSupabaseServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { PanelLayout } from "@/components/panel/panel-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, TrendingUp, TrendingDown } from "lucide-react"

export default async function BalancesPage() {
  const supabase = await getSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { data: comercio } = await supabase
    .from("comercios")
    .select("id, name, subscription_plan")
    .eq("owner_id", user.id)
    .single()

  if (!comercio) {
    redirect("/panel/comercio/setup")
  }

  // Obtener datos del mes actual
  const primerDiaMes = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString()

  const { data: pagos } = await supabase
    .from("pagos")
    .select("*")
    .eq("comercio_id", comercio.id)
    .eq("status", "approved")
    .gte("created_at", primerDiaMes)

  const totalIngresos = pagos?.reduce((sum, p) => sum + Number(p.amount), 0) || 0
  const totalComisiones = pagos?.reduce((sum, p) => sum + Number(p.platform_commission_amount), 0) || 0
  const ingresoNeto = totalIngresos - totalComisiones

  const senas = pagos?.filter((p) => p.payment_type === "sena").length || 0
  const pagosCompletos = pagos?.filter((p) => p.payment_type === "completo").length || 0

  return (
    <PanelLayout userType="comercio">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Balance Mensual</h1>
          <p className="text-muted-foreground">Resumen de ingresos y comisiones del mes actual</p>
        </div>

        {comercio.subscription_plan !== "premium" && (
          <Card className="border-primary/50 bg-primary/5">
            <CardContent className="pt-6">
              <p className="text-sm text-center">
                Actualizá a Premium para acceder al balance mensual detallado y estadísticas avanzadas
              </p>
            </CardContent>
          </Card>
        )}

        {/* Resumen Financiero */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Ingresos Totales</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalIngresos.toLocaleString("es-AR")}</div>
              <p className="text-xs text-muted-foreground">Este mes</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Comisiones Plataforma</CardTitle>
              <TrendingDown className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">-${totalComisiones.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">3% señas, 5% pagos completos</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Ingreso Neto</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">${ingresoNeto.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">Después de comisiones</p>
            </CardContent>
          </Card>
        </div>

        {/* Detalle de Pagos */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Señas Recibidas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-2">{senas}</div>
              <p className="text-sm text-muted-foreground">Turnos con seña de $3.000</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pagos Completos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-2">{pagosCompletos}</div>
              <p className="text-sm text-muted-foreground">Servicios pagados completamente</p>
            </CardContent>
          </Card>
        </div>

        {/* Listado de Transacciones */}
        <Card>
          <CardHeader>
            <CardTitle>Transacciones Recientes</CardTitle>
          </CardHeader>
          <CardContent>
            {!pagos || pagos.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No hay transacciones registradas este mes</p>
            ) : (
              <div className="space-y-4">
                {pagos.map((pago) => (
                  <div key={pago.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">{pago.payment_type === "sena" ? "Seña" : "Pago Completo"}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(pago.created_at).toLocaleDateString("es-AR")}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">${Number(pago.amount).toLocaleString("es-AR")}</p>
                      <p className="text-sm text-muted-foreground">
                        Neto: ${(Number(pago.amount) - Number(pago.platform_commission_amount)).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </PanelLayout>
  )
}
