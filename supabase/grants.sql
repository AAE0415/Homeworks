-- ─────────────────────────────────────────────────────────────
--  Delilicias · Permisos de las tablas para la API (anon y authenticated)
--  Los proyectos nuevos de Supabase no dan estos permisos por defecto.
--  RLS (en schema.sql) sigue decidiendo QUÉ filas ve o cambia cada quien.
--  Ejecutar después de schema.sql. Se puede ejecutar varias veces.
-- ─────────────────────────────────────────────────────────────

grant usage on schema public to anon, authenticated;

-- Menú, fechas y configuración: lectura para todos
grant select on public.categorias, public.productos, public.fechas_entrega, public.configuracion to anon, authenticated;

-- Escritura del menú y las fechas (RLS la limita a la administradora)
grant insert, update, delete on public.categorias, public.productos, public.fechas_entrega to authenticated;
grant update on public.configuracion to authenticated;
grant usage, select on sequence public.fechas_entrega_id_seq to authenticated;

-- Perfiles: cada quien lee y edita el suyo (RLS)
grant select, update on public.profiles to authenticated;

-- Pedidos: se crean con la función crear_pedido; se leen según RLS; la administradora los actualiza
grant select, update on public.pedidos to authenticated;
grant select on public.pedido_items to authenticated;

-- Vistas públicas
grant select on public.ventas_por_producto, public.fechas_disponibilidad to anon, authenticated;

-- Funciones
grant execute on function public.es_admin() to anon, authenticated;
grant execute on function public.crear_pedido(int, int, text, text, text, text, jsonb) to authenticated;
grant execute on function public.registrar_comprobante(bigint, text) to authenticated;
revoke execute on function public.crear_pedido(int, int, text, text, text, text, jsonb) from anon;
revoke execute on function public.registrar_comprobante(bigint, text) from anon;
