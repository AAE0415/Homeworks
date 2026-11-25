import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import SubirComprobante from '../../components/orders/SubirComprobante';
import Loader from '../../components/shared/Loader';
import { formatCOP } from '../../helpers/format';
import { supabase } from '../../lib/supabase';
import styles from './PedidoEnVivo.module.scss';

// Versión del Hito 6: datos del pedido y subida del comprobante.
// En el Hito 7 se convierte en el seguimiento en vivo (estados en tiempo real y WhatsApp).
export default function PedidoEnVivo() {
  const { id } = useParams();
  const [pedido, setPedido] = useState(null);
  const [cargando, setCargando] = useState(true);

  const cargar = useCallback(async () => {
    const { data } = await supabase.from('pedidos').select('*, pedido_items(*), fechas_entrega(texto, fecha)').eq('id', id).maybeSingle();
    setPedido(data);
    setCargando(false);
  }, [id]);

  useEffect(() => { cargar(); }, [cargar]);

  if (cargando) return <Loader texto="Cargando tu pedido…" />;
  if (!pedido) {
    return (
      <section className={`hoja ${styles.pedido}`}>
        <h1 className="titular">No encontramos ese pedido</h1>
        <Link className="btn" to="/cuenta/pedidos">Ver mis pedidos</Link>
      </section>
    );
  }

  const numero = String(pedido.id).padStart(4, '0');
  return (
    <section className={`hoja ${styles.pedido}`} aria-labelledby="t-pedido">
      <h1 className="titular" id="t-pedido">Pedido N.º {numero}</h1>
      <p className={styles.sub}>{pedido.fechas_entrega?.texto} · {pedido.nombre_recibe} · {pedido.direccion}</p>

      <div className={styles.cuerpo}>
        <div>
          <h2>Comprobante del anticipo</h2>
          {pedido.comprobante_url ? (
            <p className={styles.ok}>Recibimos tu comprobante. Delilicias lo revisa y confirma tu cupo.</p>
          ) : pedido.estado === 'recibido' ? (
            <SubirComprobante pedido={pedido} onSubido={cargar} />
          ) : null}
        </div>
        <div>
          <h2>Lo que pediste</h2>
          <ul className={styles.items}>
            {pedido.pedido_items.map((i) => (
              <li key={i.id}><span>{i.nombre} · {i.cantidad}{i.porciones ? ` · ${i.porciones}` : ''}</span><span className="tabular">{formatCOP(i.precio_unitario * i.cantidad)}</span></li>
            ))}
            <li><span>Subtotal</span><span className="tabular">{formatCOP(pedido.subtotal)}</span></li>
            <li><span>Domicilio</span><span>{pedido.domicilio_gratis ? 'Gratis' : 'Por acordar'}</span></li>
            <li><span>Anticipo (50 %)</span><span className="tabular">{formatCOP(pedido.anticipo)}</span></li>
          </ul>
        </div>
      </div>
    </section>
  );
}
