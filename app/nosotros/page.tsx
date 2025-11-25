import { DynamicHeader } from "@/components/home/dynamic-header"
import { Card, CardContent } from "@/components/ui/card"
import { Target, Users, Zap, Shield } from "lucide-react"

export default function NosotrosPage() {
  return (
    <div className="min-h-screen">
      <DynamicHeader />
      
      {/* Hero Section */}
      <section className="py-24 md:py-32 bg-gradient-to-br from-background via-background to-secondary/40">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Sobre BarberApp AR</h1>
            <p className="text-lg md:text-xl text-muted-foreground">
              Somos un equipo comprometido en simplificar la gestión de barberías en Argentina, 
              combinando tecnología moderna con las necesidades reales del sector.
            </p>
          </div>
        </div>
      </section>

      {/* Misión y Visión */}
      <section className="py-20 container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <Card>
            <CardContent className="pt-6">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Target className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-2xl font-bold mb-4">Nuestra Misión</h2>
              <p className="text-muted-foreground">
                Proporcionar una plataforma accesible y eficiente que permita a las barberías argentinas 
                profesionalizar su gestión, optimizar sus operaciones y ofrecer una experiencia superior 
                a sus clientes mediante herramientas digitales intuitivas.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-2xl font-bold mb-4">Nuestra Visión</h2>
              <p className="text-muted-foreground">
                Ser la plataforma líder en gestión digital para barberías en Argentina, reconocida por 
                nuestra transparencia, seguridad y compromiso con el crecimiento de los negocios locales 
                a través de soluciones tecnológicas adaptadas al mercado argentino.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Historia */}
      <section className="py-20 bg-secondary/20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">Nuestra Historia</h2>
            <div className="space-y-6 text-muted-foreground">
              <p>
                BarberApp AR nació de una necesidad real identificada en el sector de barberías argentinas: 
                la falta de herramientas digitales accesibles, completas y adaptadas al mercado local para 
                gestionar turnos y pagos de manera profesional.
              </p>
              <p>
                Observamos que muchas barberías dependían de métodos tradicionales como agendas físicas, 
                grupos de WhatsApp o soluciones extranjeras que no se adaptaban a las particularidades 
                del sistema de pagos y operación en Argentina.
              </p>
              <p>
                Decidimos crear una plataforma pensada desde y para Argentina, integrando los métodos de 
                pago locales, respetando la legislación nacional y ofreciendo una experiencia diseñada 
                específicamente para las necesidades de nuestros comercios y clientes.
              </p>
              <p>
                Comenzamos con las funcionalidades esenciales y evolucionamos continuamente basándonos en 
                el feedback real de nuestros usuarios, priorizando siempre la transparencia, la seguridad 
                y la facilidad de uso.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Valores */}
      <section className="py-20 container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">Nuestros Valores</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Shield className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Transparencia</h3>
                    <p className="text-sm text-muted-foreground">
                      Comunicamos claramente nuestros precios, comisiones y funcionamiento. 
                      Sin costos ocultos ni sorpresas.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Shield className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Seguridad</h3>
                    <p className="text-sm text-muted-foreground">
                      Protegemos los datos de nuestros usuarios con estándares de seguridad 
                      internacionales y cumplimos con la legislación argentina.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Compromiso Local</h3>
                    <p className="text-sm text-muted-foreground">
                      Desarrollamos pensando en las necesidades específicas del mercado argentino 
                      y apoyamos el crecimiento de negocios locales.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Zap className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Mejora Continua</h3>
                    <p className="text-sm text-muted-foreground">
                      Escuchamos activamente a nuestros usuarios y evolucionamos la plataforma 
                      basándonos en sus necesidades reales.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Equipo */}
      <section className="py-20 bg-secondary/20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Nuestro Equipo</h2>
            <p className="text-muted-foreground mb-8">
              Somos un equipo multidisciplinario de desarrolladores, diseñadores y especialistas en 
              gestión de negocios, unidos por la pasión de crear soluciones tecnológicas que generen 
              un impacto real en el día a día de las barberías argentinas.
            </p>
            <p className="text-muted-foreground">
              Trabajamos de manera ágil y colaborativa, siempre abiertos al feedback de nuestra comunidad 
              de usuarios para seguir mejorando la plataforma.
            </p>
          </div>
        </div>
      </section>

      {/* Contacto */}
      <section className="py-20 container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">¿Querés saber más?</h2>
          <p className="text-muted-foreground mb-8">
            Estamos siempre disponibles para responder tus consultas, escuchar tus sugerencias o 
            conversar sobre cómo podemos ayudarte a mejorar la gestión de tu barbería.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Card className="text-left">
              <CardContent className="pt-6">
                <p className="text-sm font-semibold mb-2">Email General</p>
                <p className="text-sm text-muted-foreground">soporte@barberapp.com.ar</p>
              </CardContent>
            </Card>
            <Card className="text-left">
              <CardContent className="pt-6">
                <p className="text-sm font-semibold mb-2">Email Comercial</p>
                <p className="text-sm text-muted-foreground">ventas@barberapp.com.ar</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}
