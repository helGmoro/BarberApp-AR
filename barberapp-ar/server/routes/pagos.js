import express from "express"
import mercadopago from "mercadopago"
import { supabase } from "../config/supabase.js"
import { authenticateUser } from "../middleware/auth.js"

const router = express.Router()

// Configurar Mercado Pago
mercadopago.configure({
  access_token: process.env.MERCADOPAGO_ACCESS_TOKEN,
})

// Crear preferencia de pago
router.post("/crear-preferencia", authenticateUser, async (req, res) => {
  try {
    const { turno_id, titulo, precio } = req.body

    const preference = {
      items: [
        {
          title: titulo,
          unit_price: Number.parseFloat(precio),
          quantity: 1,
        },
      ],
      back_urls: {
        success: `${process.env.FRONTEND_URL || "http://localhost:3000"}/pago-exitoso`,
        failure: `${process.env.FRONTEND_URL || "http://localhost:3000"}/pago-fallido`,
        pending: `${process.env.FRONTEND_URL || "http://localhost:3000"}/pago-pendiente`,
      },
      auto_return: "approved",
      external_reference: turno_id,
      notification_url: `${process.env.BACKEND_URL || "http://localhost:3000"}/api/pagos/webhook`,
    }

    const response = await mercadopago.preferences.create(preference)

    res.json({
      id: response.body.id,
      init_point: response.body.init_point,
    })
  } catch (error) {
    console.error("[v0] Error creating preference:", error)
    res.status(500).json({ error: "Error al crear preferencia de pago" })
  }
})

// Webhook de Mercado Pago
router.post("/webhook", async (req, res) => {
  try {
    const { type, data } = req.body

    if (type === "payment") {
      const paymentId = data.id

      const payment = await mercadopago.payment.findById(paymentId)

      if (payment.body.status === "approved") {
        const turnoId = payment.body.external_reference

        // Actualizar el turno como pagado
        await supabase
          .from("turnos")
          .update({
            pagado: true,
            metodo_pago: "mercadopago",
            estado: "confirmado",
          })
          .eq("id", turnoId)
      }
    }

    res.status(200).send("OK")
  } catch (error) {
    console.error("[v0] Webhook error:", error)
    res.status(500).send("Error")
  }
})

export default router
