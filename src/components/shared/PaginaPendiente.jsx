import styles from './PaginaPendiente.module.scss';

// Marcador para las pantallas que se construyen en hitos posteriores.
export default function PaginaPendiente({ titulo, descripcion, hito }) {
  return (
    <section className={`hoja ${styles.pendiente}`} aria-labelledby="titulo-pagina">
      <h1 className="titular" id="titulo-pagina">{titulo}</h1>
      <p>{descripcion}</p>
      <span className="sello sello--pendiente">Llega en el hito {hito}</span>
    </section>
  );
}
