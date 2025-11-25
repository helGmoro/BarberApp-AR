/**
 * Utilidades para cálculo de pagos con señas y descuentos
 */

export interface PaymentCalculation {
  servicePriceOriginal: number
  senaPercentage: number
  senaAmount: number
  remainingAmount: number
  instantDiscount: number
  instantDiscountAmount: number
  instantPaymentTotal: number
  finalAmount: number
}

/**
 * Calcula los montos de seña y resto
 */
export function calculateSenaAmounts(
  servicePrice: number,
  senaPercentage: number = 30
): {
  senaAmount: number
  remainingAmount: number
} {
  const senaAmount = Math.round((servicePrice * senaPercentage) / 100)
  const remainingAmount = servicePrice - senaAmount

  return {
    senaAmount,
    remainingAmount,
  }
}

/**
 * Calcula el monto con descuento por pago instantáneo
 */
export function calculateInstantPayment(
  servicePrice: number,
  discountPercentage: number = 0
): {
  originalAmount: number
  discountAmount: number
  finalAmount: number
} {
  const discountAmount = Math.round((servicePrice * discountPercentage) / 100)
  const finalAmount = servicePrice - discountAmount

  return {
    originalAmount: servicePrice,
    discountAmount,
    finalAmount,
  }
}

/**
 * Calcula todos los escenarios de pago
 */
export function calculatePaymentOptions(
  servicePrice: number,
  senaPercentage: number = 30,
  instantDiscountPercentage: number = 0
): PaymentCalculation {
  const { senaAmount, remainingAmount } = calculateSenaAmounts(servicePrice, senaPercentage)
  const { discountAmount, finalAmount } = calculateInstantPayment(servicePrice, instantDiscountPercentage)

  return {
    servicePriceOriginal: servicePrice,
    senaPercentage,
    senaAmount,
    remainingAmount,
    instantDiscount: instantDiscountPercentage,
    instantDiscountAmount: discountAmount,
    instantPaymentTotal: finalAmount,
    finalAmount: servicePrice, // Por defecto, el precio original
  }
}

/**
 * Calcula la fecha límite para pagar la seña
 */
export function calculateSenaDeadline(hours: number = 24): Date {
  const deadline = new Date()
  deadline.setHours(deadline.getHours() + hours)
  return deadline
}

/**
 * Verifica si la seña expiró
 */
export function isSenaExpired(deadline: string | Date): boolean {
  const deadlineDate = typeof deadline === "string" ? new Date(deadline) : deadline
  return new Date() > deadlineDate
}

/**
 * Formatea tiempo restante para pagar seña
 */
export function formatTimeRemaining(deadline: string | Date): string {
  const deadlineDate = typeof deadline === "string" ? new Date(deadline) : deadline
  const now = new Date()
  const diff = deadlineDate.getTime() - now.getTime()

  if (diff <= 0) return "Expirado"

  const hours = Math.floor(diff / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

  if (hours > 0) {
    return `${hours}h ${minutes}m restantes`
  }
  return `${minutes}m restantes`
}
