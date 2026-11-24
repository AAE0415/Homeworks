# Delilicias — Plataforma de pedidos por encargo · Documento de diseño

Fecha: 2026-11-24 · Proyecto final de Estructuras de Datos II (UAO)

## 1. Intención y porqué

Delilicias vende cenas de Navidad por encargo en Cali (entradas, platos fuertes por libra, acompañantes). Hoy su sitio es un menú estático que termina en un mensaje de WhatsApp: no queda registro del pedido, los cupos por fecha se controlan a mano y la cocina organiza la producción sin herramienta.

La plataforma nueva convierte ese flujo en un sistema real con cuentas, pedidos guardados, seguimiento en vivo y panel de administración. Es la entrega del proyecto final de la materia, así que además debe cumplir la rúbrica: propuesta gráfica, plataforma fiel al diseño, menús públicos/privados, mapa, carrito, tiempo real, login/registro reales, 5 estructuras de datos con un uso genuino, estructura de carpetas ordenada, despliegue, documento final y README.

El código se escribe **desde cero**. Del sitio actual de Delilicias solo se reutiliza **contenido**: fotos de los platos, nombres, descripciones, precios, secciones, reglas del negocio (anticipo 50 %, domicilio gratis desde $149.900, fechas 24 y 31 de diciembre, porciones por libra).

## 2. Objetivos, no-objetivos y anti-objetivos

**Objetivos**
- Cliente: ver el menú, buscar, armar canasta (con deshacer), registrarse, hacer un pedido con fecha y dirección, subir el comprobante del anticipo, seguir su pedido en vivo y chatear con la cocina.
- Administradora: confirmar anticipos en orden de llegada, ver la agenda de cocina por urgencia, cambiar estados, gestionar el menú (precios, agotados, fotos), controlar cupos por fecha y responder chats.
- Cumplir cada punto de la rúbrica de forma verificable.

**No-objetivos**
- Pasarela de pago en línea (el anticipo se confirma con comprobante subido por el cliente).
- Rol de repartidor con GPS en vivo.
- App móvil nativa, múltiples sedes, facturación electrónica.

**Anti-objetivos** (fracaso aunque "funcione")
- Estructuras de datos decorativas: cada una debe estar en el flujo real y su porqué debe ser defendible en la sustentación.
- Interfaz con aspecto de plantilla genérica; debe sentirse como Delilicias (cálida, de fiesta, editorial).
- Exponer la llave `service_role` en el frontend o depender de "ocultar" la llave pública: la seguridad la dan las políticas RLS.

## 3. Restricciones

- Stack del curso: React + Vite, JavaScript con `.jsx` y `.module.scss`, React Router, Context API, custom hooks.
- Estructura de carpetas pedida por la rúbrica (sección 7).
- Proyecto en `C:\Users\juann\OneDrive\Documentos\Proyecto_final`; `node_modules` es una unión (junction) hacia `C:\Users\juann\dev-deps\Proyecto_final\node_modules` para que OneDrive no lo sincronice.
- Servicios gratuitos: Supabase (plan Free), Netlify, OpenStreetMap.
- Las cuentas de Supabase, Netlify y GitHub las crea el usuario; el asistente no crea cuentas ni maneja contraseñas.
- Trabajo por pasos: cada paso termina con un avance visible y espera la aprobación del usuario antes de seguir.

## 4. Enfoques considerados

| Enfoque | A favor | En contra |
|---|---|---|
| **React + Vite + Supabase** (elegido) | SQL relacional (pedido ↔ productos), Auth, RLS para separar cliente/admin, Realtime, Storage para fotos y comprobantes en un solo servicio; es lo más reciente del curso (clase 10) | Requiere escribir SQL y políticas |
| React + Vite + Firebase | Visto en clase 08, muy rápido de arrancar | NoSQL dispersa pedidos/ítems y los permisos de admin quedan en reglas menos claras |
| Backend propio (Express) | Control total | Otro servidor por desplegar y mantener, sin puntos extra en la rúbrica |

El usuario aprobó **React + Vite + Supabase**.

## 5. Funcionalidad

### Público (sin sesión)
- **Inicio**: portada de temporada, "Lo más pedido" (top K por heap), carrusel de platos destacados, cómo pedir, condiciones (anticipo, domicilio, fechas límite).
- **Menú**: secciones Entradas / Platos fuertes / Acompañantes renderizadas desde el árbol del menú; menú lateral de secciones; platos agotados visibles pero no pedibles.
- **Buscador**: autocompletado por nombre e ingrediente (trie).
- **Detalle de plato**: foto, descripción, precio por unidad, selector de porciones (3/4/5 por libra en platos fuertes).
- **Canasta**: agregar, cambiar cantidad, quitar, **deshacer** (pila), subtotal, domicilio estimado, anticipo 50 %. Se conserva en `localStorage` para invitados.
- **Mapa de cobertura**: barrios de Cali atendidos, sede de cocina.
- **Login / Registro**.

