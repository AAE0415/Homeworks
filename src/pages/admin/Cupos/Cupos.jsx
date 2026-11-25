import PaginaPendiente from '../../../components/shared/PaginaPendiente';
import styles from './Cupos.module.scss';

export default function Cupos() {
  return (
    <div className={styles.pagina}>
      <PaginaPendiente
        titulo="Cupos por fecha"
        descripcion="Cupo total y ocupado de cada fecha de entrega."
        hito={8}
      />
    </div>
  );
}
