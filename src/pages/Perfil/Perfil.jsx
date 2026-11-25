import PaginaPendiente from '../../components/shared/PaginaPendiente';
import styles from './Perfil.module.scss';

export default function Perfil() {
  return (
    <div className={styles.pagina}>
      <PaginaPendiente
        titulo="Mi perfil"
        descripcion="Nombre, celular y barrio por defecto."
        hito={4}
      />
    </div>
  );
}
