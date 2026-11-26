import { describe, expect, it } from 'vitest';
import Graph from './Graph';

const grafo = () => {
  const g = new Graph();
  ['A', 'B', 'C', 'D', 'E', 'F'].forEach((id) => g.addNode(id, { titulo: id }));
  g.addEdge('A', 'B', 0.9);
  g.addEdge('A', 'C', 0.6);
  g.addEdge('B', 'D', 0.8);
  g.addEdge('C', 'D', 0.5);
  g.addEdge('D', 'E', 0.7);
  return g; // F queda sola
};

describe('Graph no dirigido de canciones relacionadas', () => {
  it('las conexiones van en ambos sentidos', () => {
    const g = grafo();
    expect(g.getNeighbors('B').map((e) => e.to)).toContain('A');
    expect(g.getNeighbors('A').map((e) => e.to)).toContain('B');
  });

  it('recommend pone primero las directas por similitud y luego las de segundo nivel', () => {
    const r = grafo().recommend('A', 5);
    expect(r.map((x) => x.id)).toEqual(['B', 'C', 'D']);
    expect(r[0]).toMatchObject({ id: 'B', nivel: 1 });
    expect(r[2]).toMatchObject({ id: 'D', nivel: 2 });
  });

  it('recommend respeta el límite y no incluye la canción misma', () => {
    const r = grafo().recommend('A', 2);
    expect(r).toHaveLength(2);
    expect(r.map((x) => x.id)).not.toContain('A');
  });

  it('una canción sin conexiones no tiene recomendaciones', () => {
    expect(grafo().recommend('F')).toEqual([]);
    expect(grafo().recommend('Z')).toEqual([]);
  });

  it('bfs recorre por niveles solo lo alcanzable', () => {
    expect(grafo().bfs('A')).toEqual(['A', 'B', 'C', 'D', 'E']);
  });

  it('removeNode borra la canción y sus conexiones; addEdge exige nodos existentes', () => {
    const g = grafo();
    g.removeNode('D');
    expect(g.getNeighbors('B').map((e) => e.to)).toEqual(['A']);
    expect(g.size()).toBe(5);
    expect(() => g.addEdge('A', 'Z')).toThrow();
  });
});
