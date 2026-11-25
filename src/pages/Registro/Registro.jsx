import { useState } from 'react';
import { Navigate, useSearchParams } from 'react-router-dom';
import f from '../../components/cuenta/formularios.module.scss';
import PanelIngreso from '../../components/cuenta/PanelIngreso';
import Campo from '../../components/shared/Campo';
import { BARRIOS } from '../../data/barrios';
import { validarRegistro } from '../../helpers/validacion';
import useAuth from '../../hooks/useAuth';

const barriosOrdenados = [...BARRIOS.nodos].sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'));

export default function Registro() {
  const { user, registrar, configurado } = useAuth();
  const [params] = useSearchParams();
  const volver = params.get('volver') || '';
  const [datos, setDatos] = useState({ nombre: '', telefono: '', barrio_id: '', email: '', password: '' });
  const [errores, setErrores] = useState({});
  const [errorGeneral, setErrorGeneral] = useState('');
  const [confirmar, setConfirmar] = useState(false);
  const [enviando, setEnviando] = useState(false);

  if (user) return <Navigate to={volver || '/'} replace />;

  const cambiar = (e) => setDatos((d) => ({ ...d, [e.target.name]: e.target.value }));

  const enviar = async (e) => {
    e.preventDefault();
    const err = validarRegistro(datos);
    setErrores(err);
    setErrorGeneral('');
    if (Object.keys(err).length) return;
    setEnviando(true);
    const r = await registrar(datos);
    setEnviando(false);
    if (r.error) setErrorGeneral(r.error);
    else if (r.confirmarCorreo) setConfirmar(true);
  };

  if (confirmar) {
    return (
      <PanelIngreso titulo="Revisa tu correo" bajada="Te enviamos un enlace para confirmar tu cuenta." activa="registro" volver={volver}>
        <p className={f.exito} role="status">Abre el enlace que llegó a {datos.email} y luego ingresa con tu contraseña.</p>
      </PanelIngreso>
    );
  }

  return (
    <PanelIngreso titulo="Crea tu cuenta" bajada="Para separar tu fecha y seguir tu pedido. Tu canasta no se pierde." activa="registro" volver={volver}>
      <form className={f.form} onSubmit={enviar} noValidate>
        {errorGeneral && <p className={f.error} role="alert">{errorGeneral}</p>}
        <Campo label="Nombre" error={errores.nombre}>
          <input name="nombre" autoComplete="name" value={datos.nombre} onChange={cambiar} />
        </Campo>
        <div className={f.dos}>
          <Campo label="Celular (WhatsApp)" error={errores.telefono}>
            <input name="telefono" inputMode="tel" autoComplete="tel" placeholder="315 237 7306" value={datos.telefono} onChange={cambiar} />
          </Campo>
          <Campo label="Barrio" error={errores.barrio_id}>
            <select name="barrio_id" value={datos.barrio_id} onChange={cambiar}>
              <option value="">Elige tu barrio</option>
              {barriosOrdenados.map((b) => <option key={b.id} value={b.id}>{b.nombre}</option>)}
            </select>
          </Campo>
        </div>
        <Campo label="Correo" error={errores.email}>
          <input name="email" type="email" autoComplete="email" value={datos.email} onChange={cambiar} />
        </Campo>
        <Campo label="Contraseña" ayuda="Mínimo 8 caracteres." error={errores.password}>
          <input name="password" type="password" autoComplete="new-password" value={datos.password} onChange={cambiar} />
        </Campo>
        <button className="btn btn--rojo btn--bloque" type="submit" disabled={enviando || !configurado}>
          {enviando ? 'Creando tu cuenta…' : 'Crear cuenta y seguir'}
        </button>
        <p className={f.aviso}>Solo usamos tu celular para hablar contigo sobre tu pedido.</p>
      </form>
    </PanelIngreso>
  );
}
