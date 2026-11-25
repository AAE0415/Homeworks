import { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import Icon from './Icon';
import styles from './AdminLayout.module.scss';

const SECCIONES = [
  { to: '/admin', texto: 'Resumen', icono: 'resumen', end: true },
  { to: '/admin/anticipos', texto: 'Anticipos', icono: 'check' },
  { to: '/admin/agenda', texto: 'Agenda de cocina', icono: 'cocina' },
  { to: '/admin/menu', texto: 'Menú', icono: 'plato' },
  { to: '/admin/cupos', texto: 'Cupos por fecha', icono: 'calendario' },
];

// Panel de administración: riel lateral oscuro con las secciones de trabajo.
export default function AdminLayout() {
  const { perfil, logout } = useAuth();
  const [abierto, setAbierto] = useState(false);
  const navigate = useNavigate();
  const salir = () => { logout(); navigate('/', { replace: true }); };

  return (
    <div className={styles.admin}>
      <div className={styles.barraMovil}>
        <Link className={styles.marca} to="/admin">Delilicias</Link>
        <button type="button" aria-expanded={abierto} aria-controls="riel-admin"
          aria-label={abierto ? 'Cerrar menú' : 'Abrir menú'} onClick={() => setAbierto((v) => !v)}>
          <Icon name={abierto ? 'cerrar' : 'menu'} />
        </button>
      </div>

      <aside className={styles.riel} id="riel-admin" data-abierto={abierto}>
        <Link className={styles.marca} to="/admin">Delilicias <small>Administración</small></Link>
        <nav aria-label="Administración" onClick={(e) => e.target.closest('a') && setAbierto(false)}>
          {SECCIONES.map((s) => (
            <NavLink key={s.to} to={s.to} end={s.end}><Icon name={s.icono} />{s.texto}</NavLink>
          ))}
        </nav>
        <div className={styles.pie}>
          <span>Sesión: {perfil?.nombre ?? 'Administradora'}</span>
          <Link to="/">Ver la tienda</Link>
          <button type="button" onClick={salir}><Icon name="salir" />Salir</button>
        </div>
      </aside>

      <main className={styles.area} id="contenido"><Outlet /></main>
    </div>
  );
}
