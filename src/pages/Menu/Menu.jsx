import PaginaPendiente from '../../components/shared/PaginaPendiente';
import styles from './Menu.module.scss';

export default function Menu() {
  return (
    <div className={styles.pagina}>
      <PaginaPendiente
        titulo="El menú"
        descripcion="Secciones del menú, buscador con autocompletado y selector de porciones."
        hito={5}
      />
    </div>
  );
}
