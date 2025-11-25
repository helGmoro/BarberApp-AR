import { getSupabaseServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { PanelLayout } from "@/components/panel/panel-layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ProfileDataForm } from "@/components/panel/profile-data-form"
import { PasswordChangeForm } from "@/components/panel/password-change-form"
import { Separator } from "@/components/ui/separator"

export default async function PerfilComercioPage() {
  const supabase = await getSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  if (profile?.user_type !== "comercio") {
    redirect("/panel")
  }

  return (
    <PanelLayout userType="comercio">
      <div className="space-y-8 max-w-3xl">
        <div>
          <h1 className="text-3xl font-bold mb-2">Mi Perfil</h1>
          <p className="text-muted-foreground">Administrá tus datos personales y contraseña</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Información Personal</CardTitle>
            <CardDescription>Tus datos como propietario del comercio</CardDescription>
          </CardHeader>
          <CardContent>
            <ProfileDataForm profile={profile} />
          </CardContent>
        </Card>

        <Separator />

        <Card>
          <CardHeader>
            <CardTitle>Cambiar Contraseña</CardTitle>
            <CardDescription>Actualiza tu contraseña de acceso</CardDescription>
          </CardHeader>
          <CardContent>
            <PasswordChangeForm />
          </CardContent>
        </Card>
      </div>
    </PanelLayout>
  )
}
