"use client"

import { useState } from "react"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Loader2, CheckCircle2 } from "lucide-react"
import { useRouter } from "next/navigation"

interface HorariosFormProps {
  comercioId: string
  businessHours: {
    [key: string]: {
      open: string
      close: string
      closed: boolean
      breaks?: Array<{ start: string; end: string }>
    }
  }
}

const DIAS = ["lunes", "martes", "miercoles", "jueves", "viernes", "sabado", "domingo"]
const DIAS_LABEL: { [key: string]: string } = {
  lunes: "Lunes",
  martes: "Martes",
  miercoles: "Miércoles",
  jueves: "Jueves",
  viernes: "Viernes",
  sabado: "Sábado",
  domingo: "Domingo",
}

export function HorariosForm({ comercioId, businessHours: initialHours }: HorariosFormProps) {
  const supabase = getSupabaseBrowserClient()
  const router = useRouter()
  const [horarios, setHorarios] = useState(initialHours)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)

  const handleDayChange = (dia: string, field: string, value: any) => {
    setHorarios({
      ...horarios,
      [dia]: {
        ...horarios[dia],
        [field]: value,
      },
    })
  }

  const handleBreakChange = (dia: string, index: number, field: "start" | "end", value: string) => {
    const breaks = horarios[dia].breaks || []
    breaks[index] = { ...breaks[index], [field]: value }
    setHorarios({
      ...horarios,
      [dia]: {
        ...horarios[dia],
        breaks,
      },
    })
  }

  const addBreak = (dia: string) => {
    const breaks = horarios[dia].breaks || []
    breaks.push({ start: "13:00", end: "15:00" })
    setHorarios({
      ...horarios,
      [dia]: {
        ...horarios[dia],
        breaks,
      },
    })
  }

  const removeBreak = (dia: string, index: number) => {
    const breaks = (horarios[dia].breaks || []).filter((_, i) => i !== index)
    setHorarios({
      ...horarios,
      [dia]: {
        ...horarios[dia],
        breaks,
      },
    })
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSaved(false)
    try {
      const { error: updateError } = await supabase
        .from("comercios")
        .update({ business_hours: horarios })
        .eq("id", comercioId)
      if (updateError) {
        setError(updateError.message)
        return
      }
      setSaved(true)
      router.refresh()
    } catch (e) {
      setError("Error al guardar horarios")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Horarios de Atención</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSave} className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {saved && (
            <Alert>
              <CheckCircle2 className="h-4 w-4" />
              <AlertDescription>Horarios guardados correctamente.</AlertDescription>
            </Alert>
          )}
          {DIAS.map((dia) => {
            const config = horarios[dia] || { open: "09:00", close: "19:00", closed: false }
            return (
              <div key={dia} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-semibold">{DIAS_LABEL[dia]}</Label>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">{config.closed ? "Cerrado" : "Abierto"}</span>
                    <Switch
                      checked={!config.closed}
                      onCheckedChange={(checked) => handleDayChange(dia, "closed", !checked)}
                    />
                  </div>
                </div>
                {!config.closed && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <Label htmlFor={`${dia}-open`} className="text-xs">
                          Apertura
                        </Label>
                        <Input
                          id={`${dia}-open`}
                          type="time"
                          value={config.open}
                          onChange={(e) => handleDayChange(dia, "open", e.target.value)}
                        />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor={`${dia}-close`} className="text-xs">
                          Cierre
                        </Label>
                        <Input
                          id={`${dia}-close`}
                          type="time"
                          value={config.close}
                          onChange={(e) => handleDayChange(dia, "close", e.target.value)}
                        />
                      </div>
                    </div>
                    {config.breaks && config.breaks.length > 0 && (
                      <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground">Descansos</Label>
                        {config.breaks.map((breakItem, idx) => (
                          <div key={idx} className="grid grid-cols-2 gap-2">
                            <Input
                              type="time"
                              value={breakItem.start}
                              onChange={(e) => handleBreakChange(dia, idx, "start", e.target.value)}
                              className="text-sm"
                            />
                            <div className="flex gap-2">
                              <Input
                                type="time"
                                value={breakItem.end}
                                onChange={(e) => handleBreakChange(dia, idx, "end", e.target.value)}
                                className="text-sm"
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeBreak(dia, idx)}
                                className="px-2"
                              >
                                ✕
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    <Button type="button" variant="outline" size="sm" onClick={() => addBreak(dia)} className="w-full">
                      + Agregar Descanso
                    </Button>
                  </>
                )}
              </div>
            )
          })}
          <Button type="submit" disabled={loading} className="w-full">
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Guardar Horarios
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
