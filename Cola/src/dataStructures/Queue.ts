// Cola genérica basada en un arreglo interno.
// Diferencia clave frente a una cola FIFO "pura": aquí el orden de salida no depende
// del orden en que se llamó a enqueue, sino de un criterio de prioridad (la fecha de
// llegada asignada por el sistema).
export class Queue<T> {
  private items: T[] = [];
  private compare: (a: T, b: T) => number;

  constructor(compare: (a: T, b: T) => number) {
    this.compare = compare;
  }

  // Agrega un nuevo elemento y reorganiza todo el arreglo de menor a mayor según el
  // criterio de comparación (en este caso, la fecha de llegada).
  // Si la persona recién ingresada tiene la fecha más próxima, queda reposicionada
  // automáticamente al frente (posición 0).
  enqueue(item: T): void {
    this.items.push(item);
    this.items.sort(this.compare);
  }

  // Retorna y elimina el elemento del frente (el de fecha más próxima tras el reordenamiento)
  dequeue(): T | null {
    if (this.isEmpty()) return null;
    return this.items.shift() as T;
  }

  // Consulta el elemento del frente sin eliminarlo
  peek(): T | null {
    if (this.isEmpty()) return null;
    return this.items[0];
  }

  isEmpty(): boolean {
    return this.items.length === 0;
  }

  size(): number {
    return this.items.length;
  }

  // Devuelve una copia del contenido, ya ordenado, lista para imprimir en pantalla
  print(): T[] {
    return [...this.items];
  }
}
