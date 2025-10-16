# BarberApp AR

**Tu Lugar, Tu Estilo**

Plataforma digital para gestión de turnos en barberías y peluquerías de Argentina. Conecta clientes con profesionales del rubro de forma simple y eficiente.

## Características Principales

### Para Clientes
- Búsqueda y exploración de negocios
- Reserva de turnos online en tiempo real
- Pago anticipado con Mercado Pago o en el local
- Gestión de turnos personales
- Notificaciones de confirmación

### Para Propietarios
- Panel de administración completo
- Gestión de múltiples negocios
- Creación y edición de servicios
- Visualización y gestión de turnos
- Dashboard con estadísticas
- Control de pagos y balances

## Tecnologías

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Backend**: Node.js + Express
- **Base de datos**: Supabase (PostgreSQL)
- **Autenticación**: Supabase Auth
- **Pagos**: Mercado Pago
- **Hosting**: Vercel / Netlify / Render (compatible)

## Requisitos Previos

- Node.js 18 o superior
- Cuenta de Supabase (gratuita)
- Cuenta de Mercado Pago Developers (gratuita)
- Git

## Instalación

### 1. Clonar el repositorio

\`\`\`bash
git clone https://github.com/tu-usuario/barberapp-ar.git
cd barberapp-ar
\`\`\`

### 2. Instalar dependencias

\`\`\`bash
npm install
\`\`\`

### 3. Configurar variables de entorno

Copia el archivo de ejemplo y completa las variables:

\`\`\`bash
cp .env.example .env
\`\`\`

Edita `.env` con tus credenciales:

\`\`\`env
# Supabase
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_ANON_KEY=tu_clave_anonima_aqui

# Mercado Pago
MERCADOPAGO_ACCESS_TOKEN=TEST-tu_token_de_prueba_aqui

# Server
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:3000
\`\`\`

### 4. Configurar Supabase

#### Crear proyecto en Supabase

1. Ve a [https://supabase.com](https://supabase.com)
2. Crea una cuenta o inicia sesión
3. Crea un nuevo proyecto
4. Copia la URL y la clave anónima a tu `.env`

#### Ejecutar scripts SQL

En el SQL Editor de Supabase, ejecuta los scripts en orden:

1. `scripts/01-create-tables.sql` - Crea las tablas
2. `scripts/02-enable-rls.sql` - Configura seguridad
3. `scripts/03-seed-data.sql` - Datos de prueba (opcional)

### 5. Configurar Mercado Pago

Sigue la guía detallada en [MERCADOPAGO_SETUP.md](./MERCADOPAGO_SETUP.md)

Resumen rápido:
1. Crea cuenta en [Mercado Pago Developers](https://www.mercadopago.com.ar/developers)
2. Crea una aplicación
3. Obtén el Access Token de prueba
4. Agrégalo a tu `.env`

### 6. Iniciar el servidor

\`\`\`bash
npm run dev
\`\`\`

La aplicación estará disponible en `http://localhost:3000`

## Estructura del Proyecto

