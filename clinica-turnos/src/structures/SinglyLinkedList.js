import { Node } from './Node';


export class SinglyLinkedList {
  constructor() {
    this.head = null;
    this.tail = null;
    this.length = 0;
  }


  append(value) {
    const newNode = new Node(value);

    if (!this.head) {
      this.head = newNode;
    } else {
      this.tail.next = newNode;
    }

    this.tail = newNode;
    this.length++;
    return newNode;
  }


  peek(id, current = this.head) {
    if (!current) return null;
    if (current.value.id === id) return current;
    return this.peek(id, current.next);
  }


  size() {
    return this.length;
  }


  remove(id, current = this.head) {
    if (!this.head) return null;

    if (this.head.value.id === id) {
      const removed = this.head;
      this.head = this.head.next;
      if (!this.head) this.tail = null;
      this.length--;
      return removed.value;
    }

    while (current.next && current.next.value.id !== id) {
      current = current.next;
    }

    if (current.next) {
      const removed = current.next;
      current.next = current.next.next;
      if (!current.next) this.tail = current;
      this.length--;
      return removed.value;
    }

    return null;
  }


  removeFirst() {
    if (!this.head) return null;
    const removed = this.head;
    this.head = this.head.next;
    if (!this.head) this.tail = null;
    this.length--;
    return removed.value;
  }

  print() {
    let current = this.head;
    let result = '';
    while (current) {
      result += `${current.value.nombre} -> `;
      current = current.next;
    }
    console.log(result + 'null');
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
}
