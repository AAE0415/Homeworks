import Icon from '../shared/Icon';
import styles from './RutaResumen.module.scss';

// Distancia, tiempo y barrios por los que pasa la ruta más corta.
export default function RutaResumen({ ruta, minutos, nombres, enCobertura, domicilioGratis }) {
  if (!enCobertura) {
    return (
      <div className={`${styles.ruta} ${styles.fuera}`} role="status">
        <b>Fuera de cobertura.</b> No llegamos a ese barrio por ahora. Escríbenos por WhatsApp y lo revisamos.
      </div>
    );
  }
  return (
    <div className={styles.ruta} aria-live="polite">
      <div className={styles.datos}>
        <div><span className="numeral">{String(ruta.distance).replace('.', ',')}</span><span>km desde la cocina</span></div>
        <div><span className="numeral">{minutos}</span><span>minutos aprox.</span></div>
      </div>
      <ol className={styles.camino} aria-label="Ruta">
        {nombres.map((n) => <li key={n}>{n}</li>)}
      </ol>
      {domicilioGratis != null && (
        domicilioGratis
          ? <span className={styles.gratis}><Icon name="check" />Domicilio gratis por el valor de tu pedido</span>
          : <span className={styles.acordar}>El valor del domicilio lo acordamos por WhatsApp.</span>
      )}
    </div>
  );
}
