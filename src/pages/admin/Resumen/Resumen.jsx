import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import CabeceraArea from '../../../components/admin/CabeceraArea';
import Loader from '../../../components/shared/Loader';
import { formatCOP } from '../../../helpers/format';
import { colaAnticipos, masPedidos } from '../../../helpers/orders';
import useAdminOrders from '../../../hooks/useAdminOrders';
import styles from './Resumen.module.scss';

const ESTADOS = [
  ['recibido', 'Recibidos', 'sello--tinta'],
  ['anticipo_confirmado', 'Confirmados', 'sello--verde'],
  ['en_cocina', 'En cocina', ''],
  ['en_camino', 'En camino', ''],
  ['entregado', 'Entregados', 'sello--verde'],
  ['cancelado', 'Cancelados', 'sello--pendiente'],
];

export default function Resumen() {
  const { pedidos, cargando } = useAdminOrders();

  const datos = useMemo(() => {
    const activos = pedidos.filter((p) => p.estado !== 'cancelado');
    const ventas = {};
    activos.forEach((p) => p.pedido_items.forEach((i) => {
      ventas[i.producto_id] ??= { producto_id: i.producto_id, nombre: i.nombre, cantidad: 0 };
      ventas[i.producto_id].cantidad += i.cantidad;
    }));
    const { cola, sinComprobante } = colaAnticipos(pedidos);
    return {
      porEstado: Object.fromEntries(ESTADOS.map(([e]) => [e, pedidos.filter((p) => p.estado === e).length])),
      ventasEstimadas: activos.reduce((s, p) => s + p.subtotal, 0),
      anticiposConfirmados: activos.filter((p) => p.estado !== 'recibido').reduce((s, p) => s + p.anticipo, 0),
      top: masPedidos(Object.values(ventas), 5),
      porRevisar: cola.size(),
      sinComprobante: sinComprobante.length,
    };
  }, [pedidos]);

  if (cargando) return <Loader texto="Cargando el resumen…" />;

  return (
    <>
      <CabeceraArea titulo="Resumen" bajada="Cómo va la temporada de Navidad." enVivo />

      {datos.porRevisar > 0 && (
        <p className={styles.pendiente}>
          Tienes <b>{datos.porRevisar}</b> {datos.porRevisar === 1 ? 'anticipo' : 'anticipos'} por revisar. <Link to="/admin/anticipos">Ir a la bandeja</Link>
        </p>
      )}

      <div className={styles.cifras}>
        <div><span className="numeral">{pedidos.length - datos.porEstado.cancelado}</span><span>pedidos activos</span></div>
        <div><span className="numeral">{formatCOP(datos.ventasEstimadas)}</span><span>ventas estimadas</span></div>
        <div><span className="numeral">{formatCOP(datos.anticiposConfirmados)}</span><span>anticipos confirmados</span></div>
      </div>

      <div className={styles.columnas}>
        <section aria-labelledby="t-estados">
          <h2 id="t-estados">Pedidos por estado</h2>
          <ul className={styles.estados}>
            {ESTADOS.map(([e, texto, clase]) => (
              <li key={e}><span className={`sello ${clase}`}>{texto}</span><span className="numeral tabular">{datos.porEstado[e]}</span></li>
            ))}
          </ul>
          {datos.sinComprobante > 0 && <p className={styles.nota}>{datos.sinComprobante} {datos.sinComprobante === 1 ? 'pedido espera' : 'pedidos esperan'} el comprobante del cliente.</p>}
        </section>

        <section aria-labelledby="t-top">
          <h2 id="t-top">Lo más vendido</h2>
          {datos.top.length === 0 ? <p className={styles.nota}>Aún no hay ventas.</p> : (
            <ol className={styles.top}>
              {datos.top.map((v, i) => (
                <li key={v.producto_id}><span className="numeral">{i + 1}</span><span>{v.nombre}</span><span className="tabular">{v.cantidad} {v.cantidad === 1 ? 'unidad' : 'unidades'}</span></li>
              ))}
            </ol>
          )}
        </section>
      </div>
    </>
  );
}
