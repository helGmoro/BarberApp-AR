import { LoginForm } from "@/components/auth/login-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle2, Scissors } from "lucide-react"
import Link from "next/link"

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ deleted?: string }>
}) {
  const params = await searchParams
  const accountDeleted = params?.deleted === "true"

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-primary/5 via-background to-background">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <Scissors className="h-8 w-8 text-primary" />
            <span className="font-bold text-2xl">BarberApp AR</span>
          </Link>
          <p className="text-muted-foreground">Bienvenido de vuelta</p>
        </div>

        {accountDeleted && (
          <Alert className="mb-4 border-green-500 bg-green-500/10">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            <AlertDescription className="text-green-900 dark:text-green-100">
              Tu cuenta ha sido eliminada exitosamente. Esperamos verte de nuevo pronto.
            </AlertDescription>
          </Alert>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Iniciar Sesión</CardTitle>
            <CardDescription>Ingresá tus credenciales para acceder a tu cuenta</CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm />
          </CardContent>
        </Card>

        <p className="text-center text-sm text-muted-foreground mt-4">
          ¿No tenés cuenta?{" "}
          <Link href="/registro" className="text-primary hover:underline font-medium">
            Registrate acá
          </Link>
        </p>
      </div>
    </div>
  )
}
