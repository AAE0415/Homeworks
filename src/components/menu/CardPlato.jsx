import { useState } from 'react';
import { Link } from 'react-router-dom';
import { formatCOP } from '../../helpers/format';
import useCart from '../../hooks/useCart';
import Icon from '../shared/Icon';
import SelectorPorciones from './SelectorPorciones';
import styles from './CardPlato.module.scss';

const textoUnidad = (u) => (u === 'libra' ? 'la libra' : u === 'porción' ? 'porción' : u);

// Plato del menú. variante: "destacado" (entradas), "fila" (platos fuertes) o "celda" (acompañantes).
// "porciones" son los hijos del nodo del plato en el árbol del menú.
export default function CardPlato({ producto, porciones = [], variante = 'fila' }) {
  const { agregar } = useCart();
  const [abierto, setAbierto] = useState(false);
  const agotado = !producto.disponible;
  const conPorciones = porciones.length > 0;

  const accion = agotado ? (
    <span className="sello sello--tinta">Agotado</span>
  ) : conPorciones ? (
    <button className={styles.agregar} type="button" aria-expanded={abierto}
      aria-label={`${abierto ? 'Cerrar opciones de' : 'Elegir porciones de'} ${producto.nombre}`} onClick={() => setAbierto((v) => !v)}>
      <Icon name={abierto ? 'cerrar' : 'mas'} />
    </button>
  ) : (
    <button className={styles.agregar} type="button" aria-label={`Agregar ${producto.nombre} a la canasta`}
      onClick={() => agregar(producto, { cantidad: 1 })}>
      <Icon name="mas" />
    </button>
  );

  if (variante === 'destacado') {
    return (
      <article className={styles.destacado}>
        <img src={producto.foto_url} alt={producto.alt ?? producto.nombre} />
        <div>
          <h3><Link to={`/plato/${producto.id}`}>{producto.nombre}</Link></h3>
          <p>{producto.descripcion}</p>
          <span className={`precio ${styles.precioGrande}`}>{formatCOP(producto.precio)} <small>· {producto.unidad}</small></span>
          {agotado ? <span className="sello sello--tinta">Agotado</span> : (
            <button className="btn btn--rojo" type="button" onClick={() => agregar(producto, { cantidad: 1 })}>
              <Icon name="mas" />Agregar a la canasta
            </button>
          )}
        </div>
      </article>
    );
  }

  if (variante === 'celda') {
    return (
      <li className={`${styles.celda} ${agotado ? styles.agotado : ''}`}>
        <img src={producto.foto_url} alt="" />
        <h3><Link to={`/plato/${producto.id}`}>{producto.nombre}</Link></h3>
        <div className={styles.filaCelda}>
          <span className="precio">{formatCOP(producto.precio)}</span>
          {accion}
        </div>
      </li>
    );
  }

  return (
    <li className={`${styles.fila} ${agotado ? styles.agotado : ''}`}>
      <img src={producto.foto_url} alt="" />
      <div>
        <h3><Link to={`/plato/${producto.id}`}>{producto.nombre}</Link></h3>
        <p>{producto.descripcion}</p>
      </div>
      <div className={styles.der}>
        <span className="precio">{formatCOP(producto.precio)}</span>
        <span className={styles.unidad}>{textoUnidad(producto.unidad)}</span>
        {accion}
      </div>
      {abierto && conPorciones && (
        <div className={styles.selector}>
          <SelectorPorciones producto={producto} porciones={porciones} onAgregado={() => setAbierto(false)} />
        </div>
      )}
    </li>
  );
}
