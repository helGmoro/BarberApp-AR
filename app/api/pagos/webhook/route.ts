import { type NextRequest, NextResponse } from "next/server"
import { getSupabaseServerClient } from "@/lib/supabase/server"

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

      // Actualizar el pago en la base de datos
      const { error } = await supabase
        .from("pagos")
        .update({
          status: "approved",
          mercadopago_payment_id: paymentId,
          paid_at: new Date().toISOString(),
        })
        .eq("mercadopago_payment_id", paymentId)

      if (error) {
        console.error("[v0] Error updating payment:", error)
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error processing webhook:", error)
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}
