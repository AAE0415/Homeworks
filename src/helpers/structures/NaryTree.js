// Árbol n-ario: cada nodo tiene un valor y una lista de hijos (sin límite de cantidad).
// Uso en Delilicias: el menú. Raíz › secciones › platos › opciones de porción.
// Con él se dibujan las secciones del menú y el menú lateral.

export class TreeNode {
  constructor(value) {
    this.value = value;
    this.children = [];
  }

  /** Agrega un hijo y lo devuelve (para encadenar). */
  addChild(node) {
    this.children.push(node);
    return node;
  }

  isLeaf() {
    return this.children.length === 0;
  }
}

export default class NaryTree {
  constructor(root = null) {
    this.root = root;
  }

  /** Recorrido en profundidad (preorden). Devuelve los valores. */
  dfs() {
    const out = [];
    const visitar = (nodo) => {
      out.push(nodo.value);
      nodo.children.forEach(visitar);
    };
    if (this.root) visitar(this.root);
    return out;
  }

  /** Recorrido en anchura (por niveles) con una cola. Devuelve los valores. */
  bfs() {
    if (!this.root) return [];
    const out = [];
    const cola = [this.root];
    while (cola.length) {
      const nodo = cola.shift();
      out.push(nodo.value);
      cola.push(...nodo.children);
    }
    return out;
  }

  /** Primer nodo (en profundidad) cuyo valor cumple la condición, o null. */
  find(predicate) {
    const pila = this.root ? [this.root] : [];
    while (pila.length) {
      const nodo = pila.pop();
      if (predicate(nodo.value)) return nodo;
      for (let i = nodo.children.length - 1; i >= 0; i--) pila.push(nodo.children[i]);
    }
    return null;
  }
}
