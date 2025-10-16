-- BarberApp AR - Datos de prueba
-- Este script inserta datos de ejemplo para testing

-- Nota: Estos UUIDs son de ejemplo. En producción, se crearán automáticamente
-- o se usarán los IDs reales de los usuarios autenticados

-- Insertar un negocio de ejemplo
INSERT INTO negocios (id, nombre, descripcion, direccion, telefono, email, horario_apertura, horario_cierre)
VALUES (
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  'Barbería El Estilo',
  'Barbería moderna con los mejores profesionales de la ciudad',
  'Av. Corrientes 1234, CABA',
  '+54 11 1234-5678',
  'contacto@barberiaelestilo.com',
  '09:00:00',
  '20:00:00'
);

-- Insertar servicios de ejemplo
INSERT INTO servicios (negocio_id, nombre, descripcion, duracion_minutos, precio) VALUES
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Corte Clásico', 'Corte de cabello tradicional', 30, 3500.00),
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Corte + Barba', 'Corte de cabello y arreglo de barba', 45, 5000.00),
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Afeitado Clásico', 'Afeitado tradicional con navaja', 30, 2500.00),
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Coloración', 'Tintura y coloración de cabello', 60, 6000.00);

-- Insertar una promoción de ejemplo
INSERT INTO promociones (negocio_id, titulo, descripcion, descuento_porcentaje, fecha_inicio, fecha_fin)
VALUES (
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  'Promo Lunes y Martes',
  '20% de descuento en todos los servicios',
  20.00,
  CURRENT_DATE,
  CURRENT_DATE + INTERVAL '30 days'
);
