// Nodo genérico: igual que en una lista simple, guarda un valor y el puntero next.
// La diferencia circular no está en el nodo, sino en cómo la lista conecta el último con el primero.
export class CircularNode<T> {
  value: T;
  next: CircularNode<T> | null;

  constructor(value: T) {
    this.value = value;
    this.next = null;
  }
}
