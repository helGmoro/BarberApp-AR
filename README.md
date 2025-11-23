# BarberApp AR 💈

Plataforma SaaS para gestión de turnos en barberías, peluquerías y estilistas independientes en Argentina.

## 🚀 Características

- **Sistema de reservas online**: Los clientes pueden buscar y reservar turnos en barberías y peluquerías
- **Panel de gestión para comercios**: Dashboard completo con estadísticas, gestión de turnos, servicios y promociones
- **Integración con Mercado Pago**: Split payments automático con comisiones configurables
- **Sistema de suscripciones**: Plan Premium de $10.000/mes para comercios
- **Panel administrativo**: Gestión global de comercios, usuarios, pagos y configuración de la plataforma
- **Autenticación segura**: Registro diferenciado para clientes y comercios 

## 👥 Tipos de Usuario

### **Clientes**
- Buscar barberías y peluquerías
- Reservar turnos
- Ver historial de turnos
- Dejar reseñas
- Pagar señas o servicios completos

### **Dueños de Comercio**
- Gestionar perfil del comercio
- Administrar servicios y precios
- Ver y gestionar turnos
- Configurar horarios de atención
- Publicar promociones
- Ver balances y estadísticas
- Vincular cuenta de Mercado Pago
- Gestionar suscripción Premium

### **Administradores de Plataforma**
- Gestionar comercios (activar/desactivar)
- Ver todos los usuarios
- Monitorear pagos y comisiones
- Configurar porcentajes de comisión
- Configurar precios de suscripción
- Ver estadísticas globales

## 💰 Modelo de Negocio

- **Suscripción Premium**
- **Comisión por seña**
- **Comisión por pago completo**
- Los pagos van directamente a la cuenta de Mercado Pago del comercio
- La plataforma retiene las comisiones automáticamente 

## 🔐 Seguridad

- Autenticación con Supabase Auth
- Row Level Security (RLS) en todas las tablas
- Middleware para proteger rutas
- Políticas de acceso por tipo de usuario
- Validación de permisos en API routes

## 📱 Estructura del Proyecto

\`\`\`
barberapp-ar/
├── app/                    # Páginas de Next.js (App Router)
│   ├── admin/             # Panel administrativo
│   ├── api/               # API Routes
│   ├── buscar/            # Búsqueda de comercios
│   ├── comercio/          # Detalle de comercio
│   ├── login/             # Autenticación
│   ├── panel/             # Paneles de cliente y comercio
│   └── registro/          # Registro de usuarios
├── components/            # Componentes React
│   ├── admin/            # Componentes del panel admin
│   ├── auth/             # Componentes de autenticación
│   ├── comercio/         # Componentes de comercio
│   ├── panel/            # Componentes de paneles
│   ├── search/           # Componentes de búsqueda
│   └── ui/               # Componentes UI (shadcn)
├── lib/                   # Utilidades y configuración
│   ├── supabase/         # Clientes de Supabase
│   ├── mercadopago.ts    # Configuración de MP
│   └── platform-config.ts # Configuración de plataforma
└── scripts/              # Scripts SQL para DB
\`\`\`

## 🛠️ Tecnologías

- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS v4
- **Backend**: Next.js API Routes, Server Actions
- **Base de datos**: PostgreSQL (Supabase)
- **Autenticación**: Supabase Auth
- **Pagos**: Mercado Pago (Split Payments)
- **UI Components**: shadcn/ui
- **Hosting**: Vercel

## 📞 Soporte

Para soporte técnico, contacta al equipo de desarrollo.

## 📄 Licencia

Todos los derechos reservados © BarberApp AR
