# Parcial 3 · Mini plataforma de música educativa

**Estructuras de Datos II · Universidad Autónoma de Occidente**
**Estudiante:** Juan Pablo Cuellar

Panel web en React + Vite donde los usuarios buscan canciones rápidamente, ven el ranking de las más escuchadas y reciben recomendaciones de canciones relacionadas. Los estilos del panel están hechos con Sass reutilizable.

> Las canciones son reales; las cifras de reproducciones son datos de ejemplo para el parcial.

## Cómo se cumple cada punto del enunciado

| Requisito | Dónde | Cómo |
|---|---|---|
| **Buscador predictivo con Trie** | `src/estructuras/Trie.js`, `src/components/Buscador.jsx` | Los títulos se guardan letra por letra en un Trie. |
| 1. Insertar canciones | `Trie.insert(titulo)` y el formulario **Agregar canción** | Cada canción nueva entra al Trie, al Max Heap y al grafo. |
| 2. Buscar si una canción existe | `Trie.search(titulo)` | El buscador muestra "La canción existe en el catálogo" cuando se escribe un título completo. |
| 3. Sugerencias por prefijo | `Trie.suggest(prefijo)` | Al escribir "la" aparecen La Bicicleta, La Camisa Negra, La Gota Fría y La Tortura. No distingue tildes ni mayúsculas. |
| **Ranking con Max Heap** | `src/estructuras/MaxHeap.js`, `src/components/Ranking.jsx` | El heap está ordenado por reproducciones. El Top 10 sale con `topK`, que hace `extractMax` sobre una copia. El botón **▶ +500** suma reproducciones y el ranking se reordena al instante. |
| **Recomendaciones con grafo no dirigido** | `src/estructuras/Graph.js`, `src/components/Recomendaciones.jsx` | Cada canción es un nodo; las aristas unen canciones similares con un peso de similitud y se guardan en ambos sentidos. `recommend` devuelve primero las conectadas directamente y luego las de segundo nivel ("vía" otra canción). Un mini grafo en SVG lo muestra. |
| **Panel visual con Sass** | `src/styles/` y los `*.module.scss` | Variables, funciones, mixins, mapas, bucles y placeholders reutilizables (detalle abajo). |

## Estructuras de datos

### Trie (`Trie.js`)
- Cada `TrieNode` tiene `children` (letra → nodo), `isEndOfWord` y el `titulo` original para mostrarlo con tildes.
- `insert(titulo)` recorre el título normalizado (sin tildes y en minúsculas) creando los nodos que falten.
- `search(titulo)` devuelve `true` solo si el camino existe y termina en una palabra.
- `suggest(prefijo, limite)` baja hasta el nodo del prefijo y recorre su subárbol en profundidad (DFS).
- **Complejidad:** insertar y buscar cuestan O(L), con L el largo del título, sin importar cuántas canciones haya.

### Max Heap (`MaxHeap.js`)
- Es un árbol binario completo guardado en un arreglo: los hijos de `i` están en `2i+1` y `2i+2`, y el padre en `⌊(i−1)/2⌋`.
- Cada padre tiene más o igual reproducciones que sus hijos, así que la raíz (`peek`) es la canción más escuchada.
- Métodos: `insert` (con `percolateUp`), `extractMax` (con `percolateDown`), `heapify`, `peek`, `topK`, `size` y `toArray`.
- **Complejidad:** `insert` y `extractMax` son O(log n), `peek` es O(1), `heapify` es O(n) y `topK(k)` es O(k log n).

### Grafo no dirigido (`Graph.js`)
- Usa lista de adyacencia: `id → [{ to, weight }]`. `addEdge(a, b, similitud)` agrega la arista en los dos sentidos.
- Métodos: `addNode`, `addEdge`, `removeNode`, `searchNode`, `getNeighbors`, `bfs` y `recommend`.
- `recommend(id, limite)`:
  - **Nivel 1:** los vecinos directos, ordenados por similitud.
  - **Nivel 2:** los vecinos de esos vecinos. Su puntaje es el producto de las similitudes del camino y se queda el mejor camino.

## Sass reutilizable

| Archivo | Qué tiene |
|---|---|
| `_variables.scss` | Colores, el **mapa** `$generos` (un color por género), espaciado, radios y puntos de quiebre. |
| `_functions.scss` | `esp($n)` para el espaciado, `color-puesto($puesto)` para el color de cada puesto del ranking (con `@if`/`@else`), `color-genero()` y `velo()` para fondos translúcidos. |
| `_mixins.scss` | `tarjeta`, `titulo-seccion`, `boton($color)`, `campo`, `etiqueta($color)` y `hasta($ancho)` para el diseño responsivo. |
| `global.scss` | Genera con **`@each`** una clase `.genero-*` por cada género del mapa. |
| `Ranking.module.scss` | Colorea los puestos 1 a 10 con un bucle **`@for`** y la función `color-puesto()`, y marca el podio. |
| `Recomendaciones.module.scss` | Usa un **placeholder** `%nodo` con `@extend` para los nodos del grafo. |

Todos los componentes usan los módulos con `@use '../styles/variables' as *;`.

## Cómo correrlo

```bash
npm install
npm run dev      # http://localhost:5173
npm test         # 15 pruebas de las estructuras (Vitest)
npm run build
```

## Estructura de carpetas

```
src/
  estructuras/   Trie.js, MaxHeap.js, Graph.js (+ pruebas), normalizar.js, genero.js
  data/          canciones.js (catálogo y relaciones de similitud)
  hooks/         useMusica.js (construye las tres estructuras)
  components/    Buscador, Ranking, Recomendaciones, AgregarCancion (+ .module.scss)
  styles/        _variables, _functions, _mixins, global
```
