"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function CheckoutButton() {
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleCheckout = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/suscripcion/create-checkout", {
        method: "POST",
      })

      if (!response.ok) {
        throw new Error("Error al crear el checkout")
      }

      const data = await response.json()

      // Redirigir al checkout de Mercado Pago (o simulación en dev)
      window.location.href = data.initPoint
    } catch (error) {
      console.error("Error:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo procesar el pago. Intentá de nuevo.",
      })
      setLoading(false)
    }
  }

  return (
    <Button className="w-full mt-6" onClick={handleCheckout} disabled={loading}>
      {loading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Procesando...
        </>
      ) : (
        "Actualizar a Premium"
      )}
    </Button>
  )
}
