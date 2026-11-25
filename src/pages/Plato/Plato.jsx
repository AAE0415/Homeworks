import PaginaPendiente from '../../components/shared/PaginaPendiente';
import styles from './Plato.module.scss';

export default function Plato() {
  return (
    <div className={styles.pagina}>
      <PaginaPendiente
        titulo="Detalle del plato"
        descripcion="Foto, descripción, precio y porciones del plato elegido."
        hito={5}
      />
    </div>
  );
}
