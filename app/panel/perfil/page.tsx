"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, AlertCircle, CheckCircle2, User } from "lucide-react"
import { Separator } from "@/components/ui/separator"

export default function PerfilPage() {
  const router = useRouter()
  const supabase = getSupabaseBrowserClient()
  
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    dni: "",
    phone: "",
  })

  const [emailData, setEmailData] = useState({
    newEmail: "",
  })

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const [currentEmail, setCurrentEmail] = useState("")

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push("/login")
        return
      }

      setCurrentEmail(user.email || "")

      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single()

      if (profile) {
        setProfileData({
          firstName: profile.first_name || "",
          lastName: profile.last_name || "",
          dni: profile.dni || "",
          phone: profile.phone || "",
        })
      }
    } catch (err) {
      console.error("Error cargando perfil:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    setSuccess(null)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { error: updateError } = await supabase
        .from("profiles")
        .upsert({
          id: user.id,
          email: user.email,
          first_name: profileData.firstName,
          last_name: profileData.lastName,
          dni: profileData.dni,
          phone: profileData.phone,
          updated_at: new Date().toISOString(),
        })

      if (updateError) throw updateError

      setSuccess("Perfil actualizado correctamente")
    } catch (err: any) {
      setError(err.message || "Error al guardar perfil")
    } finally {
      setSaving(false)
    }
  }

  const handleChangeEmail = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    setSuccess(null)

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        email: emailData.newEmail,
      })

      if (updateError) throw updateError

      setSuccess("Se envió un email de confirmación a tu nueva dirección")
      setEmailData({ newEmail: "" })
    } catch (err: any) {
      setError(err.message || "Error al cambiar email")
    } finally {
      setSaving(false)
    }
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    setSuccess(null)

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError("Las contraseñas no coinciden")
      setSaving(false)
      return
    }

    if (passwordData.newPassword.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres")
      setSaving(false)
      return
    }

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password: passwordData.newPassword,
      })

      if (updateError) throw updateError

      setSuccess("Contraseña actualizada correctamente")
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" })
    } catch (err: any) {
      setError(err.message || "Error al cambiar contraseña")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Mi Perfil</h1>
            <p className="text-muted-foreground">Administrá tu información personal y configuración de cuenta</p>
          </div>
        </div>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="mb-6 border-primary bg-primary/10">
          <CheckCircle2 className="h-4 w-4 text-primary" />
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-6">
        {/* Datos Personales */}
        <Card>
          <CardHeader>
            <CardTitle>Datos Personales</CardTitle>
            <CardDescription>Completá tu información de perfil</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Nombre</Label>
                  <Input
                    id="firstName"
                    value={profileData.firstName}
                    onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                    placeholder="Juan"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Apellido</Label>
                  <Input
                    id="lastName"
                    value={profileData.lastName}
                    onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                    placeholder="Pérez"
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dni">DNI</Label>
                  <Input
                    id="dni"
                    value={profileData.dni}
                    onChange={(e) => setProfileData({ ...profileData, dni: e.target.value })}
                    placeholder="12345678"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Teléfono</Label>
                  <Input
                    id="phone"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                    placeholder="+54 9 11 1234-5678"
                    required
                  />
                </div>
              </div>

              <Button type="submit" disabled={saving}>
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Guardar Cambios
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Cambiar Email */}
        <Card>
          <CardHeader>
            <CardTitle>Cambiar Email</CardTitle>
            <CardDescription>Email actual: {currentEmail}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleChangeEmail} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="newEmail">Nuevo Email</Label>
                <Input
                  id="newEmail"
                  type="email"
                  value={emailData.newEmail}
                  onChange={(e) => setEmailData({ newEmail: e.target.value })}
                  placeholder="nuevo@email.com"
                  required
                />
              </div>

              <Button type="submit" disabled={saving}>
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Actualizar Email
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Cambiar Contraseña */}
        <Card>
          <CardHeader>
            <CardTitle>Cambiar Contraseña</CardTitle>
            <CardDescription>Actualizá tu contraseña de acceso</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="newPassword">Nueva Contraseña</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  placeholder="••••••••"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar Nueva Contraseña</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  placeholder="••••••••"
                  required
                />
              </div>

              <Button type="submit" disabled={saving}>
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Cambiar Contraseña
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
