import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Star, User } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import Image from "next/image"

interface ReviewsSectionProps {
  reviews: Array<{
    id: string
    rating: number
    comment: string | null
    created_at: string
    profiles: {
      full_name: string
      avatar_url: string | null
    }
  }>
  avgRating: number
}

export function ReviewsSection({ reviews, avgRating }: ReviewsSectionProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Reseñas</CardTitle>
          {reviews.length > 0 && (
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 fill-primary text-primary" />
              <span className="font-semibold">{avgRating.toFixed(1)}</span>
              <span className="text-muted-foreground">({reviews.length})</span>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {reviews.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">Aún no hay reseñas para este comercio</p>
        ) : (
          <div className="space-y-6">
            {reviews.map((review) => (
              <div key={review.id} className="pb-6 border-b last:border-0 last:pb-0">
                <div className="flex items-start gap-3 mb-3">
                  {review.profiles.avatar_url ? (
                    <div className="relative h-10 w-10 rounded-full overflow-hidden flex-shrink-0">
                      <Image
                        src={review.profiles.avatar_url || "/placeholder.svg"}
                        alt={review.profiles.full_name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                      <User className="h-5 w-5 text-muted-foreground" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold">{review.profiles.full_name}</span>
                      <span className="text-sm text-muted-foreground">
                        {format(new Date(review.created_at), "dd MMM yyyy", { locale: es })}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 mb-2">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < review.rating ? "fill-primary text-primary" : "text-muted-foreground"
                          }`}
                        />
                      ))}
                    </div>
                    {review.comment && <p className="text-sm text-muted-foreground">{review.comment}</p>}
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
