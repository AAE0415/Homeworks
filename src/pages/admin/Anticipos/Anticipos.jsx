import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import CabeceraArea from '../../../components/admin/CabeceraArea';
import VistaComprobante from '../../../components/admin/VistaComprobante';
import BotonWhatsApp from '../../../components/orders/BotonWhatsApp';
import Icon from '../../../components/shared/Icon';
import Loader from '../../../components/shared/Loader';
import { BARRIOS } from '../../../data/barrios';
import { formatCOP } from '../../../helpers/format';
import { colaAnticipos } from '../../../helpers/orders';
import { mensajeAdmin } from '../../../helpers/whatsapp';
import useAdminOrders from '../../../hooks/useAdminOrders';
import styles from './Anticipos.module.scss';

const barrio = (id) => BARRIOS.nodos.find((b) => b.id === id)?.nombre ?? id;
const numero = (id) => String(id).padStart(4, '0');
const hace = (iso) => {
  const min = Math.round((Date.now() - new Date(iso)) / 60000);
  if (min < 60) return `hace ${min} min`;
  if (min < 60 * 24) return `hace ${Math.round(min / 60)} h`;
  return `hace ${Math.round(min / 1440)} días`;
};
const hora = (iso) => new Intl.DateTimeFormat('es-CO', { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' }).format(new Date(iso));

export default function Anticipos() {
  const { pedidos, cargando, error, cambiarEstado, urlComprobante } = useAdminOrders();
  const [mensaje, setMensaje] = useState('');
  const { cola, sinComprobante } = useMemo(() => colaAnticipos(pedidos), [pedidos]);
  const frente = cola.peek();
  const resto = cola.toArray().slice(1);

  if (cargando) return <Loader texto="Cargando anticipos…" />;

  const resolver = async (estado) => {
    const r = await cambiarEstado(frente.id, estado);
    setMensaje(r.error ?? (estado === 'cancelado' ? `Rechazaste el pedido N.º ${numero(frente.id)}.` : `Confirmaste el anticipo del pedido N.º ${numero(frente.id)}.`));
  };

  return (
    <>
      <CabeceraArea titulo="Anticipos por confirmar" bajada="Se atienden en el orden en que llegaron." enVivo />
      {error && <p className={styles.error} role="alert">{error}</p>}
      {mensaje && <p className={styles.aviso} role="status">{mensaje}</p>}

      <div className={styles.trabajo}>
        {frente ? (
          <article className={styles.turno} aria-labelledby="t-turno">
            <div className={styles.turnoCab}>
              <span className="sello sello--tinta">Primero en la fila</span>
              <h2 className="titular" id="t-turno">Pedido N.º {numero(frente.id)}</h2>
              <span className={styles.espera}><Icon name="reloj" />Llegó {hace(frente.created_at)}</span>
            </div>
            <div className={styles.turnoCuerpo}>
              <dl className={styles.datos}>
                <dt>Cliente</dt><dd>{frente.cliente?.nombre ?? '—'} · {frente.cliente?.telefono ?? 'sin teléfono'}</dd>
                <dt>Entrega</dt><dd>{frente.fechas_entrega?.texto} · {frente.personas} personas</dd>
                <dt>Barrio</dt><dd>{barrio(frente.barrio_id)}</dd>
                <dt>Pedido</dt><dd>{frente.pedido_items.map((i) => `${i.nombre} ${i.cantidad}${i.porciones ? ' lb' : ''}`).join(', ')}</dd>
                <dt>Domicilio</dt><dd>{frente.domicilio_gratis ? `Gratis (subtotal ${formatCOP(frente.subtotal)})` : 'Por acordar'}</dd>
              </dl>
              <VistaComprobante ruta={frente.comprobante_url} anticipo={frente.anticipo} obtenerUrl={urlComprobante} />
            </div>
            <div className={styles.acciones}>
              <button className="btn btn--verde" type="button" onClick={() => resolver('anticipo_confirmado')}><Icon name="check" />Confirmar anticipo</button>
              <button className="btn" type="button" onClick={() => resolver('cancelado')}>Rechazar</button>
              <Link className="btn-texto" to={`/admin/pedidos/${frente.id}`}>Ver detalle</Link>
              {frente.cliente?.telefono && (
                <BotonWhatsApp variante="texto" numero={`57${frente.cliente.telefono}`}
                  mensaje={mensajeAdmin({ id: frente.id, nombre: frente.cliente.nombre, fechaTexto: frente.fechas_entrega?.texto })}>
                  Escribir por WhatsApp
                </BotonWhatsApp>
              )}
            </div>
          </article>
        ) : (
          <div className={styles.vacio}>
            <span className="sello sello--verde">Al día</span>
            <p>No hay anticipos por confirmar. Cuando un cliente suba su comprobante aparecerá aquí.</p>
          </div>
        )}

        <div className={styles.columna}>
          <section className={styles.fila} aria-labelledby="t-fila">
            <h2 id="t-fila">En la fila <small>{resto.length} más</small></h2>
            {resto.length === 0 ? <p className={styles.suave}>Nadie más esperando.</p> : (
              <ol>
                {resto.map((p, i) => (
                  <li key={p.id}>
                    <span className={`numeral ${styles.pos}`}>{i + 2}</span>
                    <span><b>N.º {numero(p.id)} · {p.cliente?.nombre ?? 'Cliente'}</b><span>{p.fechas_entrega?.texto} · {barrio(p.barrio_id)} · llegó {hora(p.created_at)}</span></span>
                    <span className="tabular">{formatCOP(p.anticipo)}</span>
                  </li>
                ))}
              </ol>
            )}
          </section>

          {sinComprobante.length > 0 && (
            <section className={styles.fila} aria-labelledby="t-sin">
              <h2 id="t-sin">Esperando comprobante <small>{sinComprobante.length}</small></h2>
              <ol>
                {sinComprobante.map((p) => (
                  <li key={p.id}>
                    <span className={`numeral ${styles.pos}`}>·</span>
                    <span><b>N.º {numero(p.id)} · {p.cliente?.nombre ?? 'Cliente'}</b><span>{p.fechas_entrega?.texto} · hizo el pedido {hace(p.created_at)}</span></span>
                    <Link className="btn-texto" to={`/admin/pedidos/${p.id}`}>Ver</Link>
                  </li>
                ))}
              </ol>
            </section>
          )}
        </div>
      </div>
    </>
  );
}
