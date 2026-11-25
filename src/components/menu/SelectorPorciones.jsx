import { useId, useState } from 'react';
import { formatCOP } from '../../helpers/format';
import useCart from '../../hooks/useCart';
import PasoCantidad from '../shared/PasoCantidad';
import styles from './SelectorPorciones.module.scss';

// Elegir porciones (hijos "porción" del nodo del plato en el árbol del menú) y libras.
export default function SelectorPorciones({ producto, porciones, onAgregado }) {
  const { agregar } = useCart();
  const id = useId();
  const [porcion, setPorcion] = useState(porciones[1] ?? porciones[0] ?? null);
  const [cantidad, setCantidad] = useState(1);

  const agregarALaCanasta = () => {
    agregar(producto, { cantidad, porciones: porcion });
    onAgregado?.();
  };

  return (
    <div className={styles.porciones}>
      {porciones.length > 0 && (
        <fieldset>
          <legend>¿En cuántas porciones te cortamos cada libra?</legend>
          <div className={styles.opciones}>
            {porciones.map((texto) => {
              const [n, ...resto] = texto.split(' de ');
              return (
                <label className={styles.opcion} key={texto}>
                  <input type="radio" name={`${id}-porcion`} value={texto} checked={porcion === texto} onChange={() => setPorcion(texto)} />
                  <span><b>{n}</b>de {resto.join(' de ')}</span>
                </label>
              );
            })}
          </div>
        </fieldset>
      )}
      <div className={styles.fila}>
        <PasoCantidad valor={cantidad} unidad={producto.unidad} onCambiar={setCantidad} nombre={producto.nombre} />
        <button className="btn btn--rojo btn--chico" type="button" onClick={agregarALaCanasta}>
          Agregar · {formatCOP(producto.precio * cantidad)}
        </button>
      </div>
    </div>
  );
}
