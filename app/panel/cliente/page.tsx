import { getSupabaseServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { PanelLayoutWrapper as PanelLayout } from "@/components/panel/panel-layout-wrapper"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin, Clock } from "lucide-react"
import Link from "next/link"

export default async function ClienteDashboardPage() {
  const supabase = await getSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { data: profile } = await supabase.from("profiles").select("user_type").eq("id", user.id).single()
  
  // Redirigir según tipo de usuario si no es cliente
  if (profile?.user_type === "admin") {
    redirect("/admin")
  } else if (profile?.user_type === "comercio") {
    redirect("/panel/comercio")
  } else if (profile?.user_type !== "cliente") {
    redirect("/login")
  }

  // Obtener próximos turnos
  const hoy = new Date().toISOString().split("T")[0]
  const { data: proximosTurnos } = await supabase
    .from("turnos")
    .select(`
      *,
      comercios (
        name,
        address,
        city
      ),
      servicios (
        name,
        price
      )
    `)
    .eq("cliente_id", user.id)
    .gte("appointment_date", hoy)
    .order("appointment_date", { ascending: true })
    .limit(3)

  return (
    <PanelLayout userType="cliente">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Bienvenido</h1>
          <p className="text-muted-foreground">Gestioná tus turnos y encontrá las mejores barberías</p>
        </div>

        {/* Próximos turnos */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Próximos Turnos</CardTitle>
              <Button variant="outline" size="sm" asChild>
                <Link href="/panel/cliente/mis-turnos">Ver Todos</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {!proximosTurnos || proximosTurnos.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">No tenés turnos programados</p>
                <Button asChild>
                  <Link href="/buscar">Buscar Barberías</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {proximosTurnos.map((turno) => (
                  <div key={turno.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-2">
                      <h4 className="font-semibold">{turno.comercios.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {turno.servicios.name} - ${turno.servicios.price.toLocaleString("es-AR")}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {turno.appointment_date}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {turno.appointment_time}
                        </div>
                      </div>
                    </div>
                    <Button variant="outline" asChild>
                      <Link href={`/panel/cliente/mis-turnos/${turno.id}`}>Ver Detalles</Link>
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Explorar barberías */}
        <Card>
          <CardHeader>
            <CardTitle>Explorá Barberías Cerca Tuyo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-6">
              <MapPin className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">Encontrá las mejores barberías y peluquerías en tu ciudad</p>
              <Button asChild>
                <Link href="/buscar">Buscar Ahora</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </PanelLayout>
  )
}
