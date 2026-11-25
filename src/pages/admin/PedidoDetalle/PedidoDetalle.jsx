import PaginaPendiente from '../../../components/shared/PaginaPendiente';
import styles from './PedidoDetalle.module.scss';

export default function PedidoDetalle() {
  return (
    <div className={styles.pagina}>
      <PaginaPendiente
        titulo="Detalle del pedido"
        descripcion="Productos, datos del cliente, ruta y WhatsApp."
        hito={8}
      />
    </div>
  );
}
