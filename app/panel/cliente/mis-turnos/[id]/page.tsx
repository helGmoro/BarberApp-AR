import { getSupabaseServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Clock, MapPin, Phone, Mail, User, DollarSign, ArrowLeft } from "lucide-react"
import Link from "next/link"

interface TurnoDetallePageProps {
  params: Promise<{
    id: string
  }>
}

export default async function TurnoDetallePage({ params }: TurnoDetallePageProps) {
  const { id } = await params
  const supabase = await getSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  // Obtener el turno con todos sus detalles
  const { data: turno } = await supabase
    .from("turnos")
    .select(`
      *,
      comercios (
        name,
        address,
        city,
        province,
        phone,
        email
      ),
      servicios (
        name,
        price,
        duration_minutes,
        description
      ),
      pagos (
        id,
        amount,
        payment_type,
        status,
        paid_at,
        is_instant_payment,
        discount_amount
      )
    `)
    .eq("id", id)
    .eq("cliente_id", user.id)
    .single()

  if (!turno) {
    redirect("/panel/cliente/mis-turnos")
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { label: string; variant: "default" | "secondary" | "outline" | "destructive" }> = {
      pending: { label: "Pendiente", variant: "outline" },
      pending_sena: { label: "Pago Pendiente", variant: "outline" },
      confirmed: { label: "Confirmado", variant: "default" },
      in_progress: { label: "En Progreso", variant: "secondary" },
      completed: { label: "Completado", variant: "secondary" },
      cancelled: { label: "Cancelado", variant: "destructive" },
      expired: { label: "Expirado", variant: "destructive" },
      no_show: { label: "No Asistió", variant: "destructive" },
    }
    const config = variants[status] || variants.pending
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  return (
    <div className="container max-w-4xl mx-auto py-6 px-4">
      <div className="mb-6">
        <Link href="/panel/cliente">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
        </Link>
      </div>

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Detalle del Turno</h1>
            <p className="text-muted-foreground">
              Reserva #{turno.id.slice(0, 8)}
            </p>
          </div>
          {getStatusBadge(turno.status)}
        </div>

        {/* Información del Comercio */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Comercio
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="font-semibold text-lg">{turno.comercios.name}</p>
              <p className="text-muted-foreground">
                {turno.comercios.address}, {turno.comercios.city}, {turno.comercios.province}
              </p>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{turno.comercios.phone}</span>
              </div>
              {turno.comercios.email && (
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{turno.comercios.email}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Fecha y Hora */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Fecha y Hora
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-6">
              <div>
                <p className="text-sm text-muted-foreground">Fecha</p>
                <p className="font-semibold text-lg">{turno.appointment_date}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Horario</p>
                <p className="font-semibold text-lg flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  {turno.appointment_time} - {turno.end_time}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Servicio */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Servicio Contratado
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="font-semibold text-lg">{turno.servicios.name}</p>
              {turno.servicios.description && (
                <p className="text-muted-foreground text-sm mt-1">{turno.servicios.description}</p>
              )}
            </div>
            <div className="flex items-center justify-between pt-3 border-t">
              <div>
                <p className="text-sm text-muted-foreground">Duración</p>
                <p className="font-medium">{turno.servicios.duration_minutes} minutos</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Precio</p>
                <p className="font-bold text-xl text-primary">
                  ${turno.servicios.price.toLocaleString('es-AR')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Información de Pago */}
        {(turno.payment_method === 'platform' || turno.pagos?.length > 0) && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Estado del Pago
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Método de pago:</span>
                <Badge variant="secondary">
                  {turno.payment_method === 'platform' ? 'Mercado Pago' : 'Pago en Local'}
                </Badge>
              </div>
              
              {turno.sena_paid && (
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Seña pagada:</span>
                  <Badge variant="default">Sí</Badge>
                </div>
              )}

              {turno.full_payment_paid && (
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Pago completo:</span>
                  <Badge variant="default">Sí</Badge>
                </div>
              )}

              {turno.instant_discount_applied && (
                <div className="flex items-center justify-between text-green-600">
                  <span>Descuento por pago instantáneo:</span>
                  <span className="font-semibold">Aplicado</span>
                </div>
              )}

              {/* Historial de pagos */}
              {turno.pagos && turno.pagos.length > 0 && (
                <div className="pt-3 border-t">
                  <p className="font-semibold mb-2">Historial de Pagos</p>
                  <div className="space-y-2">
                    {turno.pagos.map((pago: any) => (
                      <div key={pago.id} className="flex items-center justify-between text-sm p-2 bg-muted/50 rounded">
                        <div>
                          <p className="font-medium">
                            {pago.payment_type === 'sena' ? 'Seña' : pago.payment_type === 'completo' ? 'Pago Completo' : 'Resto'}
                          </p>
                          {pago.paid_at && (
                            <p className="text-xs text-muted-foreground">
                              {new Date(pago.paid_at).toLocaleString('es-AR')}
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">${pago.amount.toLocaleString('es-AR')}</p>
                          <Badge variant={pago.status === 'approved' ? 'default' : 'outline'} className="text-xs">
                            {pago.status === 'approved' ? 'Pagado' : 'Pendiente'}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Datos del Cliente */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Datos de Contacto
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Nombre:</span>
              <span className="font-medium">{turno.client_name}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Teléfono:</span>
              <span className="font-medium">{turno.client_phone}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Email:</span>
              <span className="font-medium">{turno.client_email}</span>
            </div>
          </CardContent>
        </Card>

        {/* Notas */}
        {turno.notes && (
          <Card>
            <CardHeader>
              <CardTitle>Notas Adicionales</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{turno.notes}</p>
            </CardContent>
          </Card>
        )}

        {/* Acciones */}
        {turno.status === 'pending_sena' && !turno.sena_paid && (
          <div className="flex gap-3">
            <Link href={`/panel/cliente/mis-turnos?pagar=${turno.id}`} className="flex-1">
              <Button className="w-full" size="lg">
                <DollarSign className="h-5 w-5 mr-2" />
                Pagar Ahora
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
