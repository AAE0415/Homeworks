import { useState } from 'react';
import CabeceraArea from '../../../components/admin/CabeceraArea';
import Loader from '../../../components/shared/Loader';
import useFechas from '../../../hooks/useFechas';
import { supabase } from '../../../lib/supabase';
import styles from './Cupos.module.scss';

// Cupo total y ocupado de cada fecha de entrega; la administradora puede ajustar el cupo.
export default function Cupos() {
  const { fechas, cargando } = useFechas();
  const [cambios, setCambios] = useState({});
  const [avisos, setAvisos] = useState({});

  if (cargando) return <Loader texto="Cargando cupos…" />;

  const guardar = async (f) => {
    const cupo = Number(cambios[f.id] ?? f.cupo);
    if (!(cupo >= f.ocupados)) {
      setAvisos((a) => ({ ...a, [f.id]: { error: true, texto: `El cupo no puede ser menor que los ${f.ocupados} pedidos ya separados.` } }));
      return;
    }
    const { error } = await supabase.from('fechas_entrega').update({ cupo }).eq('id', f.id);
    setAvisos((a) => ({ ...a, [f.id]: error ? { error: true, texto: 'No pudimos guardar el cupo.' } : { texto: 'Cupo guardado.' } }));
  };

  return (
    <>
      <CabeceraArea titulo="Cupos por fecha" bajada="Cuántos pedidos se reciben para cada día de entrega." />
      <div className={styles.fechas}>
        {fechas.map((f) => {
          const cupo = Number(cambios[f.id] ?? f.cupo);
          const libres = Math.max(0, cupo - f.ocupados);
          return (
            <section key={f.id} className={styles.fecha} aria-labelledby={`t-cupo-${f.id}`}>
              <span className="numeral">{f.fecha.slice(8)}</span>
              <div>
                <h2 id={`t-cupo-${f.id}`}>{f.texto}</h2>
                <p>{f.pedir_hasta ? `Se reciben pedidos hasta el ${Number(f.pedir_hasta.slice(8))} de diciembre` : 'Sin fecha límite para pedir'}</p>
                <div className={styles.barra} aria-hidden="true"><i style={{ width: `${cupo ? Math.min(100, (f.ocupados / cupo) * 100) : 100}%` }} /></div>
                <p className={styles.cifras}><b className="tabular">{f.ocupados}</b> ocupados · <b className="tabular">{libres}</b> libres</p>
                <div className={styles.editar}>
                  <label htmlFor={`cupo-${f.id}`}>Cupo total</label>
                  <input id={`cupo-${f.id}`} className="control" type="number" min={f.ocupados} value={cambios[f.id] ?? f.cupo}
                    onChange={(e) => setCambios((c) => ({ ...c, [f.id]: e.target.value }))} />
                  <button className="btn btn--chico" type="button" onClick={() => guardar(f)}>Guardar</button>
                </div>
                {avisos[f.id] && <p className={avisos[f.id].error ? styles.error : styles.ok} role="status">{avisos[f.id].texto}</p>}
              </div>
            </section>
          );
        })}
      </div>
    </>
  );
}
