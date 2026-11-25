import { useMemo } from 'react';
import { calcularRuta } from '../helpers/rutas';

// Ruta más corta desde la cocina hasta el barrio elegido (grafo + Dijkstra).
export default function useDeliveryRoute(barrioId) {
  return useMemo(() => calcularRuta(barrioId), [barrioId]);
}
