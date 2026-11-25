-- ─────────────────────────────────────────────────────────────
--  Delilicias · Esquema de base de datos (Supabase / PostgreSQL)
--  Ejecutar completo en Supabase → SQL Editor, una sola vez.
--  Después ejecutar seed.sql.
-- ─────────────────────────────────────────────────────────────

-- ========== Perfiles (un perfil por usuario de auth.users) ==========
create table if not exists public.profiles (
  id uuid primary key references auth.users on delete cascade,
  nombre text not null default '',
  telefono text not null default '',
  barrio_id text,
  rol text not null default 'cliente' check (rol in ('cliente', 'admin')),
  created_at timestamptz not null default now()
);

-- ¿El usuario actual es administrador? (security definer para no chocar con RLS)
create or replace function public.es_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.profiles where id = auth.uid() and rol = 'admin');
$$;

-- Crear el perfil automáticamente al registrarse, con los datos del formulario
create or replace function public.crear_perfil()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, nombre, telefono, barrio_id)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'nombre', ''),
    coalesce(new.raw_user_meta_data ->> 'telefono', ''),
    new.raw_user_meta_data ->> 'barrio_id'
  );
  return new;
end $$;

drop trigger if exists al_crear_usuario on auth.users;
create trigger al_crear_usuario after insert on auth.users
  for each row execute function public.crear_perfil();

-- Un cliente no puede cambiarse el rol a sí mismo
create or replace function public.proteger_rol()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if new.rol is distinct from old.rol and not public.es_admin() then
    raise exception 'No puedes cambiar el rol';
  end if;
  return new;
end $$;

drop trigger if exists proteger_rol on public.profiles;
create trigger proteger_rol before update on public.profiles
  for each row execute function public.proteger_rol();

-- ========== Menú ==========
create table if not exists public.categorias (
  id text primary key,
  numeral text not null,
  titulo text not null,
  subtitulo text,
  nota text,
  orden int not null
);

create table if not exists public.productos (
  id text primary key,
  categoria_id text not null references public.categorias on update cascade,
  nombre text not null,
  descripcion text not null default '',
  ingredientes text[] not null default '{}',
  precio int not null check (precio > 0),
  unidad text not null,
  foto_url text,
  alt text,
  disponible boolean not null default true,
  destacado boolean not null default false,
  orden int not null default 0
);

-- ========== Fechas de entrega y configuración ==========
create table if not exists public.fechas_entrega (
  id serial primary key,
  texto text not null,
  fecha date not null unique,
  pedir_hasta date,
  cupo int not null check (cupo >= 0)
);

create table if not exists public.configuracion (
  id int primary key default 1 check (id = 1),
  whatsapp text not null,
  domicilio_gratis_desde int not null,
  anticipo int not null check (anticipo between 0 and 100)
);

-- ========== Pedidos ==========
create table if not exists public.pedidos (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users on delete cascade default auth.uid(),
  fecha_entrega_id int not null references public.fechas_entrega,
  personas int not null default 1 check (personas > 0),
  nombre_recibe text not null,
  barrio_id text not null,
  direccion text not null,
  notas text,
  subtotal int not null,
  domicilio_gratis boolean not null,
  domicilio_acordado int,
  anticipo int not null,
  comprobante_url text,
  estado text not null default 'recibido'
    check (estado in ('recibido', 'anticipo_confirmado', 'en_cocina', 'en_camino', 'entregado', 'cancelado')),
  created_at timestamptz not null default now(),
  confirmado_at timestamptz
);

create table if not exists public.pedido_items (
  id bigint generated always as identity primary key,
  pedido_id bigint not null references public.pedidos on delete cascade,
  producto_id text not null references public.productos,
  nombre text not null,
  cantidad int not null check (cantidad > 0),
  porciones text,
  precio_unitario int not null
);

create index if not exists pedidos_user_idx on public.pedidos (user_id);
create index if not exists pedidos_estado_idx on public.pedidos (estado);
create index if not exists pedido_items_pedido_idx on public.pedido_items (pedido_id);

-- Sellar la hora de confirmación del anticipo
create or replace function public.sellar_confirmacion()
returns trigger language plpgsql as $$
begin
  if new.estado = 'anticipo_confirmado' and old.estado = 'recibido' then
    new.confirmado_at := now();
  end if;
  return new;
end $$;

drop trigger if exists sellar_confirmacion on public.pedidos;
create trigger sellar_confirmacion before update on public.pedidos
  for each row execute function public.sellar_confirmacion();

-- ========== Transacción: crear un pedido ==========
-- Valida la fecha (vencida o sin cupo), toma los precios reales del menú,
-- calcula subtotal, domicilio y anticipo, e inserta pedido + ítems en una sola transacción.
-- items: [{ "producto_id": "rollo-mixto", "cantidad": 2, "porciones": "4 porciones de 125 g" }]
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
  v_ocupados int;
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

  -- Bloquear la fecha para que dos pedidos simultáneos no superen el cupo
  select * into v_fecha from public.fechas_entrega where id = p_fecha_entrega_id for update;
  if not found then raise exception 'La fecha de entrega no existe'; end if;
  if v_fecha.pedir_hasta is not null and v_fecha.pedir_hasta < (now() at time zone 'America/Bogota')::date then
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
  values (auth.uid(), p_fecha_entrega_id, greatest(p_personas, 1), p_nombre_recibe, p_barrio_id, p_direccion, p_notas,
          v_subtotal, v_subtotal >= v_conf.domicilio_gratis_desde, round(v_subtotal * v_conf.anticipo / 100.0))
  returning id into v_pedido_id;

  insert into public.pedido_items (pedido_id, producto_id, nombre, cantidad, porciones, precio_unitario)
  select v_pedido_id, p.id, p.nombre, (i ->> 'cantidad')::int, nullif(i ->> 'porciones', ''), p.precio
  from jsonb_array_elements(p_items) i
  join public.productos p on p.id = i ->> 'producto_id';

  return v_pedido_id;
