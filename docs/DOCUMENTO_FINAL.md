# Documento final · Delilicias

**Proyecto final de Estructuras de Datos II · Universidad Autónoma de Occidente**
**Integrante:** Juan Pablo Cuellar

## 1. Alcance del sistema

Delilicias es una cocina de Cali que vende cenas de Navidad por encargo (rollos, lomos, costillas y acompañantes) para el 24 y el 31 de diciembre, con cupos limitados por fecha y un anticipo del 50 %. Antes, su sitio terminaba en un mensaje de WhatsApp: no quedaba registro del pedido, los cupos se llevaban a mano y la cocina no tenía cómo ordenar la producción.

La plataforma resuelve eso con dos partes:

**Para el cliente (público y con cuenta)**
- Portada con el almanaque de diciembre: platos destacados, fechas de entrega con los cupos que quedan y lo más pedido.
- Menú por secciones, buscador con autocompletado y detalle de plato con porciones (3, 4 o 5 por libra).
- Canasta con deshacer; domicilio gratis desde $149.900 o por acordar por WhatsApp; anticipo del 50 %.
- Registro e inicio de sesión reales, perfil con celular obligatorio.
- Checkout: fecha con cupo, datos de entrega y ruta más corta en el mapa de Cali.
- Subida del comprobante del anticipo y seguimiento del pedido **en tiempo real**, con botón de WhatsApp que lleva el pedido ya escrito.

**Para la administradora**
- Bandeja de anticipos en orden de llegada, con el comprobante.
- Agenda de cocina ordenada por urgencia, con avance de estados.
- Detalle del pedido, valor del domicilio acordado y WhatsApp al cliente.
- Gestión del menú (precios, agotados, destacados, fotos, platos nuevos), cupos por fecha y resumen de la temporada.

**Fuera del alcance:** pasarela de pago en línea (el anticipo se confirma con comprobante), chat dentro de la plataforma (la conversación sigue por WhatsApp, decisión del negocio) y tarifa automática de domicilio (se acuerda por WhatsApp).

## 2. Tecnologías

| Capa | Tecnología | Para qué |
|---|---|---|
| Interfaz | React 19 + Vite 8 | Componentes, estado y compilación |
| Navegación | React Router 6 | Rutas públicas, de cliente (`/cuenta`) y de administración (`/admin`) con guardias |
| Estado compartido | Context API + custom hooks | Sesión (`AuthProvider`) y canasta (`CartProvider`) |
| Estilos | SCSS Modules + estilos globales | Sistema visual "almanaque de la tienda" (ver `DESIGN.md`) |
| Backend | Supabase | PostgreSQL, autenticación, seguridad por filas (RLS), tiempo real y almacenamiento de archivos |
| Mapa | Leaflet + OpenStreetMap | Barrios, cobertura y ruta |
| Pruebas | Vitest | 93 pruebas de estructuras, helpers y lógica |
| Publicación | Netlify | Sitio estático con redirección para la SPA |

### Base de datos y seguridad

- Tablas: `profiles`, `categorias`, `productos`, `fechas_entrega`, `configuracion`, `pedidos`, `pedido_items`.
- **Transacción `crear_pedido`**: bloquea la fecha para que dos pedidos simultáneos no superen el cupo, revisa la fecha límite, toma los **precios reales** del menú (el cliente no puede alterarlos), calcula domicilio y anticipo, e inserta el pedido y sus productos de una sola vez.
- **RLS**: el menú es público; el cliente solo ve sus pedidos y su perfil; la administradora ve y edita todo. Un cliente no puede cambiarse el rol.
- **Realtime** sobre `pedidos`: el cliente ve los cambios de estado y la bandeja de la administradora se actualiza sola.
- **Storage**: fotos de platos (público) y comprobantes (privado, una carpeta por usuario; se abren con enlaces temporales).

## 3. Estructuras de datos

Las siete estructuras están implementadas desde cero en JavaScript, en `src/helpers/structures/`, siguiendo la forma vista en clase (clase `Node`, métodos `enqueue`, `push`, `addChild`, `insert`, `addEdge`…). Cada una tiene su archivo de pruebas. Ninguna es decorativa: todas resuelven un problema visible del negocio.

### 3.1 Cola · `Queue.js` (lista enlazada)

- **Dónde:** bandeja de anticipos de la administradora (`helpers/orders.js → colaAnticipos`, página `admin/Anticipos`).
- **Por qué:** lo justo es confirmar primero el anticipo de quien pidió primero: es FIFO. La bandeja muestra el frente de la cola (`peek`) y "En la fila" (`toArray`).
- **Detalle:** se implementó con lista enlazada (`head`, `tail`) para que `enqueue` y `dequeue` sean **O(1)**; con un arreglo y `shift()` sacar el primero sería O(n). Los pedidos que aún no suben comprobante van en una lista aparte para no frenar la fila.

### 3.2 Pila · `Stack.js`

- **Dónde:** "Deshacer" en la canasta (`context/cartLogic.js`, componente `BarraDeshacer`).
- **Por qué:** se deshace siempre lo último que se hizo: es LIFO. Cada acción (agregar, quitar, cambiar cantidad, vaciar) apila cómo estaba la canasta; `deshacer` hace `pop` y restaura ese estado. La barra muestra el tope de la pila (`peek`): "Quitaste Rollo mixto".
- **Complejidad:** `push`, `pop` y `peek` en O(1).

### 3.3 Lista doblemente enlazada circular · `CircularList.js`

