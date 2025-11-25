import { NextResponse } from "next/server"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { getBaseUrl } from "@/lib/platform-config"

export async function POST() {
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
      return NextResponse.json({ error: "Solo comercios pueden suscribirse" }, { status: 403 })
    }

    // Obtener comercio
    const { data: comercio } = await supabase.from("comercios").select("id, name").eq("owner_id", user.id).single()

    if (!comercio) {
      return NextResponse.json({ error: "Comercio no encontrado" }, { status: 404 })
    }

    // En desarrollo, simular el checkout
    const baseUrl = getBaseUrl()

    // Crear un ID de preferencia simulado
    const preferenceId = `pref_premium_${Date.now()}`

    // Registrar el pago pendiente
    const billingStart = new Date()
    const billingEnd = new Date()
    billingEnd.setMonth(billingEnd.getMonth() + 1)

    await supabase.from("suscripciones_pagos").insert({
      comercio_id: comercio.id,
      amount: 10000,
      billing_period_start: billingStart.toISOString().split("T")[0],
      billing_period_end: billingEnd.toISOString().split("T")[0],
      status: "pending",
      payment_method: "mercadopago",
      mercadopago_payment_id: preferenceId,
    })

    // En desarrollo, retornar URL de simulación
    return NextResponse.json({
      preferenceId: preferenceId,
      initPoint: `${baseUrl}/api/suscripcion/simulate-payment?comercio_id=${comercio.id}`,
    })
  } catch (error) {
    console.error("[BarberApp] Error creating subscription checkout:", error)
    return NextResponse.json({ error: "Error al crear el checkout" }, { status: 500 })
  }
}
