import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import styles from './Login.module.scss';

export default function Login() {
  const { user, entrarDemo, logout } = useAuth();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const volver = params.get('volver') || '/';

  const entrar = (rol) => {
    entrarDemo(rol);
    navigate(rol === 'admin' && volver === '/' ? '/admin' : volver, { replace: true });
  };

  return (
    <section className={`hoja ${styles.login}`} aria-labelledby="t-login">
      <h1 className="titular" id="t-login">Ingresar</h1>
      <p>El inicio de sesión real con Supabase llega en el hito 4.</p>
      {import.meta.env.DEV && (
        <div className={styles.demo}>
          <p className={styles.nota}>Sesión de prueba (solo en desarrollo) para revisar las rutas privadas:</p>
          <div className={styles.botones}>
            <button className="btn btn--rojo" type="button" onClick={() => entrar('cliente')}>Entrar como cliente</button>
            <button className="btn" type="button" onClick={() => entrar('admin')}>Entrar como administradora</button>
            {user && <button className="btn-texto" type="button" onClick={logout}>Cerrar sesión</button>}
          </div>
        </div>
      )}
      <p>¿No tienes cuenta? <Link to="/registro">Créala aquí</Link>.</p>
    </section>
  );
}
