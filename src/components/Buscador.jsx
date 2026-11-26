import { useId, useState } from 'react';
import { claseGenero } from '../estructuras/genero';
import { normalizar } from '../estructuras/normalizar';
import styles from './Buscador.module.scss';

// Buscador predictivo: sugerencias por prefijo (Trie.suggest) y "¿existe?" (Trie.search).
export default function Buscador({ trie, porTitulo, onElegir }) {
  const id = useId();
  const [texto, setTexto] = useState('');
  const [activa, setActiva] = useState(0);
  const sugerencias = trie.suggest(texto, 8);
  const existe = texto.trim() ? trie.search(texto) : null;

  const elegir = (titulo) => {
    setTexto(titulo);
    onElegir(porTitulo[normalizar(titulo)]);
  };

  const alTeclear = (e) => {
    if (!sugerencias.length) return;
    if (e.key === 'ArrowDown') { e.preventDefault(); setActiva((a) => Math.min(a + 1, sugerencias.length - 1)); }
    if (e.key === 'ArrowUp') { e.preventDefault(); setActiva((a) => Math.max(a - 1, 0)); }
    if (e.key === 'Enter') { e.preventDefault(); elegir(sugerencias[activa]); }
  };

  return (
    <section className={styles.buscador} aria-labelledby={`${id}-t`}>
      <h2 id={`${id}-t`}>Buscador predictivo</h2>
      <label className="sr-only" htmlFor={`${id}-q`}>Buscar canción</label>
      <input
        id={`${id}-q`}
        className={styles.campo}
        type="search"
        placeholder="Escribe el inicio de una canción: ca, pe, la…"
        autoComplete="off"
        role="combobox"
        aria-expanded={sugerencias.length > 0}
        aria-controls={`${id}-lista`}
        aria-activedescendant={sugerencias.length ? `${id}-op-${activa}` : undefined}
        value={texto}
        onChange={(e) => { setTexto(e.target.value); setActiva(0); }}
        onKeyDown={alTeclear}
      />

      {existe !== null && (
        <p className={existe ? styles.existe : styles.noExiste} role="status">
          {existe ? '✓ La canción existe en el catálogo.' : 'No hay una canción con ese título exacto.'}
        </p>
      )}

      {sugerencias.length > 0 && (
        <ul className={styles.sugerencias} id={`${id}-lista`} role="listbox" aria-label="Sugerencias">
          {sugerencias.map((titulo, i) => {
            const c = porTitulo[normalizar(titulo)];
            return (
              <li key={titulo} id={`${id}-op-${i}`} role="option" aria-selected={i === activa}
                onClick={() => elegir(titulo)} onMouseEnter={() => setActiva(i)}>
                <span className={styles.titulo}>
                  <mark>{titulo.slice(0, normalizar(texto).length)}</mark>{titulo.slice(normalizar(texto).length)}
                </span>
                <span className={styles.artista}>{c?.artista}</span>
                {c && <span className={claseGenero(c.genero)}>{c.genero}</span>}
              </li>
            );
          })}
        </ul>
      )}
      {texto.trim() && sugerencias.length === 0 && <p className={styles.vacio}>Ninguna canción empieza por “{texto}”.</p>}
    </section>
  );
}
