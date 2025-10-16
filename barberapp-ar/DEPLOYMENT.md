# Guía de Despliegue

Esta guía detalla cómo desplegar BarberApp AR en diferentes plataformas.

## Preparación

Antes de desplegar, asegúrate de:

1. Tener tu base de datos Supabase configurada
2. Tener credenciales de Mercado Pago (producción)
3. Haber probado la aplicación localmente
4. Tener un repositorio en GitHub

## Despliegue en Vercel

### Paso 1: Preparar el proyecto

Crea un archivo `vercel.json` en la raíz:

\`\`\`json
{
  "version": 2,
  "builds": [
    {
      "src": "server/index.js",
      "use": "@vercel/node"
    },
    {
      "src": "public/**",
      "use": "@vercel/static"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "server/index.js"
    },
    {
      "src": "/(.*)",
      "dest": "public/$1"
    }
  ]
}
\`\`\`

### Paso 2: Instalar Vercel CLI

\`\`\`bash
npm install -g vercel
\`\`\`

### Paso 3: Desplegar

\`\`\`bash
vercel
\`\`\`

Sigue las instrucciones en pantalla.

### Paso 4: Configurar variables de entorno

En el dashboard de Vercel:
1. Ve a Settings > Environment Variables
2. Agrega todas las variables de `.env`
3. Redespliega el proyecto

### Paso 5: Configurar dominio

1. Ve a Settings > Domains
2. Agrega tu dominio personalizado
3. Configura los DNS según las instrucciones

## Despliegue en Render

### Paso 1: Crear cuenta

1. Ve a [render.com](https://render.com)
2. Crea una cuenta o inicia sesión
3. Conecta tu cuenta de GitHub

### Paso 2: Crear Web Service

1. Click en "New +" > "Web Service"
2. Selecciona tu repositorio
3. Configura:
   - **Name**: barberapp-ar
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

### Paso 3: Variables de entorno

En la sección Environment:
- Agrega todas las variables de `.env`
- Actualiza `FRONTEND_URL` y `BACKEND_URL` con tu URL de Render

### Paso 4: Desplegar

Click en "Create Web Service" y espera el despliegue.

## Despliegue en Railway

### Paso 1: Crear cuenta

1. Ve a [railway.app](https://railway.app)
2. Inicia sesión con GitHub

### Paso 2: Nuevo proyecto

1. Click en "New Project"
2. Selecciona "Deploy from GitHub repo"
3. Elige tu repositorio

### Paso 3: Configurar

Railway detectará automáticamente Node.js.

Agrega variables de entorno:
1. Ve a Variables
2. Agrega todas las de `.env`

### Paso 4: Dominio

1. Ve a Settings
2. Genera un dominio o agrega uno personalizado

## Configuración Post-Despliegue

### Actualizar URLs en Mercado Pago

1. Ve a tu aplicación en Mercado Pago Developers
2. Actualiza la URL de webhook:
   \`\`\`
   https://tu-dominio.com/api/pagos/webhook
   \`\`\`

### Actualizar variables de entorno

Actualiza en tu plataforma de hosting:

\`\`\`env
FRONTEND_URL=https://tu-dominio.com
BACKEND_URL=https://tu-dominio.com
NODE_ENV=production
\`\`\`

### Verificar CORS

Asegúrate de que el backend permita tu dominio en producción.

## Monitoreo

### Logs

- **Vercel**: Dashboard > Deployments > Logs
- **Render**: Dashboard > Logs
- **Railway**: Dashboard > Deployments > View Logs

### Errores comunes

1. **Error 500**: Verifica variables de entorno
2. **CORS errors**: Configura CORS en el backend
3. **Database connection**: Verifica credenciales de Supabase
4. **Payment errors**: Verifica token de Mercado Pago

## Backup

### Base de datos

Supabase hace backups automáticos, pero puedes:

1. Ir a Database > Backups
2. Crear backup manual
3. Descargar si es necesario

### Código

Mantén tu repositorio de GitHub actualizado:

\`\`\`bash
git push origin main
\`\`\`

## Rollback

Si algo sale mal:

### Vercel
\`\`\`bash
vercel rollback
\`\`\`

### Render/Railway
Ve al dashboard y selecciona un despliegue anterior.

## Optimizaciones

### Performance

1. Habilita compresión gzip
2. Minifica CSS/JS en producción
3. Usa CDN para assets estáticos
4. Implementa caching

### Seguridad

1. Usa HTTPS siempre
2. Configura headers de seguridad
3. Limita rate limiting
4. Mantén dependencias actualizadas

## Soporte

Si tienes problemas:
1. Revisa los logs
2. Verifica variables de entorno
3. Consulta la documentación de la plataforma
4. Abre un issue en GitHub

---

¡Tu aplicación está lista para producción!
