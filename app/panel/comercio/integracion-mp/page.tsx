import { getSupabaseServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { PanelLayout } from "@/components/panel/panel-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MercadoPagoForm } from "@/components/panel/mercadopago-form"
import { CheckCircle2, XCircle } from "lucide-react"

export default async function IntegracionMPPage() {
  const supabase = await getSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { data: profile } = await supabase.from("profiles").select("user_type").eq("id", user.id).single()

  if (profile?.user_type !== "comercio") {
    redirect("/panel")
  }

  const { data: comercio } = await supabase
    .from("comercios")
    .select("mercadopago_access_token, mercadopago_collector_id, mercadopago_public_key")
    .eq("owner_id", user.id)
    .single()

  const hasMP = !!(comercio?.mercadopago_access_token && comercio?.mercadopago_collector_id)

  return (
    <PanelLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Integración con Mercado Pago</h1>
          <p className="text-muted-foreground">Vincula tu cuenta para recibir pagos directamente</p>
        </div>

        {/* Estado de Integración */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {hasMP ? (
                <>
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  Cuenta Vinculada
                </>
              ) : (
                <>
                  <XCircle className="h-5 w-5 text-red-500" />
                  Cuenta No Vinculada
                </>
              )}
            </CardTitle>
            <CardDescription>
              {hasMP
                ? "Tu cuenta de Mercado Pago está correctamente configurada"
                : "Vincula tu cuenta para comenzar a recibir pagos"}
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Beneficios */}
        <Card>
          <CardHeader>
            <CardTitle>¿Por qué vincular Mercado Pago?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium">Recibe pagos directamente</p>
                  <p className="text-sm text-muted-foreground">El dinero llega a tu cuenta, no pasa por BarberApp AR</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium">División automática</p>
                  <p className="text-sm text-muted-foreground">
                    La comisión de la plataforma se descuenta automáticamente
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium">Sin retrasos</p>
                  <p className="text-sm text-muted-foreground">Retiras tu dinero cuando quieras desde Mercado Pago</p>
                </div>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Formulario */}
        <Card>
          <CardHeader>
            <CardTitle>Configurar Mercado Pago</CardTitle>
            <CardDescription>Ingresa las credenciales de tu cuenta de Mercado Pago</CardDescription>
          </CardHeader>
          <CardContent>
            <MercadoPagoForm
              currentAccessToken={comercio?.mercadopago_access_token || ""}
              currentCollectorId={comercio?.mercadopago_collector_id || ""}
              currentPublicKey={comercio?.mercadopago_public_key || ""}
            />
          </CardContent>
        </Card>

        {/* Instrucciones */}
        <Card>
          <CardHeader>
            <CardTitle>¿Cómo obtener tus credenciales?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ol className="space-y-3 list-decimal list-inside">
              <li className="text-sm">
                <strong>Ingresa a tu cuenta de Mercado Pago:</strong>{" "}
                <a
                  href="https://www.mercadopago.com.ar/developers/panel"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Panel de desarrolladores
                </a>
              </li>
              <li className="text-sm">
                <strong>Ve a "Tus integraciones"</strong> y crea o selecciona una aplicación
              </li>
              <li className="text-sm">
                <strong>Copia las credenciales:</strong>
                <ul className="ml-6 mt-2 space-y-1 list-disc">
                  <li>Access Token (Producción)</li>
                  <li>Collector ID</li>
                  <li>Public Key</li>
                </ul>
              </li>
              <li className="text-sm">
                <strong>Pégalas en el formulario</strong> de arriba y guarda los cambios
              </li>
            </ol>
          </CardContent>
        </Card>
      </div>
    </PanelLayout>
  )
}
