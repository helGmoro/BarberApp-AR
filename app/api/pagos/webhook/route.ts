import { type NextRequest, NextResponse } from "next/server"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { createComercioTransfer } from "@/lib/transferencias"
import { checkRateLimit, getClientIP, RATE_LIMITS } from "@/lib/rate-limit"
import crypto from "crypto"

/**
 * Verifica la firma del webhook de Mercado Pago
 * Documentación: https://www.mercadopago.com.ar/developers/es/docs/your-integrations/notifications/webhooks
 */
function verifyMercadoPagoSignature(request: NextRequest, body: any): boolean {
  // Solo verificar en producción
  if (process.env.NODE_ENV !== 'production') {
    return true // Permitir en desarrollo
  }

  const xSignature = request.headers.get('x-signature')
  const xRequestId = request.headers.get('x-request-id')
  
  if (!xSignature || !xRequestId) {
    console.error('[BarberApp] Webhook sin firma o request ID')
    return false
  }

  // Extraer ts y hash del header x-signature
  const parts = xSignature.split(',')
  let ts: string | null = null
  let hash: string | null = null
  
  parts.forEach(part => {
    const [key, value] = part.split('=')
    if (key && value) {
      const cleanKey = key.trim()
      const cleanValue = value.trim()
      if (cleanKey === 'ts') ts = cleanValue
      if (cleanKey === 'v1') hash = cleanValue
    }
  })

  if (!ts || !hash) {
    console.error('[BarberApp] Firma mal formada')
    return false
  }

  // Obtener el secret de Mercado Pago
  const secret = process.env.MERCADOPAGO_WEBHOOK_SECRET
  if (!secret) {
    console.error('[BarberApp] MERCADOPAGO_WEBHOOK_SECRET no configurado')
    return false
  }

  // Crear el manifest: id + request-id + ts
  const dataId = body?.data?.id || ''
  const manifest = `id:${dataId};request-id:${xRequestId};ts:${ts};`
  
  // Calcular HMAC
  const hmac = crypto.createHmac('sha256', secret)
  hmac.update(manifest)
  const calculatedHash = hmac.digest('hex')

  // Comparar hashes
  const isValid = calculatedHash === hash
  
  if (!isValid) {
    console.error('[BarberApp] Firma inválida. Calculado:', calculatedHash, 'Recibido:', hash)
  }
  
  return isValid
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const clientIP = getClientIP(request)
    const rateLimitResult = checkRateLimit(clientIP, RATE_LIMITS.WEBHOOK)
    
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { error: 'Demasiadas solicitudes. Intente más tarde.' },
        { 
          status: 429,
          headers: {
            'X-RateLimit-Limit': RATE_LIMITS.WEBHOOK.maxRequests.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': new Date(rateLimitResult.resetAt).toISOString(),
          }
        }
      )
    }

    const body = await request.json()

    // Verificar la firma de Mercado Pago
    if (!verifyMercadoPagoSignature(request, body)) {
      console.error('[BarberApp] Intento de webhook con firma inválida')
      return NextResponse.json({ error: 'Firma inválida' }, { status: 401 })
    }

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
