import { useId, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatCOP, normalizeText } from '../../helpers/format';
import useSearch from '../../hooks/useSearch';
import Icon from '../shared/Icon';
import styles from './Buscador.module.scss';

// Resalta en el nombre la parte que coincide con lo escrito (sin importar tildes).
function Resaltado({ texto, query }) {
  const ultima = normalizeText(query).split(' ').pop();
  return texto.split(' ').map((p, i) => {
    const coincide = ultima && normalizeText(p).startsWith(ultima);
    const largo = Math.min(ultima.length, p.length);
    return (
      <span key={i}>
        {i > 0 && ' '}
        {coincide ? <><mark>{p.slice(0, largo)}</mark>{p.slice(largo)}</> : p}
      </span>
    );
  });
}

// Buscador con autocompletado (combobox accesible). Las sugerencias salen del Trie.
export default function Buscador({ productos, categoriasPorId }) {
  const { query, setQuery, resultados } = useSearch(productos);
  const [activo, setActivo] = useState(0);
  const [abierto, setAbierto] = useState(false);
  const navigate = useNavigate();
  const id = useId();
  const mostrar = abierto && query.trim().length > 0;

  const elegir = (producto) => {
    setAbierto(false);
    setQuery('');
    navigate(`/plato/${producto.id}`);
  };

  const alTeclear = (e) => {
    if (!mostrar) return;
    if (e.key === 'ArrowDown') { e.preventDefault(); setActivo((a) => Math.min(a + 1, resultados.length - 1)); }
    if (e.key === 'ArrowUp') { e.preventDefault(); setActivo((a) => Math.max(a - 1, 0)); }
    if (e.key === 'Enter' && resultados[activo]) { e.preventDefault(); elegir(resultados[activo]); }
    if (e.key === 'Escape') setAbierto(false);
  };

  return (
    <div className={styles.buscador} role="search">
      <Icon name="buscar" className={styles.lupa} />
      <label className="sr-only" htmlFor={`${id}-q`}>Buscar platos o ingredientes</label>
      <input
        id={`${id}-q`}
        className="control"
        type="search"
        placeholder="Busca un plato o ingrediente"
        autoComplete="off"
        role="combobox"
        aria-expanded={mostrar}
        aria-controls={`${id}-lista`}
        aria-autocomplete="list"
        aria-activedescendant={mostrar && resultados[activo] ? `${id}-op-${activo}` : undefined}
        value={query}
        onChange={(e) => { setQuery(e.target.value); setActivo(0); setAbierto(true); }}
        onFocus={() => setAbierto(true)}
        onBlur={() => setTimeout(() => setAbierto(false), 150)}
        onKeyDown={alTeclear}
      />
      {mostrar && (
        <ul className={styles.sugerencias} id={`${id}-lista`} role="listbox" aria-label="Sugerencias">
          {resultados.length === 0 && <li className={styles.nada} role="presentation">No encontramos platos con “{query}”.</li>}
          {resultados.map((p, i) => (
            <li key={p.id} id={`${id}-op-${i}`} role="option" aria-selected={i === activo}
              onMouseDown={(e) => { e.preventDefault(); elegir(p); }} onMouseEnter={() => setActivo(i)}>
              <img src={p.foto_url} alt="" />
              <span>
                <Resaltado texto={p.nombre} query={query} />
                <span className={styles.donde}>
                  {categoriasPorId[p.categoria_id]?.numeral} · {categoriasPorId[p.categoria_id]?.titulo}
                  {!p.disponible && ' · Agotado'}
                </span>
              </span>
              <span className="precio">{formatCOP(p.precio)}</span>
            </li>
          ))}
          {resultados.length > 0 && (
            <li className={styles.pie} role="presentation">
              {resultados.length} {resultados.length === 1 ? 'plato' : 'platos'} · ↑ ↓ para moverte, Enter para abrir
            </li>
          )}
        </ul>
      )}
    </div>
  );
}
