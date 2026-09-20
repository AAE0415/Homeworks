import { DoublyNode } from "./DoublyNode";

// Lista doblemente enlazada genérica.
export class DoublyLinkedList<T> {
  head: DoublyNode<T> | null = null;
  tail: DoublyNode<T> | null = null;
  length = 0;
  current: DoublyNode<T> | null = null;

  // Agrega un nuevo nodo al final, enlazándolo en ambas direcciones
  append(value: T): void {
    const newNode = new DoublyNode(value);

    if (!this.head) {
      this.head = newNode;
      this.current = newNode;
    } else {
      this.tail!.next = newNode;
      newNode.prev = this.tail;
    }

    this.tail = newNode;
    this.length++;
  }

  // Busca y retorna el nodo que coincide con el valor
  peek(value: T): DoublyNode<T> | null {
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

  // Elimina un nodo reconectando el anterior y el siguiente entre sí (en ambos sentidos)
  remove(value: T): void {
    let current = this.head;

    while (current) {
      if (current.value === value) {
        if (current.prev) {
          current.prev.next = current.next;
        } else {
          this.head = current.next;
        }

        if (current.next) {
          current.next.prev = current.prev;
        } else {
          this.tail = current.prev;
        }

        this.length--;
        return;
      }
      current = current.next;
    }
  }

  // Retrocede el puntero "current" a la página anterior. Retorna false si ya está en la cabeza.
  goBack(): boolean {
    if (this.current && this.current.prev) {
      this.current = this.current.prev;
      return true;
    }
    return false;
  }

  // Avanza el puntero "current" a la página siguiente. Retorna false si ya está en la cola.
  goForward(): boolean {
    if (this.current && this.current.next) {
      this.current = this.current.next;
      return true;
    }
    return false;
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

  // Representación en texto: "null <- 23 <-> 48 <-> 12 -> null"
  print(): string {
    let result = "";
    let current = this.head;
    while (current) {
      result += `${String(current.value)} <-> `;
      current = current.next;
    }
    return result + "null";
  }
}
