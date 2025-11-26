import { getSupabaseServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

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
    .select("user_type")
    .eq("id", user.id)
    .single()

  // Redirigir según tipo de usuario
  if (profile?.user_type === "comercio") {
    redirect("/panel/comercio/mi-perfil")
  } else if (profile?.user_type === "cliente") {
    redirect("/panel/cliente/perfil")
  } else if (profile?.user_type === "admin") {
    redirect("/admin")
  }

  // Default: redirigir a cliente
  redirect("/panel/cliente/perfil")
}
