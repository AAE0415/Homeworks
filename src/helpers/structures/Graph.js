// Grafo no dirigido y ponderado con lista de adyacencia.
// nodes: id -> datos; adjacency: id -> [{ to, weight }].
// Uso en Delilicias: barrios de Cali conectados por distancia (km).
//   - bfs: qué barrios están en cobertura desde la cocina.
//   - dijkstra: la ruta más corta desde la cocina hasta el barrio del cliente.
import Heap from './Heap';

export default class Graph {
  constructor() {
    this.nodes = new Map();
    this.adjacency = new Map();
  }

  addNode(id, data = {}) {
    if (!this.nodes.has(id)) this.adjacency.set(id, []);
    this.nodes.set(id, data);
  }

  /** Une dos nodos existentes en ambos sentidos con un peso. */
  addEdge(a, b, weight = 1) {
    if (!this.nodes.has(a) || !this.nodes.has(b)) throw new Error(`No existe el nodo ${this.nodes.has(a) ? b : a}`);
    this.adjacency.get(a).push({ to: b, weight });
    this.adjacency.get(b).push({ to: a, weight });
  }

  removeNode(id) {
    if (!this.nodes.has(id)) return;
    for (const { to } of this.adjacency.get(id)) {
      this.adjacency.set(to, this.adjacency.get(to).filter((e) => e.to !== id));
    }
    this.adjacency.delete(id);
    this.nodes.delete(id);
  }

  searchNode(id) {
    return this.nodes.has(id) ? this.nodes.get(id) : null;
  }

  /** Aristas (vecinos) de un nodo. */
  getEdges(id) {
    return this.adjacency.get(id) ?? [];
  }

  isEmpty() {
    return this.nodes.size === 0;
  }

  size() {
    return this.nodes.size;
  }

  /** Recorrido en anchura (por niveles) desde start. */
  bfs(start) {
    if (!this.nodes.has(start)) return [];
    const visitados = new Set([start]);
    const cola = [start];
    const orden = [];
    while (cola.length) {
      const actual = cola.shift();
      orden.push(actual);
      for (const { to } of this.getEdges(actual)) {
        if (!visitados.has(to)) { visitados.add(to); cola.push(to); }
      }
    }
    return orden;
  }

  /** Ruta más corta (Dijkstra con un Heap como cola de prioridad). null si no hay camino. */
  dijkstra(start, end) {
    if (!this.nodes.has(start) || !this.nodes.has(end)) return null;
    const dist = new Map([[start, 0]]);
    const previo = new Map();
    const pendientes = new Heap((a, b) => a.d - b.d, [{ id: start, d: 0 }]);

    while (!pendientes.isEmpty()) {
      const { id, d } = pendientes.pop();
      if (d > dist.get(id)) continue; // entrada vieja
      if (id === end) break;
      for (const { to, weight } of this.getEdges(id)) {
        const nueva = d + weight;
        if (nueva < (dist.get(to) ?? Infinity)) {
          dist.set(to, nueva);
          previo.set(to, id);
          pendientes.push({ id: to, d: nueva });
        }
      }
    }

    if (!dist.has(end)) return null;
    const path = [end];
    while (path[0] !== start) path.unshift(previo.get(path[0]));
    return { path, distance: Math.round(dist.get(end) * 10) / 10 };
  }

  print() {
    for (const [id, edges] of this.adjacency) console.log(id, '->', edges.map((e) => `${e.to}(${e.weight})`).join(', '));
  }
}
