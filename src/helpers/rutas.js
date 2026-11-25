// Ruta de domicilio: camino más corto (Dijkstra) desde la cocina hasta el barrio del cliente.
import { BARRIOS, COCINA, buildGrafoBarrios } from '../data/barrios';

/** Velocidad promedio de un domicilio en la ciudad, para estimar el tiempo. */
export const VELOCIDAD_KMH = 25;

const grafo = buildGrafoBarrios();
const nombre = (id) => BARRIOS.nodos.find((n) => n.id === id)?.nombre ?? id;

export function calcularRuta(barrioId) {
  const ruta = barrioId && grafo.searchNode(barrioId) ? grafo.dijkstra(COCINA, barrioId) : null;
  return {
    ruta,
    enCobertura: ruta !== null,
    minutos: ruta ? Math.round((ruta.distance / VELOCIDAD_KMH) * 60) : null,
    nombres: ruta ? ruta.path.map(nombre) : [],
  };
}
