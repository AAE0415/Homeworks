// Pila (LIFO) sobre un arreglo: push y pop trabajan en el tope, O(1).
// Uso en Delilicias: deshacer la última acción de la canasta.

export default class Stack {
  constructor() {
    this.items = [];
  }

  push(value) {
    this.items.push(value);
  }

  /** Saca y devuelve el tope, o null si está vacía. */
  pop() {
    return this.items.length > 0 ? this.items.pop() : null;
  }

  /** Devuelve el tope sin sacarlo, o null. */
  peek() {
    return this.items.length > 0 ? this.items[this.items.length - 1] : null;
  }

  isEmpty() {
    return this.items.length === 0;
  }

  size() {
    return this.items.length;
  }

  /** Copia con el tope primero. */
  toArray() {
    return this.items.slice().reverse();
  }

  clear() {
    this.items = [];
  }

  print() {
    this.toArray().forEach((item) => console.log(item));
  }
}
