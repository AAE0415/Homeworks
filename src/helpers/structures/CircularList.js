// Lista doblemente enlazada circular con un cursor (el elemento actual).
// El último apunta al primero y viceversa: avanzar o retroceder nunca "se sale".
// Uso en Delilicias: carrusel de platos destacados (anterior / siguiente).

class Node {
  constructor(value) {
    this.value = value;
    this.next = null;
    this.prev = null;
  }
}

export default class CircularList {
  constructor() {
    this.head = null;
    this.cursor = null;
    this.length = 0;
  }

  /** Agrega al final (antes de head, cerrando el círculo). */
  append(value) {
    const node = new Node(value);
    if (!this.head) {
      node.next = node;
      node.prev = node;
      this.head = node;
      this.cursor = node;
    } else {
      const tail = this.head.prev;
      tail.next = node;
      node.prev = tail;
      node.next = this.head;
      this.head.prev = node;
    }
    this.length++;
  }

  current() {
    return this.cursor ? this.cursor.value : null;
  }

  /** Mueve el cursor al siguiente y lo devuelve. */
  next() {
    if (!this.cursor) return null;
    this.cursor = this.cursor.next;
    return this.cursor.value;
  }

  /** Mueve el cursor al anterior y lo devuelve. */
  prev() {
    if (!this.cursor) return null;
    this.cursor = this.cursor.prev;
    return this.cursor.value;
  }

  size() {
    return this.length;
  }

  toArray() {
    const out = [];
    let n = this.head;
    for (let i = 0; i < this.length; i++, n = n.next) out.push(n.value);
    return out;
  }
}
