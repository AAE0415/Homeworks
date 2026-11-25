import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import f from '../../components/cuenta/formularios.module.scss';
import Campo from '../../components/shared/Campo';
import { BARRIOS } from '../../data/barrios';
import { validarRegistro } from '../../helpers/validacion';
import useAuth from '../../hooks/useAuth';
import styles from './Perfil.module.scss';

const barriosOrdenados = [...BARRIOS.nodos].sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'));

export default function Perfil() {
  const { user, perfil, actualizarPerfil, logout } = useAuth();
  const navigate = useNavigate();
  const [datos, setDatos] = useState({
    nombre: perfil?.nombre ?? '',
    telefono: perfil?.telefono ?? '',
    barrio_id: perfil?.barrio_id ?? '',
  });
  const [errores, setErrores] = useState({});
  const [mensaje, setMensaje] = useState(null);
  const [guardando, setGuardando] = useState(false);

  const cambiar = (e) => setDatos((d) => ({ ...d, [e.target.name]: e.target.value }));

  const guardar = async (e) => {
    e.preventDefault();
    // Misma validación del registro; aquí no se editan correo ni contraseña
    const todos = validarRegistro({ ...datos, email: 'x@x.co', password: '12345678' });
    setErrores(todos);
    setMensaje(null);
    if (Object.keys(todos).length) return;
    setGuardando(true);
    const r = await actualizarPerfil(datos);
    setGuardando(false);
    setMensaje(r.error ? { tipo: 'error', texto: r.error } : { tipo: 'exito', texto: 'Guardamos tus datos.' });
  };

  const salir = async () => {
    await logout();
    navigate('/', { replace: true });
  };

  return (
    <section className={`hoja ${styles.perfil}`} aria-labelledby="t-perfil">
      <h1 className="titular" id="t-perfil">Mi perfil</h1>
      <p className={styles.correo}>{user?.email}</p>
      <form className={f.form} onSubmit={guardar} noValidate>
        {mensaje && <p className={mensaje.tipo === 'error' ? f.error : f.exito} role="status">{mensaje.texto}</p>}
        <Campo label="Nombre" error={errores.nombre}>
          <input name="nombre" autoComplete="name" value={datos.nombre} onChange={cambiar} />
        </Campo>
        <div className={f.dos}>
          <Campo label="Celular (WhatsApp)" error={errores.telefono}>
            <input name="telefono" inputMode="tel" autoComplete="tel" value={datos.telefono} onChange={cambiar} />
          </Campo>
          <Campo label="Barrio por defecto" error={errores.barrio_id}>
            <select name="barrio_id" value={datos.barrio_id} onChange={cambiar}>
              <option value="">Elige tu barrio</option>
              {barriosOrdenados.map((b) => <option key={b.id} value={b.id}>{b.nombre}</option>)}
            </select>
          </Campo>
        </div>
        <div className={styles.acciones}>
          <button className="btn btn--rojo" type="submit" disabled={guardando}>{guardando ? 'Guardando…' : 'Guardar cambios'}</button>
          <button className="btn" type="button" onClick={salir}>Cerrar sesión</button>
        </div>
      </form>
    </section>
  );
}
