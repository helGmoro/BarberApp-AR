import { NextResponse } from "next/server"
import { getSupabaseServerClient } from "@/lib/supabase/server"

export async function POST() {
  try {
    const supabase = await getSupabaseServerClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    // Verificar que el usuario tiene un comercio
    const { data: comercio, error: comercioError } = await supabase
      .from("comercios")
      .select("id, name, is_verified, verification_requested_at")
      .eq("owner_id", user.id)
      .single()

    if (comercioError || !comercio) {
      return NextResponse.json({ error: "No se encontró el comercio" }, { status: 404 })
    }

    // Verificar si ya está verificado
    if (comercio.is_verified) {
      return NextResponse.json({ error: "El comercio ya está verificado" }, { status: 400 })
    }

    // Actualizar la solicitud de verificación
    const { error: updateError } = await supabase
      .from("comercios")
      .update({
        verification_requested_at: new Date().toISOString(),
      })
      .eq("id", comercio.id)

    if (updateError) {
      console.error("[BarberApp] Error updating verification request:", updateError)
      return NextResponse.json({ error: "Error al solicitar verificación" }, { status: 500 })
    }

    // TODO: Aquí podrías enviar una notificación a los administradores
    // o crear un registro en una tabla de notificaciones

    return NextResponse.json({
      success: true,
      message: "Solicitud de verificación enviada exitosamente",
    })
  } catch (error) {
    console.error("[BarberApp] Verification request error:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
