import PaginaPendiente from '../../../components/shared/PaginaPendiente';
import styles from './Resumen.module.scss';

export default function Resumen() {
  return (
    <div className={styles.pagina}>
      <PaginaPendiente
        titulo="Resumen"
        descripcion="Pedidos por estado, ventas estimadas y lo más vendido."
        hito={8}
      />
    </div>
  );
}
