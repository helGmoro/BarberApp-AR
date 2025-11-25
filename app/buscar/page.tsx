import { getSupabaseServerClient } from "@/lib/supabase/server"
import { SearchFilters } from "@/components/search/search-filters"
import { ComercioCard } from "@/components/search/comercio-card"
import { Scissors } from "lucide-react"
import Link from "next/link"

interface SearchParams {
  ciudad?: string
  servicio?: string
  q?: string
}

export default async function BuscarPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const params = await searchParams
  const supabase = await getSupabaseServerClient()

  // Construir query de búsqueda
  let query = supabase
    .from("comercios")
    .select(`
      id,
      name,
      description,
      address,
      city,
      logo_url,
      cover_image_url,
      subscription_plan,
      is_verified,
      servicios (
        id,
        name,
        price,
        duration_minutes
      ),
      reviews (
        rating
      )
    `)
    .eq("is_active", true)
    .order("created_at", { ascending: false })

  // Filtrar por ciudad
  if (params.ciudad) {
    query = query.eq("city", params.ciudad)
  }

  // Buscar por nombre
  if (params.q) {
    query = query.ilike("name", `%${params.q}%`)
  }

  const { data: comercios, error } = await query

  if (error) {
    console.error("[BarberApp] Error fetching comercios:", error)
  }

  // Calcular rating promedio para cada comercio
  const comerciosConRating =
    comercios?.map((comercio) => {
      const reviews = comercio.reviews || []
      const avgRating =
        reviews.length > 0 ? reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / reviews.length : 0
      return {
        ...comercio,
        avgRating: Math.round(avgRating * 10) / 10,
        reviewCount: reviews.length,
      }
    }) || []

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Scissors className="h-6 w-6" />
            <span className="font-bold text-xl">BarberApp AR</span>
          </Link>
          <nav className="flex items-center gap-4">
            <Link href="/panel/perfil" className="text-sm font-medium hover:text-primary transition-colors">
              Cuenta
            </Link>
          </nav>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Encontrá tu barbería perfecta</h1>
          <p className="text-muted-foreground">
            {comerciosConRating.length} barberías y peluquerías disponibles en Argentina
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Filtros */}
          <div className="lg:col-span-1">
            <SearchFilters />
          </div>

          {/* Resultados */}
          <div className="lg:col-span-3">
            {comerciosConRating.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No se encontraron barberías con los filtros seleccionados</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {comerciosConRating.map((comercio) => (
                  <ComercioCard key={comercio.id} comercio={comercio} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
