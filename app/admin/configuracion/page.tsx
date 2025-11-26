import { getSupabaseServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { AdminLayoutWrapper as AdminLayout } from "@/components/admin/admin-layout-wrapper"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ConfigForm } from "@/components/admin/config-form"

export default async function ConfiguracionPage() {
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

  // Obtener configuración actual
  const { data: configs } = await supabase.from("platform_config").select("*").order("config_key")

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Configuración de la Plataforma</h1>
          <p className="text-muted-foreground">Gestiona precios, comisiones y configuraciones globales del sistema</p>
        </div>

        <div className="grid gap-6">
          {/* Configuración de Comisiones */}
          <Card>
            <CardHeader>
              <CardTitle>Comisiones de la Plataforma</CardTitle>
              <CardDescription>Porcentajes que retiene la plataforma en cada tipo de transacción</CardDescription>
            </CardHeader>
            <CardContent>
              <ConfigForm configs={configs || []} />
            </CardContent>
          </Card>

          {/* Información de Mercado Pago */}
          <Card>
            <CardHeader>
              <CardTitle>Integración de Mercado Pago</CardTitle>
              <CardDescription>Configuración de split payments para marketplace</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-medium mb-2">Funcionamiento del Sistema de Pagos:</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Cada comercio debe vincular su cuenta de Mercado Pago</li>
                  <li>• Los pagos se dividen automáticamente: comercio recibe su parte, plataforma su comisión</li>
                  <li>• Las comisiones se configuran desde este panel</li>
                  <li>• El dinero va directamente a la cuenta del comercio</li>
                </ul>
              </div>
              <div className="p-4 border-l-4 border-primary bg-primary/5 rounded">
                <p className="text-sm font-medium">Nota:</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Para habilitar split payments, necesitas configurar las credenciales de Mercado Pago Marketplace en
                  las variables de entorno.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  )
}
