import { describe, expect, it } from 'vitest';
import Graph from './Graph';

const grafo = () => {
  const g = new Graph();
  ['A', 'B', 'C', 'D'].forEach((id) => g.addNode(id, { nombre: id }));
  g.addEdge('A', 'B', 2);
  g.addEdge('B', 'C', 3);
  g.addEdge('A', 'C', 10);
  return g;
};

describe('Graph (no dirigido y ponderado, lista de adyacencia)', () => {
  it('dijkstra encuentra la ruta más corta', () => {
    expect(grafo().dijkstra('A', 'C')).toEqual({ path: ['A', 'B', 'C'], distance: 5 });
  });

  it('dijkstra devuelve null si no hay camino', () => {
    expect(grafo().dijkstra('A', 'D')).toBeNull();
  });

  it('dijkstra de un nodo a sí mismo tiene distancia 0', () => {
    expect(grafo().dijkstra('B', 'B')).toEqual({ path: ['B'], distance: 0 });
  });

  it('bfs recorre solo lo alcanzable', () => {
    const r = grafo().bfs('A');
    expect(r).toEqual(['A', 'B', 'C']);
    expect(r).not.toContain('D');
  });

  it('las aristas van en ambos sentidos', () => {
    expect(grafo().getEdges('C')).toEqual(expect.arrayContaining([{ to: 'B', weight: 3 }, { to: 'A', weight: 10 }]));
  });

  it('removeNode borra el nodo y sus aristas', () => {
    const g = grafo();
    g.removeNode('B');
    expect(g.searchNode('B')).toBeNull();
    expect(g.getEdges('A')).toEqual([{ to: 'C', weight: 10 }]);
    expect(g.dijkstra('A', 'C').distance).toBe(10);
    expect(g.size()).toBe(3);
  });

  it('addEdge con un nodo inexistente lanza error', () => {
    expect(() => grafo().addEdge('A', 'Z', 1)).toThrow();
  });

  it('searchNode devuelve los datos y isEmpty funciona', () => {
    expect(grafo().searchNode('A')).toEqual({ nombre: 'A' });
    expect(new Graph().isEmpty()).toBe(true);
  });
});
