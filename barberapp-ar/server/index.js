import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import path from "path"
import { fileURLToPath } from "url"

// Importar rutas
import authRoutes from "./routes/auth.js"
import negociosRoutes from "./routes/negocios.js"
import serviciosRoutes from "./routes/servicios.js"
import turnosRoutes from "./routes/turnos.js"
import promocionesRoutes from "./routes/promociones.js"
import pagosRoutes from "./routes/pagos.js"

// Configuración
dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 3000

// Middlewares
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, "../public")))

// Rutas de la API
app.use("/api/auth", authRoutes)
app.use("/api/negocios", negociosRoutes)
app.use("/api/servicios", serviciosRoutes)
app.use("/api/turnos", turnosRoutes)
app.use("/api/promociones", promocionesRoutes)
app.use("/api/pagos", pagosRoutes)

// Ruta de health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "BarberApp AR API is running" })
})

// Manejo de errores
app.use((err, req, res, next) => {
  console.error("[v0] Error:", err)
  res.status(err.status || 500).json({
    error: err.message || "Internal Server Error",
  })
})

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`[v0] Server running on http://localhost:${PORT}`)
  console.log(`[v0] Environment: ${process.env.NODE_ENV || "development"}`)
})
