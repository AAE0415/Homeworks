import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import CabeceraArea from '../../../components/admin/CabeceraArea';
import Icon from '../../../components/shared/Icon';
import Loader from '../../../components/shared/Loader';
import { BARRIOS } from '../../../data/barrios';
import { ordenarAgenda, siguienteEstado } from '../../../helpers/orders';
import useAdminOrders from '../../../hooks/useAdminOrders';
import useFechas from '../../../hooks/useFechas';
import styles from './Agenda.module.scss';

const EN_AGENDA = ['anticipo_confirmado', 'en_cocina', 'en_camino'];
const SELLO = { anticipo_confirmado: ['Confirmado', 'sello--verde'], en_cocina: ['En cocina', ''], en_camino: ['En camino', 'sello--tinta'] };
const BOTON = { en_cocina: 'Pasar a En cocina', en_camino: 'Pasar a En camino', entregado: 'Marcar entregado' };
const DIAS = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
const barrio = (id) => BARRIOS.nodos.find((b) => b.id === id)?.nombre ?? id;
const fechaCorta = (iso) => (iso ? new Intl.DateTimeFormat('es-CO', { day: 'numeric', month: 'short' }).format(new Date(iso)) : '');
const etiqueta = (iso) => {
  const [a, m, d] = iso.split('-').map(Number);
  const dia = DIAS[new Date(a, m - 1, d).getDay()];
  return m === 12 && d === 24 ? `${dia}, Nochebuena` : m === 12 && d === 31 ? `${dia}, fin de año` : dia;
};

export default function Agenda() {
  const { pedidos, cargando, cambiarEstado } = useAdminOrders();
  const { fechas } = useFechas();

  // HEAP: el pedido más urgente sale primero (fecha de entrega y luego hora de confirmación)
  const agenda = useMemo(() => ordenarAgenda(
    pedidos.filter((p) => EN_AGENDA.includes(p.estado))
      .map((p) => ({ ...p, fecha: p.fechas_entrega?.fecha ?? '', confirmado_at: p.confirmado_at ?? p.created_at })),
  ), [pedidos]);

  if (cargando) return <Loader texto="Cargando la agenda…" />;

  return (
    <>
      <CabeceraArea titulo="Agenda de cocina" bajada="Primero lo que se entrega antes; a igual fecha, lo que se confirmó primero." enVivo />
      <div className={styles.dias}>
        {fechas.map((f) => {
          const delDia = agenda.filter((p) => p.fecha === f.fecha);
          const cuenta = (e) => delDia.filter((p) => p.estado === e).length;
          return (
            <section key={f.id} className={styles.dia} aria-labelledby={`t-dia-${f.id}`}>
              <div className={styles.diaCab}>
                <span className="numeral">{f.fecha.slice(8)}</span>
                <span><h2 id={`t-dia-${f.id}`}>{etiqueta(f.fecha)}</h2><span>{f.texto}</span></span>
                <span className={styles.cupo}><span className="numeral tabular">{f.ocupados}</span><small>de {f.cupo} cupos</small></span>
                <div className={styles.barra} aria-hidden="true"><i style={{ width: `${Math.min(100, (f.ocupados / f.cupo) * 100)}%` }} /></div>
              </div>
              <div className={styles.conteo}>
                <span><b>{cuenta('anticipo_confirmado')}</b> por cocinar</span>
                <span><b>{cuenta('en_cocina')}</b> en cocina</span>
                <span><b>{cuenta('en_camino')}</b> en camino</span>
              </div>
              {delDia.length === 0 ? <p className={styles.vacio}>Sin pedidos confirmados para este día.</p> : (
                <ol className={styles.tickets}>
                  {delDia.map((p) => {
                    const [texto, clase] = SELLO[p.estado];
                    const siguiente = siguienteEstado(p.estado);
                    return (
                      <li key={p.id} className={`${styles.ticket} ${p.estado !== 'anticipo_confirmado' ? styles.urgente : ''}`}>
                        <h3>
                          <Link to={`/admin/pedidos/${p.id}`}><span className="tabular">N.º {String(p.id).padStart(4, '0')}</span></Link>
                          {barrio(p.barrio_id)} · {p.personas} personas
                        </h3>
                        <span className={`sello ${clase}`}>{texto}</span>
                        <p>{p.pedido_items.map((i) => `${i.nombre} ${i.cantidad}${i.porciones ? ` lb (${i.porciones.split(' ')[0]} porc.)` : ''}`).join(' · ')}</p>
                        <div className={styles.acc}>
                          <span className={styles.hora}><Icon name="reloj" />Confirmado {fechaCorta(p.confirmado_at)}</span>
                          {siguiente && (
                            <button className="btn btn--chico" type="button" onClick={() => cambiarEstado(p.id, siguiente)}>{BOTON[siguiente]}</button>
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ol>
              )}
            </section>
          );
        })}
      </div>
    </>
  );
}
