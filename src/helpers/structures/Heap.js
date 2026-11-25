// Heap (montículo) binario representado en un arreglo: árbol binario completo.
// Para el índice i: hijos en 2i+1 y 2i+2, padre en floor((i-1)/2).
// Es un min-heap según "compare" (negativo = a va antes que b). push y pop son O(log n).
// Uso en Delilicias: agenda de cocina (el pedido más urgente primero) y "Lo más pedido" (top K).

const porDefecto = (a, b) => a - b;

export default class Heap {
  constructor(compare = porDefecto, initial = []) {
    this.compare = compare;
    this.heap = [...initial];
    this.heapify();
  }

  /** Inserta y reacomoda hacia arriba. */
  push(value) {
    this.heap.push(value);
    this.percolateUp(this.heap.length - 1);
  }

  /** Saca el mínimo (la raíz) y reacomoda hacia abajo. */
  pop() {
    if (this.heap.length === 0) return undefined;
    const n = this.heap.length;
    this.swap(0, n - 1);
    const min = this.heap.pop();
    this.percolateDown(0);
    return min;
  }

  peek() {
    return this.heap[0];
  }

  /** Convierte el arreglo desordenado en heap, de abajo hacia arriba. O(n). */
  heapify() {
    for (let i = Math.floor(this.heap.length / 2) - 1; i >= 0; i--) this.percolateDown(i);
  }

  percolateUp(index) {
    let i = index;
    while (i > 0) {
      const padre = Math.floor((i - 1) / 2);
      if (this.compare(this.heap[i], this.heap[padre]) >= 0) break;
      this.swap(i, padre);
      i = padre;
    }
  }

  percolateDown(index) {
    let i = index;
    const n = this.heap.length;
    for (;;) {
      const izq = 2 * i + 1;
      const der = 2 * i + 2;
      let menor = i;
      if (izq < n && this.compare(this.heap[izq], this.heap[menor]) < 0) menor = izq;
      if (der < n && this.compare(this.heap[der], this.heap[menor]) < 0) menor = der;
      if (menor === i) break;
      this.swap(i, menor);
      i = menor;
    }
  }

  swap(i, j) {
    [this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]];
  }

  size() {
    return this.heap.length;
  }

  isEmpty() {
    return this.heap.length === 0;
  }

  toArray() {
    return [...this.heap];
  }

  /**
   * Los k mayores según "compare", de mayor a menor.
   * Mantiene un min-heap de tamaño k: si llega uno mayor que la raíz, la reemplaza. O(n log k).
   */
  static topK(items, k, compare = porDefecto) {
    if (k <= 0) return [];
    const h = new Heap(compare);
    for (const item of items) {
      if (h.size() < k) h.push(item);
      else if (compare(item, h.peek()) > 0) { h.pop(); h.push(item); }
    }
    const out = [];
    while (!h.isEmpty()) out.push(h.pop());
    return out.reverse();
  }
}
