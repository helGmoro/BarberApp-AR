import { getSupabaseServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { PanelLayoutWrapper as PanelLayout } from "@/components/panel/panel-layout-wrapper"
import { ConvertToComercio } from "@/components/panel/convert-to-comercio"
import { DeleteAccountButton } from "@/components/panel/delete-account-button"
import { ProfileDataForm } from "@/components/panel/profile-data-form"
import { PasswordChangeForm } from "@/components/panel/password-change-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default async function PerfilClientePage() {
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

  return (
    <PanelLayout userType="cliente">
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

        <DeleteAccountButton />
      </div>
    </PanelLayout>
  )
}
