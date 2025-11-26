import { getSupabaseServerClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { ComercioHeader } from "@/components/comercio/comercio-header"
import { ServiciosSection } from "@/components/comercio/servicios-section"
import { ReservarTurnoSection } from "@/components/comercio/reservar-turno-section"
import { ReviewsSection } from "@/components/comercio/reviews-section"
import { Scissors } from "lucide-react"
import Link from "next/link"

export default async function ComercioPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await getSupabaseServerClient()

  // Obtener datos del comercio
  const { data: comercio, error } = await supabase
    .from("comercios")
    .select(`
      *,
      profiles!comercios_owner_id_fkey (
        full_name,
        phone
      ),
      servicios (
        id,
        name,
        description,
        price,
        duration_minutes,
        image_url,
        is_active
      ),
      reviews (
        id,
        rating,
        comment,
        created_at,
        profiles!reviews_cliente_id_fkey (
          full_name,
          avatar_url
        )
      )
    `)
    .eq("id", id)
    .eq("is_active", true)
    .single()

  if (error || !comercio) {
    notFound()
  }

  // DEBUG: Ver valores de configuración de pago
  console.log('[BarberApp] Comercio payment config:', {
    accepts_online_payment: comercio.accepts_online_payment,
    sena_percentage: comercio.sena_percentage,
    instant_payment_discount: comercio.instant_payment_discount,
    sena_expiration_hours: comercio.sena_expiration_hours,
  })

  // Calcular rating promedio
  const reviews = comercio.reviews || []
  const avgRating = reviews.length > 0 ? reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / reviews.length : 0

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-3 sm:px-4 h-14 sm:h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-1.5 sm:gap-2">
            <Scissors className="h-5 w-5 sm:h-6 sm:w-6" />
            <span className="font-bold text-lg sm:text-xl">BarberApp AR</span>
          </Link>
          <nav className="flex items-center gap-2 sm:gap-4">
            <Link href="/buscar" className="text-xs sm:text-sm font-medium hover:text-primary transition-colors">
              Buscar
            </Link>
            <Link href="/panel/perfil" className="text-xs sm:text-sm font-medium hover:text-primary transition-colors">
              Cuenta
            </Link>
          </nav>
        </div>
      </header>

      {/* Contenido principal */}
      <ComercioHeader comercio={comercio} avgRating={avgRating} reviewCount={reviews.length} />

      <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8">
        <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Columna principal */}
          <div className="lg:col-span-2 space-y-6 sm:space-y-8">
            <ServiciosSection servicios={comercio.servicios || []} />
            <ReviewsSection reviews={reviews} avgRating={avgRating} />
          </div>

          {/* Sidebar - Reservar turno */}
          <div className="lg:col-span-1">
            <ReservarTurnoSection
              comercioId={comercio.id}
              servicios={comercio.servicios || []}
              businessHours={comercio.business_hours}
              paymentConfig={{
                acceptsOnlinePayment: comercio.accepts_online_payment || false,
                senaPercentage: comercio.sena_percentage || 30,
                instantPaymentDiscount: comercio.instant_payment_discount || 0,
                senaExpirationHours: comercio.sena_expiration_hours || 24,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
