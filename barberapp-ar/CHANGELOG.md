# Changelog

Todos los cambios notables en este proyecto serán documentados en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/),
y este proyecto adhiere a [Semantic Versioning](https://semver.org/lang/es/).

## [1.0.0] - 2025-01-14

### Agregado

#### Sistema de Autenticación
- Registro de usuarios con email y contraseña
- Login con validación de credenciales
- Diferenciación entre clientes y propietarios
- Gestión de sesiones con Supabase Auth
- Protección de rutas según rol de usuario

#### Frontend para Clientes
- Página principal con información del servicio
- Listado de negocios disponibles
- Vista detallada de negocio con servicios
- Sistema de reserva de turnos con modal
- Gestión de turnos personales
- Integración de pagos con Mercado Pago

#### Panel de Administración
- Dashboard con estadísticas en tiempo real
- CRUD completo de negocios
- Gestión de servicios por negocio
- Visualización y gestión de turnos
- Cambio de estados de turnos
- Filtrado por negocio

#### Base de Datos
- Esquema completo con PostgreSQL
- Tablas: negocios, servicios, turnos, promociones, perfiles
- Row Level Security (RLS) implementado
- Índices para optimización de consultas
- Scripts SQL para setup inicial

#### API REST
- Endpoints de autenticación
- CRUD de negocios
- CRUD de servicios
- Gestión de turnos
- Integración con Mercado Pago
- Webhooks para confirmación de pagos

#### Pagos
- Integración completa con Mercado Pago
- Pago anticipado online
- Opción de pago en el local
- Páginas de resultado de pago
- Webhook para actualización automática

#### Documentación
- README completo con instrucciones
- Guía de configuración de Mercado Pago
- Guía de despliegue en múltiples plataformas
- Guía de contribución
- Changelog

### Seguridad
- Autenticación JWT
- RLS en todas las tablas
- Validación de permisos en backend
- Variables de entorno para datos sensibles
- Protección contra SQL injection

## [Unreleased]

### Planeado
- Sistema de notificaciones por email
- Notificaciones push
- Sistema de reseñas y calificaciones
- Programa de fidelización
- Aplicación móvil nativa
- Integración con Google Calendar
- Recordatorios automáticos
- Reportes y analytics avanzados

---

[1.0.0]: https://github.com/tu-usuario/barberapp-ar/releases/tag/v1.0.0
