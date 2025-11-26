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
  const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN

  if (!accessToken) {
    throw new Error("MERCADOPAGO_ACCESS_TOKEN no está configurado")
  }

  // Preparar datos de la preferencia
  const preferenceData: any = {
    items: items.map(item => ({
      title: item.title,
      quantity: item.quantity,
      unit_price: item.unit_price,
      currency_id: item.currency_id || "ARS",
    })),
    back_urls: backUrls,
    auto_return: "approved",
    external_reference: metadata.turnoId || "",
    metadata: metadata,
    notification_url: `${process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_APP_URL}/api/pagos/webhook`,
  }

  // Si hay split payment (comercio con MP conectado)
  if (metadata.splitPayment) {
    preferenceData.marketplace_fee = metadata.splitPayment.applicationFee
    preferenceData.marketplace = "BARBERAPP"
  }

  // Llamar a la API de Mercado Pago
  const response = await fetch("https://api.mercadopago.com/checkout/preferences", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(preferenceData),
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    console.error("[MercadoPago] Error creating preference:", errorData)
    throw new Error(`Error al crear preferencia de pago: ${response.status}`)
  }

  const preference = await response.json()
  
  return {
    id: preference.id,
    init_point: preference.init_point,
    sandbox_init_point: preference.sandbox_init_point,
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
