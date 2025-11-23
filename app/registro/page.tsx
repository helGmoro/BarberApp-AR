import { RegisterForm } from "@/components/auth/register-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Scissors } from "lucide-react"
import Link from "next/link"

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-primary/5 via-background to-background">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <Scissors className="h-8 w-8 text-primary" />
            <span className="font-bold text-2xl">BarberApp AR</span>
          </Link>
          <p className="text-muted-foreground">Creá tu cuenta y comenzá hoy mismo</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Crear Cuenta</CardTitle>
            <CardDescription>Registrate para empezar a gestionar tu barbería</CardDescription>
          </CardHeader>
          <CardContent>
            <RegisterForm />
          </CardContent>
        </Card>

        <p className="text-center text-sm text-muted-foreground mt-4">
          ¿Ya tenés cuenta?{" "}
          <Link href="/login" className="text-primary hover:underline font-medium">
            Iniciá sesión
          </Link>
        </p>
      </div>
    </div>
  )
}
