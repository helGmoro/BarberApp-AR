import { getSupabaseServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { PanelLayoutWrapper as PanelLayout } from "@/components/panel/panel-layout-wrapper"
import { UpgradePlan } from "@/components/panel/upgrade-plan"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CVUAliasForm } from "@/components/panel/cvu-alias-form"
import { CheckCircle2, XCircle, Wallet } from "lucide-react"
import { Badge } from "@/components/ui/badge"

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
    .select("mp_cvu, mp_alias, mp_account_type, accepts_online_payment, subscription_plan")
    .eq("owner_id", user.id)
    .single()

  // Verificar si tiene plan premium
  const isPremium = comercio?.subscription_plan === "premium"

  if (!isPremium) {
    return (
      <PanelLayout userType="comercio">
        <UpgradePlan feature="Integración con Mercado Pago" />
      </PanelLayout>
    )
  }

  const hasMP = !!(comercio?.mp_cvu || comercio?.mp_alias)

  return (
    <PanelLayout userType="comercio">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Integración con Mercado Pago</h1>
          <p className="text-muted-foreground">Vincula tu cuenta para recibir pagos directamente</p>
        </div>

        {/* Estado de Integración */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {hasMP ? (
                  <>
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    <div>
                      <CardTitle>Cuenta Vinculada</CardTitle>
                      <CardDescription>Tu cuenta de Mercado Pago está correctamente configurada</CardDescription>
                    </div>
                  </>
                ) : (
                  <>
                    <XCircle className="h-5 w-5 text-red-500" />
                    <div>
                      <CardTitle>Cuenta No Vinculada</CardTitle>
                      <CardDescription>Vincula tu cuenta para comenzar a recibir pagos</CardDescription>
                    </div>
                  </>
                )}
              </div>
              {hasMP && <Badge variant="secondary" className="flex items-center gap-1">
                <Wallet className="h-3 w-3" />
                Activa
              </Badge>}
            </div>
          </CardHeader>
          {hasMP && (
            <CardContent className="space-y-2">
              {comercio.mp_cvu && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">CVU:</span>
                  <code className="text-sm font-mono">{comercio.mp_cvu}</code>
                </div>
              )}
              {comercio.mp_alias && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Alias:</span>
                  <code className="text-sm font-mono">{comercio.mp_alias}</code>
                </div>
              )}
            </CardContent>
          )}
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
                  <p className="font-medium">Recibe pagos automáticamente</p>
                  <p className="text-sm text-muted-foreground">
                    Cada vez que un cliente paga un turno, el dinero se transfiere a tu cuenta
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium">Súper simple de configurar</p>
                  <p className="text-sm text-muted-foreground">
                    Solo necesitás tu CVU o Alias, igual que para recibir dinero por email
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium">Comisión transparente</p>
                  <p className="text-sm text-muted-foreground">
                    Solo se descuenta la comisión de la plataforma (3-5%)
                  </p>
                </div>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Formulario CVU/Alias */}
        <CVUAliasForm initialCVU={comercio?.mp_cvu || ""} initialAlias={comercio?.mp_alias || ""} />
      </div>
    </PanelLayout>
  )
}
