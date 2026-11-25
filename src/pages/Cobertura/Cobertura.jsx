import { useState } from 'react';
import MapaDomicilio from '../../components/orders/MapaDomicilio';
import RutaResumen from '../../components/orders/RutaResumen';
import Campo from '../../components/shared/Campo';
import { BARRIOS } from '../../data/barrios';
import useAuth from '../../hooks/useAuth';
import useDeliveryRoute from '../../hooks/useDeliveryRoute';
import styles from './Cobertura.module.scss';

const barriosOrdenados = [...BARRIOS.nodos].sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'));

export default function Cobertura() {
  const { perfil } = useAuth();
  const [barrio, setBarrio] = useState(perfil?.barrio_id ?? 'ciudad-jardin');
  const ruta = useDeliveryRoute(barrio);

  return (
    <section className={`hoja ${styles.cobertura}`} aria-labelledby="t-cobertura">
      <div className={styles.cabecera}>
        <h1 className="titular" id="t-cobertura">¿Llegamos a tu barrio?</h1>
        <p>Cocinamos en San Fernando y llevamos tu cena por la ruta más corta. Elige tu barrio en la lista o tócalo en el mapa.</p>
      </div>
      <div className={styles.cuerpo}>
        <div className={styles.lado}>
          <Campo label="Tu barrio">
            <select value={barrio} onChange={(e) => setBarrio(e.target.value)}>
              {barriosOrdenados.map((b) => <option key={b.id} value={b.id}>{b.nombre}</option>)}
            </select>
          </Campo>
          <RutaResumen {...ruta} />
        </div>
        <MapaDomicilio ruta={ruta.ruta} destino={barrio} onElegir={setBarrio} alto={520} />
      </div>
    </section>
  );
}
