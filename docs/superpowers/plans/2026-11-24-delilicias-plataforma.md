# Delilicias — Plataforma de pedidos · Plan de implementación

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Plataforma web de pedidos por encargo para Delilicias (React + Supabase) que cumple la rúbrica del proyecto final de ED2.

**Architecture:** SPA con React + Vite. Las páginas son contenedoras (datos vía hooks/contextos) y los componentes son presentacionales (props). Las 6 estructuras de datos son clases JS propias en `src/helpers/structures/`, probadas con Vitest, y se usan en el flujo real. Supabase da Auth, Postgres con RLS, Realtime (tabla `pedidos`) y Storage.

**Tech Stack:** Vite 9 (plantilla `react`, JS), React 19, react-router-dom 6.30, @supabase/supabase-js 2, sass, leaflet 1.9 + react-leaflet 5, vitest + jsdom. Despliegue: Netlify.

**Spec:** `docs/superpowers/specs/2026-11-24-delilicias-plataforma-design.md`

## Global Constraints

- Idioma de la interfaz y del código de dominio: español (nombres de páginas, textos, tablas). Métodos de las estructuras en inglés, como en el curso (`enqueue`, `push`, `addChild`, `insert`, `addEdge`…).
- Archivos `.jsx` + `.module.scss`; carpetas `helpers/`, `context/`, `pages/<Pagina>/`, `components/<area>/`, `hooks/`, `routes/` con `AppRoutes.jsx`, `UserRoutes.jsx`, `AdminRoutes.jsx`.
- Reglas del negocio: anticipo **50 %** del subtotal; domicilio **gratis desde $149.900** (subtotal ≥ 149900), si no "Por acordar por WhatsApp"; fechas **24 de diciembre** (pedir hasta **2026-12-17**) y **31 de diciembre**; porciones por libra: "3 porciones de 166 g", "4 porciones de 125 g", "5 porciones de 100 g".
- Sin chat interno y sin tarifa por km (decisión del usuario).
- Nunca usar `service_role` en el frontend. Variables: `VITE_SUPABASE_URL`, `VITE_SUPABASE_KEY` en `.env` (ignorado por git) y `.env.example` versionado.
- Moneda: COP sin decimales con `Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 })`.
- `node_modules` es una unión hacia `C:\Users\juann\dev-deps\Proyecto_final\node_modules`; no borrarla ni recrearla.
- Trabajo en la rama `juan-pablo-cuellar`; se mezcla a `main` en el Hito 9.
- **Puntos de control:** al terminar cada hito, parar, mostrar el avance al usuario (captura, enlace o salida de pruebas) y esperar su aprobación antes del siguiente hito.

## Review Focus

1. **Búsqueda con tildes/mayúsculas** ("Jamón", "JAMON", "jamon") debe dar el mismo resultado → prueba en Tarea 3.4 (`startsWith` normaliza).
2. **Fecha vencida o sin cupo** no debe poder elegirse, ni en la UI ni en la base de datos → prueba de `fechasDisponibles` en Tarea 2.2 y trigger SQL en Tarea 4.1.
3. **Canasta guardada con un plato que luego se agotó o cambió de precio** → `reconciliarCanasta` en Tarea 2.2; el checkout se bloquea si hay ítems no disponibles.
4. **Barrio sin conexión con la cocina** → `dijkstra` devuelve `null` (Tarea 3.6) y la UI muestra "Fuera de cobertura".
5. **Deshacer con la pila vacía o tras vaciar la canasta** → no-op seguro; deshacer "quitar" restaura cantidad y porciones (Tarea 5.3).

---

## Mapa de archivos

