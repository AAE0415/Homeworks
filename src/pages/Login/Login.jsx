import { useState } from 'react';
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import f from '../../components/cuenta/formularios.module.scss';
import PanelIngreso from '../../components/cuenta/PanelIngreso';
import Campo from '../../components/shared/Campo';
import { validarIngreso } from '../../helpers/validacion';
import useAuth from '../../hooks/useAuth';

export default function Login() {
  const { user, perfil, login, configurado } = useAuth();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const volver = params.get('volver') || '';
  const [datos, setDatos] = useState({ email: '', password: '' });
  const [errores, setErrores] = useState({});
  const [errorGeneral, setErrorGeneral] = useState('');
  const [enviando, setEnviando] = useState(false);

  if (user && perfil) return <Navigate to={volver || (perfil.rol === 'admin' ? '/admin' : '/')} replace />;

  const cambiar = (e) => setDatos((d) => ({ ...d, [e.target.name]: e.target.value }));

  const enviar = async (e) => {
    e.preventDefault();
    const err = validarIngreso(datos);
    setErrores(err);
    setErrorGeneral('');
    if (Object.keys(err).length) return;
    setEnviando(true);
    const r = await login(datos.email, datos.password);
    setEnviando(false);
    if (r.error) setErrorGeneral(r.error);
    else if (volver) navigate(volver, { replace: true });
  };

  return (
    <PanelIngreso titulo="Ingresa" bajada="Para separar tu fecha y seguir tu pedido. Tu canasta no se pierde." activa="login" volver={volver}>
      <form className={f.form} onSubmit={enviar} noValidate>
        {errorGeneral && <p className={f.error} role="alert">{errorGeneral}</p>}
        <Campo label="Correo" error={errores.email}>
          <input name="email" type="email" autoComplete="email" value={datos.email} onChange={cambiar} />
        </Campo>
        <Campo label="Contraseña" error={errores.password}>
          <input name="password" type="password" autoComplete="current-password" value={datos.password} onChange={cambiar} />
        </Campo>
        <button className="btn btn--rojo btn--bloque" type="submit" disabled={enviando || !configurado}>
          {enviando ? 'Ingresando…' : 'Ingresar'}
        </button>
      </form>
    </PanelIngreso>
  );
}
