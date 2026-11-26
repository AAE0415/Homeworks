import { Link, useLocation, useParams } from 'react-router-dom';
import BotonWhatsApp from '../../components/orders/BotonWhatsApp';
import LineaEstados from '../../components/orders/LineaEstados';
import MapaDomicilio from '../../components/orders/MapaDomicilio';
import SubirComprobante from '../../components/orders/SubirComprobante';
import Icon from '../../components/shared/Icon';
import Loader from '../../components/shared/Loader';
import { BARRIOS } from '../../data/barrios';
import { formatCOP, formatFecha } from '../../helpers/format';
import { WHATSAPP_NEGOCIO, mensajePedido } from '../../helpers/whatsapp';
import useDeliveryRoute from '../../hooks/useDeliveryRoute';
import useMenu from '../../hooks/useMenu';
import useOrders from '../../hooks/useOrders';
import useRealtimeOrder from '../../hooks/useRealtimeOrder';
import styles from './PedidoEnVivo.module.scss';

const DIAS = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
const nombreBarrio = (id) => BARRIOS.nodos.find((b) => b.id === id)?.nombre ?? id;

function etiquetaDia(iso) {
  const [a, m, d] = iso.split('-').map(Number);
  const dia = DIAS[new Date(a, m - 1, d).getDay()];
  if (m === 12 && d === 24) return `${dia}, Nochebuena`;
  if (m === 12 && d === 31) return `${dia}, fin de año`;
  return dia;
}

export default function PedidoEnVivo() {
  const { id } = useParams();
  const { state } = useLocation();
  const { pedido, cargando, conectado, recargar } = useRealtimeOrder(Number(id));
  const { configuracion } = useMenu();
  const { urlComprobante } = useOrders();
  const ruta = useDeliveryRoute(pedido?.barrio_id);

  if (cargando) return <Loader texto="Cargando tu pedido…" />;
  if (!pedido) {
    return (
      <section className={`hoja ${styles.noEncontrado}`}>
        <h1 className="titular">No encontramos ese pedido</h1>
        <p>Puede que el enlace esté mal o que el pedido sea de otra cuenta.</p>
        <Link className="btn" to="/cuenta/pedidos">Ver mis pedidos</Link>
      </section>
    );
  }

  const numero = String(pedido.id).padStart(4, '0');
  const fechaISO = pedido.fechas_entrega?.fecha ?? '';
  const ano = fechaISO.slice(0, 4);
  const items = pedido.pedido_items ?? [];
  const mensaje = mensajePedido({
    id: pedido.id,
    fechaTexto: pedido.fechas_entrega?.texto ?? '',
    barrio: nombreBarrio(pedido.barrio_id),
    items: items.map((i) => ({ nombre: i.nombre, cantidad: i.cantidad, unidad: i.porciones ? 'libra' : '' })),
    subtotal: pedido.subtotal,
  });

  const verComprobante = async () => {
    const url = await urlComprobante(pedido.comprobante_url);
    if (url) window.open(url, '_blank', 'noopener');
  };

  return (
    <div className={styles.pedido}>
      <div>
        <p className={styles.migas}><Link to="/cuenta/pedidos">Mis pedidos</Link> / Pedido {numero}</p>
        {state?.nuevo && !pedido.comprobante_url && (
          <p className={styles.nuevo} role="status"><Icon name="check" />Separamos tu cupo. Ahora sube el comprobante del anticipo.</p>
        )}
        <article className={styles.hojaDia} aria-labelledby="t-pedido">
          <span className={styles.vivo} data-conectado={conectado} role="status">
            {conectado ? 'En vivo · se actualiza solo' : 'Conectando…'}
          </span>
          <div className={styles.cabecera}>
            <span className="numeral" aria-hidden="true">{fechaISO.slice(8)}</span>
            <span className={styles.dia}>{fechaISO && etiquetaDia(fechaISO)}</span>
            <span className={styles.mes}>{fechaISO && `${formatFecha(fechaISO).split(' de ')[1]} ${ano}`}</span>
            <h1 className={styles.numPedido} id="t-pedido">
              Pedido <b>N.º {numero}</b> · {pedido.personas} {pedido.personas === 1 ? 'persona' : 'personas'}
            </h1>
          </div>
          <LineaEstados pedido={pedido} />
        </article>
      </div>

      <div className={styles.lado}>
        <section className={styles.tarjeta} aria-labelledby="t-comp">
          <h2 id="t-comp">Comprobante del anticipo</h2>
          {pedido.comprobante_url ? (
            <div className={styles.comprobante}>
              <span className={styles.doc}><Icon name="check" /></span>
              <span><b>Comprobante recibido</b><span>Anticipo de {formatCOP(pedido.anticipo)}</span></span>
              <button className="btn-texto" type="button" onClick={verComprobante}>Ver</button>
            </div>
          ) : pedido.estado === 'recibido' ? (
            <SubirComprobante pedido={pedido} onSubido={recargar} />
          ) : (
            <p className={styles.suave}>Anticipo de {formatCOP(pedido.anticipo)} confirmado.</p>
          )}
        </section>

        <section className={`${styles.tarjeta} ${styles.whatsapp}`} aria-labelledby="t-wa">
          <h2 id="t-wa">¿Dudas o domicilio?</h2>
          <p>Te abrimos WhatsApp con tu número de pedido, la fecha y tu barrio ya escritos.
            {!pedido.domicilio_gratis && ' Ahí acordamos el valor del domicilio.'}</p>
          <BotonWhatsApp numero={configuracion?.whatsapp ?? WHATSAPP_NEGOCIO} mensaje={mensaje} />
        </section>

        {ruta.ruta && (
          <section className={styles.tarjeta} aria-labelledby="t-ruta">
            <h2 id="t-ruta">Ruta a {nombreBarrio(pedido.barrio_id)} · {String(ruta.ruta.distance).replace('.', ',')} km</h2>
            <MapaDomicilio ruta={ruta.ruta} destino={pedido.barrio_id} compacto alto={260} />
            <p className={styles.suave}>{pedido.direccion}{pedido.notas ? ` · ${pedido.notas}` : ''}</p>
          </section>
        )}

        <section className={styles.tarjeta} aria-labelledby="t-items">
          <h2 id="t-items">Lo que pediste</h2>
          <ul className={styles.items}>
            {items.map((i) => (
              <li key={i.id}>
                <span>{i.nombre} · {i.cantidad}{i.porciones ? ` lb · ${i.porciones}` : ''}</span>
                <span className="tabular">{formatCOP(i.precio_unitario * i.cantidad)}</span>
              </li>
            ))}
            <li><span>Domicilio</span><span>{pedido.domicilio_gratis ? 'Gratis' : pedido.domicilio_acordado ? formatCOP(pedido.domicilio_acordado) : 'Por acordar'}</span></li>
            <li><span>Saldo al recibir</span><span className="tabular">{formatCOP(pedido.subtotal - pedido.anticipo)}</span></li>
          </ul>
        </section>
      </div>
    </div>
  );
}
