"use client"

import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { MapPin, Mail, Phone, CheckCircle2 } from "lucide-react"
import { useState } from "react"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

interface Comercio {
  id: string
  name: string
  city: string
  subscription_plan: string
  is_active: boolean
  is_verified: boolean
  created_at: string
  profiles: {
    full_name: string
    email: string
    phone: string | null
  }
}

export function ComerciosAdminTable({ comercios }: { comercios: Comercio[] }) {
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)

  const handleToggleActive = async (comercioId: string, currentState: boolean) => {
    setLoading(comercioId)
    try {
      const supabase = getSupabaseBrowserClient()
      await supabase.from("comercios").update({ is_active: !currentState }).eq("id", comercioId)

      router.refresh()
    } catch (error) {
      console.error("[v0] Error toggling comercio:", error)
    } finally {
      setLoading(null)
    }
  }

  const handleToggleVerified = async (comercioId: string, currentState: boolean) => {
    setLoading(comercioId)
    try {
      const supabase = getSupabaseBrowserClient()
      await supabase.from("comercios").update({ is_verified: !currentState }).eq("id", comercioId)

      router.refresh()
    } catch (error) {
      console.error("[v0] Error verifying comercio:", error)
    } finally {
      setLoading(null)
    }
  }

  if (comercios.length === 0) {
    return <p className="text-muted-foreground text-center py-8">No hay comercios registrados</p>
  }

  return (
    <div className="space-y-4">
      {comercios.map((comercio) => (
        <div key={comercio.id} className="flex items-start justify-between p-4 border rounded-lg">
          <div className="flex-1 space-y-3">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h4 className="font-semibold text-lg">{comercio.name}</h4>
                <Badge
                  variant={comercio.subscription_plan === "premium" ? "default" : "outline"}
                  className={comercio.subscription_plan === "premium" ? "bg-primary" : ""}
                >
                  {comercio.subscription_plan}
                </Badge>
                {comercio.is_verified && <CheckCircle2 className="h-5 w-5 text-success" />}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{comercio.city}</span>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-2 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>{comercio.profiles.email}</span>
              </div>
              {comercio.profiles.phone && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  <span>{comercio.profiles.phone}</span>
                </div>
              )}
            </div>

            <p className="text-xs text-muted-foreground">
              Registrado: {new Date(comercio.created_at).toLocaleDateString("es-AR")}
            </p>
          </div>

          <div className="flex flex-col gap-3 items-end ml-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Activo</span>
              <Switch
                checked={comercio.is_active}
                onCheckedChange={() => handleToggleActive(comercio.id, comercio.is_active)}
                disabled={loading === comercio.id}
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Verificado</span>
              <Switch
                checked={comercio.is_verified}
                onCheckedChange={() => handleToggleVerified(comercio.id, comercio.is_verified)}
                disabled={loading === comercio.id}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
