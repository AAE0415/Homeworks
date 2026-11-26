import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../components/shared/Icon';
import Loader from '../../components/shared/Loader';
import { formatCOP } from '../../helpers/format';
import useAuth from '../../hooks/useAuth';
import { supabase } from '../../lib/supabase';
import styles from './MisPedidos.module.scss';

const SELLO = {
  recibido: ['Recibido', 'sello--tinta'],
  anticipo_confirmado: ['Confirmado', 'sello--verde'],
  en_cocina: ['En cocina', ''],
  en_camino: ['En camino', ''],
  entregado: ['Entregado', 'sello--verde'],
  cancelado: ['Cancelado', 'sello--pendiente'],
};

export default function MisPedidos() {
  const { user } = useAuth();
  const [pedidos, setPedidos] = useState(null);

  useEffect(() => {
    let activo = true;
    const cargar = () => supabase.from('pedidos')
      .select('id, estado, subtotal, comprobante_url, created_at, fechas_entrega(texto, fecha)')
      .order('created_at', { ascending: false })
      .then(({ data }) => { if (activo) setPedidos(data ?? []); });
    cargar();
    // Si la cocina cambia el estado de cualquiera de mis pedidos, la lista se refresca
    const canal = supabase.channel(`mis-pedidos-${user.id}`)
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'pedidos', filter: `user_id=eq.${user.id}` }, cargar)
      .subscribe();
    return () => { activo = false; supabase.removeChannel(canal); };
  }, [user.id]);

  if (!pedidos) return <Loader texto="Cargando tus pedidos…" />;

  return (
    <section className={`hoja ${styles.lista}`} aria-labelledby="t-mis">
      <h1 className="titular" id="t-mis">Mis pedidos</h1>
      {pedidos.length === 0 ? (
        <div className={styles.vacio}>
          <p>Todavía no tienes pedidos. Arma tu canasta y separa tu fecha.</p>
          <Link className="btn btn--rojo" to="/menu">Ver el menú</Link>
        </div>
      ) : (
        <ul>
          {pedidos.map((p) => {
            const [texto, clase] = SELLO[p.estado];
            return (
              <li key={p.id}>
                <Link to={`/cuenta/pedidos/${p.id}`} className={styles.fila}>
                  <span className={`numeral ${styles.dia}`}>{p.fechas_entrega?.fecha.slice(8)}</span>
                  <span>
                    <b>Pedido N.º {String(p.id).padStart(4, '0')}</b>
                    <span className={styles.detalle}>
                      {p.fechas_entrega?.texto} · {formatCOP(p.subtotal)}
                      {p.estado === 'recibido' && !p.comprobante_url && ' · Falta el comprobante'}
                    </span>
                  </span>
                  <span className={`sello ${clase}`}>{texto}</span>
                  <Icon name="flecha" />
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
