import { useState } from 'react';
import styles from './AgregarCancion.module.scss';

const GENEROS = ['Salsa', 'Reguetón', 'Vallenato', 'Pop latino', 'Trova', 'Llanera', 'Otro'];

// Insertar una canción: entra al Trie (buscador), al Max Heap (ranking) y al grafo (relaciones).
export default function AgregarCancion({ canciones, onAgregar }) {
  const vacio = { titulo: '', artista: '', genero: 'Salsa', plays: '', similarA: '' };
  const [datos, setDatos] = useState(vacio);
  const [mensaje, setMensaje] = useState(null);
  const cambiar = (e) => setDatos((d) => ({ ...d, [e.target.name]: e.target.value }));

  const enviar = (e) => {
    e.preventDefault();
    if (!datos.titulo.trim()) { setMensaje({ error: true, texto: 'Escribe el título de la canción.' }); return; }
    const r = onAgregar(datos);
    if (r.error) setMensaje({ error: true, texto: r.error });
    else { setMensaje({ texto: `Agregamos “${r.cancion.titulo}”. Ya aparece en el buscador${Number(datos.plays) ? ' y en el ranking' : ''}.` }); setDatos(vacio); }
  };

  return (
    <section className={styles.agregar} aria-labelledby="t-agregar">
      <h2 id="t-agregar">Agregar canción</h2>
      <form onSubmit={enviar} noValidate>
        <label>Título<input name="titulo" value={datos.titulo} onChange={cambiar} placeholder="Ej. Ventanitas" /></label>
        <label>Artista<input name="artista" value={datos.artista} onChange={cambiar} placeholder="Ej. Grupo Niche" /></label>
        <div className={styles.fila}>
          <label>Género
            <select name="genero" value={datos.genero} onChange={cambiar}>{GENEROS.map((g) => <option key={g}>{g}</option>)}</select>
          </label>
          <label>Reproducciones<input name="plays" type="number" min="0" inputMode="numeric" value={datos.plays} onChange={cambiar} placeholder="0" /></label>
        </div>
        <label>Se parece a (opcional)
          <select name="similarA" value={datos.similarA} onChange={cambiar}>
            <option value="">Ninguna</option>
            {[...canciones].sort((a, b) => a.titulo.localeCompare(b.titulo, 'es')).map((c) => <option key={c.id} value={c.id}>{c.titulo}</option>)}
          </select>
        </label>
        <button type="submit">Insertar canción</button>
        {mensaje && <p className={mensaje.error ? styles.error : styles.ok} role="status">{mensaje.texto}</p>}
      </form>
    </section>
  );
}
