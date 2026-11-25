import PaginaPendiente from '../../components/shared/PaginaPendiente';
import styles from './MisPedidos.module.scss';

export default function MisPedidos() {
  return (
    <div className={styles.pagina}>
      <PaginaPendiente
        titulo="Mis pedidos"
        descripcion="Lista de tus pedidos con su estado."
        hito={7}
      />
    </div>
  );
}
