"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface EditarServicioDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  servicio: {
    id: string
    name: string
    description: string | null
    price: number
    duration_minutes: number
  }
}

export function EditarServicioDialog({ open, onOpenChange, servicio }: EditarServicioDialogProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: servicio.name,
    description: servicio.description || "",
    price: servicio.price,
    duration_minutes: servicio.duration_minutes,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const supabase = getSupabaseBrowserClient()
      const { error } = await supabase
        .from("servicios")
        .update({
          name: formData.name,
          description: formData.description || null,
          price: formData.price,
          duration_minutes: formData.duration_minutes,
        })
        .eq("id", servicio.id)

      if (error) throw error

      toast({
        title: "Servicio actualizado",
        description: "Los cambios se guardaron correctamente",
      })

      router.refresh()
      onOpenChange(false)
    } catch (error) {
      console.error("[BarberApp] Error updating servicio:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo actualizar el servicio",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Editar Servicio</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-name">Nombre del Servicio *</Label>
            <Input
              id="edit-name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Ej: Corte de Cabello"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-description">Descripción (opcional)</Label>
            <Textarea
              id="edit-description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe brevemente el servicio..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-price">Precio ($) *</Label>
              <Input
                id="edit-price"
                type="number"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-duration">Duración (min) *</Label>
              <Input
                id="edit-duration"
                type="number"
                min="5"
                step="5"
                value={formData.duration_minutes}
                onChange={(e) => setFormData({ ...formData, duration_minutes: Number(e.target.value) })}
                required
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button type="submit" className="flex-1" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Guardar Cambios
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
