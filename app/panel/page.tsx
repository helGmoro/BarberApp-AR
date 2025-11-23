import { getSupabaseServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export default async function PanelPage() {
  const supabase = await getSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  // Obtener metadata del usuario
  const userType = user.user_metadata?.user_type || "cliente"

  // Redirigir según el tipo de usuario
  if (userType === "comercio") {
    redirect("/panel/comercio")
  } else {
    redirect("/panel/cliente")
  }
}
