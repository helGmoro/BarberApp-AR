"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

interface ConfigItem {
  id: string
  config_key: string
  config_value: string
  config_type: string
  description: string
}

export function ConfigForm({ configs }: { configs: ConfigItem[] }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [values, setValues] = useState<Record<string, string>>(
    configs.reduce(
      (acc, config) => ({
        ...acc,
        [config.config_key]: config.config_value,
      }),
      {},
    ),
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("/api/admin/config", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ configs: values }),
      })

      if (!response.ok) {
        throw new Error("Error al actualizar configuración")
      }

      alert("Configuración actualizada exitosamente")
      router.refresh()
    } catch (error) {
      alert("Error al actualizar configuración")
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {configs.map((config) => (
        <div key={config.id} className="space-y-2">
          <Label htmlFor={config.config_key}>{config.description}</Label>
          <div className="flex gap-4">
            <Input
              id={config.config_key}
              type={config.config_type === "number" ? "number" : "text"}
              value={values[config.config_key] || ""}
              onChange={(e) =>
                setValues({
                  ...values,
                  [config.config_key]: e.target.value,
                })
              }
              step={config.config_type === "number" ? "0.01" : undefined}
              className="max-w-xs"
            />
            {config.config_type === "number" && config.config_key.includes("percentage") && (
              <span className="flex items-center text-muted-foreground">%</span>
            )}
            {config.config_type === "number" && config.config_key.includes("amount") && (
              <span className="flex items-center text-muted-foreground">ARS</span>
            )}
          </div>
          <p className="text-xs text-muted-foreground">Clave: {config.config_key}</p>
        </div>
      ))}

      <Button type="submit" disabled={loading}>
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Guardar Configuración
      </Button>
    </form>
  )
}
