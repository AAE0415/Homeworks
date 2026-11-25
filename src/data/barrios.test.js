import { describe, expect, it } from 'vitest';
import { BARRIOS, COCINA, buildGrafoBarrios } from './barrios';

describe('grafo de barrios de Cali', () => {
  const g = buildGrafoBarrios();

  it('tiene todos los barrios y la cocina existe', () => {
    expect(g.size()).toBe(BARRIOS.nodos.length);
    expect(g.searchNode(COCINA)).not.toBeNull();
  });

  it('todos los barrios con aristas son alcanzables desde la cocina', () => {
    const alcanzables = new Set(g.bfs(COCINA));
    const conAristas = BARRIOS.nodos.filter((n) => g.getEdges(n.id).length > 0);
    conAristas.forEach((n) => expect(alcanzables.has(n.id)).toBe(true));
  });

  it('hay al menos un barrio fuera de cobertura', () => {
    const fuera = BARRIOS.nodos.filter((n) => g.dijkstra(COCINA, n.id) === null);
    expect(fuera.length).toBeGreaterThan(0);
  });

  it('la ruta a Ciudad Jardín pasa por Tequendama y Capri', () => {
    expect(g.dijkstra(COCINA, 'ciudad-jardin').path).toEqual(['san-fernando', 'tequendama', 'capri', 'ciudad-jardin']);
  });
});
