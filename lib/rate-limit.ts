/**
 * Rate Limiter simple basado en IP y memoria
 * Para producción considerar usar Redis o Upstash
 */

interface RateLimitEntry {
  count: number
  resetAt: number
}

const rateLimitStore = new Map<string, RateLimitEntry>()

// Limpiar entradas expiradas cada 60 segundos
setInterval(() => {
  const now = Date.now()
  for (const [key, entry] of rateLimitStore.entries()) {
    if (entry.resetAt < now) {
      rateLimitStore.delete(key)
    }
  }
}, 60000)

export interface RateLimitConfig {
  /** Máximo número de requests permitidos */
  maxRequests: number
  /** Ventana de tiempo en segundos */
  windowSeconds: number
}

/**
 * Verifica si una request está dentro del límite permitido
 * @param identifier - Identificador único (ej: IP, user ID)
 * @param config - Configuración del rate limit
 * @returns true si está permitido, false si excede el límite
 */
export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig
): { allowed: boolean; remaining: number; resetAt: number } {
  const now = Date.now()
  const windowMs = config.windowSeconds * 1000
  const key = identifier

  const entry = rateLimitStore.get(key)

  // Primera request o ventana expirada
  if (!entry || entry.resetAt < now) {
    const resetAt = now + windowMs
    rateLimitStore.set(key, { count: 1, resetAt })
    return {
      allowed: true,
      remaining: config.maxRequests - 1,
      resetAt,
    }
  }

  // Incrementar contador
  entry.count++

  // Verificar si excede el límite
  if (entry.count > config.maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetAt: entry.resetAt,
    }
  }

  return {
    allowed: true,
    remaining: config.maxRequests - entry.count,
    resetAt: entry.resetAt,
  }
}

/**
 * Obtiene la IP del cliente desde la request
 */
export function getClientIP(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const realIP = request.headers.get('x-real-ip')
  
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  
  if (realIP) {
    return realIP
  }
  
  return 'unknown'
}

/**
 * Configuraciones predefinidas de rate limiting
 */
export const RATE_LIMITS = {
  // Login: 5 intentos por 15 minutos
  LOGIN: { maxRequests: 5, windowSeconds: 900 },
  
  // Registro: 3 cuentas por hora
  REGISTER: { maxRequests: 3, windowSeconds: 3600 },
  
  // Crear turnos: 10 por hora
  CREATE_TURNO: { maxRequests: 10, windowSeconds: 3600 },
  
  // Webhooks: 100 por minuto
  WEBHOOK: { maxRequests: 100, windowSeconds: 60 },
  
  // APIs generales: 60 por minuto
  API_GENERAL: { maxRequests: 60, windowSeconds: 60 },
}
