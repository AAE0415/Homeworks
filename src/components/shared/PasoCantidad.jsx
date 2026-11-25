import Icon from './Icon';
import styles from './PasoCantidad.module.scss';

// Selector de cantidad: − valor +. "unidad" decide el texto (libras o unidades).
export default function PasoCantidad({ valor, onCambiar, unidad, minimo = 1, compacto = false, nombre = '' }) {
  const esLibra = unidad === 'libra';
  const texto = esLibra ? `${valor} ${compacto ? 'lb' : valor === 1 ? 'libra' : 'libras'}` : String(valor);
  const que = esLibra ? 'libra' : 'unidad';
  return (
    <span className={`${styles.paso} ${compacto ? styles.compacto : ''}`}>
      <button type="button" onClick={() => onCambiar(valor - 1)} disabled={valor <= minimo}
        aria-label={`Una ${que} menos${nombre ? ` de ${nombre}` : ''}`}>
        <Icon name="menos" />
      </button>
      <output aria-live="polite">{texto}</output>
      <button type="button" onClick={() => onCambiar(valor + 1)} aria-label={`Una ${que} más${nombre ? ` de ${nombre}` : ''}`}>
        <Icon name="mas" />
      </button>
    </span>
  );
}
