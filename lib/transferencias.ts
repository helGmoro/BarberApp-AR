import { createClient } from "@supabase/supabase-js"
import { getPlatformConfig, calculateCommission } from "@/lib/platform-config"

/**
 * Crea una transferencia pendiente al comercio cuando se confirma un pago
 * Esta función se llama automáticamente desde el webhook de pagos
 */
export async function createComercioTransfer(
  turnoId: string,
  pagoId: string,
  amount: number,
  paymentType: "sena" | "completo"
) {
  try {
    // Verificar que existe SERVICE_ROLE_KEY
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error("[BarberApp] SUPABASE_SERVICE_ROLE_KEY no configurada")
      throw new Error("Server configuration error")
    }

    // Usar service role para crear transferencia sin autenticación
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

    // Obtener configuración de comisiones
    const config = await getPlatformConfig()

    // Calcular montos
    const { commissionAmount, comercioReceives } = calculateCommission(amount, paymentType, config)

    // Obtener información del turno y comercio
    const { data: turno, error: turnoError } = await supabase
      .from("turnos")
      .select("comercio_id, comercios(mp_cvu, mp_alias)")
      .eq("id", turnoId)
      .single()

    if (turnoError || !turno) {
      console.error("[BarberApp] Turno no encontrado:", turnoError)
      throw new Error("Turno no encontrado")
    }

    const comercio = turno.comercios as any

    // Verificar que el comercio tenga CVU o Alias configurado
    if (!comercio.mp_cvu && !comercio.mp_alias) {
      console.log(`[BarberApp] Comercio ${turno.comercio_id} no tiene CVU/Alias configurado - transferencia omitida`)
      return null
    }

    // Crear registro de transferencia
    const { data: transferencia, error: transferError } = await supabase
      .from("transferencias_comercio")
      .insert({
        comercio_id: turno.comercio_id,
        turno_id: turnoId,
        pago_id: pagoId,
        amount_total: amount,
        amount_commission: commissionAmount,
        amount_to_transfer: comercioReceives,
        destination_cvu: comercio.mp_cvu,
        destination_alias: comercio.mp_alias,
        status: "pending",
      })
      .select()
      .single()

    if (transferError) {
      console.error("[BarberApp] Error creando transferencia:", transferError)
      throw transferError
    }

    console.log(
      `[BarberApp] Transferencia creada: $${comercioReceives} para comercio ${turno.comercio_id} (Comisión: $${commissionAmount})`
    )

    // En desarrollo, simular transferencia inmediata
    if (process.env.NODE_ENV === "development") {
      await simulateTransfer(transferencia.id)
    }

    return transferencia
  } catch (error) {
    console.error("[BarberApp] Error en createComercioTransfer:", error)
    throw error
  }
}

/**
 * Simula una transferencia exitosa en desarrollo
 * En producción, esto sería reemplazado por la API de Mercado Pago
 */
async function simulateTransfer(transferenciaId: string) {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) return

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

  // Esperar 2 segundos para simular proceso
  await new Promise((resolve) => setTimeout(resolve, 2000))

  await supabase
    .from("transferencias_comercio")
    .update({
      status: "completed",
      mercadopago_transfer_id: `transfer_${Date.now()}`,
      processed_at: new Date().toISOString(),
    })
    .eq("id", transferenciaId)

  console.log(`[BarberApp] Transferencia ${transferenciaId} completada (simulada)`)
}

/**
 * Procesa transferencias pendientes (para ejecutar en cron job)
 * En producción, esto se ejecutaría cada X minutos/horas
 */
export async function processComercioTransfers() {
  try {
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error("SUPABASE_SERVICE_ROLE_KEY no configurada")
    }

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

    // Obtener transferencias pendientes
    const { data: transfers, error } = await supabase
      .from("transferencias_comercio")
      .select("*")
      .eq("status", "pending")
      .order("created_at", { ascending: true })
      .limit(50)

    if (error) {
      console.error("[BarberApp] Error obteniendo transferencias:", error)
      return
    }

    if (!transfers || transfers.length === 0) {
      console.log("[BarberApp] No hay transferencias pendientes")
      return
    }

    console.log(`[BarberApp] Procesando ${transfers.length} transferencias...`)

    for (const transfer of transfers) {
      try {
        // Actualizar a processing
        await supabase.from("transferencias_comercio").update({ status: "processing" }).eq("id", transfer.id)

        // TODO: En producción, usar API de Mercado Pago para hacer la transferencia real
        // const mpResponse = await transferToMercadoPago(
        //   transfer.destination_cvu || transfer.destination_alias,
        //   transfer.amount_to_transfer
        // )

        // Por ahora, simular transferencia exitosa
        await supabase
          .from("transferencias_comercio")
          .update({
            status: "completed",
            mercadopago_transfer_id: `transfer_${Date.now()}`,
            processed_at: new Date().toISOString(),
          })
          .eq("id", transfer.id)

        console.log(`[BarberApp] Transferencia ${transfer.id} completada: $${transfer.amount_to_transfer}`)
      } catch (transferError) {
        console.error(`[BarberApp] Error procesando transferencia ${transfer.id}:`, transferError)

        // Marcar como failed
        await supabase
          .from("transferencias_comercio")
          .update({
            status: "failed",
            transfer_error: String(transferError),
          })
          .eq("id", transfer.id)
      }
    }

    console.log("[BarberApp] Procesamiento de transferencias completado")
  } catch (error) {
    console.error("[BarberApp] Error en processComercioTransfers:", error)
  }
}
