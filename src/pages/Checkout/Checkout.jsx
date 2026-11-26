import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import f from '../../components/cuenta/formularios.module.scss';
import MapaDomicilio from '../../components/orders/MapaDomicilio';
import RutaResumen from '../../components/orders/RutaResumen';
import Campo from '../../components/shared/Campo';
import Icon from '../../components/shared/Icon';
import Ovalo from '../../components/shared/Ovalo';
import { BARRIOS } from '../../data/barrios';
import { formatCOP } from '../../helpers/format';
import { fechasDisponibles } from '../../helpers/orders';
import { validarCheckout } from '../../helpers/validacion';
import useAuth from '../../hooks/useAuth';
import useCart from '../../hooks/useCart';
import useDeliveryRoute from '../../hooks/useDeliveryRoute';
import useFechas from '../../hooks/useFechas';
import useMenu from '../../hooks/useMenu';
import useOrders from '../../hooks/useOrders';
import styles from './Checkout.module.scss';

const barriosOrdenados = [...BARRIOS.nodos].sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'));
const NOMBRE_DIA = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
const diaSemana = (iso) => { const [a, m, d] = iso.split('-').map(Number); return NOMBRE_DIA[new Date(a, m - 1, d).getDay()]; };

export default function Checkout() {
  const { perfil } = useAuth();
  const { items, subtotal, anticipo, domicilioGratis, hayAgotados, fechaElegida, elegirFecha, limpiarTodo } = useCart();
  const { fechas, cargando } = useFechas();
  const { crearPedido } = useOrders();
  const { configuracion } = useMenu();
  const navigate = useNavigate();
  const disponibles = useMemo(() => fechasDisponibles(fechas), [fechas]);

  const [datos, setDatos] = useState({
    personas: '',
    nombre_recibe: perfil?.nombre ?? '',
    barrio_id: perfil?.barrio_id ?? '',
    direccion: '',
    notas: '',
  });
  const [errores, setErrores] = useState({});
  const [errorGeneral, setErrorGeneral] = useState('');
  const [enviando, setEnviando] = useState(false);
  const ruta = useDeliveryRoute(datos.barrio_id);
  const fechaId = disponibles.some((x) => x.id === fechaElegida) ? fechaElegida : null;
  const fecha = disponibles.find((x) => x.id === fechaId);

  const cambiar = (e) => setDatos((d) => ({ ...d, [e.target.name]: e.target.value }));

  if (items.length === 0) {
    return (
      <section className={`hoja ${styles.vacio}`}>
        <h1 className="titular">Tu canasta está vacía</h1>
        <p>Agrega platos del menú para separar tu fecha.</p>
        <Link className="btn btn--rojo" to="/menu">Ver el menú</Link>
      </section>
    );
  }

  const enviar = async (e) => {
    e.preventDefault();
    const err = validarCheckout({ ...datos, fecha_entrega_id: fechaId, enCobertura: ruta.enCobertura });
    setErrores(err);
    setErrorGeneral('');
    if (Object.keys(err).length) {
      document.getElementById(`campo-${Object.keys(err)[0]}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    setEnviando(true);
    const r = await crearPedido({ ...datos, fecha_entrega_id: fechaId, items });
    setEnviando(false);
    if (r.error) { setErrorGeneral(r.error); return; }
    limpiarTodo();
    elegirFecha(null);
    navigate(`/cuenta/pedidos/${r.id}`, { replace: true, state: { nuevo: true } });
  };

  return (
    <>
      <div className={styles.cabecera}>
        <h1 className="titular">Separa tu fecha</h1>
        <p className="nota">Paso 2 de 3 · Después subes el comprobante del anticipo</p>
      </div>

      <form className={styles.orden} onSubmit={enviar} noValidate>
        <div>
          <section className={styles.bloque} aria-labelledby="t-fecha" id="campo-fecha_entrega_id">
            <h2 id="t-fecha"><span className="numeral">a</span>¿Para qué día?</h2>
            {cargando ? <p className="nota">Cargando fechas…</p> : disponibles.length === 0 ? (
              <p className={f.error}>Ya no quedan fechas con cupo. Escríbenos por WhatsApp.</p>
            ) : (
              <div className={styles.fechas} role="radiogroup" aria-labelledby="t-fecha">
                {disponibles.map((x) => {
                  const elegida = x.id === fechaId;
                  return (
                    <button key={x.id} type="button" role="radio" aria-checked={elegida}
                      className={styles.fecha} onClick={() => elegirFecha(x.id)}>
                      <span className={`numeral ${styles.numero}`}>{x.fecha.slice(8)}{elegida && <Ovalo dibujar />}</span>
                      <b>{diaSemana(x.fecha)}{x.fecha.endsWith('-12-24') ? ', Nochebuena' : x.fecha.endsWith('-12-31') ? ', fin de año' : ''}</b>
                      <span className={styles.cupos}>Quedan <strong>{x.cupo - x.ocupados}</strong> de {x.cupo} cupos</span>
                      {x.pedir_hasta && <span className={styles.limite}>Pide hasta el {Number(x.pedir_hasta.slice(8))} de diciembre</span>}
                    </button>
                  );
                })}
              </div>
            )}
            {errores.fecha_entrega_id && <p className={styles.errorCampo}>{errores.fecha_entrega_id}</p>}
          </section>

          <section className={styles.bloque} aria-labelledby="t-quien">
            <h2 id="t-quien"><span className="numeral">b</span>¿Quién recibe?</h2>
            <div className={styles.filaCampos}>
              <div id="campo-personas">
                <Campo label="Personas en la mesa" error={errores.personas}>
                  <input name="personas" type="number" min="1" inputMode="numeric" value={datos.personas} onChange={cambiar} />
                </Campo>
              </div>
              <div id="campo-nombre_recibe">
                <Campo label="Nombre de quien recibe" error={errores.nombre_recibe}>
                  <input name="nombre_recibe" autoComplete="name" value={datos.nombre_recibe} onChange={cambiar} />
                </Campo>
              </div>
            </div>
          </section>

          <section className={styles.bloque} aria-labelledby="t-donde">
            <h2 id="t-donde"><span className="numeral">c</span>¿A dónde la llevamos?</h2>
            <div className={styles.cobertura}>
              <div className={styles.columna}>
                <div id="campo-barrio_id">
                  <Campo label="Barrio" error={errores.barrio_id}>
                    <select name="barrio_id" value={datos.barrio_id} onChange={cambiar}>
                      <option value="">Elige el barrio</option>
                      {barriosOrdenados.map((b) => <option key={b.id} value={b.id}>{b.nombre}</option>)}
                    </select>
                  </Campo>
                </div>
                <div id="campo-direccion">
                  <Campo label="Dirección" error={errores.direccion}>
                    <input name="direccion" autoComplete="street-address" placeholder="Calle 16 # 105-40, casa 12" value={datos.direccion} onChange={cambiar} />
                  </Campo>
                </div>
                <Campo label="Notas para la entrega" opcional>
                  <textarea name="notas" placeholder="Portería, torre, a quién llamar…" value={datos.notas} onChange={cambiar} />
                </Campo>
                {datos.barrio_id && <RutaResumen {...ruta} domicilioGratis={domicilioGratis} />}
              </div>
              <MapaDomicilio ruta={ruta.ruta} destino={datos.barrio_id || null}
                onElegir={(id) => setDatos((d) => ({ ...d, barrio_id: id }))} alto={460} />
            </div>
          </section>
        </div>

        <aside className={styles.recibo} aria-labelledby="t-recibo">
          <div className={styles.reciboCab}>
            <h2 className="titular" id="t-recibo">Tu pedido</h2>
            <Link className="btn-texto" to="/canasta">Editar</Link>
          </div>
          <ul>
            {items.map((i) => (
              <li key={i.clave}>
                <span>{i.nombre} · {i.cantidad}{i.unidad === 'libra' ? ' lb' : ''}{i.porciones && <small>{i.porciones}</small>}</span>
                <span className="tabular">{formatCOP(i.precio * i.cantidad)}</span>
              </li>
            ))}
          </ul>
          <dl>
            <dt>Subtotal</dt><dd>{formatCOP(subtotal)}</dd>
            <dt>Domicilio</dt><dd className={domicilioGratis ? styles.gratis : ''}>{domicilioGratis ? 'Gratis' : 'Por acordar'}</dd>
            <dt>Saldo al recibir</dt><dd>{formatCOP(subtotal - anticipo)}</dd>
          </dl>
          <div className={styles.anticipo}><span>Anticipo hoy ({configuracion?.anticipo ?? 50} %)</span><span className="numeral">{formatCOP(anticipo)}</span></div>
          <div className={styles.acciones}>
            {errorGeneral && <p className={f.error} role="alert">{errorGeneral}</p>}
            {hayAgotados && <p className={f.error} role="alert">Quita los platos agotados de la canasta para continuar.</p>}
            <button className="btn btn--rojo btn--bloque" type="submit" disabled={enviando || hayAgotados}>
              {enviando ? 'Separando tu fecha…' : `Confirmar pedido${fecha ? ` para el ${fecha.fecha.slice(8)}` : ''}`}
              {!enviando && <Icon name="flecha" />}
            </button>
            <p className="nota">Pagas el anticipo por Nequi, transferencia o en efectivo y subes el comprobante en el siguiente paso.</p>
          </div>
        </aside>
      </form>
    </>
  );
}
