import { getSupabaseServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { AdminLayoutWrapper as AdminLayout } from "@/components/admin/admin-layout-wrapper"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Mail, User } from "lucide-react"

export default async function AdminUsuariosPage() {
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

  const { data: usuarios } = await supabase.from("profiles").select("*").order("created_at", { ascending: false })

  const clientes = usuarios?.filter((u) => u.user_type === "cliente").length || 0
  const comercios = usuarios?.filter((u) => u.user_type === "comercio").length || 0
  const admins = usuarios?.filter((u) => u.user_type === "admin").length || 0

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Gestión de Usuarios</h1>
          <p className="text-muted-foreground">Administrá todos los usuarios de la plataforma</p>
        </div>

        {/* Estadísticas */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center justify-between">
                Clientes
                <Badge variant="outline">{clientes}</Badge>
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center justify-between">
                Comercios
                <Badge variant="outline">{comercios}</Badge>
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center justify-between">
                Administradores
                <Badge variant="outline">{admins}</Badge>
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Lista de usuarios */}
        <Card>
          <CardHeader>
            <CardTitle>Todos los Usuarios</CardTitle>
          </CardHeader>
          <CardContent>
            {!usuarios || usuarios.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No hay usuarios registrados</p>
            ) : (
              <div className="space-y-4">
                {usuarios.map((usuario) => (
                  <div key={usuario.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                        <User className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-medium">{usuario.full_name}</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Mail className="h-3 w-3" />
                          <span>{usuario.email}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant={usuario.user_type === "admin" ? "default" : "outline"} className="capitalize">
                        {usuario.user_type}
                      </Badge>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(usuario.created_at).toLocaleDateString("es-AR")}
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
