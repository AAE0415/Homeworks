import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { formatCOP } from '../../helpers/format';
import CircularList from '../../helpers/structures/CircularList';
import Icon from '../shared/Icon';
import styles from './LaminaCarrusel.module.scss';

const INTERVALO = 6000;

// Lámina del almanaque: carrusel de platos destacados sobre una lista doblemente enlazada circular.
// Anterior y siguiente nunca se salen del borde: del último se vuelve al primero.
export default function LaminaCarrusel({ platos, categoriasPorId }) {
  const lista = useMemo(() => {
    const l = new CircularList();
    platos.forEach((p) => l.append(p));
    return l;
  }, [platos]);
  const [actual, setActual] = useState(() => lista.current());
  const [pausado, setPausado] = useState(false);
  const [posicion, setPosicion] = useState(1);

  // Si cambia la lista (llegan los platos), mostrar el primero
  const [listaPrevia, setListaPrevia] = useState(lista);
  if (listaPrevia !== lista) {
    setListaPrevia(lista);
    setActual(lista.current());
    setPosicion(1);
  }

  const mover = (paso) => {
    setActual(paso > 0 ? lista.next() : lista.prev());
    setPosicion((p) => ((p - 1 + paso + lista.size()) % lista.size()) + 1);
  };

  useEffect(() => {
    const reducido = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (pausado || reducido || lista.size() < 2) return undefined;
    const t = setInterval(() => {
      setActual(lista.next());
      setPosicion((p) => (p % lista.size()) + 1);
    }, INTERVALO);
    return () => clearInterval(t);
  }, [pausado, lista]);

  if (!actual) return <figure className={`${styles.lamina} ${styles.vacia}`} aria-hidden="true" />;
  const seccion = categoriasPorId[actual.categoria_id];
  const unidad = actual.unidad === 'libra' ? 'la libra' : actual.unidad === 'porción' ? 'porción' : actual.unidad;

  return (
    <figure className={styles.lamina} aria-roledescription="carrusel" aria-label="Platos destacados"
      onMouseEnter={() => setPausado(true)} onMouseLeave={() => setPausado(false)}
      onFocus={() => setPausado(true)} onBlur={() => setPausado(false)}>
      <Link className={styles.foto} to={`/plato/${actual.id}`}>
        <img key={actual.id} src={actual.foto_url} alt={actual.alt ?? actual.nombre} />
      </Link>
      <figcaption className={styles.pie}>
        <span>
          <span className={styles.nombre}>{actual.nombre}</span>
          <span className={styles.precio}>
            <span className="precio">{formatCOP(actual.precio)}</span> {unidad}{seccion ? ` · ${seccion.titulo}` : ''}
          </span>
        </span>
        {lista.size() > 1 && (
          <span className={styles.nav}>
            <button type="button" className={styles.izq} aria-label="Plato anterior" onClick={() => mover(-1)}><Icon name="flecha" /></button>
            <span className="tabular" aria-live="polite">{posicion} / {lista.size()}</span>
            <button type="button" aria-label="Plato siguiente" onClick={() => mover(1)}><Icon name="flecha" /></button>
          </span>
        )}
      </figcaption>
    </figure>
  );
}
