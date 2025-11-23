import { type NextRequest, NextResponse } from "next/server"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { createMercadoPagoPreference } from "@/lib/mercadopago"
import { getPlatformConfig, calculateCommission } from "@/lib/platform-config"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { turnoId, paymentType, amount } = body

    const supabase = await getSupabaseServerClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    // Verificar que el turno existe y pertenece al usuario
    const { data: turno, error: turnoError } = await supabase
      .from("turnos")
      .select("*, comercios(name, mercadopago_access_token, mercadopago_collector_id), servicios(name, price)")
      .eq("id", turnoId)
      .eq("cliente_id", user.id)
      .single()

    if (turnoError || !turno) {
      return NextResponse.json({ error: "Turno no encontrado" }, { status: 404 })
    }

    const platformConfig = await getPlatformConfig()

    const { commissionPercentage, commissionAmount, comercioReceives } = calculateCommission(
      amount,
      paymentType,
      platformConfig,
    )

    const preference = await createMercadoPagoPreference(
      [
        {
          title:
            paymentType === "sena"
              ? `Seña - ${turno.servicios.name} en ${turno.comercios.name}`
              : `${turno.servicios.name} en ${turno.comercios.name}`,
          quantity: 1,
          unit_price: amount,
          currency_id: "ARS",
        },
      ],
      {
        turnoId,
        paymentType,
        userId: user.id,
        comercioId: turno.comercio_id,
        splitPayment: turno.comercios.mercadopago_access_token
          ? {
              collectorId: turno.comercios.mercadopago_collector_id,
              applicationFee: commissionAmount,
            }
          : null,
      },
      {
        success: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/panel/cliente/mis-turnos?payment=success`,
        failure: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/panel/cliente/mis-turnos?payment=failure`,
        pending: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/panel/cliente/mis-turnos?payment=pending`,
      },
    )

    // Crear registro de pago pendiente
    const { error: pagoError } = await supabase.from("pagos").insert({
      turno_id: turnoId,
      comercio_id: turno.comercio_id,
      cliente_id: user.id,
      amount,
      payment_type: paymentType,
      payment_method: "mercadopago",
      status: "pending",
      platform_commission_percentage: commissionPercentage,
      platform_commission_amount: commissionAmount,
      mercadopago_preference_id: preference.id,
    })

    if (pagoError) {
      return NextResponse.json({ error: "Error al crear el pago" }, { status: 500 })
    }

    return NextResponse.json({
      preferenceId: preference.id,
      initPoint: preference.init_point,
    })
  } catch (error) {
    console.error("[v0] Error creating payment preference:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
