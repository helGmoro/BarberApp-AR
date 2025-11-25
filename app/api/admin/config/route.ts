import { type NextRequest, NextResponse } from "next/server"
import { getSupabaseServerClient } from "@/lib/supabase/server"

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { configs } = body

    const supabase = await getSupabaseServerClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    // Verificar que sea admin
    const { data: profile } = await supabase.from("profiles").select("user_type").eq("id", user.id).single()

    if (profile?.user_type !== "admin") {
      return NextResponse.json({ error: "Solo administradores pueden modificar la configuración" }, { status: 403 })
    }

    // Actualizar cada configuración
    const updates = Object.entries(configs).map(async ([key, value]) => {
      return supabase
        .from("platform_config")
        .update({
          config_value: value as string,
          updated_at: new Date().toISOString(),
          updated_by: user.id,
        })
        .eq("config_key", key)
    })

    await Promise.all(updates)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[BarberApp] Error updating config:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
