import { DynamicHeader } from "@/components/home/dynamic-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Search, Book, CreditCard, Calendar, Settings, Users, HelpCircle } from "lucide-react"

export default function AyudaPage() {
  return (
    <div className="min-h-screen">
      <DynamicHeader />
      
      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-background via-background to-secondary/40">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Centro de Ayuda</h1>
            <p className="text-lg text-muted-foreground mb-8">
              Encuentra respuestas a las preguntas más frecuentes sobre BarberApp AR
            </p>
            <div className="relative max-w-xl mx-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Buscar en la ayuda..."
                className="w-full pl-10 pr-4 py-3 rounded-lg border bg-background"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Categorías de Ayuda */}
      <section className="py-16 container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-8 text-center">Categorías</h2>
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-16">
          <Card className="cursor-pointer hover:border-primary transition-colors">
            <CardContent className="pt-6 text-center">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Book className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Primeros Pasos</h3>
              <p className="text-sm text-muted-foreground">Cómo crear tu cuenta y configurar tu perfil</p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:border-primary transition-colors">
            <CardContent className="pt-6 text-center">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Gestión de Turnos</h3>
              <p className="text-sm text-muted-foreground">Reservar, modificar y cancelar turnos</p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:border-primary transition-colors">
            <CardContent className="pt-6 text-center">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <CreditCard className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Pagos</h3>
              <p className="text-sm text-muted-foreground">Configuración y procesamiento de pagos</p>
            </CardContent>
          </Card>
        </div>

        {/* FAQ Para Clientes */}
        <div className="max-w-3xl mx-auto mb-16">
          <div className="flex items-center gap-2 mb-6">
            <Users className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold">Preguntas Frecuentes - Clientes</h2>
          </div>
          <Accordion type="single" collapsible className="space-y-4">
            <AccordionItem value="cliente-1">
              <AccordionTrigger className="text-left">
                ¿Cómo reservo un turno en una barbería?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground space-y-3">
                <p>Para reservar un turno:</p>
                <ol className="list-decimal list-inside space-y-2 ml-4">
                  <li>Ingresá a la sección "Buscar" desde el menú principal</li>
                  <li>Filtrá por provincia, ciudad o nombre de barbería</li>
                  <li>Seleccioná la barbería de tu preferencia</li>
                  <li>Hacé clic en "Reservar Turno"</li>
                  <li>Elegí el servicio, fecha y horario disponible</li>
                  <li>Completá tus datos de contacto</li>
                  <li>Si la barbería acepta pagos online, elegí tu método de pago preferido</li>
                  <li>Confirmá la reserva</li>
                </ol>
                <p>Recibirás una confirmación por email con los detalles de tu turno.</p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="cliente-2">
              <AccordionTrigger className="text-left">
                ¿Puedo cancelar o modificar mi turno?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground space-y-3">
                <p>Sí, podés gestionar tus turnos desde tu panel de cliente:</p>
                <ol className="list-decimal list-inside space-y-2 ml-4">
                  <li>Ingresá a "Panel" → "Mis Turnos"</li>
                  <li>Encontrá el turno que querés modificar o cancelar</li>
                  <li>Hacé clic en las opciones disponibles</li>
                </ol>
                <p className="text-sm">
                  <strong>Importante:</strong> Las políticas de cancelación y reembolso dependen de cada barbería. 
                  Verificá los términos antes de cancelar un turno con seña pagada.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="cliente-3">
              <AccordionTrigger className="text-left">
                ¿Es seguro pagar online?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground space-y-3">
                <p>
                  Absolutamente. Utilizamos procesadores de pago certificados y seguros que cumplen con 
                  los más altos estándares de seguridad en Argentina.
                </p>
                <p>Tus datos de tarjeta:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Están encriptados durante la transmisión</li>
                  <li>No son almacenados en nuestros servidores</li>
                  <li>Son procesados directamente por el proveedor de pagos</li>
                  <li>Cumplen con estándares PCI-DSS</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="cliente-4">
              <AccordionTrigger className="text-left">
                ¿Qué significa "Pago con seña" vs "Pago completo"?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground space-y-3">
                <p><strong>Pago con seña:</strong></p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Pagás un porcentaje del total del servicio para reservar tu turno</li>
                  <li>El resto lo pagás en el local después del servicio</li>
                  <li>La seña garantiza tu reserva</li>
                </ul>
                <p className="mt-3"><strong>Pago completo:</strong></p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Pagás el 100% del servicio online</li>
                  <li>No tenés que llevar dinero al local</li>
                  <li>Tu turno queda confirmado inmediatamente</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="cliente-5">
              <AccordionTrigger className="text-left">
                ¿Cómo sé si una barbería está verificada?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground space-y-3">
                <p>
                  Las barberías verificadas tienen un badge o insignia de verificación visible en su perfil. 
                  Esto indica que han sido revisadas y aprobadas por nuestro equipo.
                </p>
                <p>La verificación garantiza que:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>El comercio existe físicamente</li>
                  <li>La información es veraz y actualizada</li>
                  <li>Cumple con nuestros estándares de calidad</li>
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        {/* FAQ Para Comercios */}
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-2 mb-6">
            <Settings className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold">Preguntas Frecuentes - Comercios</h2>
          </div>
          <Accordion type="single" collapsible className="space-y-4">
            <AccordionItem value="comercio-1">
              <AccordionTrigger className="text-left">
                ¿Cómo creo mi perfil de barbería?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground space-y-3">
                <p>Para crear tu perfil de barbería:</p>
                <ol className="list-decimal list-inside space-y-2 ml-4">
                  <li>Registrate con tu email y contraseña</li>
                  <li>Ingresá a tu panel y hacé clic en "Convertir a Comercio"</li>
                  <li>Completá el formulario con los datos de tu barbería</li>
                  <li>Agregá servicios con precios y duraciones</li>
                  <li>Configurá tus horarios de atención</li>
                  <li>Activá la visibilidad pública cuando estés listo</li>
                </ol>
                <p className="text-sm">
                  Podés comenzar con el plan gratuito y actualizar a Premium cuando necesites más funcionalidades.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="comercio-2">
              <AccordionTrigger className="text-left">
                ¿Cómo configuro los pagos online?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground space-y-3">
                <p>Para activar pagos online:</p>
                <ol className="list-decimal list-inside space-y-2 ml-4">
                  <li>Ingresá a "Panel Comercio" → "Configuración"</li>
                  <li>En la sección de "Configuración de Pagos", activá "Aceptar pagos online"</li>
                  <li>Vinculá tu cuenta de pago siguiendo las instrucciones</li>
                  <li>Configurá tus preferencias de pago (seña, completo, o ambos)</li>
                  <li>Guardá los cambios</li>
                </ol>
                <p className="text-sm">
                  Los pagos van directamente a tu cuenta. La plataforma retiene automáticamente su comisión.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="comercio-3">
              <AccordionTrigger className="text-left">
                ¿Cuáles son las comisiones de la plataforma?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground space-y-3">
                <p>Las comisiones varían según el tipo de pago:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>Pagos con seña:</strong> Desde 3% (configurable por administración)</li>
                  <li><strong>Pagos completos:</strong> Desde 5% (configurable por administración)</li>
                </ul>
                <p>
                  La comisión se descuenta automáticamente al momento de la transferencia. 
                  Vos recibís el monto neto en tu cuenta.
                </p>
                <p className="text-sm mt-2">
                  <strong>Ejemplo:</strong> Si un cliente paga $5.000 completos con comisión del 5%, 
                  vos recibís $4.750 y la plataforma retiene $250.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="comercio-4">
              <AccordionTrigger className="text-left">
                ¿Qué diferencia hay entre el plan Gratuito y Premium?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground space-y-3">
                <p><strong>Plan Gratuito:</strong></p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Hasta 20 turnos mensuales</li>
                  <li>Perfil visible en búsquedas</li>
                  <li>Gestión básica de servicios</li>
                </ul>
                <p className="mt-3"><strong>Plan Premium ($10.000/mes):</strong></p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Turnos ilimitados</li>
                  <li>Dashboard con estadísticas</li>
                  <li>Balance mensual detallado</li>
                  <li>Gestión de promociones</li>
                  <li>Pagos online integrados</li>
                  <li>Soporte prioritario</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="comercio-5">
              <AccordionTrigger className="text-left">
                ¿Cómo solicito la verificación de mi barbería?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground space-y-3">
                <p>Para solicitar verificación:</p>
                <ol className="list-decimal list-inside space-y-2 ml-4">
                  <li>Asegurate de tener toda tu información completa y actualizada</li>
                  <li>Agregá fotos de calidad de tu local</li>
                  <li>Ingresá a "Panel Comercio" → "Configuración"</li>
                  <li>En la sección "Verificación", hacé clic en "Solicitar Verificación"</li>
                </ol>
                <p>
                  Un administrador revisará tu barbería en las próximas 48-72 horas. 
                  Te notificaremos por email cuando se apruebe o si necesitamos información adicional.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="comercio-6">
              <AccordionTrigger className="text-left">
                ¿Cómo gestiono los turnos de mis clientes?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground space-y-3">
                <p>Desde "Panel Comercio" → "Turnos" podés:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Ver todos los turnos agendados</li>
                  <li>Filtrar por fecha y estado</li>
                  <li>Confirmar turnos pendientes</li>
                  <li>Cancelar turnos si es necesario</li>
                  <li>Marcar turnos como completados</li>
                  <li>Ver información de contacto de los clientes</li>
                </ul>
                <p className="text-sm mt-2">
                  Los turnos se actualizan en tiempo real y recibís notificaciones de nuevas reservas.
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* Sección de Contacto */}
      <section className="py-16 bg-secondary/20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <HelpCircle className="h-12 w-12 text-primary mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">¿No encontraste lo que buscabas?</h2>
            <p className="text-muted-foreground mb-8">
              Nuestro equipo de soporte está disponible para ayudarte con cualquier consulta
            </p>
            <Button size="lg" asChild>
              <a href="/contacto">Contactar Soporte</a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
