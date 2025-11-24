import { NextResponse } from "next/server"
import { getSupabaseServerClient } from "@/lib/supabase/server"

const ALLOWED_TYPES = ["cliente", "comercio"] as const
type AllowedType = (typeof ALLOWED_TYPES)[number]

export async function POST(req: Request) {
  try {
    const supabase = await getSupabaseServerClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 })
    }

    const body = await req.json().catch(() => ({}))
    const userType: string | undefined = body.userType

    if (!userType || !ALLOWED_TYPES.includes(userType as AllowedType)) {
      return NextResponse.json({ error: "Tipo de usuario inválido" }, { status: 400 })
    }

    // Verificar que el perfil exista (lo crea el trigger handle_new_user)
    const { data: existingProfile } = await supabase.from("profiles").select("id").eq("id", user.id).single()
    if (!existingProfile) {
      return NextResponse.json(
        { error: "Perfil inexistente. Verificar trigger handle_new_user o añadir política INSERT." },
        { status: 400 },
      )
    }

    // Actualizar sólo el user_type
    const { error: updateError } = await supabase
      .from("profiles")
      .update({ user_type: userType, updated_at: new Date().toISOString() })
      .eq("id", user.id)

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 })
    }

    // Actualizar metadata (para acceso rápido en el cliente)
    const { error: metaError } = await supabase.auth.updateUser({ data: { user_type: userType } })
    if (metaError) {
      return NextResponse.json({ warning: "Rol actualizado pero metadata no", detail: metaError.message })
    }

    return NextResponse.json({ success: true, userType })
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Error interno" }, { status: 500 })
  }
}
