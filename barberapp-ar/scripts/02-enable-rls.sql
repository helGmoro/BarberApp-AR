-- BarberApp AR - Row Level Security (RLS)
-- Este script habilita y configura las políticas de seguridad

-- Habilitar RLS en todas las tablas
ALTER TABLE negocios ENABLE ROW LEVEL SECURITY;
ALTER TABLE servicios ENABLE ROW LEVEL SECURITY;
ALTER TABLE turnos ENABLE ROW LEVEL SECURITY;
ALTER TABLE promociones ENABLE ROW LEVEL SECURITY;
ALTER TABLE perfiles ENABLE ROW LEVEL SECURITY;

-- Políticas para NEGOCIOS
-- Los propietarios pueden ver y editar sus propios negocios
CREATE POLICY "Propietarios pueden ver sus negocios"
  ON negocios FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Propietarios pueden crear negocios"
  ON negocios FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Propietarios pueden actualizar sus negocios"
  ON negocios FOR UPDATE
  USING (auth.uid() = user_id);

-- Todos pueden ver negocios activos (para búsqueda)
CREATE POLICY "Todos pueden ver negocios activos"
  ON negocios FOR SELECT
  USING (activo = true);

-- Políticas para SERVICIOS
-- Los propietarios pueden gestionar servicios de sus negocios
CREATE POLICY "Propietarios pueden gestionar servicios"
  ON servicios FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM negocios
      WHERE negocios.id = servicios.negocio_id
      AND negocios.user_id = auth.uid()
    )
  );

-- Todos pueden ver servicios activos
CREATE POLICY "Todos pueden ver servicios activos"
  ON servicios FOR SELECT
  USING (activo = true);

-- Políticas para TURNOS
-- Los clientes pueden ver sus propios turnos
CREATE POLICY "Clientes pueden ver sus turnos"
  ON turnos FOR SELECT
  USING (auth.uid() = cliente_id);

-- Los propietarios pueden ver turnos de sus negocios
CREATE POLICY "Propietarios pueden ver turnos de sus negocios"
  ON turnos FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM negocios
      WHERE negocios.id = turnos.negocio_id
      AND negocios.user_id = auth.uid()
    )
  );

-- Los clientes pueden crear turnos
CREATE POLICY "Clientes pueden crear turnos"
  ON turnos FOR INSERT
  WITH CHECK (auth.uid() = cliente_id);

-- Los propietarios pueden actualizar turnos de sus negocios
CREATE POLICY "Propietarios pueden actualizar turnos"
  ON turnos FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM negocios
      WHERE negocios.id = turnos.negocio_id
      AND negocios.user_id = auth.uid()
    )
  );

-- Políticas para PROMOCIONES
-- Los propietarios pueden gestionar promociones de sus negocios
CREATE POLICY "Propietarios pueden gestionar promociones"
  ON promociones FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM negocios
      WHERE negocios.id = promociones.negocio_id
      AND negocios.user_id = auth.uid()
    )
  );

-- Todos pueden ver promociones activas
CREATE POLICY "Todos pueden ver promociones activas"
  ON promociones FOR SELECT
  USING (activo = true AND fecha_inicio <= CURRENT_DATE AND fecha_fin >= CURRENT_DATE);

-- Políticas para PERFILES
-- Los usuarios pueden ver y editar su propio perfil
CREATE POLICY "Usuarios pueden ver su perfil"
  ON perfiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Usuarios pueden crear su perfil"
  ON perfiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Usuarios pueden actualizar su perfil"
  ON perfiles FOR UPDATE
  USING (auth.uid() = id);
