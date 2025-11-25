import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar, TrendingUp, CreditCard, BarChart3, Scissors, Users, Clock, Shield, Sparkles } from "lucide-react"
import Link from "next/link"
import { DynamicHeader } from "@/components/home/dynamic-header"
import { getSupabaseServerClient } from "@/lib/supabase/server"

export default async function HomePage() {
  const supabase = await getSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  const isLogged = !!user
  return (
    <div className="min-h-screen">
      {/* Header/Navbar */}
      <DynamicHeader />

      {/* Hero Section */}
      <section className="relative py-24 md:py-36 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,oklch(0.25_0_0)_0%,transparent_60%)]" />
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-secondary/40" />
        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-secondary text-secondary-foreground text-xs font-semibold tracking-wide mb-6 border border-border/60">
              <Sparkles className="h-4 w-4 text-primary" /> Versión Inicial • Creciendo con feedback real
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-balance leading-tight">
              Gestión profesional y <span className="text-primary">pagos seguros</span> para tu barbería
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 text-pretty">
              Agenda tus turnos, recibí pagos online de forma segura y brindá una experiencia profesional a tus clientes. Todo en una sola plataforma.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {isLogged ? (
                <Button size="lg" className="text-lg h-12 px-10" asChild>
                  <Link href="/panel">Ir al Panel</Link>
                </Button>
              ) : (
                <Button size="lg" className="text-lg h-12 px-10" asChild>
                  <Link href="/registro">Crear Cuenta</Link>
                </Button>
              )}
              <Button size="lg" variant="outline" className="text-lg h-12 px-10 bg-transparent border-primary/40 hover:bg-primary/10" asChild>
                <Link href="/buscar">Explorar Barberías</Link>
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-6 flex flex-wrap justify-center gap-x-4 gap-y-2">
              <span>Pagos seguros</span><span>Fácil de configurar</span><span>Soporte en español</span>
            </p>
          </div>
        </div>
      </section>

      {/* Trust / Why Section */}
      <section className="py-14 border-y bg-secondary/30 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-6">
            <Card className="bg-card/60 border-border/50">
              <CardContent className="pt-5">
                <Shield className="h-6 w-6 text-primary mb-3" />
                <h3 className="text-sm font-semibold mb-1">Transparente</h3>
                <p className="text-xs text-muted-foreground">Sin cifras inventadas. Evolucionamos con tus necesidades reales.</p>
              </CardContent>
            </Card>
            <Card className="bg-card/60 border-border/50">
              <CardContent className="pt-5">
                <CreditCard className="h-6 w-6 text-primary mb-3" />
                <h3 className="text-sm font-semibold mb-1">Pagos Seguros</h3>
                <p className="text-xs text-muted-foreground">Cobros directos a tu cuenta con separación automática de comisiones.</p>
              </CardContent>
            </Card>
            <Card className="bg-card/60 border-border/50">
              <CardContent className="pt-5">
                <Calendar className="h-6 w-6 text-primary mb-3" />
                <h3 className="text-sm font-semibold mb-1">Gestión Simple</h3>
                <p className="text-xs text-muted-foreground">Agenda rápida y confiable diseñada para el día a día de tu negocio.</p>
              </CardContent>
            </Card>
            <Card className="bg-card/60 border-border/50">
              <CardContent className="pt-5">
                <TrendingUp className="h-6 w-6 text-primary mb-3" />
                <h3 className="text-sm font-semibold mb-1">Escalable</h3>
                <p className="text-xs text-muted-foreground">Plataforma preparada para crecer junto con tu negocio.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="caracteristicas" className="py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Funcionalidades clave</h2>
            <p className="text-lg text-muted-foreground">Comenzamos con lo esencial y añadimos mejoras sobre feedback real.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardContent className="pt-6">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Gestión de Turnos</h3>
                <p className="text-muted-foreground">
                  Agenda inteligente con recordatorios automáticos y sincronización en tiempo real
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <CreditCard className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Pagos Directos</h3>
                <p className="text-muted-foreground">
                  Recibí los pagos directamente en tu cuenta. La plataforma retiene automáticamente su comisión de forma transparente
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <BarChart3 className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Balance Mensual</h3>
                <p className="text-muted-foreground">
                  Visualizá tus ingresos, comisiones y estadísticas de rendimiento en un dashboard
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Promociones</h3>
                <p className="text-muted-foreground">
                  Creá y publicá ofertas especiales para atraer más clientes a tu negocio
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Base de Clientes</h3>
                <p className="text-muted-foreground">
                  Gestioná tu cartera de clientes con historial completo y preferencias guardadas
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Horarios Flexibles</h3>
                <p className="text-muted-foreground">
                  Configurá tus horarios de atención y bloqueá días festivos o vacaciones
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="planes" className="py-20 md:py-32 bg-secondary/20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Precios simples desde el inicio</h2>
            <p className="text-lg text-muted-foreground">Comenzá gratis. Solo pagás cuando realmente necesitás más capacidad.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold mb-2">Plan Gratuito</h3>
                  <div className="flex items-baseline justify-center gap-2">
                    <span className="text-4xl font-bold">$0</span>
                    <span className="text-muted-foreground">/mes</span>
                  </div>
                </div>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start gap-2">
                    <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="h-2 w-2 rounded-full bg-primary" />
                    </div>
                    <span>Perfil de barbería visible</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="h-2 w-2 rounded-full bg-primary" />
                    </div>
                    <span>Hasta 20 turnos mensuales</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="h-2 w-2 rounded-full bg-primary" />
                    </div>
                    <span>Gestión básica de servicios</span>
                  </li>
                </ul>
                {isLogged ? (
                  <Button variant="outline" className="w-full bg-transparent" asChild>
                    <Link href="/panel">Ir al Panel</Link>
                  </Button>
                ) : (
                  <Button variant="outline" className="w-full bg-transparent" asChild>
                    <Link href="/registro?plan=free">Comenzar Gratis</Link>
                  </Button>
                )}
              </CardContent>
            </Card>

            <Card className="border-primary shadow-lg">
              <CardContent className="pt-6">
                <div className="absolute top-0 right-6 -translate-y-1/2">
                  <span className="bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">
                    Recomendado
                  </span>
                </div>
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold mb-2">Plan Premium</h3>
                  <div className="flex items-baseline justify-center gap-2">
                    <span className="text-4xl font-bold">$10.000</span>
                    <span className="text-muted-foreground">/mes</span>
                  </div>
                </div>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start gap-2">
                    <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="h-2 w-2 rounded-full bg-primary" />
                    </div>
                    <span className="font-medium">Turnos ilimitados</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="h-2 w-2 rounded-full bg-primary" />
                    </div>
                    <span className="font-medium">Dashboard con estadísticas</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="h-2 w-2 rounded-full bg-primary" />
                    </div>
                    <span className="font-medium">Balance mensual detallado</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="h-2 w-2 rounded-full bg-primary" />
                    </div>
                    <span className="font-medium">Gestión de promociones</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="h-2 w-2 rounded-full bg-primary" />
                    </div>
                    <span className="font-medium">Pagos online integrados</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="h-2 w-2 rounded-full bg-primary" />
                    </div>
                    <span className="font-medium">Soporte prioritario</span>
                  </li>
                </ul>
                {isLogged ? (
                  <Button className="w-full" asChild>
                    <Link href="/panel">Ir al Panel</Link>
                  </Button>
                ) : (
                  <Button className="w-full" asChild>
                    <Link href="/registro?plan=premium">Activar Premium</Link>
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-12 space-y-2">
            <p className="text-sm text-muted-foreground">
              Comisiones: Desde 3% en señas • Desde 5% en pagos completos (Abierto a variaciones)
            </p>
            <p className="text-xs text-muted-foreground">Los pagos van directamente a tu cuenta de Mercado Pago</p>
          </div>
        </div>
      </section>

      {/* Payments Section */}
      <section className="py-20 md:py-32 border-t">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Pagos simples y directos</h2>
            <p className="text-lg text-muted-foreground">Tus cobros entran a tu cuenta. La comisión se descuenta sola.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary">1</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">Vinculá tu cuenta</h3>
                <p className="text-sm text-muted-foreground">Configurá tus datos de cobro en minutos desde el panel</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 text-center">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary">2</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">Recibí Pagos Online</h3>
                <p className="text-sm text-muted-foreground">
                  Tus clientes pagan señas o servicios completos desde la web
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 text-center">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary">3</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">División Automática</h3>
                <p className="text-sm text-muted-foreground">
                  El dinero va a tu cuenta, la comisión se descuenta automáticamente
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="mt-12 max-w-3xl mx-auto">
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="pt-6">
                <h4 className="font-semibold mb-4 text-center">Ejemplo de Pago:</h4>
                <div className="grid md:grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Cliente Paga</p>
                    <p className="text-2xl font-bold">$5.000</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Comisión Plataforma</p>
                    <p className="text-2xl font-bold text-primary">$250</p>
                    <p className="text-xs text-muted-foreground">(5%)</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Recibís en tu cuenta</p>
                    <p className="text-2xl font-bold text-green-600">$4.750</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 md:py-32">
        <div className="container mx-auto px-4">
          <Card className="bg-gradient-to-br from-secondary/50 via-background to-background border-border/50">
            <CardContent className="py-16 px-6 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Construyamos tu flujo de trabajo</h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">Registrate y probá la versión inicial. Tu feedback ayuda a priorizar las siguientes mejoras.</p>
              {isLogged ? (
                <Button size="lg" className="text-lg h-12 px-8" asChild>
                  <Link href="/panel">Ir al Panel</Link>
                </Button>
              ) : (
                <Button size="lg" className="text-lg h-12 px-8" asChild>
                  <Link href="/registro">Crear Cuenta Gratis</Link>
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 bg-secondary/40">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Scissors className="h-5 w-5" />
                <span className="font-bold">BarberApp AR</span>
              </div>
              <p className="text-sm text-muted-foreground">Herramienta en evolución para la gestión de barberías. Sin claims exagerados.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Producto</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="#caracteristicas" className="hover:text-foreground transition-colors">
                    Características
                  </Link>
                </li>
                <li>
                  <Link href="#planes" className="hover:text-foreground transition-colors">
                    Planes
                  </Link>
                </li>
                <li>
                  <Link href="/buscar" className="hover:text-foreground transition-colors">
                    Explorar
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Empresa</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/nosotros" className="hover:text-foreground transition-colors">
                    Sobre Nosotros
                  </Link>
                </li>
                <li>
                  <Link href="/contacto" className="hover:text-foreground transition-colors">
                    Contacto
                  </Link>
                </li>
                <li>
                  <Link href="/ayuda" className="hover:text-foreground transition-colors">
                    Centro de Ayuda
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/terminos" className="hover:text-foreground transition-colors">
                    Términos y Condiciones
                  </Link>
                </li>
                <li>
                  <Link href="/privacidad" className="hover:text-foreground transition-colors">
                    Política de Privacidad
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} BarberApp AR. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
