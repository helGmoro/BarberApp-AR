import express from "express"
import { supabase } from "../config/supabase.js"
import { authenticateUser } from "../middleware/auth.js"

const router = express.Router()

// Obtener turnos del usuario autenticado
router.get("/mis-turnos", authenticateUser, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("turnos")
      .select(`
        *,
        negocios(nombre, direccion, telefono),
        servicios(nombre, precio)
      `)
      .eq("cliente_id", req.user.id)
      .order("fecha", { ascending: true })
      .order("hora_inicio", { ascending: true })

    if (error) throw error

    res.json(data)
  } catch (error) {
    console.error("[v0] Error fetching turnos:", error)
    res.status(500).json({ error: "Error al obtener turnos" })
  }
})

// Obtener turnos de un negocio (para propietarios)
router.get("/negocio/:negocioId", authenticateUser, async (req, res) => {
  try {
    const { negocioId } = req.params

    // Verificar que el negocio pertenece al usuario
    const { data: negocio, error: negocioError } = await supabase
      .from("negocios")
      .select("user_id")
      .eq("id", negocioId)
      .single()

    if (negocioError || !negocio || negocio.user_id !== req.user.id) {
      return res.status(403).json({ error: "No autorizado" })
    }

    const { data, error } = await supabase
      .from("turnos")
      .select(`
        *,
        servicios(nombre, precio),
        perfiles(nombre_completo, telefono)
      `)
      .eq("negocio_id", negocioId)
      .order("fecha", { ascending: true })
      .order("hora_inicio", { ascending: true })

    if (error) throw error

    res.json(data)
  } catch (error) {
    console.error("[v0] Error fetching turnos negocio:", error)
    res.status(500).json({ error: "Error al obtener turnos del negocio" })
  }
})

// Crear un turno
router.post("/", authenticateUser, async (req, res) => {
  try {
    const { negocio_id, servicio_id, fecha, hora_inicio, hora_fin, notas } = req.body

    // Obtener precio del servicio
    const { data: servicio, error: servicioError } = await supabase
      .from("servicios")
      .select("precio")
      .eq("id", servicio_id)
      .single()

    if (servicioError) throw servicioError

    const { data, error } = await supabase
      .from("turnos")
      .insert({
        negocio_id,
        servicio_id,
        cliente_id: req.user.id,
        fecha,
        hora_inicio,
        hora_fin,
        precio_total: servicio.precio,
        notas,
        estado: "pendiente",
      })
      .select()
      .single()

    if (error) throw error

    res.status(201).json(data)
  } catch (error) {
    console.error("[v0] Error creating turno:", error)
    res.status(500).json({ error: "Error al crear turno" })
  }
})

// Actualizar estado de un turno
router.put("/:id", authenticateUser, async (req, res) => {
  try {
    const { id } = req.params
    const { estado, pagado, metodo_pago } = req.body

    const { data, error } = await supabase
      .from("turnos")
      .update({ estado, pagado, metodo_pago })
      .eq("id", id)
      .select()
      .single()

    if (error) throw error

    res.json(data)
  } catch (error) {
    console.error("[v0] Error updating turno:", error)
    res.status(500).json({ error: "Error al actualizar turno" })
  }
})

// Cancelar un turno
router.delete("/:id", authenticateUser, async (req, res) => {
  try {
    const { id } = req.params

    const { data, error } = await supabase
      .from("turnos")
      .update({ estado: "cancelado" })
      .eq("id", id)
      .eq("cliente_id", req.user.id)
      .select()
      .single()

    if (error) throw error

    res.json({ message: "Turno cancelado", data })
  } catch (error) {
    console.error("[v0] Error canceling turno:", error)
    res.status(500).json({ error: "Error al cancelar turno" })
  }
})

export default router
