import PaginaPendiente from '../../../components/shared/PaginaPendiente';
import styles from './Anticipos.module.scss';

export default function Anticipos() {
  return (
    <div className={styles.pagina}>
      <PaginaPendiente
        titulo="Anticipos por confirmar"
        descripcion="Cola de pedidos en orden de llegada con su comprobante."
        hito={8}
      />
    </div>
  );
}
