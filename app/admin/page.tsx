import { getSupabaseServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { AdminLayoutWrapper as AdminLayout } from "@/components/admin/admin-layout-wrapper"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, Users, DollarSign, Calendar } from "lucide-react"

export default async function AdminDashboardPage() {
  const supabase = await getSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  // Verificar si es admin
  const { data: profile } = await supabase.from("profiles").select("user_type").eq("id", user.id).single()

  if (profile?.user_type !== "admin") {
    redirect("/panel")
  }

  // Obtener estadísticas globales
  const { count: totalComercios } = await supabase.from("comercios").select("*", { count: "exact", head: true })

  const { count: totalUsuarios } = await supabase.from("profiles").select("*", { count: "exact", head: true })

  const { count: totalTurnos } = await supabase.from("turnos").select("*", { count: "exact", head: true })

  const { data: pagosTotales } = await supabase
    .from("pagos")
    .select("amount, platform_commission_amount")
    .eq("status", "approved")

  const comisionesTotales = pagosTotales?.reduce((sum, p) => sum + Number(p.platform_commission_amount), 0) || 0

  const { count: comerciosPremium } = await supabase
    .from("comercios")
    .select("*", { count: "exact", head: true })
    .eq("subscription_plan", "premium")

  const ingresosSuscripciones = (comerciosPremium || 0) * 10000

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Panel Administrativo</h1>
          <p className="text-muted-foreground">Vista general de la plataforma BarberApp AR</p>
        </div>

        {/* Estadísticas Principales */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Comercios</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalComercios || 0}</div>
              <p className="text-xs text-muted-foreground">{comerciosPremium || 0} con plan Premium</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Usuarios</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalUsuarios || 0}</div>
              <p className="text-xs text-muted-foreground">Clientes y comercios</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Turnos</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalTurnos || 0}</div>
              <p className="text-xs text-muted-foreground">Reservas totales</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Ingresos Plataforma</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${(comisionesTotales + ingresosSuscripciones).toLocaleString("es-AR")}
              </div>
              <p className="text-xs text-muted-foreground">Comisiones + Suscripciones</p>
            </CardContent>
          </Card>
        </div>

        {/* Desglose de Ingresos */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Ingresos por Comisiones</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary mb-2">${comisionesTotales.toLocaleString("es-AR")}</div>
              <p className="text-sm text-muted-foreground">3% en señas, 5% en pagos completos</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Ingresos por Suscripciones</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary mb-2">
                ${ingresosSuscripciones.toLocaleString("es-AR")}
              </div>
              <p className="text-sm text-muted-foreground">{comerciosPremium || 0} comercios × $10.000/mes</p>
            </CardContent>
          </Card>
        </div>

        {/* Comercios Recientes */}
        <Card>
          <CardHeader>
            <CardTitle>Comercios Recientes</CardTitle>
          </CardHeader>
          <CardContent>
            <ComerciosRecientes />
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}

async function ComerciosRecientes() {
  const supabase = await getSupabaseServerClient()

  const { data: comercios } = await supabase
    .from("comercios")
    .select("*, profiles(full_name, email)")
    .order("created_at", { ascending: false })
    .limit(5)

  if (!comercios || comercios.length === 0) {
    return <p className="text-muted-foreground text-center py-8">No hay comercios registrados aún</p>
  }

  return (
    <div className="space-y-4">
      {comercios.map((comercio) => (
        <div key={comercio.id} className="flex items-center justify-between p-4 border rounded-lg">
          <div>
            <p className="font-medium">{comercio.name}</p>
            <p className="text-sm text-muted-foreground">
              {comercio.city} - {comercio.profiles.email}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium capitalize">{comercio.subscription_plan}</p>
            <p className="text-xs text-muted-foreground">{new Date(comercio.created_at).toLocaleDateString("es-AR")}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
