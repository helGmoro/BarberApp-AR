"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import { Loader2, Eye, EyeOff } from "lucide-react"

interface MercadoPagoFormProps {
  currentAccessToken: string
  currentCollectorId: string
  currentPublicKey: string
}

export function MercadoPagoForm({ currentAccessToken, currentCollectorId, currentPublicKey }: MercadoPagoFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [showToken, setShowToken] = useState(false)
  const [formData, setFormData] = useState({
    accessToken: currentAccessToken,
    collectorId: currentCollectorId,
    publicKey: currentPublicKey,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("/api/comercio/mercadopago", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error("Error al actualizar configuración")
      }

      alert("Configuración de Mercado Pago actualizada exitosamente")
      router.refresh()
    } catch (error) {
      alert("Error al actualizar configuración de Mercado Pago")
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="accessToken">Access Token</Label>
        <div className="flex gap-2">
          <Input
            id="accessToken"
            type={showToken ? "text" : "password"}
            value={formData.accessToken}
            onChange={(e) => setFormData({ ...formData, accessToken: e.target.value })}
            placeholder="APP_USR-..."
            required
          />
          <Button type="button" variant="outline" size="icon" onClick={() => setShowToken(!showToken)}>
            {showToken ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">Tu token de acceso de Mercado Pago (Producción)</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="collectorId">Collector ID</Label>
        <Input
          id="collectorId"
          type="text"
          value={formData.collectorId}
          onChange={(e) => setFormData({ ...formData, collectorId: e.target.value })}
          placeholder="123456789"
          required
        />
        <p className="text-xs text-muted-foreground">Tu ID de cobrador en Mercado Pago</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="publicKey">Public Key</Label>
        <Input
          id="publicKey"
          type="text"
          value={formData.publicKey}
          onChange={(e) => setFormData({ ...formData, publicKey: e.target.value })}
          placeholder="APP_USR-..."
          required
        />
        <p className="text-xs text-muted-foreground">Tu clave pública de Mercado Pago</p>
      </div>

      <Button type="submit" disabled={loading}>
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Guardar Configuración
      </Button>
    </form>
  )
}
