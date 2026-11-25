import PaginaPendiente from '../../../components/shared/PaginaPendiente';
import styles from './Agenda.module.scss';

export default function Agenda() {
  return (
    <div className={styles.pagina}>
      <PaginaPendiente
        titulo="Agenda de cocina"
        descripcion="Pedidos confirmados ordenados por fecha de entrega."
        hito={8}
      />
    </div>
  );
}
