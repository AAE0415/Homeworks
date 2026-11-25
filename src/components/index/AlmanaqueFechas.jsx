import { useMemo } from 'react';
import { celdasAlmanaque } from '../../helpers/calendario';
import useCart from '../../hooks/useCart';
import useFechas from '../../hooks/useFechas';
import Ovalo from '../shared/Ovalo';
import styles from './AlmanaqueFechas.module.scss';

const DIAS = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];

// Cuadrícula del almanaque: las fechas de entrega se pueden elegir y muestran sus cupos.
export default function AlmanaqueFechas() {
  const { fechas, cargando, error } = useFechas();
  const { fechaElegida, elegirFecha } = useCart();
  const celdas = useMemo(() => celdasAlmanaque(fechas), [fechas]);

  if (cargando) return <div className={styles.cargando} aria-busy="true" />;
  if (error) return <p className={styles.error}>{error}</p>;

  return (
    <div className={styles.cuadricula} role="group" aria-label="Fechas de entrega de diciembre">
      {DIAS.map((d, i) => <span key={i} className={`${styles.diaSemana} ${i === 6 ? styles.domingo : ''}`} aria-hidden="true">{d}</span>)}
      {celdas.map((c) => {
        if (c.vacia) return <span key={c.iso} className={`${styles.celda} ${styles.vacia}`} aria-hidden="true" />;
        if (c.entrega) {
          const elegida = fechaElegida === c.entrega.id;
          return (
            <button key={c.iso} type="button" className={`${styles.celda} ${styles.entrega}`}
              aria-pressed={elegida} disabled={!c.entrega.elegible}
              aria-label={`${c.entrega.texto}: ${c.entrega.motivo ?? `quedan ${c.entrega.restantes} cupos`}`}
              onClick={() => elegirFecha(c.entrega.id)}>
              <span className={styles.numero}>{c.dia}<Ovalo dibujar={elegida} /></span>
              <span className={styles.cupo}>
                {c.entrega.motivo ?? <><b>{c.entrega.restantes}</b> <span className={styles.palabra}>cupos</span></>}
              </span>
            </button>
          );
        }
        return (
          <span key={c.iso} className={`${styles.celda} ${c.festivo ? styles.festivo : ''} ${c.limitePara ? styles.limite : ''}`}>
            <span className={styles.numero}>{c.dia}</span>
            {c.limitePara && <span className={styles.cupo}>Último día para el {c.limitePara}</span>}
          </span>
        );
      })}
    </div>
  );
}
