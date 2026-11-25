// Cola (FIFO) implementada con una lista enlazada simple.
// enqueue y dequeue son O(1): no se usa Array.shift(), que es O(n).
// Uso en Delilicias: bandeja de anticipos por confirmar, en orden de llegada.

class Node {
  constructor(value) {
    this.value = value;
    this.next = null;
  }
}

export default class Queue {
  constructor() {
    this.head = null;
    this.tail = null;
    this.length = 0;
  }

  /** Agrega al final de la cola. */
  enqueue(value) {
    const node = new Node(value);
    if (!this.head) this.head = node;
    else this.tail.next = node;
    this.tail = node;
    this.length++;
  }

  /** Saca y devuelve el primero, o null si está vacía. */
  dequeue() {
    if (!this.head) return null;
    const { value } = this.head;
    this.head = this.head.next;
    if (!this.head) this.tail = null;
    this.length--;
    return value;
  }

  /** Devuelve el primero sin sacarlo, o null. */
  peek() {
    return this.head ? this.head.value : null;
  }

  size() {
    return this.length;
  }

  isEmpty() {
    return this.length === 0;
  }

  toArray() {
    const out = [];
    for (let n = this.head; n; n = n.next) out.push(n.value);
    return out;
  }

  print() {
    console.log(this.toArray().join(' <- '));
  }
}
