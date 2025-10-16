import { supabase } from "../config/supabase.js"

export const authenticateUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "No token provided" })
    }

    const token = authHeader.split(" ")[1]

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token)

    if (error || !user) {
      return res.status(401).json({ error: "Invalid token" })
    }

    req.user = user
    next()
  } catch (error) {
    console.error("[v0] Auth middleware error:", error)
    res.status(500).json({ error: "Authentication failed" })
  }
}

export const requirePropietario = async (req, res, next) => {
  try {
    const { data: perfil, error } = await supabase
      .from("perfiles")
      .select("es_propietario")
      .eq("id", req.user.id)
      .single()

    if (error || !perfil || !perfil.es_propietario) {
      return res.status(403).json({ error: "Access denied. Propietario role required." })
    }

    next()
  } catch (error) {
    console.error("[v0] Propietario middleware error:", error)
    res.status(500).json({ error: "Authorization failed" })
  }
}
