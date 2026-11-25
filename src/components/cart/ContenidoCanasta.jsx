import { Link } from 'react-router-dom';
import useCart from '../../hooks/useCart';
import Icon from '../shared/Icon';
import BarraDeshacer from './BarraDeshacer';
import ItemCanasta from './ItemCanasta';
import ResumenCanasta from './ResumenCanasta';
import styles from './ContenidoCanasta.module.scss';

function textoCambios(cambios) {
  const precios = cambios.filter((c) => c.tipo === 'precio').length;
  const eliminados = cambios.filter((c) => c.tipo === 'eliminado').length;
  const partes = [];
  if (precios) partes.push(precios === 1 ? 'un precio cambió' : `${precios} precios cambiaron`);
  if (eliminados) partes.push(eliminados === 1 ? 'un plato ya no está en el menú' : `${eliminados} platos ya no están en el menú`);
  return partes.length ? `Pusimos tu canasta al día: ${partes.join(' y ')}.` : null;
}

// Contenido de la canasta, compartido por el panel lateral y la página /canasta.
export default function ContenidoCanasta({ onNavegar }) {
  const { items, cambiarCantidad, quitar, vaciar, hayAgotados, cambios } = useCart();
  const aviso = textoCambios(cambios);

  return (
    <div className={styles.contenido}>
      <BarraDeshacer />
      {aviso && <p className={styles.aviso}>{aviso}</p>}

      {items.length === 0 ? (
        <div className={styles.vacia}>
          <Icon name="canasta" />
          <p><b>Tu canasta está vacía.</b> Agrega platos del menú y aquí verás tu pedido.</p>
          <Link className="btn" to="/menu" onClick={onNavegar}>Ver el menú</Link>
        </div>
      ) : (
        <>
          <ul className={styles.items}>
            {items.map((item) => (
              <ItemCanasta key={item.clave} item={item} onCantidad={cambiarCantidad} onQuitar={quitar} />
            ))}
          </ul>
          <div className={styles.totales}>
            <ResumenCanasta />
            {hayAgotados && <p className={styles.error} role="alert">Quita los platos agotados para continuar.</p>}
            {hayAgotados ? (
              <button className="btn btn--rojo btn--bloque" type="button" disabled>
                Elegir fecha y pagar anticipo
              </button>
            ) : (
              <Link className="btn btn--rojo btn--bloque" to="/cuenta/checkout" onClick={onNavegar}>
                Elegir fecha y pagar anticipo <Icon name="flecha" />
              </Link>
            )}
            <button className="btn-texto" type="button" onClick={vaciar}>Vaciar canasta</button>
          </div>
        </>
      )}
    </div>
  );
}
