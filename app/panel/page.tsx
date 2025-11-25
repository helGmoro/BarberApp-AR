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

  // Obtener user_type de la tabla profiles (fuente confiable)
  const { data: profile } = await supabase.from("profiles").select("user_type").eq("id", user.id).single()

  const userType = profile?.user_type || "cliente"

  // Redirigir según el tipo de usuario
  if (userType === "admin") {
    redirect("/admin")
  } else if (userType === "comercio") {
    redirect("/panel/comercio")
  } else {
    redirect("/panel/cliente")
  }
}
