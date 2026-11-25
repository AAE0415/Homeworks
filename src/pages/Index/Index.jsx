import PaginaPendiente from '../../components/shared/PaginaPendiente';
import styles from './Index.module.scss';

export default function Index() {
  return (
    <div className={styles.pagina}>
      <PaginaPendiente
        titulo="La cena de Navidad, lista para tu mesa"
        descripcion="Portada con la lámina de platos, el almanaque de fechas y cupos, y lo más pedido."
        hito={5}
      />
    </div>
  );
}
