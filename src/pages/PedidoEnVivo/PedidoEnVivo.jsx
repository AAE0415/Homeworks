import PaginaPendiente from '../../components/shared/PaginaPendiente';
import styles from './PedidoEnVivo.module.scss';

export default function PedidoEnVivo() {
  return (
    <div className={styles.pagina}>
      <PaginaPendiente
        titulo="Tu pedido en vivo"
        descripcion="Estados en tiempo real, comprobante del anticipo y WhatsApp."
        hito={7}
      />
    </div>
  );
}
