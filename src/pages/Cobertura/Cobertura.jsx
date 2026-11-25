import PaginaPendiente from '../../components/shared/PaginaPendiente';
import styles from './Cobertura.module.scss';

export default function Cobertura() {
  return (
    <div className={styles.pagina}>
      <PaginaPendiente
        titulo="¿Llegamos a tu barrio?"
        descripcion="Mapa de barrios de Cali con la ruta desde la cocina."
        hito={6}
      />
    </div>
  );
}
