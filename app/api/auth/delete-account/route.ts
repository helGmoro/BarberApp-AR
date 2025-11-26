import { type NextRequest, NextResponse } from "next/server"
import { getSupabaseServerClient } from "@/lib/supabase/server"

export async function DELETE(request: NextRequest) {
  try {
    const supabase = await getSupabaseServerClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    // Verificar que el usuario sea cliente
    const { data: profile } = await supabase
      .from("profiles")
      .select("user_type")
      .eq("id", user.id)
      .single()

    if (!profile) {
      return NextResponse.json({ error: "Perfil no encontrado" }, { status: 404 })
    }

    // Verificar si es comercio con turnos activos o balances pendientes
    if (profile.user_type === "comercio") {
      // Verificar turnos activos
      const { data: turnosActivos } = await supabase
        .from("turnos")
        .select("id")
        .eq("comercio_id", user.id)
        .in("status", ["confirmed", "in_progress", "pending", "pending_sena"])
        .limit(1)

      if (turnosActivos && turnosActivos.length > 0) {
        return NextResponse.json(
          { 
            error: "No podés eliminar tu cuenta porque tenés turnos activos. Por favor, completá o cancelá todos los turnos primero." 
          },
          { status: 400 }
        )
      }

      // Verificar transferencias pendientes
      const { data: transferenciasPendientes } = await supabase
        .from("transferencias_comercio")
        .select("id")
        .eq("comercio_id", user.id)
        .eq("status", "pending")
        .limit(1)

      if (transferenciasPendientes && transferenciasPendientes.length > 0) {
        return NextResponse.json(
          { 
            error: "No podés eliminar tu cuenta porque tenés transferencias pendientes. Por favor, esperá a que se procesen." 
          },
          { status: 400 }
        )
      }
    }

    // Verificar si tiene turnos como cliente próximos
    if (profile.user_type === "cliente") {
      const hoy = new Date().toISOString().split("T")[0]
      const { data: turnosProximos } = await supabase
        .from("turnos")
        .select("id")
        .eq("cliente_id", user.id)
        .gte("appointment_date", hoy)
        .in("status", ["confirmed", "pending", "pending_sena"])
        .limit(1)

      if (turnosProximos && turnosProximos.length > 0) {
        return NextResponse.json(
          { 
            error: "No podés eliminar tu cuenta porque tenés turnos próximos confirmados. Por favor, cancelalos primero." 
          },
          { status: 400 }
        )
      }
    }

    // Eliminar datos relacionados en orden
    // 1. Eliminar pagos del usuario
    await supabase.from("pagos").delete().eq("cliente_id", user.id)

    // 2. Eliminar turnos como cliente
    await supabase.from("turnos").delete().eq("cliente_id", user.id)

    // 3. Si es comercio, eliminar sus datos
    if (profile.user_type === "comercio") {
      // Eliminar transferencias
      await supabase.from("transferencias_comercio").delete().eq("comercio_id", user.id)
      
      // Eliminar turnos del comercio
      await supabase.from("turnos").delete().eq("comercio_id", user.id)
      
      // Eliminar promociones
      await supabase.from("promociones").delete().eq("comercio_id", user.id)
      
      // Eliminar servicios
      await supabase.from("servicios").delete().eq("comercio_id", user.id)
      
      // Eliminar datos del comercio
      await supabase.from("comercios").delete().eq("id", user.id)
    }

    // 4. Eliminar perfil
    const { error: profileError } = await supabase
      .from("profiles")
      .delete()
      .eq("id", user.id)

    if (profileError) {
      console.error("[BarberApp] Error eliminando perfil:", profileError)
      return NextResponse.json(
        { error: "Error al eliminar el perfil" },
        { status: 500 }
      )
    }

    // 5. Eliminar usuario de auth (esto también cierra la sesión automáticamente)
    const { error: authError } = await supabase.auth.admin.deleteUser(user.id)

    if (authError) {
      console.error("[BarberApp] Error eliminando usuario de auth:", authError)
      return NextResponse.json(
        { error: "Error al eliminar la cuenta de autenticación" },
        { status: 500 }
      )
    }

    return NextResponse.json({ 
      success: true,
      message: "Cuenta eliminada exitosamente" 
    })
  } catch (error) {
    console.error("[BarberApp] Error eliminando cuenta:", error)
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}
