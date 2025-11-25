import { getSupabaseServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { PanelLayout } from "@/components/panel/panel-layout"
import { ConvertToComercio } from "@/components/panel/convert-to-comercio"
import { ProfileDataForm } from "@/components/panel/profile-data-form"
import { PasswordChangeForm } from "@/components/panel/password-change-form"
import { EstadoComercio } from "@/components/panel/estado-comercio"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default async function PerfilPage() {
  const supabase = await getSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, first_name, last_name, full_name, phone, dni, email, user_type")
    .eq("id", user.id)
    .single()

  const esCliente = profile?.user_type === "cliente"
  const esComercio = profile?.user_type === "comercio"

  let comercio: { id: string; name: string; is_active: boolean; is_verified: boolean; verification_requested_at?: string | null } | null = null
  if (esComercio) {
    const { data: comercioRow } = await supabase
      .from("comercios")
      .select("id, name, is_active, is_verified, verification_requested_at")
      .eq("owner_id", profile.id)
      .single()
    if (comercioRow) {
      comercio = comercioRow
    }
  }

  return (
    <PanelLayout userType={esComercio ? "comercio" : "cliente"}>
      <div className="max-w-4xl space-y-10">
        <div>
          <h1 className="text-3xl font-bold mb-2">Perfil</h1>
          <p className="text-muted-foreground">
            Gestioná tus datos personales, seguridad y opciones de cuenta.
          </p>
        </div>

        {profile && <ProfileDataForm profile={profile as any} />}
        <PasswordChangeForm />

        {esCliente && <ConvertToComercio />}

        {esComercio && comercio && (
          <Card>
            <CardHeader>
              <CardTitle>Estado del Comercio</CardTitle>
            </CardHeader>
            <CardContent>
              <EstadoComercio comercio={comercio} />
            </CardContent>
          </Card>
        )}
      </div>
    </PanelLayout>
  )
}
