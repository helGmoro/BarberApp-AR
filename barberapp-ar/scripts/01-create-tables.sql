-- BarberApp AR - Database Schema
-- Este script crea todas las tablas necesarias para la aplicación

-- Tabla de negocios (barberías/peluquerías)
CREATE TABLE IF NOT EXISTS negocios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  nombre VARCHAR(255) NOT NULL,
  descripcion TEXT,
  direccion TEXT NOT NULL,
  telefono VARCHAR(20),
  email VARCHAR(255),
  horario_apertura TIME,
  horario_cierre TIME,
  dias_laborales JSONB DEFAULT '["lunes","martes","miercoles","jueves","viernes","sabado"]',
  imagen_url TEXT,
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de servicios
CREATE TABLE IF NOT EXISTS servicios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  negocio_id UUID REFERENCES negocios(id) ON DELETE CASCADE,
  nombre VARCHAR(255) NOT NULL,
  descripcion TEXT,
  duracion_minutos INTEGER NOT NULL,
  precio DECIMAL(10,2) NOT NULL,
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de turnos/reservas
CREATE TABLE IF NOT EXISTS turnos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  negocio_id UUID REFERENCES negocios(id) ON DELETE CASCADE,
  servicio_id UUID REFERENCES servicios(id) ON DELETE SET NULL,
  cliente_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  fecha DATE NOT NULL,
  hora_inicio TIME NOT NULL,
  hora_fin TIME NOT NULL,
  estado VARCHAR(50) DEFAULT 'pendiente', -- pendiente, confirmado, cancelado, completado
  precio_total DECIMAL(10,2),
  pagado BOOLEAN DEFAULT false,
  metodo_pago VARCHAR(50), -- efectivo, mercadopago, transferencia
  notas TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de promociones
CREATE TABLE IF NOT EXISTS promociones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  negocio_id UUID REFERENCES negocios(id) ON DELETE CASCADE,
  titulo VARCHAR(255) NOT NULL,
  descripcion TEXT,
  descuento_porcentaje DECIMAL(5,2),
  descuento_monto DECIMAL(10,2),
  fecha_inicio DATE NOT NULL,
  fecha_fin DATE NOT NULL,
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de perfiles de usuario (información adicional)
CREATE TABLE IF NOT EXISTS perfiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nombre_completo VARCHAR(255),
  telefono VARCHAR(20),
  es_propietario BOOLEAN DEFAULT false,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_negocios_user_id ON negocios(user_id);
CREATE INDEX IF NOT EXISTS idx_servicios_negocio_id ON servicios(negocio_id);
CREATE INDEX IF NOT EXISTS idx_turnos_negocio_id ON turnos(negocio_id);
CREATE INDEX IF NOT EXISTS idx_turnos_cliente_id ON turnos(cliente_id);
CREATE INDEX IF NOT EXISTS idx_turnos_fecha ON turnos(fecha);
CREATE INDEX IF NOT EXISTS idx_promociones_negocio_id ON promociones(negocio_id);
