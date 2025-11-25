"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Clock, DollarSign, Edit, Trash2 } from "lucide-react"
import { useState } from "react"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { EditarServicioDialog } from "./editar-servicio-dialog"

interface Servicio {
  id: string
  name: string
  description: string | null
  price: number
  duration_minutes: number
  is_active: boolean
}

export function ServiciosList({ servicios, comercioId }: { servicios: Servicio[]; comercioId: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)
  const [editingServicio, setEditingServicio] = useState<Servicio | null>(null)

  const handleToggleActive = async (servicioId: string, currentState: boolean) => {
    setLoading(servicioId)
    try {
      const supabase = getSupabaseBrowserClient()
      await supabase.from("servicios").update({ is_active: !currentState }).eq("id", servicioId)

      router.refresh()
    } catch (error) {
      console.error("[BarberApp] Error toggling servicio:", error)
    } finally {
      setLoading(null)
    }
  }

  const handleDelete = async (servicioId: string) => {
    if (!confirm("¿Estás seguro de eliminar este servicio?")) return

    setLoading(servicioId)
    try {
      const supabase = getSupabaseBrowserClient()
      await supabase.from("servicios").delete().eq("id", servicioId)

      router.refresh()
    } catch (error) {
      console.error("[BarberApp] Error deleting servicio:", error)
    } finally {
      setLoading(null)
    }
  }

  if (servicios.length === 0) {
    return (
      <p className="text-muted-foreground text-center py-8">
        No hay servicios creados aún. Comenzá agregando tu primer servicio.
      </p>
    )
  }

  return (
    <div className="space-y-4">
      {servicios.map((servicio) => (
        <div key={servicio.id} className="flex items-center justify-between p-4 border rounded-lg">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h4 className="font-semibold text-lg">{servicio.name}</h4>
              {!servicio.is_active && <Badge variant="outline">Inactivo</Badge>}
            </div>
            {servicio.description && <p className="text-sm text-muted-foreground mb-3">{servicio.description}</p>}
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1 text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>{servicio.duration_minutes} min</span>
              </div>
              <div className="flex items-center gap-1 font-semibold text-primary">
                <DollarSign className="h-4 w-4" />
                <span>${servicio.price.toLocaleString("es-AR")}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Activo</span>
              <Switch
                checked={servicio.is_active}
                onCheckedChange={() => handleToggleActive(servicio.id, servicio.is_active)}
                disabled={loading === servicio.id}
              />
            </div>
            <Button 
              size="sm" 
              variant="outline" 
              disabled={loading === servicio.id}
              onClick={() => setEditingServicio(servicio)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleDelete(servicio.id)}
              disabled={loading === servicio.id}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}

      {editingServicio && (
        <EditarServicioDialog
          open={!!editingServicio}
          onOpenChange={(open) => !open && setEditingServicio(null)}
          servicio={editingServicio}
        />
      )}
    </div>
  )
}
