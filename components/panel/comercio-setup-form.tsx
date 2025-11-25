"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { AlertCircle, Loader2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ProvinceCitySelector } from "@/components/ui/province-city-selector"

export function ComercioSetupForm({ userId }: { userId: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    address: "",
    city: "",
    province: "",
    phone: "",
    email: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const supabase = getSupabaseBrowserClient()

      const { error: insertError } = await supabase.from("comercios").insert({
        owner_id: userId,
        name: formData.name,
        description: formData.description,
        address: formData.address,
        city: formData.city,
        province: formData.province,
        phone: formData.phone,
        email: formData.email || null,
        subscription_plan: "free",
        subscription_status: "active",
      })

      if (insertError) {
        setError(insertError.message)
        return
      }

      router.push("/panel/comercio")
      router.refresh()
    } catch (err) {
      setError("Error al crear el comercio. Por favor, intentá nuevamente.")
    } finally {
      setLoading(false)
    }
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

      <Button type="submit" className="w-full" disabled={loading}>
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Crear Comercio
      </Button>
    </form>
  )
}
