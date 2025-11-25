import { DynamicHeader } from "@/components/home/dynamic-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function TerminosPage() {
  return (
    <div className="min-h-screen">
      <DynamicHeader />
      
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8">Términos y Condiciones</h1>
        <p className="text-muted-foreground mb-8">
          Última actualización: {new Date().toLocaleDateString('es-AR')}
        </p>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>1. Aceptación de los Términos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-muted-foreground">
              <p>
                Al acceder y utilizar BarberApp AR (en adelante, "la Plataforma"), usted acepta estar sujeto a estos Términos y Condiciones. Si no está de acuerdo con alguna parte de estos términos, no debe utilizar nuestros servicios.
              </p>
              <p>
                BarberApp AR es una plataforma digital que conecta barberías con clientes, facilitando la gestión de turnos y pagos en línea en el territorio de la República Argentina.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>2. Uso de la Plataforma</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-muted-foreground">
              <p className="font-semibold text-foreground">2.1 Registro de Usuarios</p>
              <p>
                Para utilizar ciertos servicios de la Plataforma, deberá registrarse proporcionando información veraz, completa y actualizada. Es su responsabilidad mantener la confidencialidad de su cuenta y contraseña.
              </p>
              <p className="font-semibold text-foreground">2.2 Tipos de Usuarios</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Clientes:</strong> Personas que buscan y reservan servicios de barbería</li>
                <li><strong>Comercios:</strong> Barberías que ofrecen sus servicios a través de la Plataforma</li>
              </ul>
              <p className="font-semibold text-foreground">2.3 Uso Apropiado</p>
              <p>
                Usted se compromete a utilizar la Plataforma únicamente para fines lícitos y de conformidad con estos Términos. Queda prohibido:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Publicar información falsa o engañosa</li>
                <li>Intentar acceder a cuentas de otros usuarios</li>
                <li>Interferir con el funcionamiento de la Plataforma</li>
                <li>Usar la Plataforma para actividades fraudulentas</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>3. Servicios para Comercios</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-muted-foreground">
              <p className="font-semibold text-foreground">3.1 Planes y Suscripciones</p>
              <p>
                Los comercios pueden elegir entre diferentes planes de suscripción (Gratuito y Premium). Los precios y características de cada plan están detallados en la sección de Planes de nuestra página principal.
              </p>
              <p className="font-semibold text-foreground">3.2 Comisiones</p>
              <p>
                BarberApp AR cobra una comisión sobre las transacciones procesadas a través de la Plataforma. Los porcentajes son:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Señas: Desde 3% (configurable por administración)</li>
                <li>Pagos completos: Desde 5% (configurable por administración)</li>
              </ul>
              <p>
                Las comisiones se descuentan automáticamente al momento de la transferencia de fondos. Los comercios reciben el monto neto (total menos comisión) directamente en su cuenta.
              </p>
              <p className="font-semibold text-foreground">3.3 Verificación</p>
              <p>
                Los comercios pueden solicitar verificación oficial para aumentar la confianza de los clientes. La verificación está sujeta a revisión y aprobación por parte de BarberApp AR.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>4. Pagos y Transacciones</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-muted-foreground">
              <p className="font-semibold text-foreground">4.1 Procesamiento de Pagos</p>
              <p>
                Los pagos son procesados a través de proveedores de servicios de pago externos autorizados en Argentina. BarberApp AR no almacena información de tarjetas de crédito o débito.
              </p>
              <p className="font-semibold text-foreground">4.2 Responsabilidad</p>
              <p>
                El comercio es responsable de proveer el servicio contratado por el cliente. BarberApp AR actúa únicamente como intermediario para la gestión de turnos y pagos.
              </p>
              <p className="font-semibold text-foreground">4.3 Reembolsos</p>
              <p>
                Las políticas de cancelación y reembolso son establecidas por cada comercio. En caso de disputa, BarberApp AR puede mediar pero no garantiza reembolsos.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>5. Propiedad Intelectual</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-muted-foreground">
              <p>
                Todos los derechos de propiedad intelectual relacionados con la Plataforma, incluyendo pero no limitado a software, diseño, logos y contenido, son propiedad de BarberApp AR o sus licenciantes.
              </p>
              <p>
                Los usuarios conservan los derechos sobre el contenido que publican (fotos, descripciones de servicios, etc.), pero otorgan a BarberApp AR una licencia para usar dicho contenido dentro de la Plataforma.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>6. Limitación de Responsabilidad</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-muted-foreground">
              <p>
                BarberApp AR proporciona la Plataforma "tal cual" y no garantiza que esté libre de errores o interrupciones. No nos hacemos responsables por:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Daños indirectos o consecuenciales derivados del uso de la Plataforma</li>
                <li>Disputas entre clientes y comercios</li>
                <li>Pérdida de datos o información</li>
                <li>Servicios de terceros (procesadores de pago, hosting, etc.)</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>7. Modificaciones</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-muted-foreground">
              <p>
                BarberApp AR se reserva el derecho de modificar estos Términos y Condiciones en cualquier momento. Los cambios serán notificados a través de la Plataforma y entrarán en vigor inmediatamente después de su publicación.
              </p>
              <p>
                El uso continuado de la Plataforma después de las modificaciones constituye su aceptación de los nuevos términos.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>8. Legislación Aplicable</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-muted-foreground">
              <p>
                Estos Términos y Condiciones se rigen por las leyes de la República Argentina. Cualquier disputa será resuelta en los tribunales ordinarios de la Ciudad Autónoma de Buenos Aires.
              </p>
              <p>
                Los usuarios se someten expresamente a esta jurisdicción, renunciando a cualquier otro fuero que pudiera corresponderles.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>9. Contacto</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-muted-foreground">
              <p>
                Para consultas sobre estos Términos y Condiciones, puede contactarnos a través de:
              </p>
              <ul className="list-none space-y-2 ml-4">
                <li><strong>Email:</strong> soporte@barberapp.com.ar</li>
                <li><strong>Sección de Contacto:</strong> Disponible en nuestra plataforma</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
