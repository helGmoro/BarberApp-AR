import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Phone, Mail, Star } from "lucide-react"
import Image from "next/image"

interface ComercioHeaderProps {
  comercio: {
    name: string
    description: string | null
    address: string
    city: string
    province: string
    phone: string
    email: string | null
    logo_url: string | null
    cover_image_url: string | null
    subscription_plan: string
    business_hours: any
  }
  avgRating: number
  reviewCount: number
}

export function ComercioHeader({ comercio, avgRating, reviewCount }: ComercioHeaderProps) {
  return (
    <div className="relative">
      {/* Cover Image */}
      <div className="relative h-64 md:h-80 bg-muted">
        {comercio.cover_image_url ? (
          <Image
            src={comercio.cover_image_url || "/placeholder.svg"}
            alt={comercio.name}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
      </div>

      {/* Info Card */}
      <div className="container mx-auto px-4">
        <Card className="relative -mt-20 p-6 md:p-8">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Logo */}
            {comercio.logo_url ? (
              <div className="relative h-24 w-24 md:h-32 md:w-32 rounded-lg overflow-hidden flex-shrink-0 border-4 border-background shadow-lg">
                <Image
                  src={comercio.logo_url || "/placeholder.svg"}
                  alt={comercio.name}
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="h-24 w-24 md:h-32 md:w-32 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 text-4xl">
                ✂️
              </div>
            )}

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold mb-2">{comercio.name}</h1>
                  {comercio.subscription_plan === "premium" && <Badge className="bg-primary">Premium</Badge>}
                </div>
              </div>

              {/* Rating */}
              {reviewCount > 0 && (
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center gap-1">
                    <Star className="h-5 w-5 fill-primary text-primary" />
                    <span className="font-semibold text-lg">{avgRating.toFixed(1)}</span>
                  </div>
                  <span className="text-muted-foreground">({reviewCount} reseñas)</span>
                </div>
              )}

              {/* Descripción */}
              {comercio.description && <p className="text-muted-foreground mb-4">{comercio.description}</p>}

              {/* Contacto */}
              <div className="grid md:grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4 flex-shrink-0" />
                  <span>
                    {comercio.address}, {comercio.city}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="h-4 w-4 flex-shrink-0" />
                  <span>{comercio.phone}</span>
                </div>
                {comercio.email && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="h-4 w-4 flex-shrink-0" />
                    <span>{comercio.email}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
