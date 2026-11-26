import styles from './CabeceraArea.module.scss';

// Título de cada pantalla del panel, con la marca "Actualizado en vivo" opcional.
export default function CabeceraArea({ titulo, bajada, enVivo = false, children }) {
  return (
    <div className={styles.cabecera}>
      <div>
        <h1 className="titular">{titulo}</h1>
        {bajada && <p>{bajada}</p>}
      </div>
      {enVivo && <span className={styles.enVivo}>Actualizado en vivo</span>}
      {children}
    </div>
  );
}
