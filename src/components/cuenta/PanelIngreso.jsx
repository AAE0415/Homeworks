import { Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import styles from './PanelIngreso.module.scss';

// Diseño compartido de Ingresar / Crear cuenta: foto del plato a un lado, formulario al otro.
export default function PanelIngreso({ titulo, bajada, activa, volver, children }) {
  const { configurado } = useAuth();
  const sufijo = volver ? `?volver=${encodeURIComponent(volver)}` : '';

  return (
    <div className={styles.ingreso}>
      <figure className={styles.foto}>
        <img src="/img/costilla-san-luis.jpg" alt="Costilla San Luis glaseada" />
        <figcaption>Tu canasta te espera</figcaption>
      </figure>
      <div className={styles.formulario}>
        <div>
          <h1 className="titular">{titulo}</h1>
          <p className={styles.bajada}>{bajada}</p>
          <nav className={styles.pestanas} aria-label="Cuenta">
            <Link to={`/login${sufijo}`} aria-current={activa === 'login' ? 'page' : undefined}>Ingresar</Link>
            <Link to={`/registro${sufijo}`} aria-current={activa === 'registro' ? 'page' : undefined}>Crear cuenta</Link>
          </nav>
          {!configurado && (
            <p className={styles.aviso} role="alert">
              Falta conectar la base de datos: crea el archivo <code>.env</code> con los datos de Supabase.
            </p>
          )}
          {children}
        </div>
      </div>
    </div>
  );
}
