import { formatCOP } from '../../helpers/format';
import useCart from '../../hooks/useCart';
import styles from './ResumenCanasta.module.scss';

// Subtotal, domicilio (gratis o por acordar) y anticipo.
export default function ResumenCanasta() {
  const { subtotal, anticipo, domicilioGratis, faltaParaGratis } = useCart();
  return (
    <dl className={styles.resumen}>
      <dt>Subtotal</dt><dd>{formatCOP(subtotal)}</dd>
      <dt>Domicilio</dt>
      <dd className={domicilioGratis ? styles.gratis : ''}>{domicilioGratis ? 'Gratis' : 'Por acordar por WhatsApp'}</dd>
      {!domicilioGratis && subtotal > 0 && (
        <dd className={styles.pista}>Te faltan {formatCOP(faltaParaGratis)} para el domicilio gratis.</dd>
      )}
      <dt className={styles.anticipo}>Anticipo para confirmar (50 %)</dt>
      <dd className={styles.anticipo}>{formatCOP(anticipo)}</dd>
    </dl>
  );
}
