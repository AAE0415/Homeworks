import 'leaflet/dist/leaflet.css';
import { CircleMarker, MapContainer, Polyline, TileLayer, Tooltip } from 'react-leaflet';
import { BARRIOS, COCINA } from '../../data/barrios';
import styles from './MapaDomicilio.module.scss';

const porId = Object.fromEntries(BARRIOS.nodos.map((n) => [n.id, n]));
const punto = (id) => [porId[id].lat, porId[id].lng];
const ROJO = '#D8261C';
const TINTA = '#161412';

// Mapa de Cali (OpenStreetMap) con el grafo de barrios: aristas, nodos y la ruta más corta.
// Si recibe onElegir, cada barrio se puede tocar para elegirlo.
export default function MapaDomicilio({ ruta = null, destino = null, onElegir, compacto = false, alto = 420 }) {
  const camino = ruta?.path ?? [];
  const centro = destino && porId[destino] ? punto(destino) : punto(COCINA);

  return (
    <div className={styles.mapa} style={{ height: alto }}>
      <MapContainer center={centro} zoom={compacto ? 13 : 12} scrollWheelZoom={false} className={styles.lienzo}
        aria-label="Mapa de barrios con la ruta desde la cocina">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Aristas del grafo (calles que conectan barrios vecinos) */}
        {!compacto && BARRIOS.aristas.map(([a, b]) => (
          <Polyline key={`${a}-${b}`} positions={[punto(a), punto(b)]} pathOptions={{ color: '#8A8379', weight: 1.5, dashArray: '4 4' }} />
        ))}

        {/* Ruta más corta (Dijkstra) */}
        {camino.length > 1 && (
          <Polyline positions={camino.map(punto)} pathOptions={{ color: ROJO, weight: 5, opacity: .9 }} />
        )}

        {BARRIOS.nodos.map((n) => {
          const esCocina = n.id === COCINA;
          const esDestino = n.id === destino;
          const enRuta = camino.includes(n.id);
          if (compacto && !esCocina && !enRuta) return null;
          const fuera = !BARRIOS.aristas.some(([a, b]) => a === n.id || b === n.id);
          return (
            <CircleMarker
              key={n.id}
              center={[n.lat, n.lng]}
              radius={esCocina || esDestino ? 10 : 6}
              pathOptions={{
                color: esCocina ? TINTA : fuera ? '#8A8379' : ROJO,
                fillColor: esCocina ? TINTA : esDestino ? ROJO : enRuta ? ROJO : '#fff',
                fillOpacity: 1,
                weight: 2,
                dashArray: fuera ? '3 3' : undefined,
              }}
              eventHandlers={onElegir && !esCocina ? { click: () => onElegir(n.id) } : undefined}
            >
              <Tooltip direction="right" offset={[8, 0]} permanent={esCocina || esDestino} className={styles.etiqueta}>
                {n.nombre}{esCocina ? ' · Cocina' : ''}{fuera ? ' · fuera de cobertura' : ''}
              </Tooltip>
            </CircleMarker>
          );
        })}
      </MapContainer>
    </div>
  );
}
