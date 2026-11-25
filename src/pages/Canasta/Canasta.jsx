import PaginaPendiente from '../../components/shared/PaginaPendiente';
import styles from './Canasta.module.scss';

export default function Canasta() {
  return (
    <div className={styles.pagina}>
      <PaginaPendiente
        titulo="Tu canasta"
        descripcion="Productos elegidos, deshacer, subtotal, domicilio y anticipo."
        hito={5}
      />
    </div>
  );
}
