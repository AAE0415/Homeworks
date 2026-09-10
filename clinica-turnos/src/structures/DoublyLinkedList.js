import { DoubleNode } from './DoubleNode';

export class DoublyLinkedList {
  constructor() {
    this.head = null;
    this.tail = null;
    this.length = 0;
  }

  prepend(value) {
    const newNode = new DoubleNode(value);

    if (!this.head) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      newNode.next = this.head;
      this.head.prev = newNode;
      this.head = newNode;
    }

    this.length++;
    return newNode;
  }

  size() {
    return this.length;
  }


  toArray() {
    const arr = [];
    let current = this.head;
    while (current) {
      arr.push(current.value);
      current = current.next;
    }
    return arr;
  }
  
  toArrayReverse() {
    const arr = [];
    let current = this.tail;
    while (current) {
      arr.push(current.value);
      current = current.prev;
    }
    return arr;
  }
}
