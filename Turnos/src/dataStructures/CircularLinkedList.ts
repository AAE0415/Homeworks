import { CircularNode } from "./CircularNode";

// Clave de la circularidad: el "next" del último nodo (tail) siempre apunta de vuelta al head, en lugar de apuntar a null como en una lista simple.
export class CircularLinkedList<T> {
  head: CircularNode<T> | null = null;
  tail: CircularNode<T> | null = null;
  current: CircularNode<T> | null = null; // turno que está siendo atendido actualmente
  length = 0;

  // Agrega un nuevo turno al final de la fila, cerrando siempre el círculo
  append(value: T): void {
    const newNode = new CircularNode(value);

    if (!this.head) {
      // Primer turno: se apunta a sí mismo, formando el círculo más simple posible
      newNode.next = newNode;
      this.head = newNode;
      this.tail = newNode;
      this.current = newNode;
    } else {
      newNode.next = this.head; // el nuevo nodo cierra el círculo apuntando de nuevo al primero
      this.tail!.next = newNode;
      this.tail = newNode;
    }

    this.length++;
  }

  // Avanza el turno actual. Como la lista es circular, "next" nunca es null: al llegar al último turno, automáticamente vuelve al primero.
  advance(): void {
    if (this.current) {
      this.current = this.current.next;
    }
  }

  size(): number {
    return this.length;
  }

  // Recorre la lista una sola vuelta (se detiene al volver al head) para no generar un loop infinito
  toArray(): T[] {
    const result: T[] = [];
    if (!this.head) return result;

    let node: CircularNode<T> = this.head;
    do {
      result.push(node.value);
      node = node.next as CircularNode<T>;
    } while (node !== this.head);

    return result;
  }

  print(): string {
    const values = this.toArray();
    if (values.length === 0) return "fila vacía";
    return values.map((v) => String(v)).join(" -> ") + ` -> (vuelve a ${String(values[0])})`;
  }
}
