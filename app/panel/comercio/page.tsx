import { getSupabaseServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { PanelLayoutWrapper as PanelLayout } from "@/components/panel/panel-layout-wrapper"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, Calendar, TrendingUp, Users } from "lucide-react"

export default async function ComerciodashboardPage() {
  const supabase = await getSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  // Verificar rol correcto
  const { data: profile } = await supabase.from("profiles").select("user_type").eq("id", user.id).single()
  
  // Redirigir según tipo de usuario si no es comercio
  if (profile?.user_type === "admin") {
    redirect("/admin")
  } else if (profile?.user_type === "cliente") {
    redirect("/panel/cliente")
  } else if (profile?.user_type !== "comercio") {
    redirect("/login")
  }

  // Verificar si el usuario tiene un comercio
  const { data: comercio } = await supabase.from("comercios").select("*").eq("owner_id", user.id).single()

  // Si no tiene comercio, redirigir a crear uno
  if (!comercio) {
    redirect("/panel/comercio/setup")
  }

  // Obtener estadísticas
  const hoy = new Date().toISOString().split("T")[0]
  const primerDiaMes = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split("T")[0]

  const { data: turnosHoy } = await supabase
    .from("turnos")
    .select("*", { count: "exact" })
    .eq("comercio_id", comercio.id)
    .eq("appointment_date", hoy)

  const { data: turnosMes } = await supabase
    .from("turnos")
    .select("*", { count: "exact" })
    .eq("comercio_id", comercio.id)
    .gte("appointment_date", primerDiaMes)

  const { data: pagosMes } = await supabase
    .from("pagos")
    .select("amount")
    .eq("comercio_id", comercio.id)
    .eq("status", "approved")
    .gte("created_at", primerDiaMes)

  const ingresosMes = pagosMes?.reduce((sum, pago) => sum + Number(pago.amount), 0) || 0

  const { data: clientesUnicos } = await supabase.from("turnos").select("cliente_id").eq("comercio_id", comercio.id)

  const clientesUnicosCount = new Set(clientesUnicos?.map((t) => t.cliente_id)).size

  return (
    <PanelLayout userType="comercio">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground">Bienvenido de vuelta, {comercio.name}</p>
        </div>

        {/* Estadísticas */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Turnos Hoy</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{turnosHoy?.length || 0}</div>
              <p className="text-xs text-muted-foreground">Programados para hoy</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Turnos del Mes</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{turnosMes?.length || 0}</div>
              <p className="text-xs text-muted-foreground">Total este mes</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Ingresos del Mes</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${ingresosMes.toLocaleString("es-AR")}</div>
              <p className="text-xs text-muted-foreground">Pagos confirmados</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Clientes</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{clientesUnicosCount}</div>
              <p className="text-xs text-muted-foreground">Clientes únicos</p>
            </CardContent>
          </Card>
        </div>

        {/* Próximos turnos */}
        <Card>
          <CardHeader>
            <CardTitle>Próximos Turnos</CardTitle>
          </CardHeader>
          <CardContent>
            <ProximosTurnos comercioId={comercio.id} />
          </CardContent>
        </Card>
      </div>
    </PanelLayout>
  )
}

async function ProximosTurnos({ comercioId }: { comercioId: string }) {
  const supabase = await getSupabaseServerClient()
  const hoy = new Date().toISOString().split("T")[0]

  const { data: turnos } = await supabase
    .from("turnos")
    .select(`
      *,
      servicios (
        name,
        price
      )
    `)
    .eq("comercio_id", comercioId)
    .gte("appointment_date", hoy)
    .order("appointment_date", { ascending: true })
    .order("appointment_time", { ascending: true })
    .limit(5)

  if (!turnos || turnos.length === 0) {
    return <p className="text-muted-foreground text-center py-8">No hay turnos programados</p>
  }

  return (
    <div className="space-y-4">
      {turnos.map((turno) => (
        <div key={turno.id} className="flex items-center justify-between p-4 border rounded-lg">
          <div>
            <p className="font-medium">{turno.client_name}</p>
            <p className="text-sm text-muted-foreground">
              {turno.servicios.name} - ${turno.servicios.price.toLocaleString("es-AR")}
            </p>
          </div>
          <div className="text-right">
            <p className="font-medium">{turno.appointment_date}</p>
            <p className="text-sm text-muted-foreground">{turno.appointment_time}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
