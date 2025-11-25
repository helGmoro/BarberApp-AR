import { NextRequest, NextResponse } from "next/server"
import { getSupabaseServerClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await getSupabaseServerClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    // Verificar que sea comercio
    const { data: profile } = await supabase.from("profiles").select("user_type").eq("id", user.id).single()

    if (profile?.user_type !== "comercio") {
      return NextResponse.json({ error: "Solo comercios pueden configurar MP" }, { status: 403 })
    }

    const body = await request.json()
    const { cvu, alias } = body

    // Validaciones
    if (!cvu && !alias) {
      return NextResponse.json({ error: "Debe proporcionar CVU o Alias" }, { status: 400 })
    }

    if (cvu && cvu.length !== 22) {
      return NextResponse.json({ error: "CVU debe tener 22 dígitos" }, { status: 400 })
    }

    // Actualizar comercio
    const { error } = await supabase
      .from("comercios")
      .update({
        mp_cvu: cvu || null,
        mp_alias: alias || null,
        mp_account_type: "cvu_alias",
        accepts_online_payment: true,
      })
      .eq("owner_id", user.id)

    if (error) {
      console.error("[BarberApp] Error updating CVU/Alias:", error)
      return NextResponse.json({ error: "Error al guardar configuración" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[BarberApp] Error in mp-cvu endpoint:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
