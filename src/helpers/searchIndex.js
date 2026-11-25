// Construye el índice del buscador (un Trie) a partir de los productos del menú.
import { normalizeText } from './format';
import Trie from './structures/Trie';

const MIN_LETRAS = 3;

export function buildSearchIndex(productos) {
  const trie = new Trie();
  for (const p of productos) {
    const frases = [p.nombre, ...(p.ingredientes ?? [])];
    for (const frase of frases) {
      trie.insert(frase, p.id);
      normalizeText(frase)
        .split(' ')
        .filter((palabra) => palabra.length >= MIN_LETRAS)
        .forEach((palabra) => trie.insert(palabra, p.id));
    }
  }
  return trie;
}
