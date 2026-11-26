-- ─────────────────────────────────────────────────────────────
--  Delilicias · Migración 01: ajustes de la revisión final de código
--  Ejecutar una vez en Supabase → SQL Editor (en una base ya creada con schema.sql).
--  schema.sql ya incluye estos cambios para instalaciones nuevas.
-- ─────────────────────────────────────────────────────────────

-- 1) crear_pedido: cierra la fecha el mismo día de la entrega (aunque no tenga "pedir hasta"),
--    limita a 2 pedidos sin confirmar por cliente (para que nadie acapare los cupos)
--    y exige quién recibe, barrio y dirección.
create or replace function public.crear_pedido(
  p_fecha_entrega_id int,
  p_personas int,
  p_nombre_recibe text,
  p_barrio_id text,
  p_direccion text,
  p_notas text,
  p_items jsonb
) returns bigint language plpgsql security definer set search_path = public as $$
declare
  v_fecha public.fechas_entrega;
  v_hoy date := (now() at time zone 'America/Bogota')::date;
  v_ocupados int;
  v_abiertos int;
  v_conf public.configuracion;
  v_subtotal int := 0;
  v_pedido_id bigint;
  v_item jsonb;
  v_producto public.productos;
begin
  if auth.uid() is null then
    raise exception 'Debes iniciar sesión para hacer un pedido';
  end if;
  if jsonb_array_length(coalesce(p_items, '[]'::jsonb)) = 0 then
    raise exception 'La canasta está vacía';
  end if;
  if coalesce(trim(p_nombre_recibe), '') = '' or coalesce(trim(p_direccion), '') = '' or coalesce(trim(p_barrio_id), '') = '' then
    raise exception 'Faltan los datos de entrega: quién recibe, barrio y dirección';
  end if;

  -- Un cliente no puede tener más de 2 pedidos esperando confirmación del anticipo
  select count(*) into v_abiertos from public.pedidos where user_id = auth.uid() and estado = 'recibido';
  if v_abiertos >= 2 then
    raise exception 'Ya tienes pedidos esperando la confirmación del anticipo. Escríbenos por WhatsApp si necesitas otro';
  end if;

  -- Bloquear la fecha para que dos pedidos simultáneos no superen el cupo
  select * into v_fecha from public.fechas_entrega where id = p_fecha_entrega_id for update;
  if not found then raise exception 'La fecha de entrega no existe'; end if;
  if (v_fecha.pedir_hasta is not null and v_fecha.pedir_hasta < v_hoy) or v_fecha.fecha <= v_hoy then
    raise exception 'Ya no se reciben pedidos para el %', v_fecha.texto;
  end if;
  select count(*) into v_ocupados from public.pedidos
    where fecha_entrega_id = p_fecha_entrega_id and estado <> 'cancelado';
  if v_ocupados >= v_fecha.cupo then
    raise exception 'No quedan cupos para el %', v_fecha.texto;
  end if;

  select * into v_conf from public.configuracion where id = 1;

  -- Subtotal con los precios actuales del menú
  for v_item in select * from jsonb_array_elements(p_items) loop
    select * into v_producto from public.productos where id = v_item ->> 'producto_id';
    if not found then raise exception 'Un producto de tu canasta ya no existe'; end if;
    if not v_producto.disponible then raise exception '% está agotado', v_producto.nombre; end if;
    if (v_item ->> 'cantidad')::int <= 0 then raise exception 'Cantidad inválida'; end if;
    v_subtotal := v_subtotal + v_producto.precio * (v_item ->> 'cantidad')::int;
  end loop;

  insert into public.pedidos (user_id, fecha_entrega_id, personas, nombre_recibe, barrio_id, direccion, notas,
                              subtotal, domicilio_gratis, anticipo)
  values (auth.uid(), p_fecha_entrega_id, greatest(p_personas, 1), trim(p_nombre_recibe), p_barrio_id, trim(p_direccion), p_notas,
          v_subtotal, v_subtotal >= v_conf.domicilio_gratis_desde, round(v_subtotal * v_conf.anticipo / 100.0))
  returning id into v_pedido_id;

  insert into public.pedido_items (pedido_id, producto_id, nombre, cantidad, porciones, precio_unitario)
  select v_pedido_id, p.id, p.nombre, (i ->> 'cantidad')::int, nullif(i ->> 'porciones', ''), p.precio
  from jsonb_array_elements(p_items) i
  join public.productos p on p.id = i ->> 'producto_id';

  return v_pedido_id;
end $$;

-- 2) registrar_comprobante: el archivo debe estar en la carpeta del propio cliente
create or replace function public.registrar_comprobante(p_pedido_id bigint, p_url text)
returns void language plpgsql security definer set search_path = public as $$
begin
  if p_url is null or p_url not like auth.uid()::text || '/%' then
    raise exception 'El comprobante no es válido';
  end if;
  update public.pedidos set comprobante_url = p_url
  where id = p_pedido_id and user_id = auth.uid() and estado = 'recibido';
  if not found then raise exception 'No se pudo registrar el comprobante de este pedido'; end if;
end $$;

-- 3) Límites del bucket de comprobantes en el servidor (no solo en el navegador): 5 MB, imágenes o PDF
update storage.buckets
set file_size_limit = 5242880,
    allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif', 'application/pdf']
where id = 'comprobantes';

-- 4) Solo usuarios con sesión pueden ejecutar las funciones de pedidos
revoke execute on function public.crear_pedido(int, int, text, text, text, text, jsonb) from public, anon;
revoke execute on function public.registrar_comprobante(bigint, text) from public, anon;
grant execute on function public.crear_pedido(int, int, text, text, text, text, jsonb) to authenticated;
grant execute on function public.registrar_comprobante(bigint, text) to authenticated;

-- 5) Nota: las vistas ventas_por_producto y fechas_disponibilidad se ejecutan con los permisos del dueño
--    a propósito: solo exponen totales sin datos personales.
comment on view public.ventas_por_producto is 'Pública a propósito: unidades vendidas por plato, sin datos personales.';
comment on view public.fechas_disponibilidad is 'Pública a propósito: cupos ocupados por fecha, sin datos personales.';
