import { type NextRequest, NextResponse } from "next/server"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { createComercioTransfer } from "@/lib/transferencias"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // En producción, verificar la firma de Mercado Pago
    // const signature = request.headers.get('x-signature')

    if (body.type === "payment") {
      const paymentId = body.data.id

      // Aquí iría la lógica para consultar el pago en Mercado Pago
      // Por ahora, simulamos la respuesta

      const supabase = await getSupabaseServerClient()

      // Buscar el pago en la base de datos
      const { data: pago } = await supabase
        .from("pagos")
        .select("*, turnos(id, comercio_id, payment_method, instant_discount_applied)")
        .eq("mercadopago_payment_id", paymentId)
        .single()

      if (!pago) {
        console.log("[BarberApp] Pago no encontrado:", paymentId)
        return NextResponse.json({ success: true })
      }

      // Actualizar el pago en la base de datos
      const { error } = await supabase
        .from("pagos")
        .update({
          status: "approved",
          paid_at: new Date().toISOString(),
        })
        .eq("mercadopago_payment_id", paymentId)

      if (error) {
        console.error("[BarberApp] Error updating payment:", error)
        return NextResponse.json({ error: "Error actualizando pago" }, { status: 500 })
      }

      // Actualizar el turno según el tipo de pago
      const turnoUpdate: any = {}
      
      if (pago.payment_type === 'sena') {
        // Seña pagada -> turno confirmado
        turnoUpdate.sena_paid = true
        turnoUpdate.status = 'confirmed'
      } else if (pago.payment_type === 'completo' || pago.is_instant_payment) {
        // Pago completo -> ambos flags en true
        turnoUpdate.sena_paid = true
        turnoUpdate.full_payment_paid = true
        turnoUpdate.status = 'confirmed'
      } else if (pago.payment_type === 'resto') {
        // Resto pagado -> full payment completado
        turnoUpdate.full_payment_paid = true
      }

      const { error: turnoError } = await supabase
        .from("turnos")
        .update(turnoUpdate)
        .eq("id", pago.turno_id)

      if (turnoError) {
        console.error("[BarberApp] Error updating turno:", turnoError)
      }

      // Crear transferencia automática al comercio
      try {
        await createComercioTransfer(
          pago.turno_id,
          pago.id,
          pago.amount,
          pago.payment_type as "sena" | "completo" | "resto"
        )
        console.log(`[BarberApp] Transferencia creada automáticamente para pago ${pago.id}`)
      } catch (transferError) {
        console.error("[BarberApp] Error creando transferencia:", transferError)
        // No fallar el webhook si falla la transferencia
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[BarberApp] Error processing webhook:", error)
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}
