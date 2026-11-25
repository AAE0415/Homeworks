import { Link, useParams } from 'react-router-dom';
import SelectorPorciones from '../../components/menu/SelectorPorciones';
import Loader from '../../components/shared/Loader';
import { formatCOP } from '../../helpers/format';
import useMenu from '../../hooks/useMenu';
import NotFound from '../NotFound/NotFound';
import styles from './Plato.module.scss';

export default function Plato() {
  const { id } = useParams();
  const { arbol, cargando } = useMenu();

  if (cargando) return <Loader texto="Cargando el plato…" />;

  // El plato es un nodo del árbol del menú; su padre es la sección y sus hijos las porciones
  const nodo = arbol.find((v) => v.tipo === 'plato' && v.id === id);
  if (!nodo) return <NotFound />;
  const plato = nodo.value;
  const seccion = arbol.root.children.find((s) => s.children.includes(nodo))?.value;
  const porciones = nodo.children.map((h) => h.value.texto);
  const unidad = plato.unidad === 'libra' ? 'la libra' : plato.unidad === 'porción' ? 'la porción' : plato.unidad;

  return (
    <article className={`hoja ${styles.plato}`} aria-labelledby="t-plato">
      <p className={styles.migas}><Link to="/menu">Menú</Link> / {seccion?.numeral} · {seccion?.titulo}</p>
      <div className={styles.cuerpo}>
        <figure className={styles.lamina}>
          <img src={plato.foto_url} alt={plato.alt ?? plato.nombre} />
        </figure>
        <div className={styles.texto}>
          <h1 className="titular" id="t-plato">{plato.nombre}</h1>
          <p className={styles.descripcion}>{plato.descripcion}</p>
          <p className={styles.precio}><span className="precio">{formatCOP(plato.precio)}</span> {unidad}</p>
          {plato.disponible ? (
            <SelectorPorciones producto={plato} porciones={porciones} />
          ) : (
            <p><span className="sello sello--tinta">Agotado</span> Este plato no está disponible por ahora.</p>
          )}
          {seccion?.nota && <p className={styles.nota}>{seccion.nota.replace('100%', '100 %')}</p>}
        </div>
      </div>
    </article>
  );
}
