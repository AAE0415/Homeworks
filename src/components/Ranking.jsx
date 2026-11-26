import { claseGenero } from '../estructuras/genero';
import styles from './Ranking.module.scss';

const formato = new Intl.NumberFormat('es-CO');

// TOP de canciones más escuchadas: se sacan del Max Heap con topK (extractMax sobre una copia).
export default function Ranking({ heap, k = 10, onEscuchar, onElegir }) {
  const top = heap.topK(k);
  const maximo = top[0]?.plays || 1;

  return (
    <section className={styles.ranking} aria-labelledby="t-ranking">
      <div className={styles.cabecera}>
        <h2 id="t-ranking">Top {k} más escuchadas</h2>
        <span className={styles.nota}>Max Heap · raíz: {heap.peek()?.titulo}</span>
      </div>
      <ol>
        {top.map((c, i) => (
          <li key={c.id} className={styles[`puesto${i + 1}`]}>
            <span className={styles.numero}>{i + 1}</span>
            <button type="button" className={styles.info} onClick={() => onElegir(c)}>
              <b>{c.titulo}</b>
              <span>{c.artista} · <span className={claseGenero(c.genero)}>{c.genero}</span></span>
            </button>
            <span className={styles.barra} aria-hidden="true"><i style={{ width: `${(c.plays / maximo) * 100}%` }} /></span>
            <span className={styles.plays}>{formato.format(c.plays)}</span>
            <button type="button" className={styles.escuchar} onClick={() => onEscuchar(c.id, 500)}
              aria-label={`Escuchar ${c.titulo} (suma 500 reproducciones)`}>▶ +500</button>
          </li>
        ))}
      </ol>
    </section>
  );
}
