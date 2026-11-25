import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import Icon from './Icon';
import styles from './Menu.module.scss';

const ENLACES = [
  { to: '/', texto: 'Inicio', end: true },
  { to: '/menu', texto: 'Menú' },
  { to: '/cobertura', texto: 'Cobertura' },
  { to: '/cuenta/pedidos', texto: 'Mis pedidos' },
];

// Membrete del almanaque: marca, navegación principal, cuenta y canasta.
export default function Menu({ totalCanasta = 0 }) {
  const { user, perfil } = useAuth();
  const [abierto, setAbierto] = useState(false);


  const nombre = perfil?.nombre?.split(' ')[0];

  return (
    <header className={styles.membrete}>
      <div className={styles.interior}>
        <Link className={styles.marca} to="/">
          Delilicias <small>Cali · Navidad 2026</small>
        </Link>

        <nav className={styles.nav} id="nav-principal" aria-label="Principal" data-abierto={abierto}
          onClick={(e) => e.target.closest('a') && setAbierto(false)}>
          {ENLACES.map((e) => (
            <NavLink key={e.to} to={e.to} end={e.end}>{e.texto}</NavLink>
          ))}
          {perfil?.rol === 'admin' && <NavLink to="/admin">Administración</NavLink>}
        </nav>

        <div className={styles.acciones}>
          <Link className={styles.cuenta} to={user ? '/cuenta/perfil' : '/login'}>
            <Icon name="usuario" />
            <span>{user ? nombre || 'Mi cuenta' : 'Ingresar'}</span>
          </Link>
          <Link className={`btn btn--rojo btn--chico ${styles.canasta}`} to="/canasta">
            <Icon name="canasta" />
            Canasta <span className={styles.contador} aria-label={`${totalCanasta} productos`}>{totalCanasta}</span>
          </Link>
          <button
            className={styles.hamburguesa}
            type="button"
            aria-expanded={abierto}
            aria-controls="nav-principal"
            aria-label={abierto ? 'Cerrar menú' : 'Abrir menú'}
            onClick={() => setAbierto((v) => !v)}
          >
            <Icon name={abierto ? 'cerrar' : 'menu'} />
          </button>
        </div>
      </div>
    </header>
  );
}
