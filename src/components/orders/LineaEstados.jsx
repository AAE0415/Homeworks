import { ESTADOS } from '../../helpers/orders';
import styles from './LineaEstados.module.scss';

const INFO = {
  recibido: { titulo: 'Recibido', texto: 'Recibimos tu pedido y separamos tu cupo.', tinta: 'tinta' },
  anticipo_confirmado: { titulo: 'Anticipo confirmado', texto: 'Tu anticipo está confirmado.', tinta: 'verde' },
  en_cocina: { titulo: 'En cocina', texto: 'Tu cena se está preparando.', tinta: 'rojo' },
  en_camino: { titulo: 'En camino', texto: 'Tu cena salió de la cocina hacia tu casa.', tinta: 'rojo' },
  entregado: { titulo: 'Entregado', texto: '¡Buen provecho!', tinta: 'verde' },
};

const hora = (iso) => (iso ? new Intl.DateTimeFormat('es-CO', { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' }).format(new Date(iso)) : null);

// Estados del pedido como sellos de goma sobre la hoja del día.
// Los estados pasados quedan sellados, el actual se estampa y los que faltan van punteados.
export default function LineaEstados({ pedido }) {
  if (pedido.estado === 'cancelado') {
    return (
      <div className={styles.cancelado} role="status">
        <span className="sello">Cancelado</span>
        <p>Este pedido fue cancelado. Si tienes dudas, escríbenos por WhatsApp.</p>
      </div>
    );
  }

  const actual = ESTADOS.indexOf(pedido.estado);
  const fechas = { recibido: pedido.created_at, anticipo_confirmado: pedido.confirmado_at };
  const textoRecibido = pedido.comprobante_url
    ? 'Recibimos tu pedido y tu comprobante; estamos revisando el anticipo.'
    : 'Recibimos tu pedido. Sube el comprobante del anticipo para confirmar tu cupo.';

  return (
    <ol className={styles.estados} aria-label="Estado del pedido">
      {ESTADOS.map((estado, i) => {
        const info = INFO[estado];
        const paso = i < actual ? 'pasado' : i === actual ? 'actual' : 'pendiente';
        return (
          <li key={estado} className={`${styles.estado} ${styles[paso]}`} aria-current={paso === 'actual' ? 'step' : undefined}>
            <span className={`sello ${paso === 'pendiente' ? 'sello--pendiente' : info.tinta === 'verde' ? 'sello--verde' : info.tinta === 'tinta' ? 'sello--tinta' : ''}`}>
              {info.titulo}
            </span>
            <p>
              {paso !== 'pendiente' && hora(fechas[estado]) && <time>{hora(fechas[estado])}</time>}
              {estado === 'recibido' && paso === 'actual' ? textoRecibido : paso === 'pendiente' && estado === 'en_camino' ? 'Te avisamos aquí mismo cuando salga de la cocina.' : info.texto}
            </p>
          </li>
        );
      })}
    </ol>
  );
}
