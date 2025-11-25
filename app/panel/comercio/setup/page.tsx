import { getSupabaseServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { ComercioSetupForm } from "@/components/panel/comercio-setup-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Scissors } from "lucide-react"
import Link from "next/link"

export default async function ComercioSetupPage() {
  const supabase = await getSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  // Validar que el usuario sea de tipo comercio antes de permitir setup
  const { data: profile } = await supabase.from("profiles").select("user_type").eq("id", user.id).single()
  if (profile?.user_type !== "comercio") {
    redirect("/panel")
  }

  // Verificar si ya tiene un comercio
  const { data: existingComercio } = await supabase.from("comercios").select("id").eq("owner_id", user.id).single()

  if (existingComercio) {
    redirect("/panel/comercio")
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-primary/5 via-background to-background">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <Scissors className="h-8 w-8 text-primary" />
            <span className="font-bold text-2xl">BarberApp AR</span>
          </Link>
          <h1 className="text-3xl font-bold mb-2">Configurá tu Barbería</h1>
          <p className="text-muted-foreground">
            Completá la información de tu comercio para comenzar a recibir reservas
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Información del Comercio</CardTitle>
            <CardDescription>Esta información será visible para tus clientes</CardDescription>
          </CardHeader>
          <CardContent>
            <ComercioSetupForm userId={user.id} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
