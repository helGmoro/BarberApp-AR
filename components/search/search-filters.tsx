"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Search, MapPin } from "lucide-react"
import { useState } from "react"

const CIUDADES = ["Buenos Aires", "Córdoba", "Rosario", "Mendoza", "La Plata", "Mar del Plata", "Salta", "Tucumán"]

export function SearchFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "")
  const [selectedCiudad, setSelectedCiudad] = useState(searchParams.get("ciudad") || "")

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (searchQuery) params.set("q", searchQuery)
    if (selectedCiudad) params.set("ciudad", selectedCiudad)

    router.push(`/buscar?${params.toString()}`)
  }

  const handleReset = () => {
    setSearchQuery("")
    setSelectedCiudad("")
    router.push("/buscar")
  }

  return (
    <Card className="sticky top-20">
      <CardHeader>
        <CardTitle className="text-lg">Filtros de Búsqueda</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Búsqueda por nombre */}
        <div className="space-y-2">
          <Label htmlFor="search">Buscar por nombre</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="search"
              placeholder="Ej: Barbería Central"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="pl-9"
            />
          </div>
        </div>

        {/* Filtro por ciudad */}
        <div className="space-y-2">
          <Label htmlFor="ciudad">Ciudad</Label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <select
              id="ciudad"
              value={selectedCiudad}
              onChange={(e) => setSelectedCiudad(e.target.value)}
              className="w-full h-10 rounded-md border border-input bg-background px-9 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="">Todas las ciudades</option>
              {CIUDADES.map((ciudad) => (
                <option key={ciudad} value={ciudad}>
                  {ciudad}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Botones */}
        <div className="space-y-2 pt-2">
          <Button onClick={handleSearch} className="w-full">
            Aplicar Filtros
          </Button>
          <Button onClick={handleReset} variant="outline" className="w-full bg-transparent">
            Limpiar Filtros
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
