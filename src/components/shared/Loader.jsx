import styles from './Loader.module.scss';

export default function Loader({ texto = 'Cargando…' }) {
  return (
    <div className={styles.loader} role="status" aria-live="polite">
      <span className={styles.punto} aria-hidden="true" />
      {texto}
    </div>
  );
}