\`\`\`
barberapp-ar/
├── public/                 # Frontend (archivos estáticos)
│   ├── index.html         # Página principal
│   ├── login.html         # Inicio de sesión
│   ├── register.html      # Registro
│   ├── negocios.html      # Lista de negocios
│   ├── negocio.html       # Detalle de negocio
│   ├── mis-turnos.html    # Turnos del cliente
│   ├── pago.html          # Procesamiento de pago
│   ├── admin/             # Panel de administración
│   │   ├── dashboard.html
│   │   ├── negocios.html
│   │   ├── servicios.html
│   │   └── turnos.html
│   ├── css/
│   │   └── styles.css     # Estilos globales
│   └── js/
│       └── auth.js        # Utilidades de autenticación
├── server/                # Backend Node.js
│   ├── index.js          # Servidor Express
│   ├── config/
│   │   └── supabase.js   # Configuración de Supabase
│   ├── middleware/
│   │   └── auth.js       # Middlewares de autenticación
│   └── routes/           # Rutas de la API
│       ├── auth.js
│       ├── negocios.js
│       ├── servicios.js
│       ├── turnos.js
│       ├── promociones.js
│       └── pagos.js
├── scripts/              # Scripts SQL para Supabase
│   ├── 01-create-tables.sql
│   ├── 02-enable-rls.sql
│   └── 03-seed-data.sql
├── .env.example          # Ejemplo de variables de entorno
├── .gitignore
├── package.json
├── README.md
└── MERCADOPAGO_SETUP.md
\`\`\`

## API Endpoints

### Autenticación

\`\`\`
POST   /api/auth/register    # Registrar usuario
POST   /api/auth/login       # Iniciar sesión
POST   /api/auth/logout      # Cerrar sesión
\`\`\`

### Negocios

\`\`\`
GET    /api/negocios                    # Listar negocios activos
GET    /api/negocios/:id                # Obtener negocio
POST   /api/negocios                    # Crear negocio (propietario)
PUT    /api/negocios/:id                # Actualizar negocio (propietario)
GET    /api/negocios/mis-negocios/lista # Negocios del propietario
\`\`\`

### Servicios

\`\`\`
GET    /api/servicios/negocio/:negocioId  # Servicios de un negocio
POST   /api/servicios                     # Crear servicio (propietario)
PUT    /api/servicios/:id                 # Actualizar servicio (propietario)
DELETE /api/servicios/:id                 # Eliminar servicio (propietario)
\`\`\`

### Turnos

\`\`\`
GET    /api/turnos/mis-turnos           # Turnos del cliente
GET    /api/turnos/negocio/:negocioId   # Turnos de un negocio (propietario)
POST   /api/turnos                      # Crear turno
PUT    /api/turnos/:id                  # Actualizar turno
DELETE /api/turnos/:id                  # Cancelar turno
\`\`\`

### Pagos

\`\`\`
POST   /api/pagos/crear-preferencia  # Crear preferencia de Mercado Pago
POST   /api/pagos/webhook            # Webhook de Mercado Pago
\`\`\`

## Despliegue

### Vercel (Recomendado)

1. Instala Vercel CLI:
\`\`\`bash
npm install -g vercel
\`\`\`

2. Despliega:
\`\`\`bash
vercel
\`\`\`

3. Configura las variables de entorno en el dashboard de Vercel

### Render

1. Crea una cuenta en [Render](https://render.com)
2. Conecta tu repositorio de GitHub
3. Crea un nuevo Web Service
4. Configura las variables de entorno
5. Despliega

### Netlify

1. Crea una cuenta en [Netlify](https://netlify.com)
2. Conecta tu repositorio de GitHub
3. Configura el build command: `npm install`
4. Configura las variables de entorno
5. Despliega

## Usuarios de Prueba

Para probar la aplicación, puedes crear dos tipos de usuarios:

### Cliente
- Registrarse sin marcar "Soy propietario"
- Puede buscar negocios y reservar turnos

### Propietario
- Registrarse marcando "Soy propietario"
- Puede crear negocios, servicios y gestionar turnos

## Seguridad

- Autenticación mediante JWT (Supabase Auth)
- Row Level Security (RLS) en todas las tablas
- Validación de permisos en el backend
- Protección contra SQL injection
- CORS configurado correctamente
- Variables de entorno para datos sensibles

## Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## Roadmap

- [ ] Notificaciones por email
- [ ] Notificaciones push
- [ ] Sistema de reseñas y calificaciones
- [ ] Programa de fidelización
- [ ] Aplicación móvil nativa
- [ ] Integración con Google Calendar
- [ ] Sistema de recordatorios automáticos
- [ ] Reportes y analytics avanzados

## Licencia

MIT License - ver [LICENSE](LICENSE) para más detalles

## Autores

- Mauro Astudillo
- Stefano Ferro
- Giuliano Moro

## Contacto

Para consultas o soporte:
- Email: contacto@barberapp.com.ar
- GitHub: [https://github.com/tu-usuario/barberapp-ar](https://github.com/tu-usuario/barberapp-ar)

## Agradecimientos

- Supabase por la infraestructura de base de datos
- Mercado Pago por la pasarela de pagos
- Comunidad de desarrolladores de Argentina

---

Hecho con dedicación para digitalizar las barberías y peluquerías de Argentina 🇦🇷
