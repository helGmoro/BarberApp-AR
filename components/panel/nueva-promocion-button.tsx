"use client"

import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useState } from "react"
import { PromocionDialog } from "./promocion-dialog"

interface NuevaPromocionButtonProps {
  comercioId: string
  servicios: Array<{ id: string; name: string }>
}

export function NuevaPromocionButton({ comercioId, servicios }: NuevaPromocionButtonProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <Plus className="mr-2 h-4 w-4" />
        Nueva Promoción
      </Button>

      <PromocionDialog
        open={open}
        onOpenChange={setOpen}
        comercioId={comercioId}
        servicios={servicios}
      />
    </>
  )
}
