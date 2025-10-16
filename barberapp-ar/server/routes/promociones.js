import express from "express"
import { supabase } from "../config/supabase.js"
import { authenticateUser, requirePropietario } from "../middleware/auth.js"

const router = express.Router()

// Obtener promociones activas de un negocio
router.get("/negocio/:negocioId", async (req, res) => {
  try {
    const { negocioId } = req.params
    const today = new Date().toISOString().split("T")[0]

    const { data, error } = await supabase
      .from("promociones")
      .select("*")
      .eq("negocio_id", negocioId)
      .eq("activo", true)
      .lte("fecha_inicio", today)
      .gte("fecha_fin", today)

    if (error) throw error

    res.json(data)
  } catch (error) {
    console.error("[v0] Error fetching promociones:", error)
    res.status(500).json({ error: "Error al obtener promociones" })
  }
})

// Crear una promoción (solo propietarios)
router.post("/", authenticateUser, requirePropietario, async (req, res) => {
  try {
    const { negocio_id, titulo, descripcion, descuento_porcentaje, descuento_monto, fecha_inicio, fecha_fin } = req.body

    // Verificar propiedad del negocio
    const { data: negocio, error: negocioError } = await supabase
      .from("negocios")
      .select("user_id")
      .eq("id", negocio_id)
      .single()

    if (negocioError || !negocio || negocio.user_id !== req.user.id) {
      return res.status(403).json({ error: "No autorizado" })
    }

    const { data, error } = await supabase
      .from("promociones")
      .insert({
        negocio_id,
        titulo,
        descripcion,
        descuento_porcentaje,
        descuento_monto,
        fecha_inicio,
        fecha_fin,
      })
      .select()
      .single()

    if (error) throw error

    res.status(201).json(data)
  } catch (error) {
    console.error("[v0] Error creating promocion:", error)
    res.status(500).json({ error: "Error al crear promoción" })
  }
})

export default router
