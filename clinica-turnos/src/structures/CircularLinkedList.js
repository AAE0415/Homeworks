import { Node } from './Node';

export class CircularLinkedList {
  constructor() {
    this.head = null;
    this.tail = null;
    this.current = null;
    this.length = 0;
  }

  append(value) {
    const newNode = new Node(value);

    if (!this.head) {
      this.head = newNode;
      this.tail = newNode;
      newNode.next = newNode; 
      this.current = newNode;
    } else {
      newNode.next = this.head;
      this.tail.next = newNode;
      this.tail = newNode;
    }

    this.length++;
    return newNode;
  }

  rotate() {
    if (!this.current) return null;
    this.current = this.current.next;
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
