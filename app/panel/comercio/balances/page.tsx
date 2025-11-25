import { getSupabaseServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { PanelLayout } from "@/components/panel/panel-layout"
import { UpgradePlan } from "@/components/panel/upgrade-plan"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DollarSign, TrendingUp, TrendingDown, ArrowDownRight, Clock, CheckCircle2, XCircle } from "lucide-react"

export default async function BalancesPage() {
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
    .select("id, name, subscription_plan")
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
        <UpgradePlan feature="Balances" />
      </PanelLayout>
    )
  }

  // Obtener datos del mes actual
  const primerDiaMes = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString()

  const { data: pagos } = await supabase
    .from("pagos")
    .select("*")
    .eq("comercio_id", comercio.id)
    .eq("status", "approved")
    .gte("created_at", primerDiaMes)

  // Obtener transferencias del comercio
  const { data: transferencias } = await supabase
    .from("transferencias_comercio")
    .select("*")
    .eq("comercio_id", comercio.id)
    .order("created_at", { ascending: false })
    .limit(20)

  const totalIngresos = pagos?.reduce((sum, p) => sum + Number(p.amount), 0) || 0
  const totalComisiones = pagos?.reduce((sum, p) => sum + Number(p.platform_commission_amount), 0) || 0
  const ingresoNeto = totalIngresos - totalComisiones

  const senas = pagos?.filter((p) => p.payment_type === "sena").length || 0
  const pagosCompletos = pagos?.filter((p) => p.payment_type === "completo").length || 0

  // Estadísticas de transferencias
  const transferenciasCompletadas = transferencias?.filter((t) => t.status === "completed").length || 0
  const totalTransferido = transferencias
    ?.filter((t) => t.status === "completed")
    .reduce((sum, t) => sum + Number(t.amount_to_transfer), 0) || 0

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

        {/* Transferencias a tu Cuenta */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Transferencias a tu Cuenta</CardTitle>
              <Badge variant="outline" className="flex items-center gap-1">
                <ArrowDownRight className="h-3 w-3" />
                {transferenciasCompletadas} completadas
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {!transferencias || transferencias.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                No hay transferencias registradas. Las transferencias se crean automáticamente cuando los clientes pagan.
              </p>
            ) : (
              <div className="space-y-3">
                {transferencias.map((transfer) => (
                  <div
                    key={transfer.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition"
                  >
                    <div className="flex items-center gap-3">
                      {transfer.status === "completed" && (
                        <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                      )}
                      {transfer.status === "pending" && <Clock className="h-5 w-5 text-yellow-500 flex-shrink-0" />}
                      {transfer.status === "processing" && (
                        <Clock className="h-5 w-5 text-blue-500 flex-shrink-0 animate-pulse" />
                      )}
                      {transfer.status === "failed" && <XCircle className="h-5 w-5 text-red-500 flex-shrink-0" />}
                      <div>
                        <p className="font-medium">
                          ${Number(transfer.amount_to_transfer).toLocaleString("es-AR")}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(transfer.created_at).toLocaleDateString("es-AR", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge
                        variant={
                          transfer.status === "completed"
                            ? "default"
                            : transfer.status === "failed"
                              ? "destructive"
                              : "secondary"
                        }
                      >
                        {transfer.status === "completed" && "Transferido"}
                        {transfer.status === "pending" && "Pendiente"}
                        {transfer.status === "processing" && "Procesando"}
                        {transfer.status === "failed" && "Fallido"}
                      </Badge>
                      <p className="text-xs text-muted-foreground mt-1">
                        De ${Number(transfer.amount_total).toLocaleString("es-AR")} (
                        {transfer.destination_alias || transfer.destination_cvu})
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {transferencias && transferencias.length > 0 && (
              <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                <p className="text-sm font-medium mb-1">Total transferido a tu cuenta</p>
                <p className="text-2xl font-bold">${totalTransferido.toLocaleString("es-AR")}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </PanelLayout>
  )
}