### Cliente (con sesión, rol `cliente`)
- **Checkout**: fecha de entrega (solo fechas con cupo y antes de su fecha límite), número de personas, barrio (mapa + ruta más corta por grafo → costo de domicilio), dirección, notas. Crea el pedido en la base de datos.
- **Subir comprobante** del anticipo (Supabase Storage).
- **Mis pedidos** e **Mi pedido en vivo**: línea de estados en tiempo real (`recibido → anticipo_confirmado → en_cocina → en_camino → entregado`, o `cancelado`) y chat con la cocina en tiempo real.
- **Mi perfil**: nombre, teléfono, barrio por defecto.

### Administradora (rol `admin`)
- **Bandeja de anticipos** (cola FIFO): pedidos `recibido` con comprobante, en orden de llegada; ver comprobante, confirmar o rechazar.
- **Agenda de cocina** (min-heap): pedidos confirmados ordenados por fecha de entrega y luego por hora de confirmación; avanzar estado.
- **Menú**: crear/editar platos, precio, disponible/agotado, foto.
- **Cupos por fecha**: cupo total y ocupado por fecha de entrega.
- **Chats**: lista de conversaciones abiertas, responder en vivo.
- **Resumen**: pedidos por estado, ventas estimadas, top de platos.

## 6. Estructuras de datos (implementación propia en JS, con pruebas)

Siguen el estilo del curso (clases con `Node`, métodos con los nombres convencionales). Viven en `src/helpers/structures/` y cada una tiene su archivo de pruebas.

| # | Estructura | Uso real | Por qué |
|---|---|---|---|
| 1 | **Queue** (lista enlazada, `enqueue`/`dequeue` O(1)) | Bandeja de anticipos por confirmar | Atender primero a quien pidió primero es la regla justa (FIFO) |
| 2 | **Stack** (`push`/`pop`/`peek`) | Deshacer en la canasta (cada acción se apila con su inverso) | Se deshace siempre la última acción (LIFO) |
| 3 | **Árbol n-ario** (`addChild`, DFS, BFS, `find`) | Menú: raíz › sección › plato › opción de porción; genera el menú lateral y las secciones | El menú es jerárquico por naturaleza |
| 4 | **Trie** (`insert`, `search`, `startsWith` → ids) | Autocompletado por nombre e ingredientes, sin tildes y sin mayúsculas | Búsqueda por prefijo en tiempo proporcional a lo escrito, no al tamaño del menú |
| 5 | **Heap** (MinHeap con comparador configurable; `push`, `pop`, `peek`, `heapify`, `percolateUp/Down`) | Agenda de cocina (min por fecha de entrega) y "Lo más pedido" (top K por cantidad vendida, con comparador inverso) | Extraer siempre el más urgente / el más vendido en O(log n) sin reordenar todo |
| 6 | **Grafo** no dirigido y ponderado (lista de adyacencia; `addNode`, `addEdge`, `searchNode`, `removeNode`, `bfs`, `dijkstra`) | Barrios de Cali como nodos con coordenadas, aristas con distancia en km; ruta más corta desde la cocina al barrio del cliente, dibujada en el mapa; el costo del domicilio sale de la distancia | Las vías forman un grafo y la ruta mínima es un problema de grafos |
| extra | **Lista doblemente enlazada circular** | Carrusel de destacados (anterior/siguiente, cíclico) | Navegar en ambos sentidos sin bordes |

Con esto se cubre la rúbrica: 2 de listas/pilas/colas (cola + pila, más la lista circular extra), 2 de árboles/tries/heaps (árbol n-ario + trie + heap) y el grafo.

## 7. Arquitectura y archivos

```
src/
  helpers/
    format.js            moneda COP, fechas, normalizar texto (sin tildes)
    pricing.js           subtotal, domicilio, anticipo
    structures/          Queue, Stack, NaryTree, Trie, Heap, Graph, CircularList (+ *.test.js)
  context/
    AuthContext.jsx      sesión y perfil (rol)
    CartContext.jsx      canasta + pila de deshacer
  hooks/
    useAuth.js  useCart.js  useMenu.js  useSearch.js  useOrders.js
    useRealtimeOrder.js  useChat.js  useDeliveryRoute.js  useCollection-like CRUD para admin
  lib/supabase.js        cliente único
  routes/
    AppRoutes.jsx        públicas + monta UserRoutes y AdminRoutes; 404
    UserRoutes.jsx       rutas privadas de cliente (guardia por sesión)
    AdminRoutes.jsx      rutas privadas de admin (guardia por rol)
  pages/<Pagina>/<Pagina>.jsx + <Pagina>.module.scss
    Index, Menu, Plato, Canasta, Login, Registro, Checkout, MisPedidos, PedidoEnVivo, Perfil,
    admin/Resumen, admin/Anticipos, admin/Agenda, admin/MenuAdmin, admin/Cupos, admin/Chats, NotFound
  components/
    shared/   Menu (navbar), Footer, Button, Modal, Toast, Loader, ProtectedRoute, EmptyState
    index/    Hero, TopPlatos, CarruselDestacados, ComoPedir
    menu/     SeccionMenu, CardPlato, Buscador, MenuLateral
    cart/     CanastaPanel, ItemCanasta
    orders/   LineaEstados, Chat, MapaDomicilio
    admin/    TablaPedidos, FormPlato, ...
  styles/    _tokens.scss (colores, tipografía, espaciado), _mixins.scss, global.scss
data/        seed.sql, barrios (grafo) en JSON
supabase/    schema.sql (tablas, RLS, políticas, realtime, storage)
docs/        DOCUMENTO_FINAL.md, propuesta gráfica, este diseño
```

