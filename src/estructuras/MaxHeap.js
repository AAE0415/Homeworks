// MAX HEAP para el ranking de canciones más escuchadas.
// Árbol binario completo guardado en un arreglo: hijos de i en 2i+1 y 2i+2, padre en floor((i-1)/2).
// Propiedad: cada padre tiene MÁS O IGUAL reproducciones que sus hijos, así la raíz es la más escuchada.
// insert y extractMax: O(log n). peek: O(1). heapify: O(n).

export default class MaxHeap {
  /** prioridad: función que da el valor a comparar (por ejemplo, las reproducciones). */
  constructor(prioridad = (x) => x, inicial = []) {
    this.prioridad = prioridad;
    this.heap = [...inicial];
    this.heapify();
  }

  insert(valor) {
    this.heap.push(valor);
    this.percolateUp(this.heap.length - 1);
  }

  /** Saca y devuelve la canción con más reproducciones. */
  extractMax() {
    if (this.heap.length === 0) return null;
    this.swap(0, this.heap.length - 1);
    const max = this.heap.pop();
    this.percolateDown(0);
    return max;
  }

  peek() {
    return this.heap.length ? this.heap[0] : null;
  }

  /** Las k más escuchadas, de mayor a menor, sin modificar el heap (trabaja sobre una copia). */
  topK(k) {
    const copia = new MaxHeap(this.prioridad, this.heap);
    const top = [];
    while (top.length < k && !copia.isEmpty()) top.push(copia.extractMax());
    return top;
  }

  /** Convierte el arreglo en heap, de abajo hacia arriba. */
  heapify() {
    for (let i = Math.floor(this.heap.length / 2) - 1; i >= 0; i--) this.percolateDown(i);
  }

  percolateUp(index) {
    let i = index;
    while (i > 0) {
      const padre = Math.floor((i - 1) / 2);
      if (this.prioridad(this.heap[i]) <= this.prioridad(this.heap[padre])) break;
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
      let mayor = i;
      if (izq < n && this.prioridad(this.heap[izq]) > this.prioridad(this.heap[mayor])) mayor = izq;
      if (der < n && this.prioridad(this.heap[der]) > this.prioridad(this.heap[mayor])) mayor = der;
      if (mayor === i) break;
      this.swap(i, mayor);
      i = mayor;
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
}
