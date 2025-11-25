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

    const { data: profile } = await supabase.from("profiles").select("user_type").eq("id", user.id).single()

    if (profile?.user_type !== "comercio") {
      return NextResponse.json({ error: "Solo comercios pueden configurar pagos" }, { status: 403 })
    }

    const body = await request.json()
    const { acceptsOnlinePayment, senaPercentage, instantPaymentDiscount, senaExpirationHours } = body

    // Validaciones
    if (senaPercentage < 10 || senaPercentage > 100) {
      return NextResponse.json({ error: "Seña debe ser entre 10% y 100%" }, { status: 400 })
    }

    if (instantPaymentDiscount < 0 || instantPaymentDiscount > 50) {
      return NextResponse.json({ error: "Descuento debe ser entre 0% y 50%" }, { status: 400 })
    }

    if (senaExpirationHours < 1 || senaExpirationHours > 72) {
      return NextResponse.json({ error: "Expiración debe ser entre 1 y 72 horas" }, { status: 400 })
    }

    const { error } = await supabase
      .from("comercios")
      .update({
        accepts_online_payment: acceptsOnlinePayment,
        sena_percentage: senaPercentage,
        instant_payment_discount: instantPaymentDiscount,
        sena_expiration_hours: senaExpirationHours,
      })
      .eq("owner_id", user.id)

    if (error) {
      console.error("[BarberApp] Error updating payment config:", error)
      return NextResponse.json({ error: "Error al guardar configuración" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[BarberApp] Error in payment-config endpoint:", error)
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}
