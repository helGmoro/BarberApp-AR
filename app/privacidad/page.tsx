import { DynamicHeader } from "@/components/home/dynamic-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function PrivacidadPage() {
  return (
    <div className="min-h-screen">
      <DynamicHeader />
      
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8">Política de Privacidad</h1>
        <p className="text-muted-foreground mb-8">
          Última actualización: {new Date().toLocaleDateString('es-AR')}
        </p>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>1. Información que Recopilamos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-muted-foreground">
              <p className="font-semibold text-foreground">1.1 Información de Registro</p>
              <p>
                Cuando crea una cuenta en BarberApp AR, recopilamos:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Nombre completo</li>
                <li>Dirección de correo electrónico</li>
                <li>Número de teléfono</li>
                <li>DNI (para comercios)</li>
                <li>Contraseña encriptada</li>
              </ul>
              
              <p className="font-semibold text-foreground">1.2 Información de Comercios</p>
              <p>
                Para comercios que ofrecen servicios, además recopilamos:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Nombre del comercio</li>
                <li>Dirección física</li>
                <li>Provincia y ciudad</li>
                <li>Información de servicios y precios</li>
                <li>Horarios de atención</li>
                <li>Datos de cuenta para pagos (CVU/Alias)</li>
              </ul>

              <p className="font-semibold text-foreground">1.3 Información de Uso</p>
              <p>
                Automáticamente recopilamos información sobre su uso de la plataforma:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Dirección IP</li>
                <li>Tipo de navegador</li>
                <li>Páginas visitadas</li>
                <li>Fecha y hora de acceso</li>
                <li>Acciones realizadas en la plataforma</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>2. Cómo Usamos su Información</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-muted-foreground">
              <p>
                Utilizamos la información recopilada para:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Proporcionar y mantener nuestros servicios</li>
                <li>Procesar reservas y pagos</li>
                <li>Enviar notificaciones sobre turnos y actualizaciones</li>
                <li>Mejorar la experiencia del usuario</li>
                <li>Prevenir fraude y garantizar seguridad</li>
                <li>Cumplir con obligaciones legales</li>
                <li>Analizar el uso de la plataforma para mejoras</li>
                <li>Contactarlo con información relevante sobre el servicio</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>3. Base Legal para el Procesamiento (Ley 25.326)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-muted-foreground">
              <p>
                De acuerdo con la Ley de Protección de Datos Personales de Argentina (Ley 25.326), procesamos sus datos personales bajo las siguientes bases legales:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Consentimiento:</strong> Al registrarse, usted consiente el procesamiento de sus datos</li>
                <li><strong>Ejecución de contrato:</strong> Para proveer los servicios solicitados</li>
                <li><strong>Obligación legal:</strong> Para cumplir con requisitos fiscales y legales</li>
                <li><strong>Interés legítimo:</strong> Para mejorar nuestros servicios y prevenir fraude</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>4. Compartir Información</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-muted-foreground">
              <p className="font-semibold text-foreground">4.1 Con Comercios</p>
              <p>
                Cuando reserva un turno, compartimos su información de contacto con el comercio para facilitar el servicio.
              </p>
              
              <p className="font-semibold text-foreground">4.2 Con Proveedores de Servicios</p>
              <p>
                Compartimos información con terceros que nos ayudan a operar la plataforma:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Procesadores de pago (para transacciones seguras)</li>
                <li>Servicios de hosting y almacenamiento</li>
                <li>Servicios de análisis</li>
                <li>Servicios de envío de emails</li>
              </ul>
              <p>
                Estos proveedores están obligados contractualmente a proteger su información.
              </p>

              <p className="font-semibold text-foreground">4.3 Requisitos Legales</p>
              <p>
                Podemos divulgar información si es requerido por ley o para:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Cumplir con procesos legales</li>
                <li>Hacer cumplir nuestros términos</li>
                <li>Proteger los derechos y seguridad de BarberApp AR y usuarios</li>
                <li>Prevenir fraude</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>5. Seguridad de Datos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-muted-foreground">
              <p>
                Implementamos medidas de seguridad técnicas y organizativas para proteger sus datos:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Encriptación de datos sensibles en tránsito y en reposo</li>
                <li>Contraseñas almacenadas con hash seguro</li>
                <li>Acceso restringido a datos personales</li>
                <li>Monitoreo regular de seguridad</li>
                <li>Auditorías periódicas de sistemas</li>
              </ul>
              <p>
                Sin embargo, ningún sistema es 100% seguro. No podemos garantizar la seguridad absoluta de sus datos.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>6. Sus Derechos (Ley 25.326)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-muted-foreground">
              <p>
                Conforme a la legislación argentina, usted tiene derecho a:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Acceso:</strong> Solicitar información sobre qué datos personales tenemos sobre usted</li>
                <li><strong>Rectificación:</strong> Corregir datos inexactos o incompletos</li>
                <li><strong>Supresión:</strong> Solicitar la eliminación de sus datos personales</li>
                <li><strong>Oposición:</strong> Oponerse al procesamiento de sus datos en ciertas circunstancias</li>
                <li><strong>Portabilidad:</strong> Recibir sus datos en formato estructurado</li>
                <li><strong>Revocación:</strong> Retirar su consentimiento en cualquier momento</li>
              </ul>
              <p>
                Para ejercer estos derechos, contáctenos en: <strong>privacidad@barberapp.com.ar</strong>
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>7. Retención de Datos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-muted-foreground">
              <p>
                Conservamos sus datos personales mientras:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Su cuenta esté activa</li>
                <li>Sea necesario para proveer servicios</li>
                <li>Sea requerido por obligaciones legales (ej: registros contables por 10 años)</li>
                <li>Sea necesario para resolver disputas</li>
              </ul>
              <p>
                Cuando elimina su cuenta, anonimizamos o eliminamos sus datos, excepto donde la ley requiera retención.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>8. Cookies y Tecnologías Similares</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-muted-foreground">
              <p>
                Utilizamos cookies y tecnologías similares para:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Mantener su sesión activa</li>
                <li>Recordar sus preferencias</li>
                <li>Analizar el tráfico del sitio</li>
                <li>Mejorar la experiencia del usuario</li>
              </ul>
              <p>
                Puede configurar su navegador para rechazar cookies, pero esto puede afectar la funcionalidad de la plataforma.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>9. Menores de Edad</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-muted-foreground">
              <p>
                BarberApp AR no está dirigido a menores de 18 años. No recopilamos intencionalmente datos de menores. Si descubrimos que hemos recopilado datos de un menor, los eliminaremos inmediatamente.
              </p>
              <p>
                Si es padre o tutor y cree que su hijo nos ha proporcionado datos, contáctenos de inmediato.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>10. Cambios a esta Política</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-muted-foreground">
              <p>
                Podemos actualizar esta Política de Privacidad periódicamente. Los cambios significativos serán notificados a través de:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Correo electrónico a su dirección registrada</li>
                <li>Notificación destacada en la plataforma</li>
                <li>Actualización de la fecha en la parte superior de esta página</li>
              </ul>
              <p>
                Le recomendamos revisar esta política periódicamente.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>11. Autoridad de Control</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-muted-foreground">
              <p>
                Si tiene preocupaciones sobre cómo manejamos sus datos personales, puede contactar a la Agencia de Acceso a la Información Pública de Argentina:
              </p>
              <ul className="list-none space-y-2 ml-4">
                <li><strong>Sitio web:</strong> www.argentina.gob.ar/aaip</li>
                <li><strong>Dirección:</strong> Av. Pte. Gral. Julio A. Roca 710, Piso 3°, CABA</li>
                <li><strong>Email:</strong> datospersonales@aaip.gob.ar</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>12. Contacto</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-muted-foreground">
              <p>
                Para consultas sobre esta Política de Privacidad o el tratamiento de sus datos personales:
              </p>
              <ul className="list-none space-y-2 ml-4">
                <li><strong>Email de Privacidad:</strong> privacidad@barberapp.com.ar</li>
                <li><strong>Email General:</strong> soporte@barberapp.com.ar</li>
                <li><strong>Formulario de Contacto:</strong> Disponible en nuestra plataforma</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
