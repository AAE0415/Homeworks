import useCart from '../../hooks/useCart';
import Icon from '../shared/Icon';
import styles from './BarraDeshacer.module.scss';

const TEXTOS = {
  agregar: (n) => <>Agregaste <b>{n}</b>.</>,
  quitar: (n) => <>Quitaste <b>{n}</b>.</>,
  cantidad: (n) => <>Cambiaste la cantidad de <b>{n}</b>.</>,
  vaciar: () => <>Vaciaste la canasta.</>,
};

// Muestra la última acción (el tope de la pila) y permite deshacerla.
export default function BarraDeshacer() {
  const { puedeDeshacer, ultimaAccion, deshacer } = useCart();
  if (!puedeDeshacer) return null;
  return (
    <div className={styles.barra} role="status">
      <span>{TEXTOS[ultimaAccion.tipo]?.(ultimaAccion.nombre)}</span>
      <button type="button" onClick={deshacer}><Icon name="deshacer" />Deshacer</button>
    </div>
  );
}
