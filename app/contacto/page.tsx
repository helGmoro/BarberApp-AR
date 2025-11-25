import { DynamicHeader } from "@/components/home/dynamic-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Mail, MessageSquare, Phone, MapPin } from "lucide-react"

export default function ContactoPage() {
  return (
    <div className="min-h-screen">
      <DynamicHeader />
      
      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-background via-background to-secondary/40">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Contacto</h1>
            <p className="text-lg text-muted-foreground">
              Estamos aquí para ayudarte. Envianos tu consulta y te responderemos a la brevedad.
            </p>
          </div>
        </div>
      </section>

      {/* Información de Contacto y Formulario */}
      <section className="py-16 container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Información de Contacto */}
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-6">Información de Contacto</h2>
              <p className="text-muted-foreground mb-8">
                Elegí el canal que prefieras para comunicarte con nosotros. Nuestro equipo está 
                disponible para resolver tus dudas y ayudarte a aprovechar al máximo la plataforma.
              </p>
            </div>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Email</h3>
                    <p className="text-sm text-muted-foreground mb-2">Soporte General</p>
                    <a href="mailto:soporte@barberapp.com.ar" className="text-sm text-primary hover:underline">
                      soporte@barberapp.com.ar
                    </a>
                    <p className="text-sm text-muted-foreground mt-3 mb-2">Consultas Comerciales</p>
                    <a href="mailto:ventas@barberapp.com.ar" className="text-sm text-primary hover:underline">
                      ventas@barberapp.com.ar
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <MessageSquare className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Horario de Atención</h3>
                    <p className="text-sm text-muted-foreground">
                      Lunes a Viernes: 9:00 - 18:00 hs
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Sábados: 10:00 - 14:00 hs
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Tiempo de respuesta promedio: 24-48 horas
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Ubicación</h3>
                    <p className="text-sm text-muted-foreground">
                      Buenos Aires, Argentina
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Servicio disponible en todo el territorio argentino
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Formulario de Contacto */}
          <Card>
            <CardHeader>
              <CardTitle>Envianos tu Consulta</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre Completo</Label>
                  <Input id="name" placeholder="Juan Pérez" required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="juan@ejemplo.com" required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Teléfono (opcional)</Label>
                  <Input id="phone" type="tel" placeholder="11 1234 5678" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Asunto</Label>
                  <Input id="subject" placeholder="¿En qué podemos ayudarte?" required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Mensaje</Label>
                  <Textarea 
                    id="message" 
                    placeholder="Contanos tu consulta con el mayor detalle posible..." 
                    rows={6}
                    required
                  />
                </div>

                <Button type="submit" className="w-full">
                  Enviar Mensaje
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  Al enviar este formulario, aceptás nuestra{" "}
                  <a href="/privacidad" className="text-primary hover:underline">
                    Política de Privacidad
                  </a>
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Preguntas Frecuentes Rápidas */}
      <section className="py-16 bg-secondary/20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4">¿Necesitás ayuda inmediata?</h2>
            <p className="text-muted-foreground mb-8">
              Visitá nuestro Centro de Ayuda para encontrar respuestas a las preguntas más frecuentes
            </p>
            <Button variant="outline" size="lg" asChild>
              <a href="/ayuda">Ir al Centro de Ayuda</a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
