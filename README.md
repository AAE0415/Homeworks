# Delilicias · Plataforma de pedidos por encargo

Proyecto final de **Estructuras de Datos II** (Universidad Autónoma de Occidente).

Delilicias cocina cenas de Navidad por encargo en Cali. Esta plataforma reemplaza el menú que terminaba en un mensaje de WhatsApp: el cliente arma su canasta, separa una fecha con cupo, paga el anticipo y sigue su pedido en vivo; la administradora confirma anticipos en orden de llegada y organiza la cocina por urgencia.

## Integrante

| Nombre | Rama |
|---|---|
| Juan Pablo Cuellar | `juan-pablo-cuellar` |

## Enlaces

| Qué | Enlace |
|---|---|
| Plataforma publicada (Netlify) | _pendiente: se agrega al publicar_ |
| Propuesta gráfica | [`docs/propuesta-grafica/index.html`](docs/propuesta-grafica/index.html) (maquetas HTML; se importan a Figma con el plugin *html.to.design*) |
| Documento final | [`docs/DOCUMENTO_FINAL.md`](docs/DOCUMENTO_FINAL.md) |
| Backend | Supabase (base de datos PostgreSQL, Auth, Realtime y Storage) |

## Tecnologías

React 19 + Vite · React Router 6 · Context API y custom hooks · SCSS Modules · Supabase · Leaflet + OpenStreetMap · Vitest · Netlify.

## Estructuras de datos

Implementadas desde cero en [`src/helpers/structures/`](src/helpers/structures), cada una con sus pruebas:

| Estructura | Dónde se usa |
|---|---|
| Cola (lista enlazada) | Bandeja de anticipos: se atiende primero a quien pidió primero |
| Pila | "Deshacer" en la canasta |
| Lista doblemente enlazada circular | Carrusel de platos de la portada |
| Árbol n-ario | Menú (sección › plato › porción) y menú lateral |
| Trie | Buscador con autocompletado por nombre e ingrediente |
| Heap | Agenda de cocina por urgencia y "Lo más pedido" (top K) |
| Grafo + Dijkstra | Barrios de Cali: cobertura y ruta más corta desde la cocina |

El porqué de cada una está en el [documento final](docs/DOCUMENTO_FINAL.md).

## Cómo correrlo

Requisitos: Node 20 o superior y un proyecto de Supabase.

1. Instalar dependencias:
   ```bash
   npm install
   ```
2. Crear `.env` en la raíz (ver `.env.example`):
   ```
   VITE_SUPABASE_URL=https://xxxx.supabase.co
   VITE_SUPABASE_KEY=sb_publishable_xxxx
   ```
3. En Supabase → SQL Editor, ejecutar en este orden: [`supabase/schema.sql`](supabase/schema.sql), [`supabase/grants.sql`](supabase/grants.sql) y [`supabase/seed.sql`](supabase/seed.sql). (`migracion-01-revision.sql` solo hace falta en bases creadas antes de esa revisión.)
4. Iniciar:
   ```bash
   npm run dev      # http://localhost:5173
   npm test         # pruebas
   npm run build    # versión de producción en dist/
   ```

### Crear una administradora

Registra la cuenta en la app y luego, en el SQL Editor:

```sql
update public.profiles set rol = 'admin'
where id = (select id from auth.users where email = 'correo@de-la-admin.com');
```

El rol solo se puede asignar desde el SQL Editor: un cliente no puede dárselo a sí mismo desde la app.

### Cuentas de prueba

Hay una cuenta de cliente y una de administradora para la sustentación. Sus datos no se publican en el repositorio; se entregan aparte.

## Estructura de carpetas

```
src/
  helpers/      funciones generales y structures/ (las estructuras de datos)
  context/      AuthProvider, CartProvider (canasta con deshacer)
  hooks/        useAuth, useCart, useMenu, useSearch, useFechas, useOrders,
                useRealtimeOrder, useAdminOrders, useDeliveryRoute
  routes/       AppRoutes, UserRoutes, AdminRoutes
  pages/        una carpeta por página: Pagina.jsx + Pagina.module.scss
  components/   shared/, index/, menu/, cart/, orders/, cuenta/, admin/
  data/         barrios.js (grafo de barrios de Cali)
  lib/          cliente de Supabase
supabase/       schema.sql, grants.sql, seed.sql
docs/           propuesta gráfica, documento final, diseño y plan
```

## Publicación en Netlify

El archivo [`netlify.toml`](netlify.toml) ya define el build (`npm run build`, carpeta `dist`) y la redirección para las rutas de React. En Netlify se conecta el repositorio de GitHub y se agregan las variables `VITE_SUPABASE_URL` y `VITE_SUPABASE_KEY`. Después, en Supabase → Authentication → URL Configuration, se agrega la dirección de Netlify como Site URL.
