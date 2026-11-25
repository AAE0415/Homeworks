import { formatCOP } from '../../helpers/format';
import PasoCantidad from '../shared/PasoCantidad';
import styles from './ItemCanasta.module.scss';

export default function ItemCanasta({ item, onCantidad, onQuitar }) {
  const precioUnidad = item.unidad === 'libra' ? 'la libra' : item.unidad === 'porción' ? 'la porción' : item.unidad;
  return (
    <li className={`${styles.item} ${item.disponible === false ? styles.agotado : ''}`}>
      <img src={item.foto_url} alt="" />
      <div>
        <h3>{item.nombre}</h3>
        <p className={styles.detalle}>
          {item.porciones ? `${item.porciones} por libra · ` : ''}{formatCOP(item.precio)} {precioUnidad}
        </p>
        {item.disponible === false && <p className={styles.aviso}>Se agotó. Quítalo para poder continuar.</p>}
        <div className={styles.fila}>
          <PasoCantidad valor={item.cantidad} unidad={item.unidad} compacto nombre={item.nombre}
            onCambiar={(n) => onCantidad(item.clave, n)} minimo={1} />
          <span className="precio">{formatCOP(item.precio * item.cantidad)}</span>
        </div>
        <button className="btn-texto" type="button" onClick={() => onQuitar(item.clave)}>Quitar</button>
      </div>
    </li>
  );
}
