// Pila genérica implementada sobre un arreglo interno, tal como en clase.
export class Stack<T> {
  private items: T[] = [];

  // Agrega un nuevo valor en el tope de la pila
  push(value: T): void {
    this.items.push(value);
  }

  // Retorna y elimina el último valor ingresado (el del tope). Si está vacía, retorna null.
  pop(): T | null {
    if (this.isEmpty()) return null;
    return this.items.pop() as T;
  }

  // Consulta el valor del tope sin retirarlo de la pila
  peek(): T | null {
    if (this.isEmpty()) return null;
    return this.items[this.items.length - 1];
  }

  // Retorna true si la pila no tiene elementos
  isEmpty(): boolean {
    return this.items.length === 0;
  }

  // Retorna la cantidad total de elementos acumulados
  size(): number {
    return this.items.length;
  }

  // Devuelve una copia del contenido, ordenada desde el tope (el último en entrar) hacia la base
  print(): T[] {
    return [...this.items].reverse();
  }
}
