import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, DollarSign } from "lucide-react"
import Image from "next/image"

interface ServiciosSectionProps {
  servicios: Array<{
    id: string
    name: string
    description: string | null
    price: number
    duration_minutes: number
    image_url: string | null
    is_active: boolean
  }>
}

export function ServiciosSection({ servicios }: ServiciosSectionProps) {
  const serviciosActivos = servicios.filter((s) => s.is_active)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Servicios Disponibles</CardTitle>
      </CardHeader>
      <CardContent>
        {serviciosActivos.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">No hay servicios disponibles en este momento</p>
        ) : (
          <div className="space-y-4">
            {serviciosActivos.map((servicio) => (
              <div key={servicio.id} className="flex gap-4 p-4 rounded-lg border hover:bg-muted/50 transition-colors">
                {servicio.image_url && (
                  <div className="relative h-20 w-20 rounded-md overflow-hidden flex-shrink-0">
                    <Image
                      src={servicio.image_url || "/placeholder.svg"}
                      alt={servicio.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-lg mb-1">{servicio.name}</h4>
                  {servicio.description && <p className="text-sm text-muted-foreground mb-3">{servicio.description}</p>}
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>{servicio.duration_minutes} min</span>
                    </div>
                    <div className="flex items-center gap-1 font-semibold text-primary">
                      <DollarSign className="h-4 w-4" />
                      <span>${servicio.price.toLocaleString("es-AR")}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