end $$;

-- El cliente registra el comprobante de su pedido mientras está "recibido"
create or replace function public.registrar_comprobante(p_pedido_id bigint, p_url text)
returns void language plpgsql security definer set search_path = public as $$
begin
  update public.pedidos set comprobante_url = p_url
  where id = p_pedido_id and user_id = auth.uid() and estado = 'recibido';
  if not found then raise exception 'No se pudo registrar el comprobante de este pedido'; end if;
end $$;

-- ========== Vistas públicas (sin datos personales) ==========
create or replace view public.ventas_por_producto as
  select i.producto_id, sum(i.cantidad)::int as cantidad
  from public.pedido_items i
  join public.pedidos p on p.id = i.pedido_id
  where p.estado <> 'cancelado'
  group by i.producto_id;

create or replace view public.fechas_disponibilidad as
  select f.id, f.texto, f.fecha, f.pedir_hasta, f.cupo,
         (select count(*) from public.pedidos p where p.fecha_entrega_id = f.id and p.estado <> 'cancelado')::int as ocupados
  from public.fechas_entrega f;

grant select on public.ventas_por_producto, public.fechas_disponibilidad to anon, authenticated;

-- ========== Seguridad por filas (RLS) ==========
alter table public.profiles enable row level security;
alter table public.categorias enable row level security;
alter table public.productos enable row level security;
alter table public.fechas_entrega enable row level security;
alter table public.configuracion enable row level security;
alter table public.pedidos enable row level security;
alter table public.pedido_items enable row level security;

-- Perfiles: cada quien ve y edita el suyo; la administradora ve todos
drop policy if exists "perfil propio" on public.profiles;
create policy "perfil propio" on public.profiles for select to authenticated
  using (id = (select auth.uid()) or public.es_admin());
drop policy if exists "editar perfil propio" on public.profiles;
create policy "editar perfil propio" on public.profiles for update to authenticated
  using (id = (select auth.uid()) or public.es_admin());

-- Menú, fechas y configuración: lectura pública; escritura solo admin
drop policy if exists "leer categorias" on public.categorias;
create policy "leer categorias" on public.categorias for select to anon, authenticated using (true);
drop policy if exists "admin categorias" on public.categorias;
create policy "admin categorias" on public.categorias for all to authenticated using (public.es_admin()) with check (public.es_admin());

drop policy if exists "leer productos" on public.productos;
create policy "leer productos" on public.productos for select to anon, authenticated using (true);
drop policy if exists "admin productos" on public.productos;
create policy "admin productos" on public.productos for all to authenticated using (public.es_admin()) with check (public.es_admin());

drop policy if exists "leer fechas" on public.fechas_entrega;
create policy "leer fechas" on public.fechas_entrega for select to anon, authenticated using (true);
drop policy if exists "admin fechas" on public.fechas_entrega;
create policy "admin fechas" on public.fechas_entrega for all to authenticated using (public.es_admin()) with check (public.es_admin());

drop policy if exists "leer configuracion" on public.configuracion;
create policy "leer configuracion" on public.configuracion for select to anon, authenticated using (true);
drop policy if exists "admin configuracion" on public.configuracion;
create policy "admin configuracion" on public.configuracion for update to authenticated using (public.es_admin());

-- Pedidos: el cliente ve los suyos (se crean con crear_pedido); la administradora ve y edita todos
drop policy if exists "ver mis pedidos" on public.pedidos;
create policy "ver mis pedidos" on public.pedidos for select to authenticated
  using (user_id = (select auth.uid()) or public.es_admin());
drop policy if exists "admin edita pedidos" on public.pedidos;
create policy "admin edita pedidos" on public.pedidos for update to authenticated
  using (public.es_admin()) with check (public.es_admin());

drop policy if exists "ver mis items" on public.pedido_items;
create policy "ver mis items" on public.pedido_items for select to authenticated
  using (exists (select 1 from public.pedidos p where p.id = pedido_id and (p.user_id = (select auth.uid()) or public.es_admin())));

-- ========== Tiempo real ==========
do $$ begin
  alter publication supabase_realtime add table public.pedidos;
exception when duplicate_object then null; end $$;

-- ========== Archivos (Storage) ==========
insert into storage.buckets (id, name, public) values ('platos', 'platos', true)
  on conflict (id) do nothing;
insert into storage.buckets (id, name, public) values ('comprobantes', 'comprobantes', false)
  on conflict (id) do nothing;

drop policy if exists "admin sube fotos" on storage.objects;
create policy "admin sube fotos" on storage.objects for all to authenticated
  using (bucket_id = 'platos' and public.es_admin()) with check (bucket_id = 'platos' and public.es_admin());

drop policy if exists "subir mi comprobante" on storage.objects;
create policy "subir mi comprobante" on storage.objects for insert to authenticated
  with check (bucket_id = 'comprobantes' and (storage.foldername(name))[1] = (select auth.uid())::text);

drop policy if exists "ver comprobantes" on storage.objects;
create policy "ver comprobantes" on storage.objects for select to authenticated
  using (bucket_id = 'comprobantes' and ((storage.foldername(name))[1] = (select auth.uid())::text or public.es_admin()));
