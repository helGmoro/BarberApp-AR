// Utilidad para obtener y actualizar configuraciones de la plataforma
import { getSupabaseServerClient } from "./supabase/server"

export interface PlatformConfig {
  commission_sena_percentage: number
  commission_completo_percentage: number
  sena_amount: number
  subscription_premium_price: number
  enable_commissions: boolean
}

export async function getPlatformConfig(): Promise<PlatformConfig> {
  const supabase = await getSupabaseServerClient()

  const { data, error } = await supabase.from("platform_config").select("config_key, config_value, config_type")

  if (error) {
    console.error("[BarberApp] Error fetching platform config:", error)
    // Valores por defecto si falla
    return {
      commission_sena_percentage: 3,
      commission_completo_percentage: 5,
      sena_amount: 3000,
      subscription_premium_price: 10000,
      enable_commissions: true,
    }
  }

  const config: any = {}
  data?.forEach((item) => {
    if (item.config_type === "number") {
      config[item.config_key] = Number.parseFloat(item.config_value)
    } else if (item.config_type === "boolean") {
      config[item.config_key] = item.config_value === "true"
    } else {
      config[item.config_key] = item.config_value
    }
  })

  return config as PlatformConfig
}

export function getBaseUrl(): string {
  // En producción, usar la URL del dominio
  if (process.env.NODE_ENV === "production" && process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL
  }
  // En desarrollo, usar localhost
  return process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
}

export async function updatePlatformConfig(key: string, value: string | number | boolean) {
  const supabase = await getSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("No autorizado")
  }

  // Verificar que sea admin
  const { data: profile } = await supabase.from("profiles").select("user_type").eq("id", user.id).single()

  if (profile?.user_type !== "admin") {
    throw new Error("Solo administradores pueden modificar la configuración")
  }

  const { error } = await supabase
    .from("platform_config")
    .update({
      config_value: value.toString(),
      updated_at: new Date().toISOString(),
      updated_by: user.id,
    })
    .eq("config_key", key)

  if (error) {
    throw new Error(`Error actualizando configuración: ${error.message}`)
  }
}

export function calculateCommission(
  amount: number,
  paymentType: "sena" | "completo",
  config: PlatformConfig,
): {
  commissionPercentage: number
  commissionAmount: number
  comercioReceives: number
} {
  const percentage = paymentType === "sena" ? config.commission_sena_percentage : config.commission_completo_percentage

  const commissionAmount = Math.round((amount * percentage) / 100)
  const comercioReceives = amount - commissionAmount

  return {
    commissionPercentage: percentage,
    commissionAmount,
    comercioReceives,
  }
}
