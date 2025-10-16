import express from "express"
import { supabase } from "../config/supabase.js"
import { authenticateUser, requirePropietario } from "../middleware/auth.js"

const router = express.Router()

// Obtener servicios de un negocio
router.get("/negocio/:negocioId", async (req, res) => {
  try {
    const { negocioId } = req.params

    const { data, error } = await supabase
      .from("servicios")
      .select("*")
      .eq("negocio_id", negocioId)
      .eq("activo", true)
      .order("nombre")

    if (error) throw error

    res.json(data)
  } catch (error) {
    console.error("[v0] Error fetching servicios:", error)
    res.status(500).json({ error: "Error al obtener servicios" })
  }
})

// Crear un servicio (solo propietarios)
router.post("/", authenticateUser, requirePropietario, async (req, res) => {
  try {
    const { negocio_id, nombre, descripcion, duracion_minutos, precio } = req.body

    // Verificar que el negocio pertenece al usuario
    const { data: negocio, error: negocioError } = await supabase
      .from("negocios")
      .select("user_id")
      .eq("id", negocio_id)
      .single()

    if (negocioError || !negocio || negocio.user_id !== req.user.id) {
      return res.status(403).json({ error: "No autorizado" })
    }

    const { data, error } = await supabase
      .from("servicios")
      .insert({
        negocio_id,
        nombre,
        descripcion,
        duracion_minutos,
        precio,
      })
      .select()
      .single()

    if (error) throw error

    res.status(201).json(data)
  } catch (error) {
    console.error("[v0] Error creating servicio:", error)
    res.status(500).json({ error: "Error al crear servicio" })
  }
})

// Actualizar un servicio
router.put("/:id", authenticateUser, requirePropietario, async (req, res) => {
  try {
    const { id } = req.params
    const updates = req.body

    // Verificar propiedad del servicio
    const { data: servicio, error: fetchError } = await supabase
      .from("servicios")
      .select("negocio_id, negocios(user_id)")
      .eq("id", id)
      .single()

    if (fetchError || !servicio) {
      return res.status(404).json({ error: "Servicio no encontrado" })
    }

    if (servicio.negocios.user_id !== req.user.id) {
      return res.status(403).json({ error: "No autorizado" })
    }

    const { data, error } = await supabase.from("servicios").update(updates).eq("id", id).select().single()

    if (error) throw error

    res.json(data)
  } catch (error) {
    console.error("[v0] Error updating servicio:", error)
    res.status(500).json({ error: "Error al actualizar servicio" })
  }
})

// Eliminar (desactivar) un servicio
router.delete("/:id", authenticateUser, requirePropietario, async (req, res) => {
  try {
    const { id } = req.params

    const { data, error } = await supabase.from("servicios").update({ activo: false }).eq("id", id).select().single()

    if (error) throw error

    res.json({ message: "Servicio desactivado", data })
  } catch (error) {
    console.error("[v0] Error deleting servicio:", error)
    res.status(500).json({ error: "Error al eliminar servicio" })
  }
})

export default router
