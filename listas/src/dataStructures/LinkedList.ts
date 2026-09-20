import { Node } from "./Node";

// Lista simplemente enlazada genérica.
export class LinkedList<T> {
  head: Node<T> | null = null;
  tail: Node<T> | null = null;
  length = 0;
  current: Node<T> | null = null;

  // Agrega un nuevo nodo al final de la lista
  append(value: T): void {
    const newNode = new Node(value);

    if (!this.head) {
      this.head = newNode;
      this.current = newNode; // la reproducción inicia en el primer nodo agregado
    } else {
      this.tail!.next = newNode;
    }

    this.tail = newNode;
    this.length++;
  }

  // Busca y retorna el nodo que coincide con el valor (comparación por referencia/valor primitivo)
  peek(value: T): Node<T> | null {
    let current = this.head;
    while (current) {
      if (current.value === value) return current;
      current = current.next;
    }
    return null;
  }

  // Retorna la cantidad de nodos en la lista
  size(): number {
    return this.length;
  }

  // Elimina el nodo con el valor indicado, reenlazando al nodo anterior con el siguiente
  remove(value: T): void {
    if (!this.head) return;

    if (this.head.value === value) {
      this.head = this.head.next;
      this.length--;
      return;
    }

    let current = this.head;
    while (current.next) {
      if (current.next.value === value) {
        current.next = current.next.next;
        this.length--;
        return;
      }
      current = current.next;
    }
  }

  // Avanza el puntero "current" a la siguiente canción. Retorna false si ya está en el último nodo.
  playNext(): boolean {
    if (this.current && this.current.next) {
      this.current = this.current.next;
      return true;
    }
    return false;
  }

  // Regresa el puntero "current" al inicio de la lista
  restart(): void {
    this.current = this.head;
  }

  // Convierte la lista en un arreglo, útil para renderizarla en React
  toArray(): T[] {
    const result: T[] = [];
    let current = this.head;
    while (current) {
      result.push(current.value);
      current = current.next;
    }
    return result;
  }

  // Representación en texto: "23 -> 48 -> 12 -> null"
  print(): string {
    let result = "";
    let current = this.head;
    while (current) {
      result += `${String(current.value)} -> `;
      current = current.next;
    }
    return result + "null";
  }
}
