import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Solo procesar pagos aprobados
    if (body.type === "payment" && body.action === "payment.updated") {
      const paymentId = body.data.id

      // Verificar que existe SERVICE_ROLE_KEY
      if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
        console.error("[BarberApp] SUPABASE_SERVICE_ROLE_KEY no configurada. Ver docs/VARIABLES_ENTORNO.md")
        return NextResponse.json(
          { error: "Server configuration error" }, 
          { status: 500 }
        )
      }

      // Usar service role para actualizar sin autenticación
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY,
        {
          auth: {
            autoRefreshToken: false,
            persistSession: false,
          },
        }
      )

      // Buscar el pago en la base de datos
      const { data: pago } = await supabase
        .from("suscripciones_pagos")
        .select("*, comercios(id, owner_id)")
        .eq("mercadopago_payment_id", paymentId)
        .single()

      if (!pago) {
        console.log("[BarberApp] Pago de suscripción no encontrado:", paymentId)
        return NextResponse.json({ received: true })
      }

      // Actualizar el pago a pagado
      await supabase
        .from("suscripciones_pagos")
        .update({
          status: "paid",
          paid_at: new Date().toISOString(),
        })
        .eq("mercadopago_payment_id", paymentId)

      // Activar plan premium en el comercio
      const subscriptionStart = new Date()
      const subscriptionExpires = new Date()
      subscriptionExpires.setMonth(subscriptionExpires.getMonth() + 1)

      await supabase
        .from("comercios")
        .update({
          subscription_plan: "premium",
          subscription_status: "active",
          subscription_started_at: subscriptionStart.toISOString(),
          subscription_expires_at: subscriptionExpires.toISOString(),
        })
        .eq("id", pago.comercio_id)

      console.log(`[BarberApp] Suscripción Premium activada para comercio: ${pago.comercio_id}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("[BarberApp] Error processing subscription webhook:", error)
    return NextResponse.json({ error: "Internal error" }, { status: 500 })
  }
}
