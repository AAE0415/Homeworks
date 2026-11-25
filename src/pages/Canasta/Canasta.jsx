import ContenidoCanasta from '../../components/cart/ContenidoCanasta';
import styles from './Canasta.module.scss';

export default function Canasta() {
  return (
    <section className={`hoja ${styles.canasta}`} aria-labelledby="t-pagina-canasta">
      <h1 className="titular" id="t-pagina-canasta">Tu canasta</h1>
      <div className={styles.hoja}>
        <ContenidoCanasta />
      </div>
    </section>
  );
}
