import PaginaPendiente from '../../../components/shared/PaginaPendiente';
import styles from './MenuAdmin.module.scss';

export default function MenuAdmin() {
  return (
    <div className={styles.pagina}>
      <PaginaPendiente
        titulo="Menú"
        descripcion="Precios, platos agotados, destacados y fotos."
        hito={8}
      />
    </div>
  );
}
