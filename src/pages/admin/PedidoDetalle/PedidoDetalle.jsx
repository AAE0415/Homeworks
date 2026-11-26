import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import CabeceraArea from '../../../components/admin/CabeceraArea';
import VistaComprobante from '../../../components/admin/VistaComprobante';
import BotonWhatsApp from '../../../components/orders/BotonWhatsApp';
import LineaEstados from '../../../components/orders/LineaEstados';
import MapaDomicilio from '../../../components/orders/MapaDomicilio';
import RutaResumen from '../../../components/orders/RutaResumen';
import Loader from '../../../components/shared/Loader';
import { BARRIOS } from '../../../data/barrios';
import { formatCOP } from '../../../helpers/format';
import { siguienteEstado } from '../../../helpers/orders';
import { mensajeAdmin } from '../../../helpers/whatsapp';
import useAdminOrders from '../../../hooks/useAdminOrders';
import useDeliveryRoute from '../../../hooks/useDeliveryRoute';
import styles from './PedidoDetalle.module.scss';

const BOTON = { anticipo_confirmado: 'Confirmar anticipo', en_cocina: 'Pasar a En cocina', en_camino: 'Pasar a En camino', entregado: 'Marcar entregado' };
const barrio = (id) => BARRIOS.nodos.find((b) => b.id === id)?.nombre ?? id;

export default function PedidoDetalle() {
  const { id } = useParams();
  const { pedidos, cargando, cambiarEstado, anotarDomicilio, urlComprobante } = useAdminOrders();
  const pedido = pedidos.find((p) => p.id === Number(id));
  const ruta = useDeliveryRoute(pedido?.barrio_id);
  const [domicilio, setDomicilio] = useState(null);
  const [aviso, setAviso] = useState('');

  if (cargando) return <Loader texto="Cargando el pedido…" />;
  if (!pedido) return <p>No existe el pedido N.º {id}. <Link to="/admin/anticipos">Volver a anticipos</Link></p>;

  const numero = String(pedido.id).padStart(4, '0');
  const siguiente = siguienteEstado(pedido.estado);
  const valorDomicilio = domicilio ?? (pedido.domicilio_acordado ?? '');

  const guardarDomicilio = async (e) => {
    e.preventDefault();
    const r = await anotarDomicilio(pedido.id, valorDomicilio);
    setAviso(r.error ?? 'Guardamos el valor del domicilio.');
  };

  return (
    <>
      <CabeceraArea titulo={`Pedido N.º ${numero}`} bajada={`${pedido.fechas_entrega?.texto} · ${pedido.personas} personas · ${barrio(pedido.barrio_id)}`} enVivo />
      <div className={styles.detalle}>
        <div className={styles.izq}>
          <section className={styles.bloque}>
            <h2>Estado</h2>
            <div className={styles.hoja}><LineaEstados pedido={pedido} /></div>
            <div className={styles.acciones}>
              {siguiente && <button className="btn btn--rojo" type="button" onClick={() => cambiarEstado(pedido.id, siguiente)}>{BOTON[siguiente]}</button>}
              {!['entregado', 'cancelado'].includes(pedido.estado) && (
                <button className="btn" type="button" onClick={() => cambiarEstado(pedido.id, 'cancelado')}>Cancelar pedido</button>
              )}
            </div>
          </section>

          <section className={styles.bloque}>
            <h2>Productos</h2>
            <ul className={styles.items}>
              {pedido.pedido_items.map((i) => (
                <li key={i.id}><span>{i.nombre} · {i.cantidad}{i.porciones ? ` lb · ${i.porciones}` : ''}</span><span className="tabular">{formatCOP(i.precio_unitario * i.cantidad)}</span></li>
              ))}
              <li><span>Subtotal</span><span className="tabular">{formatCOP(pedido.subtotal)}</span></li>
              <li><span>Anticipo (50 %)</span><span className="tabular">{formatCOP(pedido.anticipo)}</span></li>
            </ul>
          </section>
        </div>

        <div className={styles.der}>
          <section className={styles.bloque}>
            <h2>Cliente</h2>
            <p className={styles.cliente}>
              <b>{pedido.cliente?.nombre ?? '—'}</b> · {pedido.cliente?.telefono ?? 'sin teléfono'}<br />
              Recibe: {pedido.nombre_recibe}<br />{pedido.direccion}{pedido.notas ? ` · ${pedido.notas}` : ''}
            </p>
            {pedido.cliente?.telefono && (
              <BotonWhatsApp numero={`57${pedido.cliente.telefono}`}
                mensaje={mensajeAdmin({ id: pedido.id, nombre: pedido.cliente.nombre, fechaTexto: pedido.fechas_entrega?.texto })}>
                Escribir por WhatsApp
              </BotonWhatsApp>
            )}
          </section>

          <section className={styles.bloque}>
            <h2>Domicilio</h2>
            {pedido.domicilio_gratis ? <p className={styles.gratis}>Gratis por el valor del pedido.</p> : (
              <form className={styles.domicilio} onSubmit={guardarDomicilio}>
                <label htmlFor="dom">Valor acordado por WhatsApp (opcional)</label>
                <div>
                  <input id="dom" className="control" type="number" min="0" step="500" inputMode="numeric" placeholder="Ej. 12000"
                    value={valorDomicilio} onChange={(e) => setDomicilio(e.target.value)} />
                  <button className="btn btn--chico" type="submit">Guardar</button>
                </div>
                {aviso && <span className={styles.aviso} role="status">{aviso}</span>}
              </form>
            )}
            <RutaResumen {...ruta} />
            {ruta.ruta && <MapaDomicilio ruta={ruta.ruta} destino={pedido.barrio_id} compacto alto={240} />}
          </section>

          <section className={styles.bloque}>
            <h2>Comprobante</h2>
            <VistaComprobante ruta={pedido.comprobante_url} anticipo={pedido.anticipo} obtenerUrl={urlComprobante} />
          </section>
        </div>
      </div>
    </>
  );
}
