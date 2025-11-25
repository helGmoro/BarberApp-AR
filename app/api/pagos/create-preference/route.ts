import { type NextRequest, NextResponse } from "next/server"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { createMercadoPagoPreference } from "@/lib/mercadopago"
import { getPlatformConfig, calculateCommission } from "@/lib/platform-config"
import { calculatePaymentOptions } from "@/lib/payment-utils"

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
      .select(`
        *, 
        comercios(
          name, 
          mercadopago_access_token, 
          mercadopago_collector_id,
          sena_percentage,
          instant_payment_discount
        ), 
        servicios(name, price)
      `)
      .eq("id", turnoId)
      .eq("cliente_id", user.id)
      .single()

    if (turnoError || !turno) {
      return NextResponse.json({ error: "Turno no encontrado" }, { status: 404 })
    }

    // Calcular montos según configuración
    const senaPercentage = turno.comercios.sena_percentage || 30
    const instantDiscount = turno.instant_discount_applied 
      ? (turno.comercios.instant_payment_discount || 0)
      : 0
      
    const calculation = calculatePaymentOptions(
      turno.servicios.price,
      senaPercentage,
      instantDiscount
    )

    // Determinar montos originales y con descuento
    let originalAmount = amount
    let discountAmount = 0
    let isInstantPayment = false

    if (paymentType === 'completo' && turno.instant_discount_applied) {
      originalAmount = turno.servicios.price
      discountAmount = calculation.instant.discountAmount
      isInstantPayment = true
    }

    const platformConfig = await getPlatformConfig()

    const { commissionPercentage, commissionAmount, comercioReceives } = calculateCommission(
      amount,
      paymentType,
      platformConfig,
    )

    // Título descriptivo del pago
    let paymentTitle = ''
    if (paymentType === 'sena') {
      paymentTitle = `Seña (${senaPercentage}%) - ${turno.servicios.name} en ${turno.comercios.name}`
    } else if (paymentType === 'completo') {
      paymentTitle = isInstantPayment 
        ? `Pago completo con descuento - ${turno.servicios.name} en ${turno.comercios.name}`
        : `Pago completo - ${turno.servicios.name} en ${turno.comercios.name}`
    } else {
      paymentTitle = `Pago resto - ${turno.servicios.name} en ${turno.comercios.name}`
    }

    const preference = await createMercadoPagoPreference(
      [
        {
          title: paymentTitle,
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

    // Crear registro de pago pendiente con nuevos campos
    const { error: pagoError } = await supabase.from("pagos").insert({
      turno_id: turnoId,
      comercio_id: turno.comercio_id,
      cliente_id: user.id,
      amount,
      original_amount: originalAmount,
      discount_amount: discountAmount,
      is_instant_payment: isInstantPayment,
      payment_type: paymentType,
      payment_method: "mercadopago",
      status: "pending",
      platform_commission_percentage: commissionPercentage,
      platform_commission_amount: commissionAmount,
      mercadopago_preference_id: preference.id,
    })

    if (pagoError) {
      console.error('[BarberApp] Error creating payment record:', pagoError)
      return NextResponse.json({ error: "Error al crear el pago" }, { status: 500 })
    }

    return NextResponse.json({
      preferenceId: preference.id,
      initPoint: preference.init_point,
    })
  } catch (error) {
    console.error("[BarberApp] Error creating payment preference:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
