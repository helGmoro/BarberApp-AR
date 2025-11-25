"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { AlertCircle, Loader2, Pencil, X } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ProvinceCitySelector } from "@/components/ui/province-city-selector"
import { useRouter } from "next/navigation"

interface Comercio {
  id: string
  name: string
  description: string | null
  address: string
  city: string
  province: string
  phone: string
  email: string | null
}

export function ComercioEditForm({ comercio }: { comercio: Comercio }) {
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const [formData, setFormData] = useState({
    name: comercio.name,
    description: comercio.description || "",
    address: comercio.address,
    city: comercio.city,
    province: comercio.province,
    phone: comercio.phone,
    email: comercio.email || "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const supabase = getSupabaseBrowserClient()

      const { error: updateError } = await supabase
        .from("comercios")
        .update({
          name: formData.name,
          description: formData.description || null,
          address: formData.address,
          city: formData.city,
          province: formData.province,
          phone: formData.phone,
          email: formData.email || null,
        })
        .eq("id", comercio.id)

      if (updateError) {
        setError(updateError.message)
        return
      }

      setSuccess(true)
      setIsEditing(false)
      router.refresh()

      // Limpiar mensaje de éxito después de 3 segundos
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      setError("Error al actualizar el comercio. Por favor, intentá nuevamente.")
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setFormData({
      name: comercio.name,
      description: comercio.description || "",
      address: comercio.address,
      city: comercio.city,
      province: comercio.province,
      phone: comercio.phone,
      email: comercio.email || "",
    })
    setIsEditing(false)
    setError(null)
  }

  if (!isEditing) {
    return (
      <div className="space-y-4">
        {success && (
          <Alert className="bg-green-50 border-green-200">
            <AlertDescription className="text-green-800">
              ✓ Datos actualizados correctamente
            </AlertDescription>
          </Alert>
        )}

        <div className="grid gap-4 md:grid-cols-2 text-sm">
          <div>
            <p className="text-muted-foreground">Nombre</p>
            <p className="font-medium">{comercio.name}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Provincia</p>
            <p className="font-medium">{comercio.province}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Ciudad</p>
            <p className="font-medium">{comercio.city}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Dirección</p>
            <p className="font-medium">{comercio.address}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Teléfono</p>
            <p className="font-medium">{comercio.phone}</p>
          </div>
          {comercio.email && (
            <div>
              <p className="text-muted-foreground">Email</p>
              <p className="font-medium">{comercio.email}</p>
            </div>
          )}
          {comercio.description && (
            <div className="md:col-span-2">
              <p className="text-muted-foreground">Descripción</p>
              <p className="font-medium">{comercio.description}</p>
            </div>
          )}
        </div>

        <Button onClick={() => setIsEditing(true)} variant="outline" size="sm">
          <Pencil className="h-4 w-4 mr-2" />
          Editar Información
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="name">Nombre del Comercio *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Ej: Barbería Central"
          required
          disabled={loading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Descripción</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Contanos sobre tu barbería..."
          rows={3}
          disabled={loading}
        />
      </div>

      <ProvinceCitySelector
        provinciaValue={formData.province}
        ciudadValue={formData.city}
        onProvinciaChange={(value) => setFormData({ ...formData, province: value })}
        onCiudadChange={(value) => setFormData({ ...formData, city: value })}
        required
        disabled={loading}
      />

      <div className="space-y-2">
        <Label htmlFor="address">Dirección *</Label>
        <Input
          id="address"
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          placeholder="Ej: Av. Corrientes 1234"
          required
          disabled={loading}
        />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="phone">Teléfono *</Label>
          <Input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="11 1234-5678"
            required
            disabled={loading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="contacto@tubarberia.com"
            disabled={loading}
          />
        </div>
      </div>

      <div className="flex gap-2">
        <Button type="submit" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Guardar Cambios
        </Button>
        <Button type="button" variant="outline" onClick={handleCancel} disabled={loading}>
          <X className="h-4 w-4 mr-2" />
          Cancelar
        </Button>
      </div>
    </form>
  )
}
