import { NextRequest, NextResponse } from "next/server"
import { getSupabaseServerClient } from "@/lib/supabase/server"

// Endpoint para simular un pago exitoso en desarrollo
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const comercioId = searchParams.get("comercio_id")

  if (!comercioId) {
    return NextResponse.json({ error: "comercio_id requerido" }, { status: 400 })
  }

  try {
    const supabase = await getSupabaseServerClient()

    // Activar plan premium
    const subscriptionStart = new Date()
    const subscriptionExpires = new Date()
    subscriptionExpires.setMonth(subscriptionExpires.getMonth() + 1)

    const { error: updateError } = await supabase
      .from("comercios")
      .update({
        subscription_plan: "premium",
        subscription_status: "active",
        subscription_started_at: subscriptionStart.toISOString(),
        subscription_expires_at: subscriptionExpires.toISOString(),
      })
      .eq("id", comercioId)

    if (updateError) {
      console.error("[BarberApp] Error updating comercio:", updateError)
      throw updateError
    }

    // Actualizar el último pago pendiente a pagado
    const { data: pendingPayment } = await supabase
      .from("suscripciones_pagos")
      .select("id")
      .eq("comercio_id", comercioId)
      .eq("status", "pending")
      .order("created_at", { ascending: false })
      .limit(1)
      .single()

    if (pendingPayment) {
      await supabase
        .from("suscripciones_pagos")
        .update({
          status: "paid",
          paid_at: new Date().toISOString(),
        })
        .eq("id", pendingPayment.id)
    }

    // Redirigir a la página de bienvenida
    return NextResponse.redirect(new URL("/panel/comercio/suscripcion/bienvenida", request.url))
  } catch (error) {
    console.error("[BarberApp] Error simulating payment:", error)
    return NextResponse.redirect(
      new URL("/panel/comercio/suscripcion?error=payment_failed", request.url)
    )
  }
}
