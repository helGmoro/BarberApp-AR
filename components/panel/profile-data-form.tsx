"use client"

import { useState } from "react"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Loader2, CheckCircle2, Pencil } from "lucide-react"
import { useRouter } from "next/navigation"

interface ProfileDataFormProps {
  profile: {
    id: string
    first_name: string | null
    last_name: string | null
    full_name: string | null
    phone: string | null
    dni: string | null
    email: string | null
    user_type: string | null
  }
}

export function ProfileDataForm({ profile }: ProfileDataFormProps) {
  const supabase = getSupabaseBrowserClient()
  const router = useRouter()
  const [firstName, setFirstName] = useState(profile.first_name || "")
  const [lastName, setLastName] = useState(profile.last_name || "")
  const [phone, setPhone] = useState(profile.phone || "")
  const [dni, setDni] = useState(profile.dni || "")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)
  const [isEditing, setIsEditing] = useState(false)

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSaved(false)
    try {
      const fullName = (firstName + " " + lastName).trim() || null
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ first_name: firstName || null, last_name: lastName || null, full_name: fullName, phone: phone || null, dni: dni || null })
        .eq("id", profile.id)
      if (updateError) {
        setError(updateError.message)
        return
      }
      setSaved(true)
      setIsEditing(false)
      router.refresh()
    } catch (e) {
      setError("Error al guardar cambios")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Datos del Perfil</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSave} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {saved && !isEditing && (
            <Alert className="border-success bg-success/10">
              <CheckCircle2 className="h-4 w-4 text-success" />
              <AlertDescription className="text-success-foreground">Datos guardados correctamente</AlertDescription>
            </Alert>
          )}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="firstName">Nombre</Label>
              <Input 
                id="firstName" 
                value={firstName} 
                onChange={(e) => setFirstName(e.target.value)} 
                placeholder="Juan"
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="lastName">Apellido</Label>
              <Input 
                id="lastName" 
                value={lastName} 
                onChange={(e) => setLastName(e.target.value)} 
                placeholder="Pérez"
                disabled={!isEditing}
              />
            </div>
          </div>
          <div className="space-y-1">
            <Label htmlFor="phone">Teléfono</Label>
            <Input 
              id="phone" 
              value={phone} 
              onChange={(e) => setPhone(e.target.value)} 
              placeholder="11 5555 5555"
              disabled={!isEditing}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="dni">DNI</Label>
            <Input 
              id="dni" 
              value={dni} 
              onChange={(e) => setDni(e.target.value)} 
              placeholder="12345678"
              disabled={!isEditing}
            />
          </div>
          
          {isEditing ? (
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setIsEditing(false)
                  setFirstName(profile.first_name || "")
                  setLastName(profile.last_name || "")
                  setPhone(profile.phone || "")
                  setDni(profile.dni || "")
                }}
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={loading} className="flex-1">
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Guardar Cambios
              </Button>
            </div>
          ) : (
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => {
                setIsEditing(true)
                setSaved(false)
              }}
            >
              <Pencil className="mr-2 h-4 w-4" />
              Editar Datos
            </Button>
          )}
        </form>
      </CardContent>
    </Card>
  )
}
