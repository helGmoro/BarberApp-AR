import { getSupabaseServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { AdminLayoutWrapper as AdminLayout } from "@/components/admin/admin-layout-wrapper"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ComerciosAdminTable } from "@/components/admin/comercios-admin-table"

export default async function AdminComerciosPage() {
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

  const { data: comercios } = await supabase
    .from("comercios")
    .select(`
      *,
      profiles(full_name, email, phone)
    `)
    .order("created_at", { ascending: false })

  const activos = comercios?.filter((c) => c.is_active).length || 0
  const premium = comercios?.filter((c) => c.subscription_plan === "premium").length || 0
  const verificados = comercios?.filter((c) => c.is_verified).length || 0

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Gestión de Comercios</h1>
          <p className="text-muted-foreground">Administrá todas las barberías y peluquerías de la plataforma</p>
        </div>

        {/* Estadísticas */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center justify-between">
                Activos
                <Badge variant="outline">{activos}</Badge>
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center justify-between">
                Premium
                <Badge className="bg-primary">{premium}</Badge>
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center justify-between">
                Verificados
                <Badge variant="outline">{verificados}</Badge>
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Tabla de comercios */}
        <Card>
          <CardHeader>
            <CardTitle>Todos los Comercios</CardTitle>
          </CardHeader>
          <CardContent>
            <ComerciosAdminTable comercios={comercios || []} />
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}
