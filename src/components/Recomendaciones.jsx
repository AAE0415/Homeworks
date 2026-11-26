import { claseGenero } from '../estructuras/genero';
import styles from './Recomendaciones.module.scss';

const ANCHO = 360;
const C = ANCHO / 2;

// Recomendaciones desde el grafo no dirigido: vecinos directos (nivel 1) y vecinos de vecinos (nivel 2).
export default function Recomendaciones({ grafo, cancion, onElegir }) {
  if (!cancion) {
    return (
      <section className={styles.recomendaciones} aria-labelledby="t-reco">
        <h2 id="t-reco">Canciones relacionadas</h2>
        <p className={styles.vacio}>Elige una canción en el buscador o en el ranking para ver sus recomendaciones.</p>
      </section>
    );
  }

  const recos = grafo.recommend(cancion.id, 8);
  const nivel1 = recos.filter((r) => r.nivel === 1);
  const nivel2 = recos.filter((r) => r.nivel === 2);
  const posicion = (i, total, radio) => {
    const ang = (i / Math.max(total, 1)) * Math.PI * 2 - Math.PI / 2;
    return [C + radio * Math.cos(ang), C + radio * Math.sin(ang)];
  };
  const pos = {};
  nivel1.forEach((r, i) => { pos[r.id] = posicion(i, nivel1.length, 95); });
  nivel2.forEach((r, i) => { pos[r.id] = posicion(i + 0.5, nivel2.length, 155); });

  return (
    <section className={styles.recomendaciones} aria-labelledby="t-reco">
      <h2 id="t-reco">Si te gusta <em>{cancion.titulo}</em></h2>

      <svg className={styles.grafo} viewBox={`0 0 ${ANCHO} ${ANCHO}`} role="img"
        aria-label={`Grafo de canciones relacionadas con ${cancion.titulo}`}>
        {nivel2.map((r) => pos[r.via] && (
          <line key={`l2-${r.id}`} x1={pos[r.via][0]} y1={pos[r.via][1]} x2={pos[r.id][0]} y2={pos[r.id][1]} className={styles.arista2} />
        ))}
        {nivel1.map((r) => (
          <line key={`l1-${r.id}`} x1={C} y1={C} x2={pos[r.id][0]} y2={pos[r.id][1]} className={styles.arista1}
            strokeWidth={1 + r.puntaje * 4} />
        ))}
        {recos.map((r) => (
          <g key={r.id} className={r.nivel === 1 ? styles.nodo1 : styles.nodo2} onClick={() => onElegir(grafo.searchNode(r.id))}>
            <circle cx={pos[r.id][0]} cy={pos[r.id][1]} r={r.nivel === 1 ? 9 : 6} />
            <text x={pos[r.id][0]} y={pos[r.id][1] + (r.nivel === 1 ? 22 : 18)} textAnchor="middle">
              {grafo.searchNode(r.id).titulo.slice(0, 16)}
            </text>
          </g>
        ))}
        <circle cx={C} cy={C} r="14" className={styles.centro} />
      </svg>

      {recos.length === 0 ? <p className={styles.vacio}>Esta canción todavía no tiene canciones relacionadas.</p> : (
        <ol className={styles.lista}>
          {recos.map((r) => {
            const c = grafo.searchNode(r.id);
            return (
              <li key={r.id}>
                <button type="button" onClick={() => onElegir(c)}>
                  <span className={r.nivel === 1 ? styles.directa : styles.indirecta}>
                    {r.nivel === 1 ? 'Similar' : `Vía ${grafo.searchNode(r.via).titulo}`}
                  </span>
                  <b>{c.titulo}</b>
                  <span className={styles.meta}>{c.artista} · <span className={claseGenero(c.genero)}>{c.genero}</span></span>
                </button>
                <span className={styles.afinidad} title="Afinidad">{Math.round(r.puntaje * 100)} %</span>
              </li>
            );
          })}
        </ol>
      )}
    </section>
  );
}