```
index.html  vite.config.js  netlify.toml  .env.example  README.md
docs/propuesta-grafica/        maquetas HTML (Hito 1)
docs/DOCUMENTO_FINAL.md        (Hito 9)
supabase/schema.sql            tablas, RLS, triggers, realtime, storage
supabase/seed.sql              categorías, productos, fechas, configuración
public/img/                    fotos de platos (copiadas del sitio Delilicias)
src/main.jsx  src/App.jsx
src/styles/_tokens.scss _mixins.scss global.scss
src/lib/supabase.js
src/data/barrios.js
src/helpers/format.js pricing.js whatsapp.js menuTree.js searchIndex.js orders.js
src/helpers/structures/Queue.js Stack.js CircularList.js NaryTree.js Trie.js Heap.js Graph.js (+ .test.js cada una)
src/context/AuthContext.jsx CartContext.jsx
src/hooks/useAuth.js useCart.js useMenu.js useSearch.js useOrders.js useRealtimeOrder.js useDeliveryRoute.js useAdminOrders.js
src/routes/AppRoutes.jsx UserRoutes.jsx AdminRoutes.jsx
src/pages/{Index,Menu,Plato,Canasta,Cobertura,Login,Registro,NotFound,Checkout,MisPedidos,PedidoEnVivo,Perfil}/
src/pages/admin/{Resumen,Anticipos,Agenda,PedidoDetalle,MenuAdmin,Cupos}/
src/components/shared/  Menu Footer Button Modal Toast Loader ProtectedRoute EmptyState Layout AdminLayout
src/components/index/   Hero TopPlatos CarruselDestacados ComoPedir
src/components/menu/    SeccionMenu CardPlato Buscador MenuLateral
src/components/cart/    CanastaPanel ItemCanasta ResumenCanasta
src/components/orders/  LineaEstados MapaDomicilio BotonWhatsApp
src/components/admin/   TablaPedidos FormPlato
```

---

## Hito 1 — Propuesta gráfica

### Tarea 1.1: Contexto de diseño y maquetas

**Files:** Create `docs/propuesta-grafica/index.html` (índice), una página HTML por pantalla, `docs/propuesta-grafica/DESIGN.md` (tokens: colores, tipografías, espaciado, radios, sombras).

