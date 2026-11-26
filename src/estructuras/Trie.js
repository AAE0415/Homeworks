// TRIE (árbol de caracteres) para el buscador predictivo de canciones.
// Cada arista es una letra; el camino desde la raíz forma el título.
// Insertar y buscar cuestan O(L), donde L es el largo del título, sin importar cuántas canciones haya.
import { normalizar } from './normalizar';

class TrieNode {
  constructor(value) {
    this.value = value;        // la letra de este nodo
    this.children = {};        // letra -> TrieNode
    this.isEndOfWord = false;  // aquí termina un título
    this.titulo = null;        // título original (con tildes y mayúsculas) para mostrarlo
  }
}

export default class Trie {
  constructor() {
    this.root = new TrieNode(null);
    this.cantidad = 0;
  }

  /** 1. Insertar una canción. */
  insert(titulo) {
    const texto = normalizar(titulo);
    if (!texto) return;
    let current = this.root;
    for (const letra of texto) {
      if (current.children[letra] === undefined) current.children[letra] = new TrieNode(letra);
      current = current.children[letra];
    }
    if (!current.isEndOfWord) this.cantidad++;
    current.isEndOfWord = true;
    current.titulo = titulo;
  }

  #buscarNodo(prefijo) {
    let current = this.root;
    for (const letra of normalizar(prefijo)) {
      current = current.children[letra];
      if (!current) return null;
    }
    return current;
  }

  /** 2. ¿Existe la canción? (título completo). */
  search(titulo) {
    const nodo = this.#buscarNodo(titulo);
    return Boolean(nodo && nodo.isEndOfWord);
  }

  /** 3. Sugerencias por prefijo: recorre en profundidad (DFS) el subárbol del prefijo. */
  suggest(prefijo, limite = 10) {
    if (!normalizar(prefijo)) return [];
    const inicio = this.#buscarNodo(prefijo);
    if (!inicio) return [];
    const sugerencias = [];
    const recorrer = (nodo) => {
      if (sugerencias.length >= limite) return;
      if (nodo.isEndOfWord) sugerencias.push(nodo.titulo);
      Object.keys(nodo.children).sort().forEach((letra) => recorrer(nodo.children[letra]));
    };
    recorrer(inicio);
    return sugerencias;
  }

  size() {
    return this.cantidad;
  }
}
