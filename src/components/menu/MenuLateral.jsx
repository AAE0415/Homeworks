import { Link } from 'react-router-dom';
import styles from './MenuLateral.module.scss';

// Menú lateral generado del árbol: nivel 1 = secciones, nivel 2 = platos de la sección activa.
export default function MenuLateral({ arbol, activa }) {
  const secciones = arbol.root?.children ?? [];
  return (
    <nav className={styles.lateral} aria-label="Secciones del menú">
      <ol>
        {secciones.map((nodo) => {
          const s = nodo.value;
          return (
            <li key={s.id}>
              <a href={`#${s.id}`} aria-current={activa === s.id ? 'location' : undefined}>
                <span className="numeral">{s.numeral}</span>
                <span className={styles.sec}>{s.titulo}</span>
                <span className={styles.cuenta}>{nodo.children.length}</span>
              </a>
              {activa === s.id && nodo.children.length > 1 && (
                <ol>
                  {nodo.children.map((p) => (
                    <li key={p.value.id}><Link to={`/plato/${p.value.id}`}>{p.value.nombre}</Link></li>
                  ))}
                </ol>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
