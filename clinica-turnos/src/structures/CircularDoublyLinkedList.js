import { DoubleNode } from './DoubleNode';

export class CircularDoublyLinkedList {
  constructor() {
    this.head = null;
    this.tail = null;
    this.current = null;
    this.length = 0;
  }

  append(value) {
    const newNode = new DoubleNode(value);

    if (!this.head) {
      this.head = newNode;
      this.tail = newNode;
      newNode.next = newNode;
      newNode.prev = newNode;
      this.current = newNode;
    } else {
      newNode.next = this.head;
      newNode.prev = this.tail;
      this.head.prev = newNode;
      this.tail.next = newNode;
      this.tail = newNode;
    }

    this.length++;
    return newNode;
  }


  next() {
    if (!this.current) return null;
    this.current = this.current.next;
    return this.current.value;
  }


  prev() {
    if (!this.current) return null;
    this.current = this.current.prev;
    return this.current.value;
  }

  getCurrent() {
    return this.current ? this.current.value : null;
  }

  size() {
    return this.length;
  }

  
  toArray() {
    const arr = [];
    if (!this.head) return arr;
    let node = this.head;
    do {
      arr.push(node.value);
      node = node.next;
    } while (node !== this.head);
    return arr;
  }
}
