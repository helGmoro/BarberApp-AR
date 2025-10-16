import express from "express"
import { supabase } from "../config/supabase.js"

const router = express.Router()

// Registro de usuario
router.post("/register", async (req, res) => {
  try {
    const { email, password, nombre_completo, telefono, es_propietario } = req.body

    // Crear usuario en Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    })

    if (authError) {
      return res.status(400).json({ error: authError.message })
    }

    // Crear perfil del usuario
    const { error: perfilError } = await supabase.from("perfiles").insert({
      id: authData.user.id,
      nombre_completo,
      telefono,
      es_propietario: es_propietario || false,
    })

    if (perfilError) {
      console.error("[v0] Error creating profile:", perfilError)
    }

    res.status(201).json({
      message: "Usuario registrado exitosamente",
      user: authData.user,
      session: authData.session,
    })
  } catch (error) {
    console.error("[v0] Register error:", error)
    res.status(500).json({ error: "Error al registrar usuario" })
  }
})

// Login de usuario
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return res.status(401).json({ error: error.message })
    }

    // Obtener perfil del usuario
    const { data: perfil } = await supabase.from("perfiles").select("*").eq("id", data.user.id).single()

    res.json({
      message: "Login exitoso",
      user: data.user,
      session: data.session,
      perfil,
    })
  } catch (error) {
    console.error("[v0] Login error:", error)
    res.status(500).json({ error: "Error al iniciar sesión" })
  }
})

// Logout
router.post("/logout", async (req, res) => {
  try {
    const { error } = await supabase.auth.signOut()

    if (error) {
      return res.status(400).json({ error: error.message })
    }

    res.json({ message: "Logout exitoso" })
  } catch (error) {
    console.error("[v0] Logout error:", error)
    res.status(500).json({ error: "Error al cerrar sesión" })
  }
})

export default router
