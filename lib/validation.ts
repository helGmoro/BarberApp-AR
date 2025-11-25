/**
 * Utilidades para validación y sanitización de inputs
 */

/**
 * Sanitiza un string removiendo caracteres peligrosos
 */
export function sanitizeString(input: string): string {
  if (typeof input !== 'string') return ''
  
  return input
    .trim()
    .replace(/[<>]/g, '') // Remover < y > para prevenir XSS básico
    .slice(0, 1000) // Limitar longitud
}

/**
 * Valida y sanitiza un email
 */
export function validateEmail(email: string): { valid: boolean; email: string; error?: string } {
  const sanitized = sanitizeString(email).toLowerCase()
  
  if (!sanitized) {
    return { valid: false, email: '', error: 'El email es requerido' }
  }
  
  // Regex básico para email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  
  if (!emailRegex.test(sanitized)) {
    return { valid: false, email: sanitized, error: 'Email inválido' }
  }
  
  if (sanitized.length > 254) {
    return { valid: false, email: sanitized, error: 'Email demasiado largo' }
  }
  
  return { valid: true, email: sanitized }
}

/**
 * Valida un número de teléfono argentino
 */
export function validatePhone(phone: string): { valid: boolean; phone: string; error?: string } {
  const sanitized = sanitizeString(phone).replace(/\s/g, '')
  
  if (!sanitized) {
    return { valid: true, phone: '' } // Teléfono es opcional en algunos casos
  }
  
  // Permitir números argentinos: 11 1234 5678, 15 1234 5678, etc
  const phoneRegex = /^[0-9]{8,15}$/
  
  if (!phoneRegex.test(sanitized)) {
    return { valid: false, phone: sanitized, error: 'Teléfono inválido' }
  }
  
  return { valid: true, phone: sanitized }
}

/**
 * Valida un DNI argentino
 */
export function validateDNI(dni: string): { valid: boolean; dni: string; error?: string } {
  const sanitized = sanitizeString(dni).replace(/\D/g, '') // Solo números
  
  if (!sanitized) {
    return { valid: true, dni: '' } // DNI es opcional
  }
  
  // DNI argentino: 7-8 dígitos
  if (sanitized.length < 7 || sanitized.length > 8) {
    return { valid: false, dni: sanitized, error: 'DNI debe tener 7 u 8 dígitos' }
  }
  
  return { valid: true, dni: sanitized }
}

/**
 * Valida una contraseña
 */
export function validatePassword(password: string): { valid: boolean; error?: string } {
  if (!password) {
    return { valid: false, error: 'La contraseña es requerida' }
  }
  
  if (password.length < 8) {
    return { valid: false, error: 'La contraseña debe tener al menos 8 caracteres' }
  }
  
  if (password.length > 128) {
    return { valid: false, error: 'La contraseña es demasiado larga' }
  }
  
  // Al menos una letra y un número
  if (!/[a-zA-Z]/.test(password) || !/[0-9]/.test(password)) {
    return { valid: false, error: 'La contraseña debe contener letras y números' }
  }
  
  return { valid: true }
}

/**
 * Valida un nombre (nombre completo, nombre de comercio, etc)
 */
export function validateName(name: string, field: string = 'Nombre'): { valid: boolean; name: string; error?: string } {
  const sanitized = sanitizeString(name)
  
  if (!sanitized) {
    return { valid: false, name: '', error: `${field} es requerido` }
  }
  
  if (sanitized.length < 2) {
    return { valid: false, name: sanitized, error: `${field} debe tener al menos 2 caracteres` }
  }
  
  if (sanitized.length > 100) {
    return { valid: false, name: sanitized, error: `${field} es demasiado largo` }
  }
  
  return { valid: true, name: sanitized }
}

/**
 * Valida un monto de dinero
 */
export function validateAmount(amount: number | string): { valid: boolean; amount: number; error?: string } {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount
  
  if (isNaN(numAmount)) {
    return { valid: false, amount: 0, error: 'Monto inválido' }
  }
  
  if (numAmount < 0) {
    return { valid: false, amount: numAmount, error: 'El monto no puede ser negativo' }
  }
  
  if (numAmount > 10000000) {
    return { valid: false, amount: numAmount, error: 'Monto demasiado alto' }
  }
  
  return { valid: true, amount: numAmount }
}

/**
 * Valida un UUID
 */
export function validateUUID(uuid: string): { valid: boolean; uuid: string; error?: string } {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
  
  if (!uuid || !uuidRegex.test(uuid)) {
    return { valid: false, uuid, error: 'ID inválido' }
  }
  
  return { valid: true, uuid }
}

/**
 * Valida una fecha
 */
export function validateDate(dateStr: string): { valid: boolean; date: string; error?: string } {
  if (!dateStr) {
    return { valid: false, date: '', error: 'La fecha es requerida' }
  }
  
  const date = new Date(dateStr)
  
  if (isNaN(date.getTime())) {
    return { valid: false, date: dateStr, error: 'Fecha inválida' }
  }
  
  // No permitir fechas muy antiguas o muy futuras
  const minDate = new Date('2020-01-01')
  const maxDate = new Date()
  maxDate.setFullYear(maxDate.getFullYear() + 2)
  
  if (date < minDate || date > maxDate) {
    return { valid: false, date: dateStr, error: 'Fecha fuera de rango permitido' }
  }
  
  return { valid: true, date: dateStr }
}

/**
 * Valida una URL
 */
export function validateURL(url: string): { valid: boolean; url: string; error?: string } {
  if (!url) {
    return { valid: true, url: '' } // URL opcional
  }
  
  try {
    const urlObj = new URL(url)
    
    // Solo permitir http y https
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      return { valid: false, url, error: 'Protocolo no permitido' }
    }
    
    return { valid: true, url }
  } catch {
    return { valid: false, url, error: 'URL inválida' }
  }
}
