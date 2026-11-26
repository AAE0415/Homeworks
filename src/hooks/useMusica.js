import { useCallback, useMemo, useState } from 'react';
import { CANCIONES, RELACIONES } from '../data/canciones';
import Graph from '../estructuras/Graph';
import MaxHeap from '../estructuras/MaxHeap';
import { normalizar } from '../estructuras/normalizar';
import Trie from '../estructuras/Trie';

const slug = (t) => normalizar(t).replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

// Estado de la plataforma: catálogo de canciones y las tres estructuras construidas sobre él.
export default function useMusica() {
  const [canciones, setCanciones] = useState(CANCIONES);
  const [relaciones, setRelaciones] = useState(RELACIONES);

  // TRIE: títulos para el buscador predictivo
  const trie = useMemo(() => {
    const t = new Trie();
    canciones.forEach((c) => t.insert(c.titulo));
    return t;
  }, [canciones]);

  // MAX HEAP: ordenado por reproducciones para el ranking
  const heap = useMemo(() => new MaxHeap((c) => c.plays, canciones), [canciones]);

  // GRAFO NO DIRIGIDO: canciones similares
  const grafo = useMemo(() => {
    const g = new Graph();
    canciones.forEach((c) => g.addNode(c.id, c));
    relaciones.forEach(([a, b, s]) => { if (g.searchNode(a) && g.searchNode(b)) g.addEdge(a, b, s); });
    return g;
  }, [canciones, relaciones]);

  const porTitulo = useMemo(() => Object.fromEntries(canciones.map((c) => [normalizar(c.titulo), c])), [canciones]);

  /** Inserta una canción nueva (y opcionalmente la conecta con otra similar). */
  const agregarCancion = useCallback(({ titulo, artista, genero, plays, similarA }) => {
    if (trie.search(titulo)) return { error: 'Esa canción ya existe en el catálogo.' };
    const nueva = { id: slug(titulo), titulo: titulo.trim(), artista: artista.trim() || 'Artista desconocido', genero: genero || 'Otro', plays: Number(plays) || 0 };
    setCanciones((lista) => [...lista, nueva]);
    if (similarA) setRelaciones((r) => [...r, [nueva.id, similarA, 0.8]]);
    return { ok: true, cancion: nueva };
  }, [trie]);

  /** "Escuchar" suma una reproducción: el heap se reconstruye y el ranking cambia. */
  const escuchar = useCallback((id, veces = 1) => {
    setCanciones((lista) => lista.map((c) => (c.id === id ? { ...c, plays: c.plays + veces } : c)));
  }, []);

  return { canciones, trie, heap, grafo, porTitulo, agregarCancion, escuchar };
}
