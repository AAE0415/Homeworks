// GRAFO NO DIRIGIDO de canciones relacionadas (lista de adyacencia).
// Nodos: canciones. Aristas: "son similares", con un peso de similitud entre 0 y 1.
// Como es no dirigido, si A se parece a B, B se parece a A: cada arista se guarda en los dos sentidos.

export default class Graph {
  constructor() {
    this.nodes = new Map();      // id -> datos de la canción
    this.adjacency = new Map();  // id -> [{ to, weight }]
  }

  addNode(id, datos = {}) {
    if (!this.nodes.has(id)) this.adjacency.set(id, []);
    this.nodes.set(id, datos);
  }

  addEdge(a, b, weight = 1) {
    if (!this.nodes.has(a) || !this.nodes.has(b)) throw new Error(`No existe la canción ${this.nodes.has(a) ? b : a}`);
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
    return this.nodes.get(id) ?? null;
  }

  getNeighbors(id) {
    return this.adjacency.get(id) ?? [];
  }

  size() {
    return this.nodes.size;
  }

  /** Recorrido en anchura (por niveles) desde una canción. */
  bfs(inicio) {
    if (!this.nodes.has(inicio)) return [];
    const visitados = new Set([inicio]);
    const cola = [inicio];
    const orden = [];
    while (cola.length) {
      const actual = cola.shift();
      orden.push(actual);
      for (const { to } of this.getNeighbors(actual)) {
        if (!visitados.has(to)) { visitados.add(to); cola.push(to); }
      }
    }
    return orden;
  }

  /**
   * Recomendaciones para una canción:
   * nivel 1 = conectadas directamente (ordenadas por similitud),
   * nivel 2 = "amigas de amigas" (puntaje = mejor producto de similitudes del camino).
   */
  recommend(id, limite = 5) {
    if (!this.nodes.has(id)) return [];
    const directas = [...this.getNeighbors(id)]
      .sort((x, y) => y.weight - x.weight)
      .map(({ to, weight }) => ({ id: to, nivel: 1, puntaje: weight }));

    const vistas = new Set([id, ...directas.map((d) => d.id)]);
    const segundo = new Map();
    for (const d of directas) {
      for (const { to, weight } of this.getNeighbors(d.id)) {
        if (vistas.has(to)) continue;
        const puntaje = d.puntaje * weight;
        if (!segundo.has(to) || segundo.get(to).puntaje < puntaje) segundo.set(to, { id: to, nivel: 2, puntaje, via: d.id });
      }
    }
    const indirectas = [...segundo.values()].sort((x, y) => y.puntaje - x.puntaje);
    return [...directas, ...indirectas].slice(0, limite);
  }
}
