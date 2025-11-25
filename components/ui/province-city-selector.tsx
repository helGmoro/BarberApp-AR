"use client"

import { useState, useEffect } from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"

interface Provincia {
  id: string
  nombre: string
}

interface Ciudad {
  id: string
  nombre: string
}

interface ProvinceCitySelectorProps {
  provinciaValue?: string
  ciudadValue?: string
  onProvinciaChange: (value: string) => void
  onCiudadChange: (value: string) => void
  required?: boolean
  disabled?: boolean
  layout?: "row" | "column"
}

export function ProvinceCitySelector({
  provinciaValue,
  ciudadValue,
  onProvinciaChange,
  onCiudadChange,
  required = false,
  disabled = false,
  layout = "row",
}: ProvinceCitySelectorProps) {
  const [provincias, setProvincias] = useState<Provincia[]>([])
  const [ciudades, setCiudades] = useState<Ciudad[]>([])
  const [loadingProvincias, setLoadingProvincias] = useState(true)
  const [loadingCiudades, setLoadingCiudades] = useState(false)

  const provinciaOptions =
    provinciaValue && !provincias.some((provincia) => provincia.nombre === provinciaValue)
      ? [...provincias, { id: provinciaValue, nombre: provinciaValue }]
      : provincias

  const ciudadOptions =
    ciudadValue && !ciudades.some((ciudad) => ciudad.nombre === ciudadValue)
      ? [...ciudades, { id: ciudadValue, nombre: ciudadValue }]
      : ciudades

  // Cargar provincias al montar el componente
  useEffect(() => {
    const controller = new AbortController()

    async function fetchProvincias() {
      setLoadingProvincias(true)
      try {
        const response = await fetch(
          "https://apis.datos.gob.ar/georef/api/provincias?campos=id,nombre&max=24",
          { signal: controller.signal }
        )
        if (!response.ok) {
          throw new Error("No se pudieron cargar las provincias")
        }
        const data = await response.json()
        const provinciasOrdenadas = (data?.provincias || []).sort((a: Provincia, b: Provincia) =>
          a.nombre.localeCompare(b.nombre)
        )
        setProvincias(provinciasOrdenadas)
      } catch (error) {
        if ((error as Error).name !== "AbortError") {
          console.error("Error cargando provincias:", error)
        }
      } finally {
        setLoadingProvincias(false)
      }
    }

    fetchProvincias()

    return () => controller.abort()
  }, [])

  // Cargar ciudades cuando cambia la provincia
  useEffect(() => {
    if (!provinciaValue) {
      setCiudades([])
      return
    }

    const controller = new AbortController()

    async function fetchCiudades() {
      setLoadingCiudades(true)
      try {
        const response = await fetch(
          `https://apis.datos.gob.ar/georef/api/localidades?campos=id,nombre&max=5000&provincia=${encodeURIComponent(
            provinciaValue ?? ""
          )}`,
          { signal: controller.signal }
        )
        if (!response.ok) {
          throw new Error("No se pudieron cargar las ciudades")
        }
        const data = await response.json()
        const ciudadesOrdenadas = (data?.localidades || []).sort((a: Ciudad, b: Ciudad) =>
          a.nombre.localeCompare(b.nombre)
        )
        setCiudades(ciudadesOrdenadas)
      } catch (error) {
        if ((error as Error).name !== "AbortError") {
          console.error("Error cargando ciudades:", error)
        }
      } finally {
        setLoadingCiudades(false)
      }
    }

    fetchCiudades()

    return () => controller.abort()
  }, [provinciaValue])

  const handleProvinciaChange = (value: string) => {
    onProvinciaChange(value)
    // Limpiar ciudad cuando cambia provincia
    onCiudadChange("")
  }

  return (
    <div className={layout === "row" ? "grid gap-4 md:grid-cols-2" : "space-y-4"}>
      <div className="space-y-2">
        <Label htmlFor="provincia">
          Provincia {required && <span className="text-red-500">*</span>}
        </Label>
        <Select
          value={provinciaValue}
          onValueChange={handleProvinciaChange}
          disabled={disabled || loadingProvincias}
        >
          <SelectTrigger id="provincia">
            <SelectValue placeholder={loadingProvincias ? "Cargando..." : "Seleccionar provincia"} />
          </SelectTrigger>
          <SelectContent>
            {provinciaOptions.map((provincia) => (
              <SelectItem key={provincia.id} value={provincia.nombre}>
                {provincia.nombre}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="ciudad">
          Ciudad {required && <span className="text-red-500">*</span>}
        </Label>
        <Select
          value={ciudadValue}
          onValueChange={onCiudadChange}
          disabled={disabled || !provinciaValue || loadingCiudades}
        >
          <SelectTrigger id="ciudad">
            <SelectValue
              placeholder={
                !provinciaValue
                  ? "Seleccione provincia primero"
                  : loadingCiudades
                  ? "Cargando..."
                  : "Seleccionar ciudad"
              }
            />
          </SelectTrigger>
          <SelectContent>
            {ciudadOptions.map((ciudad) => (
              <SelectItem key={ciudad.id} value={ciudad.nombre}>
                {ciudad.nombre}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
