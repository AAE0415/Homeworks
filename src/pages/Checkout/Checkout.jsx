import PaginaPendiente from '../../components/shared/PaginaPendiente';
import styles from './Checkout.module.scss';

export default function Checkout() {
  return (
    <div className={styles.pagina}>
      <PaginaPendiente
        titulo="Separa tu fecha"
        descripcion="Fecha de entrega con cupos, datos de entrega y ruta en el mapa."
        hito={6}
      />
    </div>
  );
}
