import { Link } from 'react-router-dom';
import { formatCOP } from '../../helpers/format';
import { masPedidos } from '../../helpers/orders';
import Icon from '../shared/Icon';
import styles from './TopPlatos.module.scss';

const K = 5;
const unidadCorta = (u) => (u === 'libra' ? 'la libra' : u);

// "Lo más pedido": los K platos con más unidades vendidas, elegidos con un Heap (top K).
// Mientras no haya ventas suficientes, se completa con los platos destacados.
export default function TopPlatos({ productos, ventas }) {
  const porId = Object.fromEntries(productos.map((p) => [p.id, p]));
  const top = masPedidos(ventas.filter((v) => porId[v.producto_id]), K).map((v) => porId[v.producto_id]);
  const relleno = productos.filter((p) => p.destacado && !top.includes(p));
  const platos = [...top, ...relleno].slice(0, K);
  if (platos.length === 0) return null;
  const [primero, ...resto] = platos;

  return (
    <section className={styles.seccion} aria-labelledby="t-ranking">
      <div className={styles.cabecera}>
        <h2 className="titular" id="t-ranking">Lo más pedido</h2>
        <Link className="btn-texto" to="/menu">Ver el menú completo <Icon name="flecha" /></Link>
      </div>
      <ol className={styles.ranking}>
        <li className={styles.primero}>
          <span className="numeral">1</span>
          <Link to={`/plato/${primero.id}`}>
            <img src={primero.foto_url} alt={primero.alt ?? primero.nombre} />
            <h3>{primero.nombre}</h3>
          </Link>
          <p>{primero.descripcion}</p>
          <span className="precio">{formatCOP(primero.precio)} <small>{unidadCorta(primero.unidad)}</small></span>
        </li>
        {resto.map((p, i) => (
          <li key={p.id} className={styles.otro}>
            <span className="numeral">{i + 2}</span>
            <Link className={styles.mini} to={`/plato/${p.id}`}>
              <img src={p.foto_url} alt="" />
              <span>
                <h3>{p.nombre}</h3>
                <span className="precio">{formatCOP(p.precio)} <small>{unidadCorta(p.unidad)}</small></span>
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </section>
  );
}
