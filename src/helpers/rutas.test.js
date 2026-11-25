import { describe, expect, it } from 'vitest';
import { calcularRuta, VELOCIDAD_KMH } from './rutas';

describe('calcularRuta (Dijkstra sobre el grafo de barrios)', () => {
  it('devuelve la ruta, la distancia y los minutos estimados', () => {
    const r = calcularRuta('ciudad-jardin');
    expect(r.enCobertura).toBe(true);
    expect(r.ruta.path).toEqual(['san-fernando', 'tequendama', 'capri', 'ciudad-jardin']);
    expect(r.ruta.distance).toBe(7.5);
    expect(r.minutos).toBe(Math.round((7.5 / VELOCIDAD_KMH) * 60));
    expect(r.nombres).toEqual(['San Fernando', 'Tequendama', 'Capri', 'Ciudad Jardín']);
  });

  it('un barrio sin camino queda fuera de cobertura', () => {
    expect(calcularRuta('jamundi')).toMatchObject({ enCobertura: false, ruta: null, minutos: null });
  });

  it('sin barrio no hay ruta', () => {
    expect(calcularRuta('')).toMatchObject({ enCobertura: false, ruta: null });
    expect(calcularRuta('no-existe')).toMatchObject({ enCobertura: false, ruta: null });
  });
});
