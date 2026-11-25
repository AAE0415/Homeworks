// Trie (árbol de caracteres): la información está en el camino, cada arista es una letra.
// insert y la búsqueda de un prefijo cuestan O(largo del texto), sin importar cuántos platos haya.
// Uso en Delilicias: autocompletado del buscador por nombre e ingrediente.
import { normalizeText } from '../format';

class TrieNode {
  constructor(value) {
    this.value = value;
    this.children = {};
    this.isEndOfWord = false;
    this.ids = new Set();
  }
}

export default class Trie {
  constructor() {
    this.root = new TrieNode(null);
    this.orden = new Map(); // id -> orden de inserción, para devolver resultados estables
  }

  /** Inserta una palabra (o frase) asociada al id de un producto. */
  insert(word, id) {
    const texto = normalizeText(word);
    if (!texto) return;
    let current = this.root;
    for (const character of texto) {
      if (current.children[character] === undefined) current.children[character] = new TrieNode(character);
      current = current.children[character];
    }
    current.isEndOfWord = true;
    current.ids.add(id);
    if (!this.orden.has(id)) this.orden.set(id, this.orden.size);
  }

  #nodo(prefijo) {
    let current = this.root;
    for (const character of normalizeText(prefijo)) {
      current = current.children[character];
      if (!current) return null;
    }
    return current;
  }

  /** ¿Está la palabra completa? */
  search(word) {
    const nodo = this.#nodo(word);
    return Boolean(nodo && nodo.isEndOfWord);
  }

  /** Ids de todo lo que empieza por el prefijo (sin repetir). */
  startsWith(prefix) {
    if (!normalizeText(prefix)) return [];
    const inicio = this.#nodo(prefix);
    if (!inicio) return [];
    const encontrados = new Set();
    const pila = [inicio]; // recorrido en profundidad (DFS) del subárbol
    while (pila.length) {
      const nodo = pila.pop();
      nodo.ids.forEach((id) => encontrados.add(id));
      Object.values(nodo.children).forEach((hijo) => pila.push(hijo));
    }
    return [...encontrados].sort((a, b) => this.orden.get(a) - this.orden.get(b));
  }
}
