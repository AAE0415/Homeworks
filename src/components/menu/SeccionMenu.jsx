import CardPlato from './CardPlato';
import styles from './SeccionMenu.module.scss';

// Una sección del menú = un nodo "seccion" del árbol. Sus hijos son los platos,
// y los hijos de cada plato son sus opciones de porción.
export default function SeccionMenu({ nodo }) {
  const seccion = nodo.value;
  const platos = nodo.children;
  const variante = seccion.id === 'entradas' ? 'destacado' : seccion.id === 'acompanantes' ? 'celda' : 'fila';
  const porcionesDe = (n) => n.children.map((h) => h.value.texto);

  return (
    <section className={styles.seccion} id={seccion.id} aria-labelledby={`t-${seccion.id}`}>
      <div className={styles.cabecera}>
        <span className="numeral" aria-hidden="true">{seccion.numeral}</span>
        <h2 className="titular" id={`t-${seccion.id}`}>{seccion.titulo}</h2>
        <p>{seccion.subtitulo}</p>
      </div>

      {seccion.nota && (
        <p className={styles.nota}>
          <span>{seccion.nota.replace('100%', '100 %')}</span>
          {variante === 'fila' && <span className={styles.suave}>Se venden por libra y te las porcionamos</span>}
        </p>
      )}

      {variante === 'destacado' && platos.map((n) => <CardPlato key={n.value.id} producto={n.value} variante="destacado" />)}
      {variante === 'fila' && (
        <ul className={styles.lista}>
          {platos.map((n) => <CardPlato key={n.value.id} producto={n.value} porciones={porcionesDe(n)} />)}
        </ul>
      )}
      {variante === 'celda' && (
        <ul className={styles.celdas}>
          {platos.map((n) => <CardPlato key={n.value.id} producto={n.value} variante="celda" />)}
        </ul>
      )}
    </section>
  );
}
