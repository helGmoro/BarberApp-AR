import express from "express"
import { supabase } from "../config/supabase.js"
import { authenticateUser, requirePropietario } from "../middleware/auth.js"

const router = express.Router()

// Obtener todos los negocios activos (público)
router.get("/", async (req, res) => {
  try {
    const { data, error } = await supabase.from("negocios").select("*").eq("activo", true).order("nombre")

    if (error) throw error

    res.json(data)
  } catch (error) {
    console.error("[v0] Error fetching negocios:", error)
    res.status(500).json({ error: "Error al obtener negocios" })
  }
})

// Obtener un negocio por ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params

    const { data, error } = await supabase.from("negocios").select("*").eq("id", id).single()

    if (error) throw error

    if (!data) {
      return res.status(404).json({ error: "Negocio no encontrado" })
    }

    res.json(data)
  } catch (error) {
    console.error("[v0] Error fetching negocio:", error)
    res.status(500).json({ error: "Error al obtener negocio" })
  }
})

// Crear un negocio (solo propietarios autenticados)
router.post("/", authenticateUser, requirePropietario, async (req, res) => {
  try {
    const {
      nombre,
      descripcion,
      direccion,
      telefono,
      email,
      horario_apertura,
      horario_cierre,
      dias_laborales,
      imagen_url,
    } = req.body

    const { data, error } = await supabase
      .from("negocios")
      .insert({
        user_id: req.user.id,
        nombre,
        descripcion,
        direccion,
        telefono,
        email,
        horario_apertura,
        horario_cierre,
        dias_laborales,
        imagen_url,
      })
      .select()
      .single()

    if (error) throw error

    res.status(201).json(data)
  } catch (error) {
    console.error("[v0] Error creating negocio:", error)
    res.status(500).json({ error: "Error al crear negocio" })
  }
})

// Actualizar un negocio (solo el propietario)
router.put("/:id", authenticateUser, requirePropietario, async (req, res) => {
  try {
    const { id } = req.params
    const updates = req.body

    // Verificar que el negocio pertenece al usuario
    const { data: negocio, error: fetchError } = await supabase.from("negocios").select("user_id").eq("id", id).single()

    if (fetchError || !negocio) {
      return res.status(404).json({ error: "Negocio no encontrado" })
    }

    if (negocio.user_id !== req.user.id) {
      return res.status(403).json({ error: "No autorizado" })
    }

    const { data, error } = await supabase.from("negocios").update(updates).eq("id", id).select().single()

    if (error) throw error

    res.json(data)
  } catch (error) {
    console.error("[v0] Error updating negocio:", error)
    res.status(500).json({ error: "Error al actualizar negocio" })
  }
})

// Obtener negocios del propietario autenticado
router.get("/mis-negocios/lista", authenticateUser, requirePropietario, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("negocios")
      .select("*")
      .eq("user_id", req.user.id)
      .order("created_at", { ascending: false })

    if (error) throw error

    res.json(data)
  } catch (error) {
    console.error("[v0] Error fetching mis negocios:", error)
    res.status(500).json({ error: "Error al obtener tus negocios" })
  }
})

export default router
