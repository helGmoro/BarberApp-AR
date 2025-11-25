import { NextResponse } from "next/server"
import { processComercioTransfers } from "@/lib/transferencias"

/**
 * Endpoint para procesar transferencias pendientes
 * Puede ser llamado manualmente o desde un cron job
 */
export async function POST() {
  try {
    await processComercioTransfers()
    return NextResponse.json({ success: true, message: "Transferencias procesadas" })
  } catch (error) {
    console.error("[BarberApp] Error en endpoint de transferencias:", error)
    return NextResponse.json({ error: "Error procesando transferencias" }, { status: 500 })
  }
}

/**
 * Endpoint GET para obtener estadísticas de transferencias
 */
export async function GET() {
  try {
    // TODO: Implementar estadísticas
    return NextResponse.json({
      message: "Endpoint de estadísticas - Por implementar",
    })
  } catch (error) {
    return NextResponse.json({ error: "Error" }, { status: 500 })
  }
}
