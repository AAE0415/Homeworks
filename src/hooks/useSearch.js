import { useMemo, useState } from 'react';
import { buildSearchIndex } from '../helpers/searchIndex';

// Buscador con autocompletado: el índice es un Trie construido una vez por menú.
export default function useSearch(productos, limite = 6) {
  const [query, setQuery] = useState('');
  const indice = useMemo(() => buildSearchIndex(productos), [productos]);
  const porId = useMemo(() => Object.fromEntries(productos.map((p) => [p.id, p])), [productos]);
  const resultados = useMemo(
    () => indice.startsWith(query).slice(0, limite).map((id) => porId[id]).filter(Boolean),
    [indice, porId, query, limite],
  );
  return { query, setQuery, resultados };
}
