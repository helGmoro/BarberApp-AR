import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Star, Clock, DollarSign, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface ComercioCardProps {
  comercio: {
    id: string
    name: string
    description: string | null
    address: string
    city: string
    province: string
    logo_url: string | null
    cover_image_url: string | null
    subscription_plan: string
    is_verified?: boolean
    avgRating: number
    reviewCount: number
    servicios: Array<{
      id: string
      name: string
      price: number
      duration_minutes: number
    }>
  }
}

export function ComercioCard({ comercio }: ComercioCardProps) {
  const precioMin = comercio.servicios.length > 0 ? Math.min(...comercio.servicios.map((s) => s.price)) : 0

  return (
    <Link href={`/comercio/${comercio.id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
        {/* Imagen de portada */}
        <div className="relative h-40 bg-muted">
          {comercio.cover_image_url ? (
            <Image
              src={comercio.cover_image_url || "/placeholder.svg"}
              alt={comercio.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
              <div className="text-6xl">✂️</div>
            </div>
          )}
          <div className="absolute top-2 right-2 flex gap-2">
            {comercio.subscription_plan === "premium" && (
              <Badge className="bg-primary">Premium</Badge>
            )}
            {comercio.is_verified && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3 text-success" /> Verificado
              </Badge>
            )}
          </div>
        </div>

        <CardContent className="p-4">
          <div className="flex items-start gap-2 sm:gap-3 mb-3">
            {/* Logo */}
            {comercio.logo_url ? (
              <div className="relative h-10 w-10 sm:h-12 sm:w-12 rounded-full overflow-hidden flex-shrink-0 border-2 border-background shadow-sm">
                <Image
                  src={comercio.logo_url || "/placeholder.svg"}
                  alt={comercio.name}
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <span className="text-lg sm:text-xl">✂️</span>
              </div>
            )}

            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-base sm:text-lg leading-tight mb-1 truncate">{comercio.name}</h3>
              <div className="flex items-center gap-1 text-xs sm:text-sm text-muted-foreground">
                <MapPin className="h-3 w-3 flex-shrink-0" />
                <span className="truncate">{comercio.city}, {comercio.province}</span>
              </div>
            </div>
          </div>

          {/* Rating */}
          {comercio.reviewCount > 0 && (
            <div className="flex items-center gap-1 mb-3">
              <Star className="h-4 w-4 fill-primary text-primary" />
              <span className="font-medium">{comercio.avgRating}</span>
              <span className="text-sm text-muted-foreground">({comercio.reviewCount} reseñas)</span>
            </div>
          )}

          {/* Descripción */}
          {comercio.description && (
            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{comercio.description}</p>
          )}

          {/* Info adicional */}
          <div className="flex items-center justify-between text-sm pt-3 border-t">
            <div className="flex items-center gap-1 text-muted-foreground">
              <DollarSign className="h-4 w-4" />
              <span>Desde ${precioMin.toLocaleString("es-AR")}</span>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>{comercio.servicios.length} servicios</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
