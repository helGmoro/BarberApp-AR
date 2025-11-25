"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Edit, Trash2, Calendar, Percent, DollarSign, Tag, Users } from "lucide-react"
import { useState } from "react"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { PromocionDialog } from "./promocion-dialog"
import { format } from "date-fns"
import { es } from "date-fns/locale"

interface Promocion {
  id: string
  title: string
  description: string | null
  discount_type: string
  discount_percentage: number | null
  discount_amount: number | null
  valid_from: string
  valid_until: string
  applicable_days: number[]
  max_uses: number | null
  current_uses: number
  is_active: boolean
  promo_code: string | null
}

interface PromocionesListProps {
  promociones: Promocion[]
  comercioId: string
  servicios: Array<{ id: string; name: string }>
}

export function PromocionesList({ promociones, comercioId, servicios }: PromocionesListProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState<string | null>(null)
  const [editingPromo, setEditingPromo] = useState<Promocion | null>(null)

  const handleToggleActive = async (id: string, currentState: boolean) => {
    setLoading(id)
    try {
      const supabase = getSupabaseBrowserClient()
      const { error } = await supabase
        .from("promociones")
        .update({ is_active: !currentState })
        .eq("id", id)

      if (error) throw error

      toast({
        title: currentState ? "Promoción desactivada" : "Promoción activada",
        description: "Los cambios se guardaron correctamente",
      })

      router.refresh()
    } catch (error) {
      console.error("[BarberApp] Error toggling promocion:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo actualizar la promoción",
      })
    } finally {
      setLoading(null)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de eliminar esta promoción?")) return

    setLoading(id)
    try {
      const supabase = getSupabaseBrowserClient()
      const { error } = await supabase.from("promociones").delete().eq("id", id)

      if (error) throw error

      toast({
        title: "Promoción eliminada",
        description: "La promoción se eliminó correctamente",
      })

      router.refresh()
    } catch (error) {
      console.error("[BarberApp] Error deleting promocion:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo eliminar la promoción",
      })
    } finally {
      setLoading(null)
    }
  }

  const isExpired = (validUntil: string) => {
    return new Date(validUntil) < new Date()
  }

  const isMaxUsesReached = (promo: Promocion) => {
    return promo.max_uses !== null && promo.current_uses >= promo.max_uses
  }

  return (
    <>
      <div className="grid gap-4">
        {promociones.map((promo) => {
          const expired = isExpired(promo.valid_until)
          const maxReached = isMaxUsesReached(promo)

          return (
            <Card key={promo.id} className={!promo.is_active || expired || maxReached ? "opacity-60" : ""}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="flex items-center gap-2 mb-2">
                      {promo.title}
                      {promo.promo_code && (
                        <Badge variant="secondary" className="flex items-center gap-1">
                          <Tag className="h-3 w-3" />
                          {promo.promo_code}
                        </Badge>
                      )}
                    </CardTitle>
                    <div className="flex flex-wrap gap-2">
                      {!promo.is_active && <Badge variant="outline">Inactiva</Badge>}
                      {expired && <Badge variant="destructive">Vencida</Badge>}
                      {maxReached && <Badge variant="destructive">Límite alcanzado</Badge>}
                      {promo.is_active && !expired && !maxReached && (
                        <Badge className="bg-green-500">Activa</Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={promo.is_active}
                      onCheckedChange={() => handleToggleActive(promo.id, promo.is_active)}
                      disabled={loading === promo.id || expired || maxReached}
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setEditingPromo(promo)}
                      disabled={loading === promo.id}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(promo.id)}
                      disabled={loading === promo.id}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {promo.description && (
                  <p className="text-sm text-muted-foreground">{promo.description}</p>
                )}

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {/* Descuento */}
                  <div className="flex items-center gap-2">
                    {promo.discount_type === "percentage" ? (
                      <>
                        <Percent className="h-4 w-4 text-primary" />
                        <div>
                          <p className="text-sm font-medium">{promo.discount_percentage}% OFF</p>
                          <p className="text-xs text-muted-foreground">Descuento</p>
                        </div>
                      </>
                    ) : (
                      <>
                        <DollarSign className="h-4 w-4 text-primary" />
                        <div>
                          <p className="text-sm font-medium">${promo.discount_amount}</p>
                          <p className="text-xs text-muted-foreground">Descuento fijo</p>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Fechas */}
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">
                        {format(new Date(promo.valid_from), "dd/MM", { locale: es })} -{" "}
                        {format(new Date(promo.valid_until), "dd/MM", { locale: es })}
                      </p>
                      <p className="text-xs text-muted-foreground">Vigencia</p>
                    </div>
                  </div>

                  {/* Usos */}
                  {promo.max_uses && (
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">
                          {promo.current_uses}/{promo.max_uses}
                        </p>
                        <p className="text-xs text-muted-foreground">Usos</p>
                      </div>
                    </div>
                  )}

                  {/* Días */}
                  <div>
                    <p className="text-sm font-medium">
                      {promo.applicable_days.length === 7
                        ? "Todos los días"
                        : `${promo.applicable_days.length} días/semana`}
                    </p>
                    <p className="text-xs text-muted-foreground">Disponibilidad</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {editingPromo && (
        <PromocionDialog
          open={!!editingPromo}
          onOpenChange={(open) => !open && setEditingPromo(null)}
          comercioId={comercioId}
          servicios={servicios}
          promocion={editingPromo}
        />
      )}
    </>
  )
}