Padres e hijos: las páginas son contenedoras (obtienen datos con hooks/contextos) y los componentes son presentacionales (reciben props).

## 8. Datos (Supabase)

- `profiles` (id = auth.users.id, nombre, telefono, barrio_id, rol `cliente`|`admin`)
- `categorias` (id, titulo, subtitulo, orden)
- `productos` (id, categoria_id, nombre, descripcion, ingredientes[], precio, unidad, foto_url, disponible, destacado)
- `fechas_entrega` (id, texto, fecha, pedir_hasta, cupo)
- `pedidos` (id, user_id, fecha_entrega_id, personas, barrio_id, direccion, notas, subtotal, domicilio, total, anticipo, comprobante_url, estado, created_at, confirmado_at)
- `pedido_items` (pedido_id, producto_id, cantidad, porciones, precio_unitario)
- `mensajes` (id, pedido_id, autor_id, texto, created_at)
- Vista/consulta de ventas por producto para el top K.
- RLS: el cliente solo ve y crea lo suyo; `admin` (por `profiles.rol`) ve y edita todo; productos y categorías de lectura pública.
- Realtime activo en `pedidos` y `mensajes`.
- Storage: bucket `platos` (lectura pública, escritura admin) y bucket `comprobantes` (privado, carpeta por usuario).
- Los barrios y distancias del grafo van como JSON en el frontend (datos estáticos), con coordenadas reales aproximadas.

## 9. Diseño visual

- Se diseña primero la **propuesta gráfica** con la skill Impeccable como maquetas HTML de las pantallas clave (Inicio, Menú, Canasta, Checkout con mapa, Pedido en vivo, Login, panel admin), en escritorio y móvil. Se pueden importar a Figma con el plugin *html.to.design* para la entrega "propuesta gráfica en Figma".
- Identidad: cálida y festiva sin caer en clichés navideños; editorial (numerales romanos por sección, como en el menú actual), tipografía con carácter para títulos, fotos de producto protagonistas.
- Estilos con SCSS Modules + tokens propios en `_tokens.scss` (sin librería de componentes pesada, para mantener la fidelidad al diseño). Accesible (contraste AA, foco visible, navegación con teclado) y responsive.

## 10. Calidad, entrega y git

- Pruebas con Vitest para todas las estructuras (TDD) y para `pricing.js`.
- Despliegue: Netlify (build de Vite, `_redirects` para SPA, variables `VITE_SUPABASE_URL` y `VITE_SUPABASE_KEY`). El backend es Supabase (ya alojado).
- `README.md`: integrantes, enlace a la propuesta gráfica, enlace de Netlify, cómo correr el proyecto, usuarios de prueba.
- `docs/DOCUMENTO_FINAL.md`: alcance, tecnologías, estructuras de datos y su porqué.
- Ramas: una por integrante (nombres pendientes), mezcladas en `main` al final.

## 11. Orden de trabajo (cada paso termina con avance para aprobar)

1. Propuesta gráfica (maquetas).
2. Esqueleto: Vite, carpetas, rutas, layout, tokens de estilo.
3. Estructuras de datos con pruebas.
4. Supabase: esquema, RLS, datos semilla, login/registro.
5. Menú público, buscador, canasta con deshacer, inicio.
6. Checkout con mapa y grafo, cupos, comprobante.
7. Pedido en vivo y chat en tiempo real.
8. Panel de administración.
9. Despliegue, README, documento final, ramas.

## 12. Decisiones que tomó el asistente (revisables)

- Anticipo por **comprobante subido**, no pasarela de pago.
- Chat dentro de la plataforma en lugar de WhatsApp; el número de WhatsApp queda solo como contacto en el pie.
- Barrios del grafo como JSON estático (~15–20 barrios de Cali) en lugar de una API de rutas.
- Costo de domicilio: gratis desde $149.900; si no, tarifa por km de la ruta más corta (valores configurables en `pricing.js`).
- Sin librería de componentes UI; SCSS Modules + tokens propios.
- Cola implementada sobre lista enlazada (O(1) al sacar), corrigiendo el `shift()` O(n) de las diapositivas.

## 13. Pendiente del usuario

- Nombres de los integrantes (README y ramas).
- Crear cuentas de Supabase, Netlify y GitHub cuando lleguemos a esos pasos.
