import { getSupabaseServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { PanelLayoutWrapper as PanelLayout } from "@/components/panel/panel-layout-wrapper"
import { ConvertToComercio } from "@/components/panel/convert-to-comercio"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default async function PerfilClientePage() {
  const supabase = await getSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { data: profile } = await supabase.from("profiles").select("full_name, user_type, email, phone").eq("id", user.id).single()

  const esCliente = profile?.user_type === "cliente"

  return (
    <PanelLayout userType="cliente">
      <div className="max-w-3xl space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Perfil</h1>
          <p className="text-muted-foreground">Configurá tu cuenta y convertite en comercio si ofrecés servicios.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Datos de la Cuenta</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium">{profile?.email || user.email}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Tipo de Usuario</p>
              <p className="font-medium capitalize">{profile?.user_type}</p>
            </div>
          </CardContent>
        </Card>

        {esCliente && <ConvertToComercio />}
      </div>
    </PanelLayout>
  )
}
