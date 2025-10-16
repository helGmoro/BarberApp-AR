# Configuración de Mercado Pago

Esta guía te ayudará a configurar Mercado Pago en BarberApp AR.

## Paso 1: Crear cuenta en Mercado Pago Developers

1. Ve a [https://www.mercadopago.com.ar/developers](https://www.mercadopago.com.ar/developers)
2. Inicia sesión con tu cuenta de Mercado Pago (o crea una nueva)
3. Acepta los términos y condiciones de desarrollador

## Paso 2: Crear una aplicación

1. En el panel de desarrolladores, ve a "Tus integraciones"
2. Haz clic en "Crear aplicación"
3. Completa los datos:
   - **Nombre**: BarberApp AR
   - **Descripción**: Plataforma de gestión de turnos para barberías
   - **Modelo de integración**: Checkout Pro
4. Guarda la aplicación

## Paso 3: Obtener credenciales de prueba

1. En tu aplicación, ve a la sección "Credenciales"
2. Selecciona "Credenciales de prueba"
3. Copia el **Access Token** (comienza con `TEST-`)
4. Pega este token en tu archivo `.env`:

\`\`\`env
MERCADOPAGO_ACCESS_TOKEN=TEST-1234567890-123456-abcdef1234567890abcdef1234567890-123456789
\`\`\`

## Paso 4: Configurar URLs de callback

En tu archivo `.env`, configura las URLs:

\`\`\`env
FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:3000
\`\`\`

**Importante**: Cuando despliegues a producción, actualiza estas URLs con tu dominio real.

## Paso 5: Probar la integración

### Usuarios de prueba

Mercado Pago proporciona usuarios de prueba para simular pagos:

1. Ve a "Usuarios de prueba" en el panel de desarrolladores
2. Crea dos usuarios:
   - **Vendedor**: Para recibir pagos
   - **Comprador**: Para realizar pagos

### Tarjetas de prueba

Usa estas tarjetas para probar diferentes escenarios:

| Tarjeta | Número | CVV | Fecha | Resultado |
|---------|--------|-----|-------|-----------|
| Mastercard | 5031 7557 3453 0604 | 123 | 11/25 | Aprobado |
| Visa | 4509 9535 6623 3704 | 123 | 11/25 | Aprobado |
| Mastercard | 5031 4332 1540 6351 | 123 | 11/25 | Rechazado |

### Flujo de prueba

1. Inicia sesión como cliente en BarberApp AR
2. Reserva un turno en cualquier negocio
3. Selecciona "Pagar con Mercado Pago"
4. Usa las credenciales del usuario comprador de prueba
5. Ingresa una tarjeta de prueba
6. Completa el pago

## Paso 6: Pasar a producción

Cuando estés listo para recibir pagos reales:

1. Completa la información de tu negocio en Mercado Pago
2. Activa tu cuenta
3. Ve a "Credenciales de producción"
4. Copia el **Access Token de producción**
5. Actualiza tu `.env` con el token de producción
6. Actualiza las URLs con tu dominio real

\`\`\`env
MERCADOPAGO_ACCESS_TOKEN=APP-1234567890-123456-abcdef1234567890abcdef1234567890-123456789
FRONTEND_URL=https://tudominio.com
BACKEND_URL=https://tudominio.com
\`\`\`

## Webhooks (Opcional pero recomendado)

Los webhooks permiten que Mercado Pago notifique a tu servidor cuando cambia el estado de un pago.

1. En tu aplicación de Mercado Pago, ve a "Webhooks"
2. Agrega la URL: `https://tudominio.com/api/pagos/webhook`
3. Selecciona los eventos: `payment`
4. Guarda la configuración

**Nota**: Los webhooks solo funcionan con URLs públicas (HTTPS). En desarrollo local, puedes usar herramientas como ngrok.

## Comisiones

Mercado Pago cobra una comisión por cada transacción:
- **Argentina**: ~3.99% + $0 por transacción
- Las comisiones pueden variar según tu cuenta y volumen

Consulta las tarifas actualizadas en [https://www.mercadopago.com.ar/costs-section/](https://www.mercadopago.com.ar/costs-section/)

## Soporte

Si tienes problemas:
- Documentación oficial: [https://www.mercadopago.com.ar/developers/es/docs](https://www.mercadopago.com.ar/developers/es/docs)
- Foro de desarrolladores: [https://www.mercadopago.com.ar/developers/es/support](https://www.mercadopago.com.ar/developers/es/support)