- **Dónde:** carrusel de platos destacados en la portada (`components/index/LaminaCarrusel`).
- **Por qué:** con anterior/siguiente el carrusel nunca "se sale" del borde: del último plato se pasa al primero y del primero al último. Cada nodo tiene `next` y `prev`, y un cursor marca el plato actual.
- **Complejidad:** `next`, `prev` y `append` en O(1).

### 3.4 Árbol n-ario · `NaryTree.js`

- **Dónde:** el menú completo (`helpers/menuTree.js`): raíz › secciones (Entradas, Platos fuertes, Acompañantes) › platos › opciones de porción. Con él se dibujan las secciones, el menú lateral (primer nivel) y el selector de porciones (hijos del nodo del plato); la página de detalle ubica el plato con `find`.
- **Por qué:** el menú es jerárquico por naturaleza y cada nivel puede tener cualquier cantidad de hijos.
- **Recorridos:** DFS (preorden) y BFS (por niveles con una cola). `find` en O(n).

### 3.5 Trie · `Trie.js`

- **Dónde:** buscador con autocompletado (`helpers/searchIndex.js`, `hooks/useSearch`, componente `Buscador`).
- **Por qué:** se inserta el nombre de cada plato, cada palabra y cada ingrediente; al escribir "toci" se recorre el camino t-o-c-i y se devuelven los platos del subárbol (dip, rollo mixto, arroz con tocineta). El texto se normaliza (sin tildes ni mayúsculas), así "JAMÓN" y "jamon" dan lo mismo.
- **Complejidad:** buscar un prefijo cuesta O(largo del prefijo) más el tamaño del subárbol, sin importar cuántos platos tenga el menú.

### 3.6 Heap · `Heap.js` (montículo binario en arreglo)

- **Dónde:**
  - **Agenda de cocina** (`helpers/orders.js → ordenarAgenda`): sale primero el pedido que se entrega antes; a igual fecha, el que se confirmó primero.
  - **"Lo más pedido" / "Lo más vendido"** (`masPedidos` con `Heap.topK`): los K platos con más unidades.
  - **Cola de prioridad de Dijkstra** en el grafo.
- **Por qué:** se necesita sacar siempre el elemento más urgente o el más vendido sin reordenar todo cada vez.
- **Detalle:** árbol binario completo guardado en un arreglo (hijos en `2i+1` y `2i+2`, padre en `⌊(i−1)/2⌋`), con `percolateUp`, `percolateDown` y `heapify`. El comparador es configurable. `push` y `pop` son **O(log n)**, `heapify` O(n) y `topK` O(n log k).

### 3.7 Grafo · `Graph.js` (no dirigido, ponderado, lista de adyacencia)

- **Dónde:** 18 barrios de Cali como nodos (con coordenadas) y aristas entre barrios vecinos con su distancia en km (`data/barrios.js`). Se usa en la página Cobertura, en el checkout, en el pedido en vivo y en el detalle del pedido de la administradora.
- **Por qué:** las calles de una ciudad forman un grafo.
  - **BFS** dice qué barrios están en cobertura (alcanzables desde la cocina en San Fernando); Jamundí queda fuera.
  - **Dijkstra** calcula la ruta más corta desde la cocina hasta el barrio del cliente; el mapa la dibuja en rojo junto con la distancia y el tiempo estimado (a 25 km/h). La ruta no fija precio: el domicilio se acuerda por WhatsApp.
- **Complejidad:** Dijkstra con heap en O((V + E) log V).

## 4. Organización del código

- **`routes/`**: `AppRoutes` (públicas y 404), `UserRoutes` (cliente, exige sesión) y `AdminRoutes` (exige rol admin). Las rutas privadas y el mapa se cargan aparte para que la primera carga sea liviana.
- **`pages/`**: una carpeta por pantalla con su `.jsx` y su `.module.scss`. Las páginas obtienen datos con hooks y contextos.
- **`components/`**: componentes que reciben props, agrupados por área (`shared`, `index`, `menu`, `cart`, `orders`, `cuenta`, `admin`).
- **`context/`**: `AuthProvider` (sesión y perfil) y `CartProvider` (canasta con deshacer y fecha elegida).
- **`hooks/`**: lógica reutilizable (`useMenu`, `useSearch`, `useOrders`, `useRealtimeOrder`, `useAdminOrders`, `useDeliveryRoute`…).
- **`helpers/`**: funciones generales (formato, precios, WhatsApp, validaciones, calendario, rutas) y las estructuras de datos.

## 5. Pruebas

`npm test` ejecuta 93 pruebas con Vitest. Las pruebas se escribieron antes que el código (TDD). Cubren las siete estructuras, incluidos sus casos límite: cola y pila vacías, barrio sin camino, empates de fecha en la agenda, búsqueda con tildes y top K con menos elementos que K. También cubren la canasta con deshacer, el calendario de fechas y cupos, las validaciones de formularios y los cálculos de precios. Además, cada pantalla se probó en el navegador contra la base de datos real: registro, pedido completo, comprobante, cambio de estado en vivo y panel de administración.

## 6. Diseño

La propuesta gráfica está en `docs/propuesta-grafica/` y el sistema visual en `DESIGN.md`. El mundo visual es "el almanaque de la tienda": papel, tinta negra y rojo almanaque, numerales grandes, fechas encerradas con un óvalo rojo trazado a mano y estados del pedido como sellos de goma. Funciona igual en celular y en computador, y cuida la accesibilidad: contraste, foco visible, navegación con teclado y respeto a `prefers-reduced-motion`.
