"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useState } from "react"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { Loader2, Calendar, Percent, DollarSign } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface PromocionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  comercioId: string
  servicios: Array<{ id: string; name: string }>
  promocion?: {
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
    is_active: boolean
    promo_code: string | null
  }
}

const DIAS = [
  { value: 0, label: "Dom" },
  { value: 1, label: "Lun" },
  { value: 2, label: "Mar" },
  { value: 3, label: "Mié" },
  { value: 4, label: "Jue" },
  { value: 5, label: "Vie" },
  { value: 6, label: "Sáb" },
]

export function PromocionDialog({ open, onOpenChange, comercioId, servicios, promocion }: PromocionDialogProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    title: promocion?.title || "",
    description: promocion?.description || "",
    discount_type: promocion?.discount_type || "percentage",
    discount_percentage: promocion?.discount_percentage || 10,
    discount_amount: promocion?.discount_amount || 1000,
    valid_from: promocion?.valid_from?.split("T")[0] || "",
    valid_until: promocion?.valid_until?.split("T")[0] || "",
    applicable_days: promocion?.applicable_days || [0, 1, 2, 3, 4, 5, 6],
    max_uses: promocion?.max_uses || null as number | null,
    is_active: promocion?.is_active ?? true,
    promo_code: promocion?.promo_code || "",
  })

  const toggleDia = (dia: number) => {
    if (formData.applicable_days.includes(dia)) {
      setFormData({
        ...formData,
        applicable_days: formData.applicable_days.filter((d) => d !== dia),
      })
    } else {
      setFormData({
        ...formData,
        applicable_days: [...formData.applicable_days, dia].sort(),
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.valid_from || !formData.valid_until) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Debes especificar las fechas de validez",
      })
      return
    }

    if (formData.applicable_days.length === 0) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Selecciona al menos un día de la semana",
      })
      return
    }

    setLoading(true)

    try {
      const supabase = getSupabaseBrowserClient()
      
      const dataToSave = {
        comercio_id: comercioId,
        title: formData.title,
        description: formData.description || null,
        discount_type: formData.discount_type,
        discount_percentage: formData.discount_type === "percentage" ? formData.discount_percentage : null,
        discount_amount: formData.discount_type === "fixed" ? formData.discount_amount : null,
        valid_from: new Date(formData.valid_from).toISOString(),
        valid_until: new Date(formData.valid_until + "T23:59:59").toISOString(),
        applicable_days: formData.applicable_days,
        max_uses: formData.max_uses,
        is_active: formData.is_active,
        promo_code: formData.promo_code || null,
      }

      let error
      if (promocion) {
        // Actualizar
        const result = await supabase
          .from("promociones")
          .update(dataToSave)
          .eq("id", promocion.id)
        error = result.error
      } else {
        // Crear
        const result = await supabase.from("promociones").insert(dataToSave)
        error = result.error
      }

      if (error) throw error

      toast({
        title: promocion ? "Promoción actualizada" : "Promoción creada",
        description: "Los cambios se guardaron correctamente",
      })

      router.refresh()
      onOpenChange(false)
    } catch (error: any) {
      console.error("[BarberApp] Error saving promocion:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "No se pudo guardar la promoción",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{promocion ? "Editar Promoción" : "Nueva Promoción"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Información básica */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Título de la Promoción *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Ej: 2x1 en Cortes de Cabello"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe los detalles de la promoción..."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="promo_code">Código Promocional (opcional)</Label>
              <Input
                id="promo_code"
                value={formData.promo_code}
                onChange={(e) => setFormData({ ...formData, promo_code: e.target.value.toUpperCase() })}
                placeholder="Ej: VERANO2025"
              />
              <p className="text-xs text-muted-foreground">Los clientes pueden usar este código al reservar</p>
            </div>
          </div>

          {/* Tipo de descuento */}
          <div className="space-y-3">
            <Label>Tipo de Descuento *</Label>
            <RadioGroup
              value={formData.discount_type}
              onValueChange={(value) => setFormData({ ...formData, discount_type: value })}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="percentage" id="percentage" />
                <Label htmlFor="percentage" className="font-normal flex items-center gap-2">
                  <Percent className="h-4 w-4" />
                  Porcentaje
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="fixed" id="fixed" />
                <Label htmlFor="fixed" className="font-normal flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Monto Fijo
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Valor del descuento */}
          <div className="space-y-2">
            {formData.discount_type === "percentage" ? (
              <>
                <Label htmlFor="discount_percentage">Porcentaje de Descuento (%) *</Label>
                <Input
                  id="discount_percentage"
                  type="number"
                  min="1"
                  max="100"
                  value={formData.discount_percentage}
                  onChange={(e) => setFormData({ ...formData, discount_percentage: Number(e.target.value) })}
                  required
                />
              </>
            ) : (
              <>
                <Label htmlFor="discount_amount">Monto de Descuento ($) *</Label>
                <Input
                  id="discount_amount"
                  type="number"
                  min="1"
                  step="0.01"
                  value={formData.discount_amount}
                  onChange={(e) => setFormData({ ...formData, discount_amount: Number(e.target.value) })}
                  required
                />
              </>
            )}
          </div>

          {/* Fechas de validez */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="valid_from" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Válida desde *
              </Label>
              <Input
                id="valid_from"
                type="date"
                value={formData.valid_from}
                onChange={(e) => setFormData({ ...formData, valid_from: e.target.value })}
                min={new Date().toISOString().split("T")[0]}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="valid_until" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Válida hasta *
              </Label>
              <Input
                id="valid_until"
                type="date"
                value={formData.valid_until}
                onChange={(e) => setFormData({ ...formData, valid_until: e.target.value })}
                min={formData.valid_from || new Date().toISOString().split("T")[0]}
                required
              />
            </div>
          </div>

          {/* Días aplicables */}
          <div className="space-y-3">
            <Label>Días de la semana en que aplica</Label>
            <div className="flex gap-2">
              {DIAS.map((dia) => (
                <Button
                  key={dia.value}
                  type="button"
                  variant={formData.applicable_days.includes(dia.value) ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleDia(dia.value)}
                  className="flex-1"
                >
                  {dia.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Límite de usos */}
          <div className="space-y-2">
            <Label htmlFor="max_uses">Límite de usos (opcional)</Label>
            <Input
              id="max_uses"
              type="number"
              min="1"
              value={formData.max_uses || ""}
              onChange={(e) => setFormData({ ...formData, max_uses: e.target.value ? Number(e.target.value) : null })}
              placeholder="Sin límite"
            />
            <p className="text-xs text-muted-foreground">
              Deja vacío para permitir usos ilimitados
            </p>
          </div>

          {/* Estado activo */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <Label htmlFor="is_active">Promoción Activa</Label>
              <p className="text-sm text-muted-foreground">
                {formData.is_active ? "Visible para los clientes" : "Oculta temporalmente"}
              </p>
            </div>
            <Switch
              id="is_active"
              checked={formData.is_active}
              onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
            />
          </div>

          {/* Botones */}
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
              {promocion ? "Guardar Cambios" : "Crear Promoción"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