- [ ] **Step 1:** Crear la rama `juan-pablo-cuellar` desde `main`.
- [ ] **Step 2:** Invocar la skill `impeccable` con el contexto: marca Delilicias, cena de Navidad por encargo en Cali, cálida/festiva/editorial con numerales romanos por sección, fotos protagonistas, sin clichés navideños, AA. Fotos tomadas de `C:\Users\juann\Downloads\Menú digital-html\sitio\img\` copiadas a `public/img/` (mismos nombres).
- [ ] **Step 3:** Maquetar en escritorio (1440) y móvil (390): Inicio, Menú con buscador abierto, Canasta (panel), Checkout con mapa, Mi pedido en vivo, Login/Registro, Admin · Anticipos, Admin · Agenda.
- [ ] **Step 4:** Escribir `DESIGN.md` con los tokens finales; esos valores pasan tal cual a `src/styles/_tokens.scss` en el Hito 2.
- [ ] **Step 5:** Commit `docs: propuesta gráfica`.
- [ ] **Punto de control:** abrir las maquetas en el navegador, enviar capturas al usuario y esperar aprobación. Indicar cómo importarlas a Figma (plugin *html.to.design*).

---

## Hito 2 — Esqueleto

### Tarea 2.1: Proyecto Vite, dependencias, estilos base y rutas vacías

**Files:** Create todo lo de la raíz, `src/main.jsx`, `src/App.jsx`, `src/styles/*`, `src/routes/*`, una página mínima por ruta, `src/components/shared/{Layout,AdminLayout,Menu,Footer,ProtectedRoute}`, `.claude/launch.json`.

**Interfaces — Produces:**
- Rutas públicas (`AppRoutes`): `/` Index, `/menu` Menu, `/plato/:id` Plato, `/canasta` Canasta, `/cobertura` Cobertura, `/login` Login, `/registro` Registro, `*` NotFound.
- `UserRoutes` montado en `/cuenta/*`: `checkout`, `pedidos`, `pedidos/:id`, `perfil`. Guardia: sin sesión → `/login?volver=<ruta>`.
- `AdminRoutes` montado en `/admin/*`: índice Resumen, `anticipos`, `agenda`, `pedidos/:id`, `menu`, `cupos`. Guardia: rol ≠ `admin` → `/`.
- `<ProtectedRoute requireRole?: 'admin'>` renderiza `<Outlet/>`.

- [ ] **Step 1:** Scaffold con `npm create vite@latest . -- --template react` (conservar `docs/`, `.gitignore`, la unión `node_modules`) e instalar: `react-router-dom@6 @supabase/supabase-js sass leaflet react-leaflet` y dev `vitest jsdom`. Script `"test": "vitest run"`. `vitest` con `environment: 'jsdom'` en `vite.config.js`.
- [ ] **Step 2:** Verificar que la unión funciona: `npm run dev` sirve la app y `npm run build` termina sin errores; si Vite rechaza rutas fuera de la raíz, añadir `server.fs.allow` con la ruta de `dev-deps`.
- [ ] **Step 3:** `_tokens.scss` con los valores de `DESIGN.md`; `global.scss` (reset, tipografías, foco visible); Layout público (Menu + Outlet + Footer) y AdminLayout (barra lateral).
- [ ] **Step 4:** Rutas con guardias usando un `AuthContext` provisional (`user: null, perfil: null, cargando: false`) que se reemplaza en el Hito 4.
- [ ] **Step 5:** `.claude/launch.json` con config `delilicias` (`npm run dev`, puerto 5173).
- [ ] **Step 6:** Commit `feat: esqueleto, rutas y estilos base`.

### Tarea 2.2: Helpers de dominio

**Files:** Create `src/helpers/format.js`, `pricing.js`, `whatsapp.js`, `orders.js` + `src/helpers/helpers.test.js`.

**Interfaces — Produces:**
- `normalizeText(str): string` — minúsculas, sin tildes (NFD + quitar diacríticos), `ñ` se conserva como `n`, espacios colapsados.
- `formatCOP(n): string`, `formatFecha(isoDate): string` ("24 de diciembre").
- `calcularSubtotal(items: {precio:number, cantidad:number}[]): number`
- `domicilioEsGratis(subtotal, desde = 149900): boolean`
- `calcularAnticipo(subtotal, porcentaje = 50): number` — `Math.round`.
- `linkWhatsApp(numero: string, mensaje: string): string` → `https://wa.me/<numero>?text=<encodeURIComponent(mensaje)>`
- `mensajePedido({id, fechaTexto, barrio, items, subtotal}): string` y `mensajeAdmin({id, nombre, ...}): string`.
- `fechasDisponibles(fechas: {id, fecha, pedir_hasta|null, cupo, ocupados}[], hoy: Date): fechas[]` — excluye `pedir_hasta < hoy` (comparando por día) y `ocupados >= cupo`.
- `reconciliarCanasta(items, productosPorId): {items, cambios: {id, tipo: 'agotado'|'precio'|'eliminado'}[]}` — actualiza precio, marca `disponible:false`, quita los que ya no existen.
- `ESTADOS = ['recibido','anticipo_confirmado','en_cocina','en_camino','entregado']`, `siguienteEstado(estado): string|null`.

- [ ] **Step 1:** Pruebas: `normalizeText('Jamón  de POLLO') === 'jamon de pollo'`; `calcularAnticipo(149900) === 74950`; `domicilioEsGratis(149899) === false`, `domicilioEsGratis(149900) === true`; `linkWhatsApp('573152377306','Hola pedido #12')` termina en `?text=Hola%20pedido%20%2312`; `fechasDisponibles` con hoy=2026-12-18 excluye la del 24 (pedir_hasta 2026-12-17) y una con `ocupados === cupo`, incluye la del 31; `reconciliarCanasta` marca agotado, actualiza precio de 45900→47000 y elimina un id inexistente; `siguienteEstado('entregado') === null`.
- [ ] **Step 2:** `npm test` → FAIL.
- [ ] **Step 3:** Implementar.
- [ ] **Step 4:** `npm test` → PASS.
- [ ] **Step 5:** Commit `feat: helpers de formato, precios, whatsapp y pedidos`.
- [ ] **Punto de control (Hito 2):** captura del layout con navegación entre rutas vacías + salida de `npm test`.

---

## Hito 3 — Estructuras de datos (TDD, estilo del curso)

Cada tarea: escribir `<Estructura>.test.js` → `npm test` FAIL → implementar → PASS → commit `feat: <estructura>`.

### Tarea 3.1: Queue (lista enlazada)
**Produces:** `class Queue { enqueue(value); dequeue(): value|null; peek(): value|null; size(): number; isEmpty(): boolean; toArray(): value[]; print() }` con `Node {value, next}`, `head`, `tail`, `length`.
**Tests:** orden FIFO con 3 elementos; `dequeue()` en vacía → `null`; tras vaciar, `tail === null` y un nuevo `enqueue` funciona; `toArray()` refleja el orden.

### Tarea 3.2: Stack
**Produces:** `class Stack { push(value); pop(): value|null; peek(): value|null; isEmpty(); size(); toArray() /* tope primero */; clear() }` sobre array `items`.
**Tests:** LIFO; `pop()`/`peek()` en vacía → `null`; `clear()` deja `size() === 0`.

### Tarea 3.3: CircularList (doble y circular)
**Produces:** `class CircularList { append(value); current(): value|null; next(): value|null; prev(): value|null; size(); toArray() }` con `Node {value, next, prev}`; `next()`/`prev()` mueven el cursor y devuelven el nuevo actual.
**Tests:** con [a,b,c]: `next()` x3 vuelve a `a`; `prev()` desde `a` da `c`; lista de 1 elemento: `next()` devuelve el mismo; vacía → `null`.

### Tarea 3.4: Trie
**Produces:** `class Trie { insert(word: string, id: string); search(word): boolean; startsWith(prefix): string[] }`; `TrieNode {children: {}, isEndOfWord, ids: Set}`. Toda entrada pasa por `normalizeText`. `startsWith` recorre el subárbol y devuelve ids únicos en orden de inserción; prefijo vacío → `[]`.
**Tests:** insertar "Jamón de pollo"(jamon-pollo), "Dip de queso crema y tocineta"(dip), "Arroz con maicitos y tocineta"(arroz); `startsWith('JAM')` y `startsWith('jam')` → `['jamon-pollo']`; `startsWith('xyz')` → `[]`; `search('jamon de pollo') === true`, `search('jam') === false`.
**Helper:** `src/helpers/searchIndex.js` → `buildSearchIndex(productos): Trie` inserta el nombre completo, cada palabra del nombre (≥3 letras) y cada ingrediente, todos con el id del producto. Prueba: `startsWith('toci')` contiene `dip` y `arroz`.

### Tarea 3.5: Heap
**Produces:** `class Heap { constructor(compare = (a,b) => a - b, initial = []); push(v); pop(); peek(); size(); isEmpty(); heapify(); percolateUp(i); percolateDown(i); swap(i,j); toArray() }` (min-heap según `compare`; `heapify` se llama en el constructor). `static topK(items, k, compare): items[]` devuelve los k mayores según `compare`, ordenados de mayor a menor.
**Tests:** `pop` sucesivo de [5,3,8,1] → 1,3,5,8; `pop` en vacío → `undefined`; comparador de agenda `(a,b) => a.fecha.localeCompare(b.fecha) || a.confirmado_at.localeCompare(b.confirmado_at)` saca primero 24-dic aunque se insertó después; `topK` de ventas `{id, cantidad}` con k=2 → los dos con más cantidad, mayor primero; empate estable no requerido.
**Helper:** `src/helpers/orders.js` agrega `ordenarAgenda(pedidos): pedidos[]` (vacía el heap) y `masPedidos(ventas, k = 4)`.

### Tarea 3.6: Graph
**Produces:** `class Graph { addNode(id, data); addEdge(a, b, weight); removeNode(id); searchNode(id): data|null; getEdges(id): {to, weight}[]; isEmpty(); size(); bfs(start): id[]; dijkstra(start, end): {path: id[], distance: number} | null }` (no dirigido; `nodes: Map`, `adjacency: Map`). Dijkstra usa la clase `Heap` de la Tarea 3.5 como cola de prioridad.
**Tests:** grafo A–B(2), B–C(3), A–C(10), D aislado: `dijkstra('A','C')` → `{path:['A','B','C'], distance:5}`; `dijkstra('A','D')` → `null`; `bfs('A')` no incluye D; `removeNode('B')` elimina sus aristas y `dijkstra('A','C').distance === 10`; `addEdge` con nodo inexistente lanza `Error`.
**Data:** `src/data/barrios.js` → `export const COCINA = 'san-fernando'` (configurable) y `export const BARRIOS = { nodos: [{id, nombre, lat, lng}], aristas: [[a, b, km]] }` con 18 barrios reales de Cali (coordenadas aproximadas, aristas entre barrios vecinos) incluyendo al menos uno fuera de cobertura (sin aristas). `buildGrafoBarrios(): Graph` en el mismo archivo. Prueba: todos los barrios con aristas son alcanzables desde `COCINA`.

### Tarea 3.7: NaryTree
**Produces:** `class TreeNode { constructor(value); children = []; addChild(node): TreeNode; isLeaf() }`; `class NaryTree { root; find(predicate): TreeNode|null /* DFS */; dfs(): value[]; bfs(): value[] }`.
**Helper:** `src/helpers/menuTree.js` → `buildMenuTree(categorias, productos, porciones): NaryTree` con raíz `{tipo:'menu'}`, hijos `{tipo:'seccion', ...categoria}` en `orden`, nietos `{tipo:'plato', ...producto}` y, para platos con `unidad === 'libra'`, hijos `{tipo:'porcion', texto}`.
**Tests:** `bfs()` da raíz, luego secciones en orden; `find(v => v.id === 'rollo-mixto')` existe y tiene 3 hijos porción; un acompañante no tiene hijos; DFS visita sección I completa antes que la II.
- [ ] **Punto de control (Hito 3):** salida completa de `npm test` y tabla resumen estructura → archivo → dónde se usará.

---

## Hito 4 — Supabase y autenticación

### Tarea 4.1: Esquema, seguridad y datos semilla

**Files:** Create `supabase/schema.sql`, `supabase/seed.sql`, `.env.example`, `src/lib/supabase.js`.

- [ ] **Step 1 (usuario):** pedir al usuario que cree el proyecto Supabase (región São Paulo) y pegue en `.env` la Project URL y la publishable key. El asistente no crea la cuenta ni ve contraseñas.
- [ ] **Step 2:** `schema.sql` con las tablas del spec §8: `profiles` (rol default `'cliente'`, `telefono` not null), `categorias`, `productos` (incluye `ingredientes text[]`, `destacado bool`), `fechas_entrega`, `pedidos` (estado con `check` en los 6 valores), `pedido_items`, `configuracion` (fila única). Trigger `on auth.users insert` → crea `profiles` con `raw_user_meta_data` (nombre, telefono). Función `es_admin()` (`security definer`) usada en políticas. Trigger `before insert on pedidos` que rechaza si la fecha venció o `ocupados >= cupo`. Vista `ventas_por_producto` (suma de cantidades de pedidos no cancelados) y vista `fechas_disponibilidad` (cada fecha con `ocupados` = pedidos no cancelados), ambas legibles públicamente sin exponer datos personales. RLS: lectura pública de `categorias`, `productos`, `fechas_entrega`, `configuracion` y de las dos vistas; cliente: select/insert de sus `pedidos` y `pedido_items`, update solo de `comprobante_url` mientras `estado = 'recibido'`; admin: todo. `alter publication supabase_realtime add table pedidos`. Buckets `platos` (público, escritura admin) y `comprobantes` (privado, carpeta `auth.uid()`; admin lee todo).
- [ ] **Step 3:** `seed.sql` con las 3 categorías y los 15 productos de Delilicias (nombres, descripciones, precios, unidades, ingredientes, `foto_url = '/img/<archivo>.jpg'`), fechas 24-dic (pedir_hasta 2026-12-17, cupo 40) y 31-dic (cupo 40), configuración (whatsapp `573152377306`, `domicilio_gratis_desde 149900`, `anticipo 50`).
- [ ] **Step 4:** Ejecutar ambos scripts en el SQL Editor (el usuario o el asistente vía navegador con la sesión del usuario) y verificar con `select count(*) from productos` → 15.
- [ ] **Step 5:** Commit `feat: esquema supabase, RLS y semilla`.

### Tarea 4.2: AuthContext, Login, Registro

**Interfaces — Produces:** `useAuth(): { user, perfil: {id, nombre, telefono, barrio_id, rol}|null, cargando, login(email, password), registrar({nombre, telefono, email, password}), logout(), actualizarPerfil(datos) }`. Errores devueltos como `{ error: string }` en español.

- [ ] **Step 1:** `AuthProvider` con `supabase.auth.getSession()` + `onAuthStateChange`, carga `profiles`.
- [ ] **Step 2:** Páginas Login/Registro (validación: email, contraseña ≥ 8, teléfono colombiano de 10 dígitos que empieza por 3); al entrar redirige a `volver` o `/`.
- [ ] **Step 3:** Perfil editable en `/cuenta/perfil`.
- [ ] **Step 4:** Promover una cuenta a admin con `update profiles set rol='admin' where id = ...` (documentado en README).
- [ ] **Step 5:** Verificar en navegador: registro → sesión → `/cuenta/perfil`; cliente en `/admin` → redirige a `/`.
- [ ] **Step 6:** Commit `feat: autenticación real con supabase`.
- [ ] **Punto de control (Hito 4):** capturas de registro/login y de las tablas con datos.

---

## Hito 5 — Menú público, buscador, canasta, inicio

### Tarea 5.1: useMenu y página Menú
**Produces:** `useMenu(): { categorias, productos, productosPorId, arbol: NaryTree, cargando, error }` (una sola carga, cacheada en módulo).
- [ ] Menú renderizado recorriendo `arbol` (SeccionMenu → CardPlato), MenuLateral generado del árbol (BFS nivel 1), agotados con etiqueta "Agotado" y botón deshabilitado. Página Plato con selector de porciones (hijos porción del nodo). Commit.

### Tarea 5.2: Buscador
**Produces:** `useSearch(productos): { query, setQuery, resultados: producto[] }` usando `buildSearchIndex` (memo).
- [ ] Buscador con lista de sugerencias accesible (combobox ARIA, flechas + Enter, Escape cierra). Prueba manual: "toci" muestra dip y arroz; "JAMÓN" muestra jamón de pollo. Commit.

### Tarea 5.3: CartContext con deshacer
**Produces:** `useCart(): { items: {id, nombre, precio, unidad, foto_url, cantidad, porciones|null, disponible}[], agregar(producto, {cantidad=1, porciones=null}), cambiarCantidad(clave, n), quitar(clave), vaciar(), deshacer(), puedeDeshacer, subtotal, anticipo, domicilioGratis, totalItems }`. `clave = id + '|' + (porciones ?? '')`. Persistencia en `localStorage['delilicias:canasta']`; al cargar el menú se aplica `reconciliarCanasta`. Cada operación apila en `Stack` su acción inversa (`{tipo, antes}`); `deshacer()` la aplica; `vaciar()` apila el estado completo.
- [ ] **Tests** (`src/context/cart.logic.test.js`, lógica pura en `src/context/cartLogic.js`): agregar dos veces suma cantidad; quitar y deshacer restaura cantidad y porciones; vaciar y deshacer restaura todo; deshacer con pila vacía no cambia nada; cantidad 0 equivale a quitar.
- [ ] CanastaPanel (lateral) + página Canasta con ResumenCanasta: subtotal, "Domicilio: Gratis" o "Por acordar por WhatsApp", anticipo 50 %, aviso de ítems agotados. Commit.

### Tarea 5.4: Inicio
- [ ] Hero, TopPlatos (`masPedidos` sobre `ventas_por_producto`, k=4; si no hay ventas, los `destacado`), CarruselDestacados con `CircularList` (botones anterior/siguiente, avance automático cada 6 s que se pausa al pasar el mouse o con `prefers-reduced-motion`), ComoPedir, condiciones. Página Cobertura con el mapa de barrios. Commit.
- [ ] **Punto de control (Hito 5):** capturas escritorio/móvil de inicio, menú, búsqueda y canasta con deshacer.

---

## Hito 6 — Checkout, mapa y comprobante

### Tarea 6.1: useDeliveryRoute y MapaDomicilio
**Produces:** `useDeliveryRoute(barrioId): { ruta: {path, distance}|null, enCobertura: boolean, minutos: number }` (minutos = `Math.round(distance / 25 * 60)` a 25 km/h). `<MapaDomicilio barrioId onSelect>` con react-leaflet + tiles OSM: marcadores de barrios, cocina destacada, polilínea de la ruta.
- [ ] Barrio fuera de cobertura → mensaje "Fuera de cobertura, escríbenos por WhatsApp" y checkout bloqueado. Commit.

### Tarea 6.2: Checkout y creación del pedido
**Produces:** `useOrders(): { crearPedido(datos): {id}|{error}, misPedidos, subirComprobante(pedidoId, file) }`.
- [ ] Formulario: fecha (solo `fechasDisponibles`), personas, barrio (select + mapa), dirección, notas. Inserta `pedidos` + `pedido_items` (`domicilio_gratis` calculado), vacía la canasta, redirige a `/cuenta/pedidos/:id`. Error del trigger de cupo → mensaje claro.
- [ ] Subida de comprobante (imagen o PDF ≤ 5 MB) a `comprobantes/<uid>/<pedidoId>.<ext>`. Commit.
- [ ] **Punto de control (Hito 6):** video corto o capturas del flujo canasta → checkout → pedido creado.

---

## Hito 7 — Pedido en vivo y WhatsApp

### Tarea 7.1: useRealtimeOrder, LineaEstados, BotonWhatsApp
**Produces:** `useRealtimeOrder(pedidoId): { pedido, items, cargando }` suscrito a `postgres_changes` de `pedidos` filtrado por id (limpia el canal en el cleanup). `<BotonWhatsApp numero mensaje label>`.
- [ ] PedidoEnVivo: LineaEstados (estado actual resaltado, cancelado aparte), resumen, mapa con la ruta, botón "Hablar por WhatsApp" con `mensajePedido`. MisPedidos con lista y estado. Verificar: cambiar el estado desde el SQL Editor actualiza la página sin recargar. Commit.
- [ ] **Punto de control (Hito 7).**

---

## Hito 8 — Panel de administración

### Tarea 8.1: useAdminOrders, Anticipos y Agenda
**Produces:** `useAdminOrders(): { pedidos, cambiarEstado(id, estado), anotarDomicilio(id, valor), urlComprobante(path) }` con suscripción realtime a toda la tabla `pedidos`.
- [ ] Anticipos: `Queue` con los pedidos `recibido` ordenados por `created_at`; se muestra el frente con su comprobante (URL firmada) y botones Confirmar (→ `anticipo_confirmado`, sella `confirmado_at`) / Rechazar (→ `cancelado`); la lista restante debajo.
- [ ] Agenda: `ordenarAgenda` (Heap) sobre pedidos `anticipo_confirmado`/`en_cocina`/`en_camino`, agrupados por fecha; botón "Siguiente estado".
- [ ] PedidoDetalle: ítems, datos del cliente, mapa, campo domicilio acordado, botón "Escribir por WhatsApp" con `mensajeAdmin`. Commit.

### Tarea 8.2: Menú, cupos y resumen
- [ ] MenuAdmin: tabla de platos con edición de precio, disponible, destacado; FormPlato para crear/editar con subida de foto al bucket `platos`.
- [ ] Cupos: por fecha, cupo editable y ocupados.
- [ ] Resumen: conteo por estado, ventas estimadas (suma de subtotales no cancelados), top 5 con `masPedidos`. Commit.
- [ ] **Punto de control (Hito 8).**

---

## Hito 9 — Entrega

### Tarea 9.1: Calidad y despliegue
- [ ] Revisión con `impeccable` (auditoría de accesibilidad, responsive, estados vacíos/carga/error) y corrección de hallazgos.
- [ ] `netlify.toml` (`build = npm run build`, `publish = dist`, redirect `/* /index.html 200`). El usuario crea la cuenta de Netlify y el repositorio de GitHub; se conecta el repo y se cargan las variables `VITE_SUPABASE_URL` y `VITE_SUPABASE_KEY`. Agregar el dominio de Netlify en Supabase → Auth → URL Configuration.
- [ ] Verificar en producción: registro, pedido, cambio de estado en vivo, admin.

### Tarea 9.2: Documentación y ramas
- [ ] `README.md`: integrante (Juan Pablo Cuellar), enlace a la propuesta gráfica (Figma o `docs/propuesta-grafica`), enlace de Netlify, backend (Supabase), cómo correr, usuarios de prueba, cómo crear un admin.
- [ ] `docs/DOCUMENTO_FINAL.md`: alcance, tecnologías, arquitectura, cada estructura de datos con dónde se usa, por qué y su complejidad.
- [ ] Mezclar `juan-pablo-cuellar` en `main` (`git merge --no-ff`) y empujar ambas ramas al GitHub del usuario (con su aprobación).
- [ ] **Punto de control final:** `npm test` en verde, build OK, enlaces funcionando.
