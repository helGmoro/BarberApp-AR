import { type NextRequest, NextResponse } from "next/server"
import { getSupabaseServerClient } from "@/lib/supabase/server"

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { accessToken, collectorId, publicKey } = body

    const supabase = await getSupabaseServerClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    // Verificar que sea un comercio
    const { data: profile } = await supabase.from("profiles").select("user_type").eq("id", user.id).single()

    if (profile?.user_type !== "comercio") {
      return NextResponse.json({ error: "Solo comercios pueden configurar Mercado Pago" }, { status: 403 })
    }

    // Actualizar credenciales de MP en el comercio
    const { error } = await supabase
      .from("comercios")
      .update({
        mercadopago_access_token: accessToken,
        mercadopago_collector_id: collectorId,
        mercadopago_public_key: publicKey,
        accepts_online_payment: true,
        updated_at: new Date().toISOString(),
      })
      .eq("owner_id", user.id)

    if (error) {
      return NextResponse.json({ error: "Error al actualizar configuración" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[BarberApp] Error updating MP config:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
