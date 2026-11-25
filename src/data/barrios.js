// Barrios de Cali atendidos por Delilicias, como grafo: nodos con coordenadas aproximadas
// y aristas entre barrios vecinos con distancia aproximada en km.
import Graph from '../helpers/structures/Graph';

/** Barrio donde está la cocina (punto de partida de las rutas). */
export const COCINA = 'san-fernando';

export const BARRIOS = {
  nodos: [
    { id: 'chipichape', nombre: 'Chipichape', lat: 3.4672, lng: -76.5270 },
    { id: 'la-flora', nombre: 'La Flora', lat: 3.4810, lng: -76.5195 },
    { id: 'versalles', nombre: 'Versalles', lat: 3.4610, lng: -76.5290 },
    { id: 'normandia', nombre: 'Normandía', lat: 3.4590, lng: -76.5520 },
    { id: 'granada', nombre: 'Granada', lat: 3.4585, lng: -76.5375 },
    { id: 'centro', nombre: 'Centro', lat: 3.4517, lng: -76.5320 },
    { id: 'el-penon', nombre: 'El Peñón', lat: 3.4505, lng: -76.5440 },
    { id: 'san-antonio', nombre: 'San Antonio', lat: 3.4470, lng: -76.5395 },
    { id: 'san-fernando', nombre: 'San Fernando', lat: 3.4325, lng: -76.5415 },
    { id: 'alameda', nombre: 'Alameda', lat: 3.4395, lng: -76.5275 },
    { id: 'tequendama', nombre: 'Tequendama', lat: 3.4205, lng: -76.5415 },
    { id: 'el-ingenio', nombre: 'El Ingenio', lat: 3.3905, lng: -76.5285 },
    { id: 'melendez', nombre: 'Meléndez', lat: 3.3790, lng: -76.5455 },
    { id: 'capri', nombre: 'Capri', lat: 3.3985, lng: -76.5395 },
    { id: 'ciudad-jardin', nombre: 'Ciudad Jardín', lat: 3.3610, lng: -76.5335 },
    { id: 'valle-del-lili', nombre: 'Valle del Lili', lat: 3.3720, lng: -76.5165 },
    { id: 'pance', nombre: 'Pance', lat: 3.3330, lng: -76.5410 },
    { id: 'jamundi', nombre: 'Jamundí', lat: 3.2610, lng: -76.5390 },
  ],
  // [barrio, barrio, km]. Jamundí no tiene aristas: queda fuera de cobertura.
  aristas: [
    ['chipichape', 'la-flora', 1.9], ['chipichape', 'versalles', 1.6], ['versalles', 'centro', 2.2],
    ['versalles', 'granada', 1.4], ['granada', 'normandia', 1.8], ['granada', 'centro', 1.7],
    ['centro', 'san-antonio', 1.2], ['san-antonio', 'el-penon', 0.9], ['el-penon', 'normandia', 1.5],
    ['san-antonio', 'san-fernando', 1.6], ['centro', 'alameda', 2.0], ['alameda', 'san-fernando', 1.8],
    ['san-fernando', 'tequendama', 2.1], ['alameda', 'tequendama', 2.4], ['tequendama', 'capri', 2.8],
    ['tequendama', 'el-ingenio', 2.5], ['el-ingenio', 'melendez', 1.9], ['el-ingenio', 'capri', 2.2],
    ['capri', 'ciudad-jardin', 2.6], ['ciudad-jardin', 'valle-del-lili', 3.1], ['melendez', 'valle-del-lili', 2.4],
    ['ciudad-jardin', 'pance', 4.2],
  ],
};

export function buildGrafoBarrios() {
  const g = new Graph();
  BARRIOS.nodos.forEach(({ id, ...datos }) => g.addNode(id, datos));
  BARRIOS.aristas.forEach(([a, b, km]) => g.addEdge(a, b, km));
  return g;
}
