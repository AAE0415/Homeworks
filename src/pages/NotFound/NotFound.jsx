import { Link } from 'react-router-dom';
import styles from './NotFound.module.scss';

export default function NotFound() {
  return (
    <section className={`hoja ${styles.noEncontrada}`} aria-labelledby="t-404">
      <span className="numeral" aria-hidden="true">404</span>
      <h1 className="titular" id="t-404">Esta hoja no está en el almanaque</h1>
      <p>La página que buscas no existe o cambió de lugar.</p>
      <div className={styles.acciones}>
        <Link className="btn btn--rojo" to="/">Volver al inicio</Link>
        <Link className="btn" to="/menu">Ver el menú</Link>
      </div>
    </section>
  );
}
