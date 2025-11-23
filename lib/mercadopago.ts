// Utilidades para trabajar con Mercado Pago
export interface MercadoPagoPreference {
  title: string
  quantity: number
  unit_price: number
  currency_id: string
}

export async function createMercadoPagoPreference(
  items: MercadoPagoPreference[],
  metadata: Record<string, any>,
  backUrls?: {
    success: string
    failure: string
    pending: string
  },
) {
  // En producción, esto se conectaría con la API de Mercado Pago
  // Por ahora, retornamos un objeto simulado para desarrollo
  return {
    id: `pref_${Date.now()}`,
    init_point: "/panel/pago/simulado",
    sandbox_init_point: "/panel/pago/simulado",
  }
}

export function calculatePlatformCommission(amount: number, paymentType: "sena" | "completo"): number {
  // Señas: 3% de comisión sobre $3000
  if (paymentType === "sena") {
    return amount * 0.03
  }
  // Pago completo: 5% de comisión
  return amount * 0.05
}
